"use client";

import { useEffect, useState } from "react";
import { stepSchemas, transactionSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { redirect } from "next/navigation";

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
    symbol: "CHF",
    rate: 1.14,
    buy: 1.17,
    sell: 1.11,
    denominations: [1000, 200, 100, 50, 20, 10],
  },
];

const steps = [
  {
    id: "transaction-type",
    name: "Transaction Type",
    description: "Select the type of transaction",
  },
  {
    id: "currency-details",
    name: "Currency Details",
    description: "Select the currency and amount",
  },
  {
    id: "customer-info",
    name: "Customer Information",
    description: "Enter customer information",
  },
  {
    id: "denominations",
    name: "Denominations",
    description: "Select denominations",
  },
  {
    id: "verification",
    name: "Verification",
    description: "Verify the transaction",
  },
  {
    id: "confirmation",
    name: "Confirmation",
    description: "Confirm the transaction",
  },
];


const stepDefaults = [
  {
    transactionType: "SELL",
  },
  {
    currencyCode: "EUR",
    sterlingAmount: 0,
    foreignAmount: 0,
    exchangeRate: currencies[0].rate,
    paymentMethod: "CARD",
  },
  {
    customerFirstName: "",
    customerLastName: "",
    customerPostcode: "",
    customerAddressLine1: "",
    customerDOB: undefined,
  },
  {
    denominations: [],
  },
  {
    confirmationStepsCompleted: false,
    amountCounted: false,
    readBackDone: false,
  }
]

type StepSchemas = typeof stepSchemas;
type StepIndex = keyof StepSchemas;
type PartialTransactionSchema = Partial<z.infer<typeof transactionSchema>>;

function useTypedStepForm<Step extends StepIndex>(
  step: Step,
  defaultValues = {}
) {
  const schema = stepSchemas[step] as z.ZodType;
  return useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
}

const TOTAL_STEPS = steps.length;

export default function Transaction() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<PartialTransactionSchema>({});

  const form = useTypedStepForm(currentStep, stepDefaults[currentStep]);
  console.log("Current Data: ", formData);
  useEffect(() => {
    // When the current step changes, reset the form with the default values for that step.
    form.reset(stepDefaults[currentStep]);
    
  }, [currentStep, form]);

  const nextStep = (data: PartialTransactionSchema) => {
    setFormData((prev) => ({ ...prev, ...data }));

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => (prev + 1) as 0 | 1 | 2 | 3 | 4 | 5);
    } else {
      console.log("Final Data: ", { ...formData, ...data });
    }
  };

  const selectedTransactionType = form.watch("transactionType");
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <main className="flex h-screen flex-col w-full max-w-6/7 mx-auto px-4">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => redirect("/")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedTransactionType == "SELL"
              ? "Sell Foreign Currency"
              : "Buy Foreign Currency"}
          </h1>
        </div>
        <div>
          <Badge variant={"outline"}>Transaction #1</Badge>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{steps[currentStep].name}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      <div className="mt-6 hidden md:block">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  index <= currentStep
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="my-8">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(nextStep, (errors) => {
                console.error("Form validation errors:", errors);
              })(e);
            }}
          >
            {currentStep === 0 && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Select Transaction Type</CardTitle>
                  <CardDescription>
                    Choose whether you are selling or buying foreign currency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormControl>
                        <RadioGroup
                          value={selectedTransactionType}
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
                                    selectedTransactionType === "SELL"
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
                                    selectedTransactionType === "BUY"
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

                  {selectedTransactionType === "BUY" && (
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
            )}

            {currentStep === 1 && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Currency Details</CardTitle>
                    <CardDescription>Select currency and enter amounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="currencyCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Currency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "EUR"}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency">
                                    {field.value && (
                                      <div className="flex items-center gap-2">
                                        <span>{currencies.find(c => c.code === field.value)?.name}</span>
                                        <span>{currencies.find(c => c.code === field.value)?.code}</span>
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
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="flex items-center justify-between my-6">
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
            {currentStep < steps.length - 1 ? (
              <Button type="submit">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">
                Complete Transaction
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
