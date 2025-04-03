import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const currencies = [
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 1.19,
    buy: 1.31,
    sell: 1.17,
    denominations: [500, 200, 100, 50, 20, 10, 5],
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: 1.27,
    buy: 1.45,
    sell: 1.24,
    denominations: [100, 50, 20, 10, 5, 2, 1],
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    rate: 189.45,
    buy: 194.1,
    sell: 184.8,
    denominations: [10000, 5000, 2000, 1000],
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: 1.92,
    buy: 1.97,
    sell: 1.87,
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    rate: 1.71,
    buy: 1.75,
    sell: 1.67,
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr.",
    rate: 1.14,
    buy: 1.17,
    sell: 1.11,
    denominations: [1000, 200, 100, 50, 20, 10],
  },
];

function roundUpToNearest(num: number, multiple: GLfloat): number {
  console.log("Rounding up:", num, "to nearest", multiple);
  const val = Math.ceil(num / multiple) * multiple;
  return parseFloat(val.toFixed(2));
}

export default function CurrencyDetailsForm() {
  const { register, control, watch, setValue } =
    useFormContext<TransactionSchema>();
  const selectedCurrency = watch("currencyDetails.currencyCode");
  const selectedTransactionType = watch("transactionType") || "SELL";
  const sterlingValue = watch("currencyDetails.sterlingAmount") || 0;
  const foreignValue = watch("currencyDetails.foreignAmount") || 0;

  const [transactionLevel, setTransactionLevel] = useState<
    "LOW" | "MEDIUM" | "HIGH"
  >("LOW");

  
  if (selectedTransactionType === "BUY") {
    currencies.sort((a, b) => a.buy - b.buy);

  } else {
    currencies.sort((a, b) => a.sell - b.sell);
  }

  const handleSterlingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Sterling value changed:", value);
    if (value === "") {
      setValue("currencyDetails.foreignAmount", 0);
      return;
    }

    const sterlingAmount = parseFloat(value);
    if (!isNaN(sterlingAmount)) {
      const currency = currencies.find((c) => c.code === selectedCurrency);
      const lowestDenomination = Math.min(...(currency?.denominations || []));
      const foreignAmount = roundUpToNearest(
        sterlingAmount * (currency?.rate ?? 0) || 0,
        lowestDenomination || 1
      );

      const newSterlingAmount = roundUpToNearest(
        foreignAmount / (currency?.rate ?? 1) || 0,
        0.01
      );
      setValue("currencyDetails.sterlingAmount", newSterlingAmount || 0);
      setValue("currencyDetails.foreignAmount", foreignAmount);

      if (sterlingAmount < 500) {
        setTransactionLevel("LOW");
      } else if (sterlingAmount < 5000) {
        setTransactionLevel("MEDIUM");
      } else {
        setTransactionLevel("HIGH");
      }
    }
  };

  const handleForeignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setValue("currencyDetails.sterlingAmount", 0);
      return;
    }

    const foreignAmount = parseFloat(value);
    if (!isNaN(foreignAmount)) {
      const currency = currencies.find((c) => c.code === selectedCurrency);
      const lowestDenomination = Math.min(...(currency?.denominations || []));

      const sterlingAmount = roundUpToNearest(
        foreignAmount / (currency?.rate ?? 1) || 0,
        0.01
      );

      if (foreignAmount % lowestDenomination !== 0) {
        const newForeignAmount = roundUpToNearest(
          sterlingAmount * (currency?.rate ?? 0) || 0,
          lowestDenomination || 1
        );
        setValue("currencyDetails.foreignAmount", newForeignAmount);
      } else {
        setValue("currencyDetails.foreignAmount", foreignAmount);
      }

      setValue("currencyDetails.sterlingAmount", sterlingAmount);
    }
  };

  return (
    <div className="grid grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Currency Details</CardTitle>
          <CardDescription>Select currency and enter amounts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <FormField
              control={control}
              {...register("currencyDetails.currencyCode")}
              name="currencyDetails.currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value || "EUR")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              <span>
                                {
                                  currencies.find((c) => c.code === field.value)
                                    ?.name
                                }
                              </span>
                              <span>
                                {
                                  currencies.find((c) => c.code === field.value)
                                    ?.code
                                }
                              </span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.code} - </span>
                            <span>{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <Card>
            <CardContent className="grid grid-cols-2">
              <div className="flex flex-col items-start gap-1">
                <span>Today&#39;s rates</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={"outline"}>Updated at 09:00</Badge>
              </div>

              <div className="flex flex-col items-start gap-1 pt-5">
                <span className="text-muted-foreground text-sm">
                  We Sell At
                </span>
                <span className="font-medium">
                  {currencies.find((c) => c.code === selectedCurrency)?.sell}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1 pt-5">
                <span className="text-muted-foreground text-sm">We Buy At</span>
                <span className="font-medium">
                  {currencies.find((c) => c.code === selectedCurrency)?.buy}
                </span>
              </div>
            </CardContent>
          </Card>
          <div>
            <FormField
              control={control}
              {...register("currencyDetails.sterlingAmount")}
              name="currencyDetails.sterlingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Sterling</FormLabel>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 self-center text-muted-foreground">
                      £
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-10 input"
                      {...field}
                      onBlur={(e) => {
                        handleSterlingChange(
                          e as unknown as React.ChangeEvent<HTMLInputElement>
                        )
                    }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSterlingChange(
                            e as unknown as React.ChangeEvent<HTMLInputElement>
                          );
                        }
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={control}
              {...register("currencyDetails.foreignAmount")}
              name="currencyDetails.foreignAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in {selectedCurrency}</FormLabel>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 self-center text-muted-foreground">
                      {
                        currencies.find((c) => c.code === selectedCurrency)
                          ?.symbol
                      }
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-10 input"
                      {...field}
                      onBlur={(e) => {
                          handleForeignChange(
                            e as unknown as React.ChangeEvent<HTMLInputElement>
                          )
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleForeignChange(
                            e as unknown as React.ChangeEvent<HTMLInputElement>
                          );
                        }
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">

        </CardContent>
      </Card>
    </div>
  );
}
