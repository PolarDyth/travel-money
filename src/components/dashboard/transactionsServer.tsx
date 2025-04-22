import { RecentTransactions } from "./transactions";
import { prisma } from "@/lib/prisma";

export default async function RecentTransactionsServer() {
  const data = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      operator: { select: { firstName: true, lastName: true } },
      currencyDetails: { include: { currency: { select: { symbol: true } } } },
    },
  });
  const transactionData = JSON.parse(JSON.stringify(data));
  return <RecentTransactions transactions={transactionData} />;
}
