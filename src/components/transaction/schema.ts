import {
  primaryIdType,
  secondaryIdType,
  sourceType,
  useOfFundsType,
} from "@/constants/Identification";
import { currencies } from "@/data/currencies";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

// ID validation schema
export const standardIdSchema = z.object({
  type: z.enum(primaryIdType),
  number: z.string().min(1, { message: "ID number is required" }), // Add min length message
  issueDate: z.coerce.date().optional(),
  expiryDate: z.coerce
    .date({ invalid_type_error: "Expiry date is required" })
    .refine(
      (value) => {
        const today = new Date();
        return value > today; // Check if expiry date is in the future
      },
      { message: "Expiry Date must be in the future" }
    ), // Add message
  customerDOB: z.coerce.date(),

  sourceOfFunds: z.enum(sourceType),
  useOfFunds: z.enum(useOfFundsType),
});

export const enhancedIdSchema = z.object({
  secondaryType: z.enum(secondaryIdType),
  secondaryNumber: z.string().min(1, { message: "ID number is required" }), // Add min length message
  secondaryIssueDate: z.coerce.date().optional(),
  secondaryExpiryDate: z.coerce.date().optional(),
  proofOfFunds: z.literal(true),
  proofOfUse: z.literal(true),
});

export const currencyDetailsSchema =
  z.object({
    id: z.string().uuid(),
    transactionType: z.enum(["SELL", "BUY"]),
    currencyCode: z.string().length(3).toUpperCase(),
    sterlingAmount: z.coerce.number().positive(),
    foreignAmount: z.coerce.number().positive(),
    exchangeRate: z.coerce.number().positive(),
    // Operator
    operatorId: z.number().int().optional(),
  })

export const allCurrencyDetailsSchema = z.object({
  activeCurrency: currencyDetailsSchema.optional(),
  currencyDetails: z.array(currencyDetailsSchema),
  totalSterling: z.coerce.number().refine((value) => value != 0),
}).superRefine((data) => {
  data.totalSterling = data.currencyDetails.reduce(
    (sum, currency) => sum + currency.sterlingAmount,
    0
  );

});

// Customer information schema
export const customerInfoSchema = z.object({
  // Customer Info
  customerFirstName: z.string().nonempty(),
  customerLastName: z.string().nonempty(),

  customerAddressLine1: z.string().nonempty(),
  customerPostcode: z.string().nonempty(),
  customerCity: z.string().nonempty(),
  customerCountry: z.string().nonempty(),

  customerEmail: z.string().email().optional(),
  customerPhone: z.string().refine(isValidPhoneNumber).optional(),

  primaryId: standardIdSchema.optional(),
  secondaryId: enhancedIdSchema.optional(),

  sterlingAmount: z.coerce.number().positive(),
});

// Verification schema
export const denominationSchema = z.record(
  z.string(), // currency code
  z.record(
    z.string().refine((val) => /^\d+$/.test(val), {
      message: "Denomination must be a number string",
    }),
    z.number().int()
  )
);

const verificationSchema = z.object({
  countedTwice: z.literal(true),
  countedToCustomer: z.literal(true),
  confirmedSterling: z.literal(true),
  confirmedCurrency: z.literal(true),
  confirmedExchangeRate: z.literal(true),
  confirmedForeign: z.literal(true),
})

// Main transaction schema - combining all schemas
export const transactionSchema = z
  .object({
    allCurrencyDetails: allCurrencyDetailsSchema,
    customerInfo: customerInfoSchema,
    denomination: denominationSchema,
    verification: verificationSchema,
  })
  .superRefine((data, ctx) => {
    const amount = data.allCurrencyDetails.totalSterling;

    if (amount >= 500 && !data.customerInfo.primaryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Primary ID is required for transactions >= £500.",
        path: ["customerInfo", "primaryId"],
      });
    }

    if (amount >= 5000) {
      if (!data.customerInfo.secondaryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Secondary ID is required for transactions >= £5000.",
          path: ["customerInfo", "secondaryId"],
        });
      }
      if (
        data.customerInfo.primaryId &&
        data.customerInfo.primaryId.type ===
          data.customerInfo.secondaryId?.secondaryType
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Primary and secondary ID must be different types.",
          path: ["customerInfo", "secondaryId", "secondaryType"],
        });
      }
    }

    data.allCurrencyDetails.currencyDetails.forEach((currency) => {
      const code = currency.currencyCode;
      const foreignAmount = currency.foreignAmount;
      const denomBreakdown = data.denomination[code];

      if (!denomBreakdown) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No denomination breakdown provided for ${code}.`,
          path: ["denomination", code],
        });
        return;
      }

      const sumOfDenom = Object.entries(denomBreakdown).reduce((sum, [key, quantity]) => {
        const denominationValue = parseFloat(key);
        return sum + denominationValue * quantity;
      }, 0);

      // Use a small tolerance for floating point comparison
      if (Math.abs(sumOfDenom - foreignAmount) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Denomination total (${sumOfDenom.toFixed(2)}) does not match the foreign amount (${foreignAmount.toFixed(2)}) for ${code}.`,
          path: ["denomination", code],
        });
      }
    });
  });

export type TransactionSchema = z.infer<typeof transactionSchema>;

// Step schemas for multi-step form
export function getSchemaSteps(step: number): keyof TransactionSchema {
  switch (step) {
    case 0:
      return "allCurrencyDetails";
    case 1:
      return "customerInfo";
    case 2:
      return "denomination";
    case 3:
      return "verification";
    default:
      throw new Error("Invalid step number");
  }
}

const defaultCurrency = currencies[0]

export const defaultTransaction: TransactionSchema = {
  allCurrencyDetails: {
    activeCurrency: {
      id: crypto.randomUUID(),
      transactionType: "SELL",
      currencyCode: defaultCurrency.code,
      foreignAmount: 0,
      sterlingAmount: 0,
      exchangeRate: defaultCurrency.sell,
    },
    currencyDetails: [],
    totalSterling: 0,
  },
  customerInfo: {
    customerFirstName: "",
    customerLastName: "",
    customerPostcode: "",
    customerAddressLine1: "",
    customerCity: "",
    customerCountry: "",
    customerEmail: "",
    customerPhone: "",
    primaryId: undefined,
    secondaryId: undefined,
    sterlingAmount: 0,
  },
  denomination: {
    "": {
      "": 0,
    }
  },
  verification: {
    countedTwice: false as unknown as true,
    countedToCustomer: false as unknown as true,
    confirmedSterling: false as unknown as true,
    confirmedCurrency: false as unknown as true,
    confirmedExchangeRate: false as unknown as true,
    confirmedForeign: false as unknown as true,
  }
};
