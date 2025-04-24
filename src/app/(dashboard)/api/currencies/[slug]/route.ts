import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params;

  const searchParams = req.nextUrl.searchParams;
  const prevRates = searchParams.get("prevRates") === "true";

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (prevRates) {
    const prevRates = await prisma.exchangeRate.findMany({
      where: {
        baseCode: 'GBP',
        currencyCode: slug,
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

  const currency = await prisma.currency.findUnique({
    where: { code: slug },
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