
import {
  primaryIdType,
  secondaryIdType,
  sourceType,
  useOfFundsType,
} from "@/constants/Identification";
import { isValidPhoneNumber } from "libphonenumber-js/min";
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
  })
  .refine(
    (data) => {

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
    operatorId: z.number().int(),
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
  customerFirstName: z.string().nonempty().max(20),
  customerLastName: z.string().nonempty().max(20),

  customerAddressLine1: z.string().nonempty().max(50),
  customerPostcode: z.string().nonempty().max(10),
  customerCity: z.string().nonempty().max(20),
  customerCountry: z.string().nonempty().max(20),

  customerEmail: z.string().email().max(50).optional().or(z.literal("")),
  customerPhone: z.string().max(20).refine((value) => {
    return isValidPhoneNumber(value);
  }, { message: "Please enter a valid phone number" }).optional().or(z.literal("")),

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
  countedTwice: z.boolean().refine((val) => val === true, {
    message: "You must confirm the cash has been counted twice.",
  }),
  countedToCustomer: z.boolean().refine((val) => val === true, {
    message: "You must confirm the cash has been counted to the customer.",
  }),
  confirmedSterling: z.boolean().refine((val) => val === true, {
    message: "You must confirm the sterling amount with the customer.",
  }),
  confirmedCurrency: z.boolean().refine((val) => val === true, {
    message: "You must confirm the currency with the customer.",
  }),
  confirmedExchangeRate: z.boolean().refine((val) => val === true, {
    message: "You must confirm the exchange rate with the customer.",
  }),
  confirmedForeign: z.boolean().refine((val) => val === true, {
    message: "You must confirm the foreign amount with the customer.",
  }),

  paymentMethod: z.record(z.enum(["CASH", "CARD"]), z.coerce.number()),
  cashTendered: z.coerce.number().optional(),
});

// Main transaction schema - combining all schemas
export const transactionSchema = z
  .object({
    allCurrencyDetails: allCurrencyDetailsSchema,
    customerInfo: customerInfoSchema,
    denomination: z.array(denominationSchema),
    verification: verificationSchema,
  })
  
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
    operatorId: Infinity,
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
    cashTendered: 0,
  },
};
