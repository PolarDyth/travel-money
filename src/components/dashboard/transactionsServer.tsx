import { getTransactions } from "@/lib/db/transactionHelpers";
import { RecentTransactions } from "./transactions";

export default async function RecentTransactionsServer() {
  const data = await getTransactions({
    operator: { select: { firstName: true, lastName: true } },
    currencyDetails: { include: { currency: { select: { symbol: true } } } },
  });
  const transactionData = JSON.parse(JSON.stringify(data));
  return <RecentTransactions transactions={transactionData} />;
}
