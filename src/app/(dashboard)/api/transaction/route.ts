"use server";

import { TransactionSchema } from "@/components/transaction/schema";
import {
  decryptFromString,
  encryptDeterministic,
  encryptToString,
} from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { validatedTransactionSchema } from "@/lib/transaction/validatedSchema";
import { NextRequest } from "next/server";
import { Prisma } from "../../../../../generated/prisma";

export async function POST(req: NextRequest) {
  const body: TransactionSchema = await req.json();
  
  const validated = validatedTransactionSchema.safeParse(body);
  if (!validated.success) {
    return new Response(JSON.stringify(validated.error), {
      status: 400,
    });
  }

  try {
    const customers = await prisma.customer.findMany({
      where: {
        firstNameEnc: encryptDeterministic(
          validated.data.customerInfo.customerFirstName
        ),
        lastNameEnc: encryptDeterministic(
          validated.data.customerInfo.customerLastName
        ),
        postcodeEnc: encryptDeterministic(
          validated.data.customerInfo.customerPostcode
        ),
      },
    });

    let customer =
      customers.find(
        (c) =>
          decryptFromString(c.addressLine1Enc) ===
          validated.data.customerInfo.customerAddressLine1
      ) || null;

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstNameEnc: encryptDeterministic(
            validated.data.customerInfo.customerFirstName
          ),
          lastNameEnc: encryptDeterministic(
            validated.data.customerInfo.customerLastName
          ),
          addressLine1Enc: encryptToString(
            validated.data.customerInfo.customerAddressLine1
          ),
          postcodeEnc: encryptDeterministic(
            validated.data.customerInfo.customerPostcode
          ),
          cityEnc: encryptToString(validated.data.customerInfo.customerCity),
          countryEnc: encryptToString(
            validated.data.customerInfo.customerCountry
          ),
          emailEnc: encryptToString(
            validated.data.customerInfo.customerEmail ?? ""
          ),
          phoneEnc: encryptToString(
            validated.data.customerInfo.customerPhone ?? ""
          ),

          // Primary ID
          ...(validated.data.customerInfo.primaryId && {
            primaryIdTypeEnc: encryptToString(
              validated.data.customerInfo.primaryId.type
            ),
            primaryIdNumberEnc: encryptToString(
              validated.data.customerInfo.primaryId.number
            ),
            primaryIdIssueDateEnc: encryptToString(
              validated.data.customerInfo.primaryId.issueDate
                ? validated.data.customerInfo.primaryId.issueDate.toISOString()
                : ""
            ),
            primaryIdExpiryDateEnc: encryptToString(
              validated.data.customerInfo.primaryId.expiryDate.toISOString()
            ),
            customerDOBEnc: encryptToString(
              validated.data.customerInfo.primaryId.customerDOB.toISOString()
            ),
          }),
          // Secondary ID
          ...(validated.data.customerInfo.secondaryId && {
            secondaryIdTypeEnc: encryptToString(
              validated.data.customerInfo.secondaryId.secondaryType
            ),
            secondaryIdEnc: encryptToString(
              validated.data.customerInfo.secondaryId.secondaryNumber
            ),
            secondaryIdIssueDateEnc: encryptToString(
              validated.data.customerInfo.secondaryId.secondaryIssueDate
                ? validated.data.customerInfo.secondaryId.secondaryIssueDate.toISOString()
                : ""
            ),
            secondaryIdExpiryDateEnc: encryptToString(
              validated.data.customerInfo.secondaryId.secondaryExpiryDate
                ? validated.data.customerInfo.secondaryId.secondaryExpiryDate.toISOString()
                : ""
            ),
          }),
        },
      });
    } else {
      // Update existing customer with any new fields if present
      const updateData: Prisma.CustomerUpdateInput = {};

      if (validated.data.customerInfo.primaryId) {
        updateData.primaryIdTypeEnc = encryptToString(
          validated.data.customerInfo.primaryId.type
        );
        updateData.primaryIdNumberEnc = encryptToString(
          validated.data.customerInfo.primaryId.number
        );
        updateData.primaryIdIssueDateEnc = encryptToString(
          validated.data.customerInfo.primaryId.issueDate
            ? validated.data.customerInfo.primaryId.issueDate.toISOString()
            : ""
        );
        updateData.primaryIdExpiryDateEnc = encryptToString(
          validated.data.customerInfo.primaryId.expiryDate.toISOString()
        );
        updateData.customerDOBEnc = encryptToString(
          validated.data.customerInfo.primaryId.customerDOB.toISOString()
        );
      }
      if (validated.data.customerInfo.secondaryId) {
        updateData.secondaryIdTypeEnc = encryptToString(
          validated.data.customerInfo.secondaryId.secondaryType
        );
        updateData.secondaryIdNumberEnc = encryptToString(
          validated.data.customerInfo.secondaryId.secondaryNumber
        );
        updateData.secondaryIdIssueDateEnc = encryptToString(
          validated.data.customerInfo.secondaryId.secondaryIssueDate
            ? validated.data.customerInfo.secondaryId.secondaryIssueDate.toISOString()
            : ""
        );
        updateData.secondaryIdExpiryDateEnc = encryptToString(
          validated.data.customerInfo.secondaryId.secondaryExpiryDate
            ? validated.data.customerInfo.secondaryId.secondaryExpiryDate.toISOString()
            : ""
        );
      }

      // Only update if there is something to update
      if (Object.keys(updateData).length > 0) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: updateData,
        });
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        operatorId: 1,
        customerId: customer.id,
        paymentMethod: JSON.stringify(
          validated.data.verification.paymentMethod
        ),
        cashTendered: validated.data.verification.cashTendered,
        totalSterling: validated.data.allCurrencyDetails.totalSterling,
      },
    });

    validated.data.allCurrencyDetails.currencyDetails.forEach(
      async (currency) => {
        await prisma.currencyDetail.create({
          data: {
            transactionId: transaction.id,
            currencyCode: currency.currencyCode,
            sterlingAmount: currency.sterlingAmount,
            foreignAmount: currency.foreignAmount,
            exchangeRate: currency.exchangeRate,
            transactionType: currency.transactionType,
          },
        });
      }
    );
    return new Response(JSON.stringify({ transactionId: transaction.id }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: { customer: true; currencyDetails: { include: { currency: true } } };
}>;

export async function GET(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const transactionId = await searchParams.get("id")

  if (!transactionId) {
    return new Response(JSON.stringify({ error: "Missing transactionId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const transaction: TransactionWithRelations | null = await prisma.transaction.findUnique({
    where: {
      id: Number(transactionId),
    },
    include: {
      customer: true,
      currencyDetails: {
        include: {
          currency: true,
        }
      }
    }
  })

  if (!transaction) {
    return new Response(JSON.stringify({ error: "Transaction not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  return new Response(JSON.stringify(transaction), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}