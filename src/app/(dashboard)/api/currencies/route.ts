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
  console.log(list.forEach((currency) => console.log(currency.rates[0])));
  const currencies = list.map((currency) => ({
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    denominations: currency.denominations,
    thresholdRules: currency.thresholdRules,
    rate: currency.rates[0]?.rate ?? null,
    buyRate: currency.rates[0]?.buyRate ?? null,
    sellRate: currency.rates[0]?.sellRate ?? null,
  }))

  return NextResponse.json(currencies)
}