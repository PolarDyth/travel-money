import { prisma } from "../prisma";

const BASE = "GBP";
const SELL_SPREAD = 0.05;
const BUY_SPREAD = 0.115;

export async function fetchDailyRates() {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/${BASE}`
  );

  if (!res.ok) throw new Error(`Failed to fetch rates: ${res.statusText}`);

  const { conversion_rates } = (await res.json()) as {
    conversion_rates: Record<string, number>;
  };

  const accepted = await prisma.currency.findMany({
    select: {
      code: true,
    },
  });

  const codes = new Set(accepted.map((c) => c.code));

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const ops = Object.entries(conversion_rates).filter(([code]) => codes.has(code)).map(([currencyCode, rate]) => {
    const buyRate = rate * (1 + BUY_SPREAD);
    const sellRate = rate * (1 - SELL_SPREAD);

    return prisma.exchangeRate.upsert({
      where: {
        unique_daily_rate: {
          currencyCode,
          baseCode: BASE,
          date: today
        },
      },
      create: {
        currencyCode,
        baseCode: BASE,
        rate,
        buyRate,
        sellRate,
        fetchedAt: now,
        date: today,
      },
      update: {
        rate,
        buyRate,
        sellRate,
        fetchedAt: now,
      },
    })
  })

  await prisma.$transaction(ops);
}
