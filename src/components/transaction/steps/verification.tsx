import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Info, PoundSterling } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { currencies } from "@/data/currencies";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function Verification() {
  const { watch, register, control, setValue } =
    useFormContext<TransactionSchema>();

  const transactionItems = watch("allCurrencyDetails.currencyDetails") ?? [];
  const totalSterling = watch("allCurrencyDetails.totalSterling");
  const customerInfo = watch("customerInfo");
  const paymentMethods = watch("verification.paymentMethod") ?? {
    CASH: 0,
    CARD: 0,
  };
  const cashTendered = watch("verification.cashTendered") ?? 0;
  const [transactionLevel, setTransactionLevel] = useState<
    "LOW" | "MEDIUM" | "HIGH"
  >("LOW");

  useEffect(() => {
    setValue("allCurrencyDetails.totalSterling", totalSterling);
    if (!cashTendered || Number(cashTendered) === 0) {
      setValue("verification.paymentMethod.CARD", Number(totalSterling) || 0);
      setValue("verification.paymentMethod.CASH", 0);
    }
    if (totalSterling >= 5000) {
      setTransactionLevel("HIGH");
    } else if (totalSterling >= 500) {
      setTransactionLevel("MEDIUM");
      setValue("customerInfo.secondaryId", undefined);
    } else {
      setTransactionLevel("LOW");
      setValue("customerInfo.primaryId", undefined);
      setValue("customerInfo.secondaryId", undefined);
    }
  }, [setValue, totalSterling, cashTendered]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Verification</CardTitle>
        <CardDescription>
          Complete the required verification steps before finalizing the
          transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <h3 className="mb-4 font-medium">
              Operator Verification Checklist
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.countedTwice")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="countedTwice"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="countedTwice"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have counted all currencies twice privately
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.countedToCustomer")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="countedToCustomer"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="countedToCustomer"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have counted all currencies once to the customer
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.confirmedCurrency")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirmedCurrency"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="confirmedCurrency"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have confirmed what currency the customer is
                            getting
                          </Label>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.confirmedForeign")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirmedForeign"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="confirmedForeign"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have confirmed the foreign currency with the
                            customer
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.confirmedSterling")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirmedSterling"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="confirmedSterling"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have confirmed the sterling amount with the
                            customer
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <FormField
                  control={control}
                  {...register("verification.confirmedExchangeRate")}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="confirmedExchangeRate"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="confirmedExchangeRate"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I have confirmed the exchange rate with the customer
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border p-4">
            <h3 className="mb-4 font-medium">Transaction Summary</h3>

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
                  const currency = currencies.find(
                    (currency) => currency.code === item.currencyCode
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
                    £{totalSterling}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Customer</span>
                <span className="font-medium">
                  {customerInfo.customerFirstName}{" "}
                  {customerInfo.customerLastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Transaction Level
                </span>
                <Badge
                  className={`
                        ${
                          transactionLevel === "LOW"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : ""
                        }
                        ${
                          transactionLevel === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : ""
                        }
                        ${
                          transactionLevel === "HIGH"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : ""
                        }
                      `}
                >
                  {transactionLevel === "LOW"
                    ? "Low"
                    : transactionLevel === "MEDIUM"
                    ? "Medium"
                    : "High"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="rounded-md border p-4 mt-4">
            <h3 className="mb-4 font-medium">Payment Method</h3>

            <div className="space-y-4">
              <FormField
                control={control}
                {...register("verification.cashTendered")}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <FormLabel htmlFor="cashTendered">
                          Cash Tendered
                        </FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <PoundSterling className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="cashTendered"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            defaultValue={field.value}
                            onBlur={(e) => {
                              let tendered = parseFloat(e.target.value);
                              if (isNaN(tendered) || tendered < 0) tendered = 0;
                              setValue("verification.cashTendered", Number(tendered.toFixed(2)));
                              const cash = Math.min(tendered, totalSterling);
                              setValue("verification.paymentMethod.CASH", cash);
                              setValue(
                                "verification.paymentMethod.CARD",
                                Math.max(0, totalSterling - cash)
                              );
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  {...register("verification.paymentMethod.CASH")}
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FormLabel>Cash Used</FormLabel>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <PoundSterling className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="number"
                              value={Math.min(
                                cashTendered,
                                totalSterling
                              ).toFixed(2)}
                              readOnly
                              className="pl-10"
                              style={{
                                backgroundColor: "#f3f4f6",
                                cursor: "not-allowed",
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  {...register("verification.paymentMethod.CARD")}
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FormLabel>Card Used</FormLabel>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <PoundSterling className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="number"
                              value={Math.max(
                                0,
                                totalSterling -
                                  Math.min(cashTendered, totalSterling)
                              ).toFixed(2)}
                              readOnly
                              className="pl-10"
                              style={{
                                backgroundColor: "#f3f4f6",
                                cursor: "not-allowed",
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* Change Required only if cashTendered > totalSterling */}
              {Number(cashTendered) > Number(totalSterling) && (
                <div className="rounded-md bg-green-50 p-3 dark:bg-green-900 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                        Change Required: £
                        {(Number(cashTendered) - Number(totalSterling)).toFixed(
                          2
                        )}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <Label>Total Payment:</Label>
                <span
                  className={`${
                    Number(paymentMethods.CASH ?? 0) +
                      Number(paymentMethods.CARD ?? 0) -
                      totalSterling >
                    0.01
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  £
                  {(
                    Number(paymentMethods.CASH ?? 0) +
                    Number(paymentMethods.CARD ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Transaction Total:</span>
                <span>£{totalSterling}</span>
              </div>
              {Number(paymentMethods.CASH ?? 0) +
                Number(paymentMethods.CARD ?? 0) -
                totalSterling >
                0.01 && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Payment mismatch</AlertTitle>
                  <AlertDescription>
                    The total payment amount does not match the transaction
                    total. Please adjust the payment amounts.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
