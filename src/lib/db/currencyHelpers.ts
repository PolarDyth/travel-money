import { Prisma } from "../../../generated/prisma";
import { prisma } from "../prisma";

export async function getCurrencies<T extends Prisma.CurrencyFindManyArgs>(
  args: T
): Promise<Prisma.CurrencyGetPayload<T>[]> {
  const result = await prisma.currency.findMany(args);
  return result as Prisma.CurrencyGetPayload<T>[];
}