"use client";

import { useState } from "react";
import {
  defaultTransaction,
  TransactionSchema,
  transactionSchema,
  getSchemaSteps,
} from "./schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { redirect } from "next/navigation";
import TransactionTypeForm from "./steps/transactionType";
import CurrencyDetailsForm from "./steps/currencyDetails";

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

const TOTAL_STEPS = steps.length;

export default function Transaction() {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultTransaction,
  });

  const nextStep = async () => {
    const valid = await methods.trigger(getSchemaSteps(currentStep));
    if (valid) setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    else console.error("Validation failed for step:", currentStep);
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = methods.handleSubmit((data: TransactionSchema) => {
    console.log("Form submitted successfully:", data);
  });

  const selectedTransactionType = methods.watch("transactionType") || "SELL";

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
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              {currentStep === 0 && (
                <TransactionTypeForm
                  transactionType={selectedTransactionType}
                />
              )}

              {currentStep === 1 && <CurrencyDetailsForm />}
              <div className="flex items-center justify-between my-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
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
        </FormProvider>
      </div>
    </main>
  );
}
