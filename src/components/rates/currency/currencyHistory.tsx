"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RateHistoryChart } from "./rateHistoryChart"
import { Currencies } from "@/lib/types/currency/type"

interface CurrencyHistoryProps {
  currency: Currencies
}

export function CurrencyHistory({ currency }: CurrencyHistoryProps) {
  const [period, setPeriod] = useState("1M")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate History</CardTitle>
        <CardDescription>Historical exchange rates for {currency.code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Tabs value={period} onValueChange={setPeriod} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <RateHistoryChart currency={currency} period={period} height={400} />
        </div>
      </CardContent>
    </Card>
  )
}
