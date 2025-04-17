"use server";

import { TransactionSchema } from "@/components/transaction/schema";
import { encrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { validatedTransactionSchema } from "@/lib/transaction/validatedSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const body: TransactionSchema = await req.json();

  const validated = validatedTransactionSchema.safeParse(body);
  if (!validated.success) {
    return new Response(JSON.stringify(validated.error), {
      status: 400,
    });
  }

  const customer = await prisma.customer.create({
    data: {
      firstNameEnc: encrypt(body.customerInfo.customerFirstName),
      lastNameEnc: encrypt(body.customerInfo.customerLastName),
      addressLine1Enc: encrypt(body.customerInfo.customerAddressLine1),
      postcodeEnc: encrypt(body.customerInfo.customerPostcode),
      cityEnc: encrypt(body.customerInfo.customerCity),
      countryEnc: encrypt(body.customerInfo.customerCountry),
      emailEnc: encrypt(body.customerInfo.customerEmail ?? ""),
      phoneEnc: encrypt(body.customerInfo.customerPhone ?? ""),
      
      // Primary ID
      ...(body.customerInfo.primaryId && {
        primaryIdTypeEnc: encrypt(body.customerInfo.primaryId.type),
        primaryIdEnc: encrypt(body.customerInfo.primaryId.number),
        primaryIdIssueDateEnc: encrypt(body.customerInfo.primaryId.issueDate ? body.customerInfo.primaryId.issueDate.toISOString() : ""),
        primaryIdExpiryDateEnc: encrypt(body.customerInfo.primaryId.expiryDate.toISOString()),
        customerDOBEnc: encrypt(body.customerInfo.primaryId.customerDOB.toISOString()),
      }),
      ...(body.customerInfo.secondaryId && {
        secondaryIdTypeEnc: encrypt(body.customerInfo.secondaryId.secondaryType),
        secondaryIdEnc: encrypt(body.customerInfo.secondaryId.secondaryNumber),
        secondaryIdIssueDateEnc: encrypt(body.customerInfo.secondaryId.secondaryIssueDate ? body.customerInfo.secondaryId.secondaryIssueDate.toISOString() : ""),      
        secondaryIdExpiryDateEnc: encrypt(body.customerInfo.secondaryId.secondaryExpiryDate ? body.customerInfo.secondaryId.secondaryExpiryDate.toISOString() : ""),    
      }),
    }
  }) 
  
  const transaction = await prisma.transaction.create({
    
  })
}