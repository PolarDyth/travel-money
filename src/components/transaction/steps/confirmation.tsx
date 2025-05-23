import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, FileText } from "lucide-react";
import { TransactionSchema } from "../schema";
import { useFormContext } from "react-hook-form";
import { useCurrencyContext } from "@/app/(dashboard)/transaction/context/CurrencyContext";
import { Currencies } from "@/lib/types/currency/type";
import TransactionReceipt from "@/components/ui/transactionReceipt";

export default function Confirmation() {
  const { currencies: data, error, isLoading } = useCurrencyContext();

  const currencies = JSON.parse(JSON.stringify(data));

  if (error) throw new Error(error.message);
  const { watch, getValues } = useFormContext<TransactionSchema>();

  const transactionItems = watch("allCurrencyDetails.currencyDetails");
  const customerInfo = watch("customerInfo");
  const totalSterling = watch("allCurrencyDetails.totalSterling");
  const paymentMethods = watch("verification.paymentMethod") ?? {
    CASH: 0,
    CARD: totalSterling,
  };
  const tenderedCash = watch("verification.cashTendered") ?? 0;

  if (isLoading) return <p>Loading...</p>;

  if (!currencies) return <p>No currencies available</p>;
  if (currencies.length === 0) return <p>No currencies found</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Confirmation</CardTitle>
        <CardDescription>Review and complete the transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900">
            <div className="flex">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                  All verification steps completed
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>
                    {`You have completed all the required steps for this
                    transaction. Click the "Complete Transaction" button to
                    finalize and record this transaction.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-4 font-medium">Transaction Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Transaction ID
                </span>
                <span className="font-medium">
                  TX-
                  {Math.floor(Math.random() * 10000)
                    .toString()
                    .padStart(4, "0")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Date & Time
                </span>
                <span className="font-medium">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Operator</span>
                <span className="font-medium">John Smith</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="font-medium">
                  {customerInfo.customerFirstName}{" "}
                  {customerInfo.customerLastName}
                </span>
              </div>
              <Separator />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Sterling</TableHead>
                    <TableHead className="text-right">Foreign</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionItems.map((item) => {
                    const currency = currencies?.find(
                      (c: Currencies) => c.code === item.currencyCode
                    );
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge
                            variant={
                              item.transactionType === "SELL"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {item.transactionType === "SELL" ? "Sell" : "Buy"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.currencyCode}</TableCell>
                        <TableCell className="text-right">
                          £{item.sterlingAmount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {currency?.symbol}
                          {item.foreignAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={2} className="font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      £{totalSterling.toFixed(2)}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 space-y-3">
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <div>
                  {(paymentMethods.CASH ?? 0) > 0 && (
                    <div className="text-right">
                      <span className="font-medium">
                        Cash: £{paymentMethods.CASH?.toFixed(2) ?? 0}
                      </span>
                      {tenderedCash > (paymentMethods.CASH ?? 0) && (
                        <div className="text-sm text-muted-foreground">
                          Tendered: £{tenderedCash.toFixed(2)}
                          <br />
                          Change: £
                          {(
                            Number(tenderedCash.toFixed(2)) -
                            Number(paymentMethods.CASH?.toFixed(2))
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                  {(paymentMethods.CARD ?? 0) > 0 && (
                    <div className="text-right mt-1">
                      <span className="font-medium">
                        Card: £{paymentMethods.CARD?.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TransactionReceipt transaction={getValues()} />

            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
