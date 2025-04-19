import Transaction from "@/components/transaction/transactionForm";
import { CurrencyProvider } from "../../context/CurrencyContext";

export default function Page() {
  return (
    <CurrencyProvider>
      <Transaction />
    </CurrencyProvider>
  );
}
