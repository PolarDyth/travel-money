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
import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../schema";
import { currencies } from "@/data/currencies";
import { calculateDenomThreshold } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DenomBreakdown() {
  const { watch, register } = useFormContext<TransactionSchema>();

  const [denomValue, setDenomValue] = useState(0);

  const watchedDenoms = watch("denomination");
  const transactionItems = watch("allCurrencyDetails.currencyDetails") ?? [];

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
        (denom) => amount >= (thresholds[denom] ?? 0)
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

  useEffect(() => {
    console.log("changed");

    const total = Object.entries(watchedDenoms ?? {}).reduce(
      (sum, [key, value]) => {
        return sum + Number(key) * Number(value);
      },
      0
    );
    setDenomValue(total);
  }, [watchedDenoms]);

  return (
    <Card>
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
              {transactionItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.transactionType === "SELL" ? "Sell" : "Buy"}{" "}
                  {item.currencyCode}
                </TabsTrigger>
              ))}
            </TabsList>

            {transactionItems.map((item, index) => {
              const currency =
                currencies.find((c) => c.code === item.currencyCode) ??
                currencies[0];
              
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
                        
                        const thresholds = calculateDenomThreshold(currency);
                        const split = getEvenlySplitDenominations(
                          item.foreignAmount,
                          currency.denominations,
                          thresholds
                        );

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
                                  className="h-8 w-16"
                                  defaultValue={split[denom] ?? 0}
                                  {...register(`denomination.${denom}`, {
                                    valueAsNumber: true,
                                  })}
                                />
                              </FormControl>
                            </div>
                            <div className="text-right font-medium">
                              {currency.symbol}
                              {/* Watch the live value if you want, or recalculate based on RHF watch */}
                              {((watchedDenoms?.[index]?.[denom] ?? 0) * denom).toFixed(2)}
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
                      {denomValue}
                    </span>
                  </div>

                  {/* Show warning if denomination total doesn't match foreign amount */}
                  {Math.abs(denomValue - item.foreignAmount) > 0.01 && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Denomination mismatch</AlertTitle>
                <AlertDescription>
                  The total from denominations does not match the foreign
                  amount. Please adjust the denominations.
                </AlertDescription>
              </Alert>
            )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
