import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { TransactionSchema } from "../schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TransactionTypeFormProps {
  transactionType: "BUY" | "SELL";
}

export default function TransactionTypeForm({ transactionType }: TransactionTypeFormProps) {

  const { register, control } = useFormContext<TransactionSchema>();

  return (
    <Card className="w-full">
    <CardHeader>
      <CardTitle>Select Transaction Type</CardTitle>
      <CardDescription>
        Choose whether you are selling or buying foreign currency
      </CardDescription>
    </CardHeader>
    <CardContent>
      <FormField
        control={control}
        {...register ("transactionType")}
        name="transactionType"
        render={({ field }) => (
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <RadioGroupItem
                  value="SELL"
                  id="SELL"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="SELL"
                  className="flex cursor-pointer flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary *:w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        Sell Foreign Currency
                      </span>
                    </div>
                    <Check
                      className={`h-5 w-5 ${
                        transactionType === "SELL"
                          ? "text-primary"
                          : "text-transparent"
                      }`}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Customer buys foreign currency from us. We
                    accept cash or card payment.
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="BUY"
                  id="BUY"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="BUY"
                  className="flex cursor-pointer flex-col gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary *:w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <ArrowLeft className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        Buy Foreign Currency
                      </span>
                    </div>
                    <Check
                      className={`h-5 w-5 ${
                        transactionType === "BUY"
                          ? "text-primary"
                          : "text-transparent"
                      }`}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Customer sells foreign currency to us. We pay
                    out in cash only.
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        )}
      />

      {transactionType === "BUY" && (
        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            When buying foreign currency from customers, we can only
            pay out in cash.
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
  )
}