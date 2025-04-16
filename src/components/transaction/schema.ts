
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

export const currencyDetailsSchema = z
  .object({
    id: z.string().uuid(),
    transactionType: z.enum(["SELL", "BUY"]),
    currencyCode: z.string().length(3).toUpperCase(),
    sterlingAmount: z.coerce.number(),
    foreignAmount: z.coerce.number().positive(),
    exchangeRate: z.coerce.number().positive(),
    // Operator
    operatorId: z.number().int().optional(),
  })
  .refine(
    (data) => {
      const currency = currencies.find((c) => c.code === data.currencyCode);
      if (!currency) return false;

      // Use the same calculation as your handleSterlingChange/handleForeignChange
      let expectedSterling: number;
      if (data.transactionType === "SELL") {
        // SELL: foreignAmount / rate, rounded up to nearest denomination
        const foreignDiv = data.foreignAmount / data.exchangeRate;
        expectedSterling = foreignDiv;
      } else {
        // BUY: foreignAmount / -abs(rate), rounded up to nearest denomination
        const foreignDiv = data.foreignAmount / -Math.abs(data.exchangeRate);
        expectedSterling = foreignDiv;
      }
      console.log("Expected Sterling:", expectedSterling);
      console.log("Actual Sterling:", data.sterlingAmount);
      // Use a small tolerance for floating point comparison
      return Math.abs(data.sterlingAmount - expectedSterling) < 0.01;
    },
    {
      message:
        "Sterling amount does not match the calculated value based on foreign amount and exchange rate.",
    }
  );

export const allCurrencyDetailsSchema = z
  .object({
    currencyDetails: z
      .array(currencyDetailsSchema)
      .min(1, "At least one currency detail is required"),
    totalSterling: z.coerce.number().refine((value) => value != 0),
  })
  .superRefine((data) => {
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

  sterlingAmount: z.coerce.number(),
});

// Verification schema
export const denominationSchema = z.record(
  z.string().refine((val) => /^\d+$/.test(val), {
    message: "Denomination must be a number string",
  }),
  z.number().int()
);

const verificationSchema = z.object({
  countedTwice: z.boolean().refine((val) => val === true),
  countedToCustomer: z.boolean().refine((val) => val === true),
  confirmedSterling: z.boolean().refine((val) => val === true),
  confirmedCurrency: z.boolean().refine((val) => val === true),
  confirmedExchangeRate: z.boolean().refine((val) => val === true),
  confirmedForeign: z.boolean().refine((val) => val === true),

  paymentMethod: z.record(z.enum(["CASH", "CARD"]), z.number().int()),
  cashTendered: z.number().int().optional(),
});

// Main transaction schema - combining all schemas
export const transactionSchema = z
  .object({
    allCurrencyDetails: allCurrencyDetailsSchema,
    customerInfo: customerInfoSchema,
    denomination: z.array(denominationSchema),
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

    data.allCurrencyDetails.currencyDetails.forEach((currency, indx) => {
      const code = currency.currencyCode;
      const foreignAmount = currency.foreignAmount;
      const denomBreakdown = data.denomination[indx][code];

      if (!denomBreakdown) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No denomination breakdown provided for ${code}.`,
          path: ["denomination", code],
        });
        return;
      }

      const sumOfDenom = Object.entries(denomBreakdown).reduce(
        (sum, [key, quantity]) => {
          const denominationValue = parseFloat(key);
          return sum + denominationValue * quantity;
        },
        0
      );

      // Use a small tolerance for floating point comparison
      if (Math.abs(sumOfDenom - foreignAmount) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Denomination total (${sumOfDenom.toFixed(
            2
          )}) does not match the foreign amount (${foreignAmount.toFixed(
            2
          )}) for ${code}.`,
          path: ["denomination", code],
        });
      }
    });

    const payment = data.verification.paymentMethod;
    const cash = payment.CASH ?? 0;
    const card = payment.CARD ?? 0;

    if (Math.abs(cash + card - amount) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The sum of cash and card payments (${(cash + card).toFixed(
          2
        )}) must equal the total sterling amount (${amount.toFixed(2)}).`,
        path: ["verification", "paymentMethod"],
      });
    }
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

export const defaultTransaction: TransactionSchema = {
  allCurrencyDetails: {
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
  denomination: [],
  verification: {
    countedTwice: false,
    countedToCustomer: false,
    confirmedSterling: false,
    confirmedCurrency: false,
    confirmedExchangeRate: false,
    confirmedForeign: false,
    paymentMethod: {
      CASH: 0,
      CARD: 0,
    },
  },
};
