import {
  primaryIdType,
  secondaryIdType,
  sourceType,
  useOfFundsType,
} from "@/constants/Identification";
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
  proofOfFunds: z.boolean(),
  proofOfUse: z.boolean(),
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
  customerFirstName: z.string().min(1),
  customerLastName: z.string().min(1),
  customerPostcode: z.string().min(1),
  customerAddressLine1: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(10).max(16).optional(),

  primaryId: standardIdSchema.optional(),
  secondaryId: enhancedIdSchema.optional(),

  sterlingAmount: z.coerce.number().positive(),
});

// Verification schema
export const denominationSchema = z.record(
  z.string().regex(/^\d+$/, "Must be a number string"),
  z.number().int().positive()
);
// Main transaction schema - combining all schemas
export const transactionSchema = z
  .object({
    transactionType: transactionTypeSchema,
    currencyDetails: currencyDetailsSchema,
    customerInfo: customerInfoSchema,
    denomination: denominationSchema,
  })
  .superRefine((data, ctx) => {
    const amount = data.currencyDetails.sterlingAmount;

    if (amount >= 500 && !data.customerInfo.primaryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Primary ID is required for transactions >= £500.",
        path: ["customerInfo", "primaryId"],
      });
    }

    if (amount >= 5000) {
      if (!data.customerInfo.secondaryId) {
        console.log("Secondary ID is required.");
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Secondary ID is required for transactions >= £5000.",
          path: ["customerInfo", "secondaryId"],
        });
      } else {
        console.log("Secondary ID is provided.");
        if (
          data.customerInfo.primaryId &&
          data.customerInfo.primaryId.type ===
            data.customerInfo.secondaryId.secondaryType
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Primary and secondary ID must be different types.",
            path: ["customerInfo", "secondaryId", "secondaryType"],
          });
        }
      }
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
    customerEmail: undefined,
    customerPhone: undefined,
    primaryId: undefined,
    secondaryId: undefined,
    sterlingAmount: 0,
  },
  denomination: {
    "0": 0,
  },
};
