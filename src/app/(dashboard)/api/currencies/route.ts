import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const params = req.nextUrl.searchParams;
  const prevRates = params.get("prevRates") === "true" ? true : false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const list = await prisma.currency.findMany({
    include: {
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

  if (prevRates) {
    const prevList = await prisma.exchangeRate.findMany({
      where: {
        baseCode: "GBP",
        date: yesterday,
      },
      select: {
        currencyCode: true,
        buyRate: true,
        sellRate: true,
      },
    });
    return new Response(JSON.stringify(prevList), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  return NextResponse.json(list, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}