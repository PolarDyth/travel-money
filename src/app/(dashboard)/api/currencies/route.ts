import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const list = await prisma.currency.findMany({
    select: {
      code: true,
      name: true,
      symbol: true,
      denominations: true,
      thresholdRules: true,
      rates: {
        where: {
          baseCode: "GBP",
          date: today,
        },
        select: {
          rate: true,
          buyRate: true,
          sellRate: true,
        },
      },
    },
  });

  return NextResponse.json(list)
}