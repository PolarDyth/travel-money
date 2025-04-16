import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { currencyDetailsSchema, TransactionSchema } from "../schema";
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
import { Info, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { roundUpToNearest } from "@/lib/utils";
import { currencies, Currency } from "@/data/currencies";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import { z } from "zod";

const defaultSchemaValues = {
  id: "",
  transactionType: "SELL" as "SELL" | "BUY",
  currencyCode: currencies[0].code,
  sterlingAmount: 0,
  foreignAmount: 0,
  exchangeRate: currencies[0].sell,
};

export default function CurrencyDetailsForm() {
  const { setValue, watch, control } = useFormContext<TransactionSchema>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "allCurrencyDetails.currencyDetails",
  });

  const [transactionLevel, setTransactionLevel] = useState("LOW");
  const [activeCurrency, setActiveCurrency] = useState<Currency>(currencies[0]);

  type activeSchema = z.infer<typeof currencyDetailsSchema>;

  const activeForm = useForm<activeSchema>({
    defaultValues: defaultSchemaValues,
  });

  // Watch the array of currency items
  const watchedCurrencyDetails = watch("allCurrencyDetails.currencyDetails");
  const currentTransactionType = activeForm.watch("transactionType");
  const sterlingValue = activeForm.watch("sterlingAmount");
  const foreignValue = activeForm.watch("foreignAmount");
  // Calculate total sterling
  useEffect(() => {
    const totalSterling = watchedCurrencyDetails.reduce(
      (sum, item) => sum + (item.sterlingAmount || 0),
      0
    );
    setValue("allCurrencyDetails.totalSterling", totalSterling);
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
  }, [watchedCurrencyDetails, setValue]);

  // Handler to add a new item
  const addToTransaction = () => {
    activeForm.setValue("id", uuidv4());
    const current = currencyDetailsSchema.safeParse(activeForm.getValues());
    if (current.success) {
      append({ ...current.data, id: uuidv4() });
      activeForm.reset();
      setActiveCurrency(currencies[0]);
    }
  };

  // Handler to remove an item
  const removeItem = (id: UUIDTypes) => {
    const index = fields.findIndex((item) => item.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  // Calculate exchange rate
  const calculateExchangeRate = (
    currency: Currency,
    transactionType: string
  ) => {
    return transactionType === "BUY" ? currency.buy : currency.sell;
  };

  // Handle sterling amount changes
  const handleSterlingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;
    const currency = currencies.find((c) => c.code === activeCurrency?.code);

    const sterlingAmount = parseFloat(value);
    if (isNaN(sterlingAmount) || !currency) return;

    const rate =
      currentTransactionType === "BUY"
        ? -Math.abs(currency.buy)
        : currency.sell;
    const lowestDenomination = Math.min(...currency.denominations);

    // Calculate foreign amount and round up
    let foreignAmount = sterlingAmount * rate;
    foreignAmount = roundUpToNearest(foreignAmount, lowestDenomination);

    // Recalculate sterling amount to match rounded foreign
    const newSterlingAmount = parseFloat((foreignAmount / rate).toFixed(2));
    activeForm.setValue("sterlingAmount", newSterlingAmount);
    activeForm.setValue("foreignAmount", foreignAmount);
  };

  // Handle foreign amount changes
  const handleForeignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;

    const currency = currencies.find((c) => c.code === activeCurrency?.code);

    let foreignAmount = parseFloat(value);
    if (isNaN(foreignAmount) || !currency) return;

    const rate =
      currentTransactionType === "BUY"
        ? -Math.abs(currency.buy)
        : currency.sell;
    const lowestDenomination = Math.min(...currency.denominations);

    // Round up to nearest denomination
    foreignAmount = roundUpToNearest(foreignAmount, lowestDenomination);

    // Calculate sterling amount
    const sterlingAmount = parseFloat((foreignAmount / rate).toFixed(2));
    activeForm.setValue("sterlingAmount", sterlingAmount);
    activeForm.setValue("foreignAmount", foreignAmount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Add Currency Exchange</CardTitle>
          <CardDescription>
            Add multiple currency exchanges to this transaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FormField
                {...activeForm.register("transactionType")}
                control={activeForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);

                          const currency = currencies.find(
                            (c) => c.code === activeCurrency?.code
                          );
                          if (value === "BUY") {
                            activeForm.setValue(
                              "exchangeRate",
                              currency?.buy ?? 0
                            );
                          } else if (value === "SELL") {
                            activeForm.setValue(
                              "exchangeRate",
                              currency?.sell ?? 0
                            );
                          }

                          activeForm.setValue("sterlingAmount", 0);
                          activeForm.setValue("foreignAmount", 0);
                        }}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="SELL" id="SELL" />
                          <Label htmlFor="SELL">Sell Foreign Currency</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="BUY" id="BUY" />
                          <Label htmlFor="BUY">Buy Foreign Currency</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                {...activeForm.register("currencyCode")}
                control={activeForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Currency</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        const selectedCurrency =
                          currencies.find((c) => c.code === value) ||
                          currencies[0];
                        setActiveCurrency(selectedCurrency);
                        activeForm.setValue("currencyCode", value);

                        activeForm.setValue("foreignAmount", 0);
                        activeForm.setValue("sterlingAmount", 0);

                        activeForm.setValue(
                          "exchangeRate",
                          calculateExchangeRate(
                            selectedCurrency,
                            currentTransactionType
                          )
                        );
                      }}
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <FormField
                {...activeForm.register("sterlingAmount")}
                control={activeForm.control}
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
                        disabled={currentTransactionType === "BUY"}
                        onBlur={() => handleSterlingChange}
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

            <FormField
              {...activeForm.register("foreignAmount")}
              control={activeForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in {activeCurrency?.code}</FormLabel>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 self-center text-muted-foreground">
                      {
                        currencies.find((c) => c.code === activeCurrency?.code)
                          ?.symbol
                      }
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-10 input"
                      {...field}
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
            <FormMessage />
          </div>
          <Button
            onClick={addToTransaction}
            disabled={sterlingValue === 0 || foreignValue <= 0}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Transaction
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction Items</span>
            <Badge variant="secondary" className="ml-2">
              {fields.length} {fields.length === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No items added yet
              </p>
              <p className="text-xs text-muted-foreground">
                Add currency exchanges to proceed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((item, idx) => {
                const currency =
                  currencies.find((c) => c.code === item.currencyCode) ||
                  currencies[0];
                return (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          item.transactionType === "SELL"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {item.transactionType === "SELL" ? "Sell" : "Buy"}{" "}
                        {item.currencyCode}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sterling:</span>
                        <span>£{item.sterlingAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Foreign:</span>
                        <span>
                          {currency.symbol}
                          {item.foreignAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total Sterling:</span>
                <span>
                  £{watch("allCurrencyDetails.totalSterling").toFixed(2)}
                </span>
              </div>

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
                  {transactionLevel === "low" &&
                    "Basic customer information required."}
                  {transactionLevel === "medium" &&
                    "Customer ID verification required."}
                  {transactionLevel === "high" &&
                    "Enhanced due diligence required with two forms of ID."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
