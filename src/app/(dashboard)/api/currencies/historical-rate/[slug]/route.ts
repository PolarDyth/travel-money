import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {params,
}: {
  params: Promise<{ slug: string }>
})  {
  const { slug } = await params;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setFullYear(today.getFullYear() - 1);

  // Fetch all rates for this currency code in the past year (base GBP)
  const rates = await prisma.exchangeRate.findMany({
    where: {
      currencyCode: slug,
      baseCode: "GBP",
      date: {
        gte: oneMonthAgo,
        lte: today,
      },
    },
    orderBy: { date: "asc" },
    select: {
      date: true,
      rate: true,
    },
  });

  return new Response(JSON.stringify(rates), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}