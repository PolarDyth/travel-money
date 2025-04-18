"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../schema";
import { calculateDenomThreshold } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo } from "react";
import { useCurrencyContext } from "@/app/context/CurrencyContext";

export default function DenomBreakdown() {
  const { currencies, error } = useCurrencyContext();

  if (error) throw new Error("Failed to fetch currencies");

  const { watch, register, setValue } = useFormContext<TransactionSchema>();
  const watchedDenoms = watch("denomination");
  const transactionItems = useMemo(
    () => watch("allCurrencyDetails.currencyDetails") ?? [],
    [watch]
  );

  useEffect(() => {
    transactionItems.forEach((item, index) => {
      const currency =
        currencies?.find((c) => c.code === item.currencyCode) ?? currencies![0];
      const thresholds = calculateDenomThreshold(currency);
      const split = getEvenlySplitDenominations(
        item.foreignAmount,
        currency.denominations,
        thresholds
      );
      // Only set if not already set
      if (!watchedDenoms?.[index] || Array.isArray(watchedDenoms[index])) {
        setValue(`denomination.${index}`, split, { shouldDirty: false });
      }
    });
  }, [transactionItems, setValue, watchedDenoms, currencies]);

  function getEvenlySplitDenominations(
    amount: number,
    denoms: number[],
    thresholds: Record<number, number> = {}
  ): Record<string, number> {
    const result: Record<string, number> = {};
    const sorted = [...denoms].sort((a, b) => b - a);
    let remaining = amount;

    while (remaining > 0) {
      const availableDenoms = sorted.filter(
        (denom) => remaining >= (thresholds[denom] ?? 0)
      );
      let gaveSomething = false;

      for (const denom of availableDenoms) {
        if (remaining >= denom) {
          result[denom] = (result[denom] ?? 0) + 1;
          remaining -= denom;
          gaveSomething = true;
        }
      }

      // if we go through the loop and can't give anything, break to avoid infinite loop
      if (!gaveSomething) break;
    }
    for (const denom of denoms) {
      if (!(denom in result)) {
        result[denom] = 0;
      }
    }
    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => [String(k), v])
    );
  }

  // Only render the denomination breakdown if there is at least one SELL transaction
  const hasSellTransaction = transactionItems.some(
    (item) => item.transactionType === "SELL"
  );

  if (!hasSellTransaction) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-3">
              <h4 className="font-medium">Counting Protocol</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Count currency twice privately</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Count once to the customer</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-600" />
                  <span>Verbally confirm the amounts</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Denomination Tips</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {
                  "Provide a mix of denominations suitable for the customer's needs. Ask if they have a preference for specific notes."
                }
              </p>
            </div>

            <div>
              <h4 className="font-medium">Counterfeit Detection</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Always check for security features on banknotes using the UV
                light and detector pen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Denomination Breakdown</CardTitle>
          <CardDescription>
            Specify the denominations for each currency in the transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue={transactionItems[0]?.id}>
              <TabsList className="mb-4">
                {transactionItems
                  .filter((item) => item.transactionType === "SELL")
                  .map((item) => (
                    <TabsTrigger key={item.id} value={item.id}>
                      Sell {item.currencyCode}
                    </TabsTrigger>
                  ))}
              </TabsList>

              {transactionItems.map((item, index) => {
                const currency =
                  currencies?.find((c) => c.code === item.currencyCode) ??
                  currencies![0];
                const thresholds = calculateDenomThreshold(currency);
                const split = getEvenlySplitDenominations(
                  item.foreignAmount,
                  currency.denominations,
                  thresholds
                );

                if (item.transactionType === "BUY") return;

                return (
                  <TabsContent
                    key={item.id}
                    value={item.id}
                    className="space-y-4"
                  >
                    <div className="rounded-md border p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium">
                          {item.transactionType === "SELL"
                            ? "Suggested Breakdown"
                            : "Enter Denominations"}
                        </h3>
                        <Badge variant="outline">
                          Total: {currency.symbol}
                          {item.foreignAmount.toFixed(2)}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        {currency.denominations.map((denom) => {
                          return (
                            <div
                              key={denom}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-12 items-center justify-center rounded border bg-muted font-mono text-sm">
                                  {currency.symbol}
                                  {denom}
                                </div>
                                <span className="text-sm">x</span>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    max={200}
                                    className="h-8 w-16"
                                    {...register(
                                      `denomination.${index}.${denom.toString()}`,
                                      {
                                        valueAsNumber: true,
                                      }
                                    )}
                                    value={
                                      watchedDenoms?.[index]?.[denom] ??
                                      split[denom] ??
                                      0
                                    }
                                  />
                                </FormControl>
                              </div>
                              <div className="text-right font-medium">
                                {currency.symbol}
                                {(
                                  (watchedDenoms?.[index]?.[denom] ??
                                    split[denom]) * denom
                                ).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-between rounded-md border p-4">
                      <span className="font-medium">
                        Total from denominations:
                      </span>
                      <span className="font-bold">
                        {currency.symbol}
                        {currency.denominations
                          .reduce(
                            (sum, denom) =>
                              sum +
                              (watchedDenoms?.[index]?.[denom] ??
                                split[denom]) *
                                denom,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>

                    {(() => {
                      const denomValue = currency.denominations.reduce(
                        (acc, denom) =>
                          acc +
                          (watchedDenoms?.[index]?.[denom] ?? split[denom]) *
                            denom,
                        0
                      );
                      return (
                        Math.abs(denomValue - item.foreignAmount) > 0.01 && (
                          <Alert variant="destructive">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Denomination mismatch</AlertTitle>
                            <AlertDescription>
                              The total from denominations does not match the
                              foreign amount. Please adjust the denominations.
                            </AlertDescription>
                          </Alert>
                        )
                      );
                    })()}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-3">
            <h4 className="font-medium">Counting Protocol</h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-600" />
                <span>Count currency twice privately</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-600" />
                <span>Count once to the customer</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green-600" />
                <span>Verbally confirm the amounts</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Denomination Tips</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              {
                "Provide a mix of denominations suitable for the customer's needs. Ask if they have a preference for specific notes."
              }
            </p>
          </div>

          <div>
            <h4 className="font-medium">Counterfeit Detection</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Always check for security features on banknotes using the UV light
              and detector pen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
