import { Receipt } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Separator } from "./separator";
import { TransactionSchema } from "../transaction/schema";
import { useCurrencyContext } from "@/app/(dashboard)/transaction/context/CurrencyContext";
import { Currencies } from "@/lib/types/currency/type";

export default function TransactionReceipt({ transaction }: { transaction: TransactionSchema }) {

  const { currencies: data, error, isLoading } = useCurrencyContext();

  if (isLoading) return <div>Loading...</div>;
  if (error) throw new Error("Failed to fetch currencies data");

  const currencies = JSON.parse(JSON.stringify(data));

  const transactionItems = transaction.allCurrencyDetails.currencyDetails;
  const paymentMethods = transaction.verification.paymentMethod;
  const tenderedCash = transaction.verification.cashTendered ?? 0;

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="w-full">
        <Receipt className="mr-2 h-4 w-4" />
        Print Receipt
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Print Receipt</DialogTitle>
        <DialogDescription>
          The receipt will be sent to the default printer.
        </DialogDescription>
      </DialogHeader>
      <div className="border p-4">
        <div className="text-center">
          <h3 className="text-lg font-bold">Travel Money Exchange</h3>
          <p className="text-sm text-muted-foreground">
            123 High Street, London, SW1A 1AA
          </p>
          <p className="text-sm text-muted-foreground">
            Tel: 020 1234 5678
          </p>
          <Separator className="my-2" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Transaction ID:</span>
            <span>
              TX-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Date & Time:</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Operator:</span>
            <span>John Smith</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>
              {transaction.customerInfo.customerFirstName}{" "}
              {transaction.customerInfo.customerLastName}
            </span>
          </div>
          <Separator className="my-2" />

          {transaction.allCurrencyDetails.currencyDetails.map((item, index) => {
            const currency = currencies?.find(
              (c: Currencies) => c.code === item.currencyCode
            );
            const sellRate = currency?.rates?.[0]?.sellRate;
            const buyRate = currency?.rates?.[0]?.buyRate;

            return (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>
                    {index + 1}.{" "}
                    {item.transactionType === "SELL" ? "Sell" : "Buy"}{" "}
                    {item.currencyCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span>
                    {item.transactionType === "SELL"
                        ? `£1 = ${currency?.symbol}${sellRate}`
                      :  `${currency?.symbol}1 = £${(
                          1 / buyRate
                        ).toFixed(4)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sterling Amount:</span>
                  <span>£{item.sterlingAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{currency?.name}:</span>
                  <span>
                    {currency?.symbol}
                    {item.foreignAmount.toFixed(2)}
                  </span>
                </div>
                {index < transactionItems.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            );
          })}

          <Separator className="my-2" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <div className="text-right">
                {(paymentMethods.CASH ?? 0) > 0 && (
                  <div>Cash: £{paymentMethods.CASH?.toFixed(2)}</div>
                )}
                {(paymentMethods.CARD ?? 0) > 0 && (
                  <div>Card: £{paymentMethods.CARD?.toFixed(2)}</div>
                )}
              </div>
            </div>

            {tenderedCash > (paymentMethods.CASH ?? 0) && (
              <div className="flex justify-between">
                <span>Cash Tendered:</span>
                <span>£{tenderedCash.toFixed(2)}</span>
              </div>
            )}

            {tenderedCash > (paymentMethods.CASH ?? 0) && (
              <div className="flex justify-between">
                <span>Change Given:</span>
                <span>
                  £
                  {(
                    tenderedCash - (paymentMethods.CASH ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <span>Total Sterling:</span>
            <span>£{transaction.allCurrencyDetails.totalSterling.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>Please retain this receipt for your records.</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button>Print</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}