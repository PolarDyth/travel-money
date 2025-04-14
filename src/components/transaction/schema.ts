import {
  primaryIdType,
  secondaryIdType,
  sourceType,
  useOfFundsType,
} from "@/constants/Identification";
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

export const transactionTypeSchema = z.enum(["SELL", "BUY"]);

export const currencyDetailsSchema = z.object({
  currencyCode: z.string().length(3).toUpperCase(),
  sterlingAmount: z.coerce.number().positive(),
  foreignAmount: z.coerce.number().positive(),
  exchangeRate: z.coerce.number().positive(),

  paymentMethod: z.enum(["CASH", "CARD"]),
  // Operator
  operatorId: z.number().int().optional(),
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
  z.string().refine((val) => /^\d+$/.test(val), {
    message: "Denomination must be a number string",
  }),
  z.number().int()
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
    transactionType: transactionTypeSchema,
    currencyDetails: currencyDetailsSchema,
    customerInfo: customerInfoSchema,
    denomination: denominationSchema,
    verification: verificationSchema,
  })
  .superRefine((data, ctx) => {
    const amount = data.currencyDetails.sterlingAmount;
    const foreignAmount = data.currencyDetails.foreignAmount;

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
    const sumOfDenom = Object.entries(data.denomination).reduce((sum, [Key, quantity]) => {
      const denominationValue = parseInt(Key, 10);
      return sum + denominationValue * quantity;
    }, 0);
    console.log("Sum of products", sumOfDenom, amount)
    if (!(foreignAmount === sumOfDenom)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Denomination does not match the sterling amount.",
        path: ["denomination"],
      });
    }
  });

export type TransactionSchema = z.infer<typeof transactionSchema>;

// Step schemas for multi-step form
export function getSchemaSteps(step: number): keyof TransactionSchema {
  switch (step) {
    case 0:
      return "transactionType";
    case 1:
      return "currencyDetails";
    case 2:
      return "customerInfo";
    case 3:
      return "denomination";
    case 4:
      return "verification";
    default:
      throw new Error("Invalid step number");
  }
}

export const defaultTransaction: TransactionSchema = {
  transactionType: "SELL",
  currencyDetails: {
    currencyCode: "EUR",
    sterlingAmount: 0,
    foreignAmount: 0,
    exchangeRate: 1.17,
    paymentMethod: "CASH",
    operatorId: 0,
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
    "0": 0,
  },
  verification: {
    countedTwice: false,
    countedToCustomer: false,
    confirmedSterling: false,
    confirmedCurrency: false,
    confirmedExchangeRate: false,
    confirmedForeign: false,
  }
};
