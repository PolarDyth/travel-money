import { z } from 'zod';

// ID validation schema
export const idSchema = z.object({
  type: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'OTHER']),
  secondaryType: z.enum(['DRIVERS_LICENSE', 'UTILITY_BILL', 'BANK_STATEMENT', 'OTHER']).optional(),
  number: z.string().min(3),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date()
});

export const transactionTypeSchema = z.enum(['SELL', 'BUY']);

// Transaction details schema
export const currencyDetailsSchema = z.object({
  currencyCode: z.string().length(3).toUpperCase(),
  sterlingAmount: z.coerce.number().positive(),
  foreignAmount: z.coerce.number().positive(),
  exchangeRate: z.coerce.number().positive(),
  
  paymentMethod: z.enum(['CASH', 'CARD']),
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
  customerDOB: z.coerce.date().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.number().optional().refine(),
});

// Verification schema
export const verificationSchema = z.object({
  // ID Fields
  primaryId: idSchema.optional(),
  secondaryId: idSchema.optional(),

  // Confirmation steps
  confirmationStepsCompleted: z.boolean().optional(),
  amountCounted: z.boolean().optional(),
  readBackDone: z.boolean().optional(),

  // Notes
  notes: z.string().optional(),
  
  // Transaction amount (needed for validation)
  sterlingAmount: z.coerce.number().positive()
}).superRefine((data, ctx) => {
  const amount = data.sterlingAmount;

  if (amount >= 500 && !data.primaryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Primary ID is required for transactions >= £500.',
      path: ['primaryId']
    });
  }

  if (amount >= 5000) {
    if (!data.secondaryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Secondary ID is required for transactions >= £5000.',
        path: ['secondaryId']
      });
    } else if (data.primaryId?.type === data.secondaryId?.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Primary and secondary ID must be different types.',
        path: ['secondaryId']
      });
    }
  }
});
// Main transaction schema - combining all schemas
export const transactionSchema = z.object({
  transactionType: transactionTypeSchema,
  currencyDetails: currencyDetailsSchema,
  customerInfo: customerInfoSchema,
  verification: verificationSchema,
})

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
      return "verification";
    default:
      throw new Error('Invalid step number');
  }
}

export const defaultTransaction: TransactionSchema = {
  transactionType: 'SELL',
  currencyDetails: {
    currencyCode: 'EUR',
    sterlingAmount: 0,
    foreignAmount: 0,
    exchangeRate: 1.17,
    paymentMethod: 'CASH',
    operatorId: 0
  },
  customerInfo: {
    customerFirstName: '',
    customerLastName: '',
    customerPostcode: '',
    customerAddressLine1: '',
    customerDOB: undefined
  },
  verification: {
    primaryId: undefined,
    secondaryId: undefined,
    confirmationStepsCompleted: false,
    amountCounted: false,
    readBackDone: false,
    notes: '',
    sterlingAmount: 0
  }
}