import { transactionSchema } from "@/components/transaction/schema";
import { z } from "zod";

export const validatedTransactionSchema = transactionSchema.superRefine((data, ctx) => {
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
      const denomBreakdown = data.denomination[indx];

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