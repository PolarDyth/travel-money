import { Prisma } from "../../../generated/prisma";
import { prisma } from "../prisma";

export function getTransactionById(id: number, include?: Prisma.TransactionInclude) {
  return prisma.transaction.findUnique({
    where: { id },
    ...(include ? { include } : {}),
  });
}

export function getTransactions(
  include?: Prisma.TransactionInclude,
  take?: number,
  skip?: number,
) {
  const data =  prisma.transaction.findMany({
    take,
    skip,
    ...(include ? { include } : {}),
  });

  return data;
}