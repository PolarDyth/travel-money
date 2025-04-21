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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useCurrencyContext } from "@/app/(dashboard)/transaction/context/CurrencyContext";
import CurrencySkeleton from "@/components/ui/skeletons/transaction/currencySkeleton";
import { Currencies } from "@/lib/types/currency/type";

// Default values for the currency detail form
const defaultSchemaValues = {
  id: "",
  transactionType: "SELL" as "SELL" | "BUY",
  currencyCode: "EUR",
  sterlingAmount: 0,
  foreignAmount: 0,
  exchangeRate: 0,
};

export default function CurrencyDetailsForm() {
  // Get currencies, loading, and error state from context
  const { currencies: data, isLoading, error } = useCurrencyContext();

  console.log("Currency data:", data);
  

  if (error) throw new Error("Failed to fetch currencies");

  // Get form context for the parent transaction form
  const { setValue, watch, control } = useFormContext<TransactionSchema>();

  // Manage the array of currency detail items in the transaction
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allCurrencyDetails.currencyDetails",
  });

  // Local state for transaction level and currently selected currency
  const [transactionLevel, setTransactionLevel] = useState("LOW");
  const [activeCurrency, setActiveCurrency] = useState<Currencies | undefined>(
    undefined
  );

  // Type for the active currency detail schema
  type activeSchema = z.infer<typeof currencyDetailsSchema>;

  // Local form for adding a new currency detail
  const activeForm = useForm<activeSchema>({
    defaultValues: defaultSchemaValues,
  });

  // Watchers for form values
  const watchedCurrencyDetails = watch("allCurrencyDetails.currencyDetails");
  const currentTransactionType = activeForm.watch("transactionType");
  const sterlingValue = activeForm.watch("sterlingAmount");
  const foreignValue = activeForm.watch("foreignAmount");

  // Calculate and update the total sterling amount and transaction level
  useEffect(() => {
    const totalSterling = watchedCurrencyDetails.reduce(
      (sum, item) => sum + (item.sterlingAmount || 0),
      0
    );
    setValue("allCurrencyDetails.totalSterling", totalSterling);

    const totalBought = watchedCurrencyDetails
      .filter((currency) => currency.transactionType === "BUY")
      .reduce((sum, currency) => sum + Math.abs(currency.sterlingAmount), 0);

    const totalSold = watchedCurrencyDetails
      .filter((currency) => currency.transactionType === "SELL")
      .reduce((sum, currency) => sum + Math.abs(currency.sterlingAmount), 0);

    console.log("Total Bought", totalBought); 
    console.log("Total Sold", totalSold);

    setValue("allCurrencyDetails.totalBought", totalBought);
    setValue("allCurrencyDetails.totalSold", totalSold);

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

  // Set the default active currency when currencies are loaded
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const betterTypes = JSON.parse(JSON.stringify(data)) as Currencies[];

      const eur = betterTypes.find((currency) => currency.code === "EUR");

      setActiveCurrency(eur || betterTypes[0]);
    }
  }, [data]);

  useEffect(() => {
    if (activeCurrency) {
      activeForm.setValue(
        "exchangeRate",
        Number(calculateExchangeRate(activeCurrency, currentTransactionType))
      );
    }
  }, [activeCurrency, currentTransactionType, activeForm]);

  // Handler to add a new currency detail to the transaction
  const addToTransaction = () => {
    if (!currencies || currencies.length === 0) return;
    activeForm.setValue("id", uuidv4());
    const current = currencyDetailsSchema.safeParse(activeForm.getValues());
    if (current.success) {
      append({ ...current.data, id: uuidv4() });
      activeForm.reset();
      setActiveCurrency(currencies[0]);
      if (!activeCurrency) throw new Error("No active currency found");
      activeForm.setValue("exchangeRate", Number(activeCurrency.rates[0].sellRate));
    }
  };
  // Handler to remove a currency detail item by id
  const removeItem = (id: UUIDTypes) => {
    const index = fields.findIndex((item) => item.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  // Calculate the exchange rate based on transaction type
  const calculateExchangeRate = (
    currency: Currencies,
    transactionType: string
  ) => {
    return transactionType === "BUY" ? currency.rates[0].buyRate : currency.rates[0].sellRate;
  };

  // Handle changes to the sterling amount input
  const handleSterlingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;

    const sterlingAmount = parseFloat(value);
    if (isNaN(sterlingAmount) || !activeCurrency) return;

    const rate =
      currentTransactionType === "BUY"
        ? -Math.abs(Number(activeCurrency.rates[0].buyRate))
        : Number(activeCurrency.rates[0].sellRate);
    const lowestDenomination = Math.min(...activeCurrency.denominations);

    // Calculate foreign amount and round up
    let foreignAmount = Math.round(sterlingAmount * rate);
    foreignAmount = roundUpToNearest(foreignAmount, lowestDenomination);

    // Recalculate sterling amount to match rounded foreign
    const newSterlingAmount = parseFloat((foreignAmount / rate).toFixed(2));
    activeForm.setValue("sterlingAmount", newSterlingAmount);
    activeForm.setValue("foreignAmount", foreignAmount);
  };

  // Handle changes to the foreign amount input
  const handleForeignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") return;

    let foreignAmount = parseFloat(value);
    if (isNaN(foreignAmount) || !activeCurrency) return;
    const rate =
      currentTransactionType === "BUY"
        ? -Math.abs(Number(activeCurrency.rates[0].buyRate))
        : Number(activeCurrency.rates[0].sellRate);
    const lowestDenomination = Math.min(...activeCurrency.denominations);

    // Round up to nearest denomination
    foreignAmount = roundUpToNearest(foreignAmount, lowestDenomination);
    // Calculate sterling amount
    const sterlingAmount = parseFloat((foreignAmount / rate).toFixed(2));
    activeForm.setValue("sterlingAmount", sterlingAmount);
    activeForm.setValue("foreignAmount", foreignAmount);
  };

  // Show loading state while currencies are loading
  if (isLoading) return <CurrencySkeleton />;

  
  const currencies = JSON.parse(JSON.stringify(data));

  // --- UI rendering below (form fields, transaction items, etc.) ---

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="grid gap-4 md:col-span-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Add Currency Exchange</CardTitle>
            <CardDescription>
              Add multiple currency exchanges to this transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            currencies!.find((c: Currencies) => c.code === value) ||
                            currencies![0];
                          setActiveCurrency(selectedCurrency);
                          activeForm.setValue("currencyCode", value);

                          activeForm.setValue("foreignAmount", 0);
                          activeForm.setValue("sterlingAmount", 0);

                          activeForm.setValue(
                            "exchangeRate",
                            Number(calculateExchangeRate(
                              selectedCurrency,
                              currentTransactionType
                            ))
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
                                      currencies!.find(
                                        (c: Currencies) => c.code === field.value
                                      )?.name
                                    }
                                  </span>
                                  <span>
                                    {
                                      currencies!.find(
                                        (c: Currencies) => c.code === field.value
                                      )?.code
                                    }
                                  </span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies!.map((currency: Currencies) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                            >
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

                            if (value === "BUY") {
                              activeForm.setValue(
                                "exchangeRate",
                                Number(activeCurrency?.rates[0].buyRate) ?? 0
                              );
                            } else if (value === "SELL") {
                              activeForm.setValue(
                                "exchangeRate",
                                Number(activeCurrency?.rates[0].sellRate) ?? 0
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FormField
                  {...activeForm.register("sterlingAmount", {
                    valueAsNumber: true,
                  })}
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

              <FormField
                {...activeForm.register("foreignAmount")}
                control={activeForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount in {activeCurrency?.code}</FormLabel>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 self-center text-muted-foreground">
                        {
                          currencies!.find(
                            (c: Currencies) => c.code === activeCurrency?.code
                          )?.symbol
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
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Currency Information</CardTitle>
            <CardDescription>
              Details about the selected currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {activeCurrency?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {activeCurrency?.code} ({activeCurrency?.symbol})
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {activeCurrency?.symbol}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">We Buy At</p>
                      <p className="text-lg font-medium">
                        {activeCurrency?.symbol}1 = £
                        {Number(activeCurrency?.rates[0].buyRate)
                          ? (1 / Number(activeCurrency?.rates[0].buyRate)).toFixed(4)
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        We Sell At
                      </p>
                      <p className="text-lg font-medium">
                        £1 = {activeCurrency?.symbol}
                        {Number(activeCurrency?.rates[0].sellRate)}
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Exchange Rate Information</AlertTitle>
                    <AlertDescription>
                      {currentTransactionType === "SELL" ? (
                        <span>
                          When selling {activeCurrency?.name}, the customer will
                          receive {activeCurrency?.symbol}
                          {Number(activeCurrency?.rates[0].sellRate)} for every £1.
                        </span>
                      ) : (
                        <span>
                          When buying {activeCurrency?.name}, the customer will
                          recieve £1 for every {activeCurrency?.symbol}
                          {Number(activeCurrency?.rates[0].buyRate)
                            ? (1 / Number(activeCurrency?.rates[0].buyRate)).toFixed(4)
                            : "N/A"}
                          .
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>

                  <div className="rounded-md border p-3">
                    <h4 className="mb-2 font-medium">
                      Available Denominations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeCurrency?.denominations.map((denom) => (
                        <Badge
                          key={denom}
                          variant="outline"
                          className="text-xs"
                        >
                          {activeCurrency?.symbol}
                          {denom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

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
                  currencies!.find((c: Currencies) => c.code === item.currencyCode) ||
                  currencies![0];
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
                  {transactionLevel === "LOW" &&
                    "Basic customer information required."}
                  {transactionLevel === "MEDIUM" &&
                    "Customer ID verification required."}
                  {transactionLevel === "HIGH" &&
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
