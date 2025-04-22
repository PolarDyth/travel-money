import { Prisma } from "../../../../generated/prisma";

export type Currencies = Prisma.CurrencyGetPayload<{
  include: {
    rates: {
      where: { baseCode: "GBP" };
      select: {
        rate: true;
        buyRate: true;
        sellRate: true;
        fetchedAt: true;
      };
    };
  };
}>;

export type ExchangeRates = Prisma.ExchangeRateGetPayload<{
  where: { baseCode: "GBP" };
  select: {
    currencyCode: true;
    buyRate: true;
    sellRate: true;
  };
}>;

export type ExchangeRate = Prisma.ExchangeRateGetPayload<{
  where: { baseCode: "GBP" };
  select: {
    currencyCode: true;
    rate: true;
    buyRate: true;
    sellRate: true;
    date: true;
  };
}>;