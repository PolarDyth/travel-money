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
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { roundUpToNearest } from "@/lib/utils";
import { currencies, Currency } from "@/data/currencies";





export default function CurrencyDetailsForm() {
  const { register, control, watch, setValue } =
    useFormContext<TransactionSchema>();
  const selectedCurrency = watch("currencyDetails.currencyCode");
  const selectedTransactionType = watch("transactionType") || "SELL";
  const sterlingValue = watch("currencyDetails.sterlingAmount") || 0;
  const foreignValue = watch("currencyDetails.foreignAmount") || 0;
  const paymentMethod = watch("currencyDetails.paymentMethod") || "cash";
  const [selectedCurrencyInfo, setCurrencyInfo] = useState<Currency>(
    currencies[0]
  );
  const [transactionLevel, setTransactionLevel] = useState<
    "LOW" | "MEDIUM" | "HIGH"
  >("LOW");

  if (selectedTransactionType === "BUY") {
    currencies.sort((a, b) => a.buy - b.buy);
  } else {
    currencies.sort((a, b) => a.sell - b.sell);
}

useEffect(() => {
  if (sterlingValue < 500) {
    setTransactionLevel("LOW");
  } else if (sterlingValue >= 500 && sterlingValue < 5000) {
    setTransactionLevel("MEDIUM");
  } else {
    setTransactionLevel("HIGH");
  }
}, [sterlingValue]);


// Calculate exchange rate
  const calculateExchangeRate = (
    currency: Currency,
    transactionType: string
  ) => {
    return transactionType === "BUY" ? currency?.buy : currency?.sell;
  };

  // Handle sterling amount changes
  const handleSterlingChange = (e: React.SyntheticEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value === "") return;

    const sterlingAmount = parseFloat(value);
    if (isNaN(sterlingAmount)) return;

    const currency = currencies.find((c) => c.code === selectedCurrency);
    if (!currency) return;

    const rate = calculateExchangeRate(currency, selectedTransactionType);
    if (sterlingAmount === parseFloat((foreignValue / rate).toFixed(2))) {
      return;
    }

    const lowestDenomination = Math.min(...currency.denominations);

    // Calculate and set foreign amount
    const foreignAmount = roundUpToNearest(
      sterlingAmount * rate,
      lowestDenomination
    );
    const newSterlingAmount = parseFloat((foreignAmount / rate).toFixed(2));

    setValue("currencyDetails.sterlingAmount", newSterlingAmount);
    setValue("currencyDetails.foreignAmount", foreignAmount);

  };

  // Handle foreign amount changes
  const handleForeignChange = (e: React.SyntheticEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value === "") return;

    const foreignAmount = parseFloat(value);
    if (isNaN(foreignAmount)) return;

    const currency = currencies.find((c) => c.code === selectedCurrency);
    if (!currency) return;

    if (
      foreignAmount ===
      sterlingValue * calculateExchangeRate(currency, selectedTransactionType)
    ) {
      return;
    }

    const rate = calculateExchangeRate(currency, selectedTransactionType);

    const lowestDenomination = Math.min(...currency.denominations);
    // Round up to the nearest denomination
    const roundedForeignAmount = roundUpToNearest(
      foreignAmount,
      lowestDenomination
    );
    // Calculate sterling amount
    const sterlingAmount = parseFloat((roundedForeignAmount / rate).toFixed(2));

    setValue("currencyDetails.sterlingAmount", sterlingAmount);
    setValue("currencyDetails.foreignAmount", roundedForeignAmount);

  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Currency Details</CardTitle>
          <CardDescription>Select currency and enter amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormField
                control={control}
                {...register("currencyDetails.currencyCode")}
                name="currencyDetails.currencyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Currency</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("currencyDetails.foreignAmount", 0);
                        setValue("currencyDetails.sterlingAmount", 0);
                        setCurrencyInfo(
                          currencies.find((c) => c.code === value) ||
                            currencies[0]
                        );
                        const foundCurrency = currencies.find(
                          (c) => c.code === value
                        );
                        if (foundCurrency) {
                          setValue(
                            "currencyDetails.exchangeRate",
                            calculateExchangeRate(
                              foundCurrency,
                              selectedTransactionType
                            )
                          );
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                <span>
                                  {
                                    currencies.find(
                                      (c) => c.code === field.value
                                    )?.name
                                  }
                                </span>
                                <span>
                                  {
                                    currencies.find(
                                      (c) => c.code === field.value
                                    )?.code
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
                  <span className="text-muted-foreground text-sm">
                    We Buy At
                  </span>
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
                        disabled={selectedTransactionType === "BUY"}
                        onBlur={handleSterlingChange}
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
                        value={field.value}
                        onBlur={handleForeignChange}
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
            <div className="space-y-2">
              <FormField
                control={control}
                {...register("currencyDetails.paymentMethod")}
                name="currencyDetails.paymentMethod"
                render={({ field }) => (
                  <FormControl>
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CASH" id="CASH" className="" />
                          <Label htmlFor="CASH" className="cursor-pointer">
                            Cash
                          </Label>
                        </div>
                        { selectedTransactionType === "SELL" && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CARD" id="CARD" className="" />
                          <Label htmlFor="CARD" className="cursor-pointer">
                            Card
                          </Label>
                        </div>
                        )}
                      </RadioGroup>
                    </FormItem>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            {sterlingValue > 0 && (
              <Alert
                className={`
                    ${
                      transactionLevel === "LOW"
                        ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
                        : ""
                    }
                    ${
                      transactionLevel === "MEDIUM"
                        ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                        : ""
                    }
                    ${
                      transactionLevel === "HIGH"
                        ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
                        : ""
                    }
                  `}
              >
                <Info className="h-4 w-4" />
                <AlertTitle>
                  Transaction Level:{" "}
                  {transactionLevel === "LOW"
                    ? "Low"
                    : transactionLevel === "MEDIUM"
                    ? "Medium"
                    : "High"}
                </AlertTitle>
                <AlertDescription>
                  {transactionLevel === "LOW" &&
                    "Basic customer information required."}
                  {transactionLevel === "MEDIUM" &&
                    "Customer ID verification required."}
                  {transactionLevel === "HIGH" &&
                    "Enhanced due diligence required with two forms of ID."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Transaction Type
            </span>
            <span className="font-medium">
              {selectedTransactionType === "SELL"
                ? "Sell Foreign Currency"
                : "Buy Foreign Currency"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Currency</span>
            <span className="font-medium">{selectedCurrencyInfo.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Exchange Rate</span>
            <span className="font-medium">
              {selectedTransactionType === "SELL"
                ? `£1 = ${
                    selectedCurrencyInfo.symbol
                  }${selectedCurrencyInfo.sell.toFixed(4)}`
                : `${selectedCurrencyInfo.symbol}1 = £${(
                    1 / selectedCurrencyInfo.buy
                  ).toFixed(4)}`}
            </span>
          </div>
          {selectedTransactionType === "SELL" && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>
              <span className="font-medium capitalize">{paymentMethod}</span>
            </div>
          )}
          {sterlingValue !== null &&
            sterlingValue !== undefined &&
            foreignValue !== null &&
            foreignValue !== undefined && (
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sterling Amount</span>
                  <span className="font-bold">£{sterlingValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    {selectedCurrencyInfo.name}
                  </span>
                  <span className="font-bold">
                    {selectedCurrencyInfo.symbol}
                    {foreignValue}
                  </span>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
