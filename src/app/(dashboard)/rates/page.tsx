"use client";

import { Suspense } from "react";
import { Globe } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RatesFilters } from "@/components/rates/ratesFilters";
import { RatesTable } from "@/components/rates/ratesTable";
import { RatesProvider } from "./context/RatesContext";
import { CurrencyProvider } from "../transaction/context/CurrencyContext";

export default function RatesPage() {
  return (
    <RatesProvider>
      <CurrencyProvider>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Currency Exchange Rates
            </h1>
            <p className="text-muted-foreground">
              View and compare exchange rates for all available currencies
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              All Currency Rates
            </CardTitle>
            <CardDescription>
              Last updated: {new Date().toDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RatesFiltersSkeleton />}>
              <RatesFilters />
            </Suspense>

            <div className="mt-4">
              <Suspense fallback={<RatesTableSkeleton />}>
                <RatesTable />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
      </CurrencyProvider>
    </RatesProvider>
  );
}

function RatesFiltersSkeleton() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      <Skeleton className="h-10 w-[300px]" />
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    </div>
  );
}

function RatesTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4 space-y-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
