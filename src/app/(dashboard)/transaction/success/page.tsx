import { Check, ChevronRight, Home, Printer, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { decryptDeterministic, decryptFromString } from "@/lib/encryption";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getTransactionById } from "@/lib/db/transactionHelpers";

export default async function TransactionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: transactionId } = await searchParams;
  // Make sure to specify the generic type so TypeScript knows the return type includes the relations
  const transaction = await getTransactionById({
    where: { id: Number(transactionId) },
    include: {
      customer: true,
      currencyDetails: { include: { currency: true } },
      operator: true,
    },
  });

  if (!transaction) {
    return <div className="flex justify-center">Transaction not found</div>;
  }

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <Check className="h-12 w-12 text-green-600 dark:text-green-300" />
      </div>

      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Transaction Complete</CardTitle>
          <CardDescription>
            The multi-currency transaction has been successfully processed and
            recorded
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction ID and Date/Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="text-lg font-medium">TX-{transaction.id}</p>
            </div>
            <div className="rounded-md bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="text-lg font-medium">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-md border p-4">
            <h3 className="mb-3 font-medium">Customer Information</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p>
                  {decryptDeterministic(transaction.customer.firstNameEnc)}
                  {""}
                  {decryptDeterministic(transaction.customer.lastNameEnc)}
                </p>
              </div>
              <div>
                {transaction.customer.phoneEnc &&
                  (() => {
                    try {
                      const decrypted = decryptFromString(
                        transaction.customer.phoneEnc
                      );
                      return (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Contact
                          </p>
                          <p>{decrypted}</p>
                        </>
                      );
                    } catch {
                      return null; // or show a fallback
                    }
                  })()}
              </div>
              <div>
                {transaction.customer.emailEnc &&
                  (() => {
                    try {
                      const decrypted = decryptFromString(
                        transaction.customer.emailEnc
                      );
                      return (
                        <>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{decrypted}</p>
                        </>
                      );
                    } catch {
                      return null;
                    }
                  })()}
              </div>
            </div>
          </div>

          {/* Currency Exchange Details */}
          <div className="rounded-md border p-4">
            <h3 className="mb-3 font-medium">Currency Exchange Details</h3>
            <div className="space-y-3">
              {transaction.currencyDetails.map((c, index) => (
                <div key={index} className="rounded-md bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.currency.symbol}</span>
                      <div>
                        <p className="font-medium">
                          {c.currency.name} ({c.currency.code})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rate: £1 = {c.currency.code} {Number(c.exchangeRate)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {c.transactionType === "SELL" ? "Sell" : "Buy"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>Amount:</span>
                    <span className="font-medium">
                      {c.currency.code}{" "}
                      {Math.abs(Number(c.foreignAmount)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GBP Equivalent:</span>
                    <span className="font-medium">
                      £{Number(c.sterlingAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-2 font-medium">
                <span>Total Currency Value:</span>
                <span>£{Number(transaction.totalSterling).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-md border p-4">
            <h3 className="mb-3 font-medium">Payment Summary</h3>
            {transaction.paymentMethod &&
              JSON.parse(transaction.paymentMethod).CASH > 0 && (
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between">
                      <span>Cash Payment:</span>
                      <span>£{JSON.parse(transaction.paymentMethod).CASH}</span>
                    </div>

                    {transaction.cashTendered && (
                      <>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Cash Tendered:</span>
                          <span>£{transaction.cashTendered.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Change Given:</span>
                          <span>
                            £
                            {Number(transaction.cashTendered) -
                              JSON.parse(transaction.paymentMethod).CASH}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {JSON.parse(transaction.paymentMethod).CARD > 0 && (
                    <div className="flex justify-between pt-2">
                      <span>Card Payment:</span>
                      <span>£{JSON.parse(transaction.paymentMethod).CARD}</span>
                    </div>
                  )}
                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium">
                    <span>Total Amount Paid:</span>
                    <span>£{Number(transaction.totalSterling)}</span>
                  </div>
                </div>
              )}
          </div>

          {/* Transaction Details */}
          <div className="rounded-md border p-4">
            <h3 className="mb-3 font-medium">Transaction Details</h3>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Operator</p>
                <p>
                  {transaction.operator.firstName}{" "}
                  {transaction.operator.lastName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Operator ID</p>
                <p>{transaction.operator.username}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Branch</p>
                <p>Edinburgh</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reference Number</p>
                <p>
                  REF-
                  {Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Options */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" className="w-full">
              <Receipt className="mr-2 h-4 w-4" />
              Email Receipt to Customer
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Link href={"/transaction"} className="w-full">
            <Button className="w-full">
              New Transaction
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href={"/"} className="w-full">
            <Button variant="outline" className="w-full">
              Return to Dashboard
              <Home className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
