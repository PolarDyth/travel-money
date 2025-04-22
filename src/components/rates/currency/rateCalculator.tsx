"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CurrencyPageType } from "./fullCurrencyPage"

interface RateCalculatorProps {
  currency: CurrencyPageType;
}

export function RateCalculator({ currency }: RateCalculatorProps) {
  const [direction, setDirection] = useState("fromGBP") // "fromGBP" or "toGBP"
  const [amount, setAmount] = useState("100")
  const [result, setResult] = useState("")

  // Calculate the result whenever inputs change
  useEffect(() => {
    if (!amount || isNaN(Number(amount))) {
      setResult("")
      return
    }

    const numAmount = Number(amount)

    if (direction === "fromGBP") {
      // Converting from GBP to foreign currency (using sell rate)
      const foreignAmount = numAmount / Number(currency.rates[0].sellRate)
      setResult(foreignAmount.toFixed(2))
    } else {
      // Converting from foreign currency to GBP (using buy rate)
      const gbpAmount = numAmount * Number(currency.rates[0].buyRate)
      setResult(gbpAmount.toFixed(2))
    }
  }, [amount, direction, currency])

  const handleSwap = () => {
    setDirection(direction === "fromGBP" ? "toGBP" : "fromGBP")
    setAmount(result)
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={direction} onValueChange={setDirection} className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fromGBP" id="fromGBP" />
          <Label htmlFor="fromGBP">GBP to {currency.code}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="toGBP" id="toGBP" />
          <Label htmlFor="toGBP">{currency.code} to GBP</Label>
        </div>
      </RadioGroup>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">{direction === "fromGBP" ? "GBP Amount" : `${currency.code} Amount`}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {direction === "fromGBP" ? "£" : currency.symbol}
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8"
              placeholder="Enter amount"
            />
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={handleSwap} className="w-8 h-8 mx-auto">
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="space-y-2">
          <Label htmlFor="result">{direction === "fromGBP" ? `${currency.code} Amount` : "GBP Amount"}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {direction === "fromGBP" ? currency.symbol : "£"}
            </div>
            <Input id="result" type="text" value={result} readOnly className="pl-8 bg-muted" />
          </div>
          <div className="text-xs text-muted-foreground">
            Rate:{" "}
            {direction === "fromGBP"
              ? `£1 = ${currency.symbol}${(1 / Number(currency.rates[0].sellRate))}`
              : `${currency.symbol}1 = £${Number(currency.rates[0].buyRate)}`}
          </div>
        </div>
      </div>
    </div>
  )
}
