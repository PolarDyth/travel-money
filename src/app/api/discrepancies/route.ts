import { PrismaClient } from "../../../../generated/prisma";
import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { currency, date, expectedAmount, actualAmount, notes } =
      await request.json();

    const expectedAmountDecimal = new Decimal(expectedAmount);
    const actualAmountDecimal = new Decimal(actualAmount);
    const differenceDecimal = expectedAmountDecimal.minus(actualAmountDecimal);

    const newDiscrepancy = await prisma.discrepancy.create({
      data: {
        currency,
        date: new Date(date),
        expectedAmount: expectedAmountDecimal,
        actualAmount: actualAmountDecimal,
        difference: differenceDecimal,
        notes,
      },
    });

    // Convert Decimal to string for the response
    const discrepancyResponse = {
      ...newDiscrepancy,
      expectedAmount: newDiscrepancy.expectedAmount.toString(),
      actualAmount: newDiscrepancy.actualAmount.toString(),
      difference: newDiscrepancy.difference.toString(),
    };

    return NextResponse.json(discrepancyResponse, { status: 201 });
  } catch (error) {
    console.error("Error creating discrepancy:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const discrepancies = await prisma.discrepancy.findMany();

    // Convert Decimal to string for the response
    const discrepanciesResponse = discrepancies.map((discrepancy) => ({
      ...discrepancy,
      expectedAmount: discrepancy.expectedAmount.toString(),
      actualAmount: discrepancy.actualAmount.toString(),
      difference: discrepancy.difference.toString(),
    }));

    return NextResponse.json(discrepanciesResponse, { status: 200 });
  } catch (error) {
    console.error("Error retrieving discrepancies:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}