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
import { redirect, useRouter } from "next/navigation";
import CurrencyDetailsForm from "./steps/currencyDetails";
import CustomerInfo from "./steps/customerInfo";
import DenomBreakdown from "./steps/denomBreakdown";
import Verification from "./steps/verification";
import Confirmation from "./steps/confirmation";

const steps = [
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

  const router = useRouter();

  const methods = useForm<TransactionSchema>({
    mode: "onTouched",
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultTransaction,
  });

  const nextStep = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      const valid = await methods.trigger(getSchemaSteps(currentStep));
      if (valid) setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
      else
        console.error("Validation failed for step:", methods.formState.errors);
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const onSubmit = methods.handleSubmit(async (data: TransactionSchema) => {
    try {
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit transaction");
      }

      const result = await response.json();
      const transactionId = result.transactionId;
      router.push(`/transaction/success?id=${transactionId}`)
    } catch {
      throw new Error("Failed to submit transaction");
    }
  });

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
          <h1 className="text-2xl font-bold">New Transaction</h1>
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
            {currentStep === 0 && <CurrencyDetailsForm />}
            {currentStep === 1 && <CustomerInfo />}
            {currentStep === 2 && <DenomBreakdown />}
            {currentStep === 3 && <Verification />}
            {currentStep === 4 && <Confirmation />}
            <div className="flex items-center justify-between my-6">
              <Button
                variant="outline"
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}>
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
