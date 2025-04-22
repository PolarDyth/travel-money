import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code; // e.g. 'USD'

  const searchParams = req.nextUrl.searchParams;
  const prevRates = searchParams.get("prevRates") === "true" ? true : false;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (prevRates) {
    const prevRates = await prisma.exchangeRate.findMany({
      where: {
        baseCode: 'GBP',
        currencyCode: code,
        date: yesterday,
      }
    });

    function replacer(key: string, value: number | string | bigint) {
      return typeof value === "bigint" ? value.toString() : value;
    }

    return new Response(JSON.stringify(prevRates, replacer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const currency = prisma.currency.findUnique({
    where: { code },
    include: {
      rates: {
        where: {
          baseCode: 'GBP',
          date: today,
        },
        select: {
          rate: true,
          buyRate: true,
          sellRate: true,
        },
      },
    }
  });

  if (!currency) {
    return new Response(JSON.stringify({ error: 'Currency not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(currency), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
