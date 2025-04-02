import { z } from 'zod';

// ID validation
const idSchema = z.object({
  type: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'UTILITY_BILL', 'BANK_STATEMENT', 'OTHER']),
  number: z.string().min(3),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date()
});

// Main transaction schema
export const transactionSchema = z.object({
  transactionType: z.enum(['BUY', 'SELL']),
  currencyCode: z.string().length(3).toUpperCase(),
  sterlingAmount: z.coerce.number().positive(),
  foreignAmount: z.coerce.number().positive(),
  exchangeRate: z.coerce.number().positive(),
  paymentMethod: z.enum(['CASH', 'CARD']),

  // Operator
  operatorId: z.number().int().positive(),

  // Customer Info
  customerFirstName: z.string().min(1),
  customerLastName: z.string().min(1),
  customerPostcode: z.string().min(1),
  customerAddressLine1: z.string().min(1),
  customerDOB: z.coerce.date().optional(),

  // ID Fields
  primaryId: idSchema.optional(),
  secondaryId: idSchema.optional(),

  // Confirmation steps
  confirmationStepsCompleted: z.boolean().optional(),
  amountCounted: z.boolean().optional(),
  readBackDone: z.boolean().optional(),

  // Notes
  notes: z.string().optional()
})
.superRefine((data, ctx) => {
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

export const stepSchemas = [
  z.object({
    transactionType: z.enum(['BUY', 'SELL']),
  }),
  z.object({
    currencyCode: z.string().length(3),
    sterlingAmount: z.coerce.number().positive().min(1),
    foreignAmount: z.coerce.number().positive().min(1),
    exchangeRate: z.coerce.number().positive(),
    paymentMethod: z.enum(['CASH', 'CARD']),
  }),
  z.object({
    customerFirstName: z.string().min(1),
    customerLastName: z.string().min(1),
    customerPostcode: z.string().min(1),
    customerAddressLine1: z.string().min(1),
    customerDOB: z.coerce.date().optional(),
  }),
  z.object({
    primaryId: idSchema.optional(),
    secondaryId: idSchema.optional()
  }),
  z.object({
    confirmationStepsCompleted: z.boolean().optional(),
    amountCounted: z.boolean().optional(),
    readBackDone: z.boolean().optional()
  }),
  transactionSchema
] as const;

