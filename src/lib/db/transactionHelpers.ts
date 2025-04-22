import { Prisma } from "../../../generated/prisma";
import { prisma } from "../prisma";

export async function getTransactionById<
  T extends Prisma.TransactionFindUniqueOrThrowArgs
>(
  args: T
): Promise<Prisma.TransactionGetPayload<T>> {
  const result = await prisma.transaction.findUniqueOrThrow(args);
  return result as Prisma.TransactionGetPayload<T>;
}