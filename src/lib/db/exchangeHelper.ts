import { Prisma } from "../../../generated/prisma";
import { prisma } from "../prisma";

export async function getExchangeRates<T extends Prisma.ExchangeRateFindManyArgs>(
  args: T
): Promise<Prisma.ExchangeRateGetPayload<T>[]> {
  const result = await prisma.exchangeRate.findMany(args);
  return result as Prisma.ExchangeRateGetPayload<T>[];
}