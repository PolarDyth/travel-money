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
import { currencies, Currency } from "@/data/currencies";
import { calculateDenomThreshold } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";

export default function DenomBreakdown() {
  const { watch, control, register, formState } = useFormContext<TransactionSchema>();

  const currency = watch("currencyDetails.currencyCode");
  const foreignAmount = watch("currencyDetails.foreignAmount");
  const transactionType = watch("transactionType");

  const selectedCurrency: Currency =
    currencies.find((c) => c.code === currency) ?? currencies[0];

  const thresholds = calculateDenomThreshold(selectedCurrency);
  

  function getEvenlySplitDenominations(
    amount: number,
    denoms: number[]
  ): Record<string, number> {
    const result: Record<string, number> = {};
    const sorted = [...denoms].sort((a, b) => b - a);
    let remaining = amount;

    while (remaining > 0) {
      
      const availableDenoms = sorted.filter((denom) => amount >= (thresholds[denom] ?? 0))
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
    console.log(denoms)
    for (const denom of denoms) {
      if (!(denom in result)) {
        console.log("Worked")
        result[denom] = 0;
      }
    }

    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => [String(k), v])
    );
  }


  const split = getEvenlySplitDenominations(foreignAmount, selectedCurrency.denominations);

  const watchedDenoms = watch("denomination");

  const total = Object.entries(watchedDenoms ?? {}).reduce(
    (sum, [key, value]) => {
      return sum + Number(key) * Number(value);
    },
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Denomination Breakdown</CardTitle>
          <CardDescription>
            {transactionType === "SELL"
              ? "Specify the denominations to give to the customer"
              : "Count and enter the denominations received from the customer"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-md border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">
                  {transactionType === "SELL"
                    ? "Suggested Breakdown"
                    : "Enter Denominations"}
                </h3>
                <Badge variant="outline">
                  Total: {selectedCurrency.symbol}
                  {foreignAmount}
                </Badge>
              </div>

              <div className="space-y-4">
                {selectedCurrency.denominations.map((denom) => {
                  const count = split[denom] || 0;

                  // Skip denominations with zero count for cleaner UI
                  if (transactionType === "SELL" && count === 0) return null;

                  return (
                    <div
                      key={denom}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-12 items-center justify-center rounded border bg-muted font-mono text-sm">
                          {selectedCurrency.symbol}
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
                        {selectedCurrency.symbol}
                        {/* Watch the live value if you want, or recalculate based on RHF watch */}
                        {(split[denom] * denom).toFixed(2) ?? 0}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between rounded-md border p-4">
              <span className="font-medium">Total from denominations:</span>
              <span className="font-bold">
                {selectedCurrency.symbol}
                {total}
              </span>
            </div>

            {/* Show warning if denomination total doesn't match foreign amount */}
            {Math.abs(total - foreignAmount) > 0.01 && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Denomination mismatch</AlertTitle>
                <AlertDescription>
                  The total from denominations does not match the foreign
                  amount. Please adjust the denominations.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

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
              {transactionType === "SELL"
                ? "Provide a mix of denominations suitable for the customer's needs. Ask if they have a preference for specific notes."
                : "Count each denomination separately and enter the quantities accurately."}
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
