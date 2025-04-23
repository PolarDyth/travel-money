import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CurrencyPageType } from "./fullCurrencyPage"

interface CurrencyDenominationsProps {
  currency: CurrencyPageType
}

export function CurrencyDenominations({ currency }: CurrencyDenominationsProps) {
  if (!currency.denominations) {
    return <div>No denomination information available</div>
  }

  // Function to format denomination values
  const formatDenomination = (value: number) => {
    if (value < 1) {
      // For coins less than 1 unit
      return `${currency.symbol}${value.toFixed(2).replace(/\.?0+$/, "")}`
    }
    return `${currency.symbol}${value}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Denominations</CardTitle>
        <CardDescription>Available denominations for {currency.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currency.denominations.map((denom: number) => (
            <Card key={denom} className="p-4 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-bold mb-1">{formatDenomination(denom)}</div>
              <div className="text-xs text-muted-foreground">≈ £{currency.rates[0].sellRate ? (denom / Number(currency.rates[0].sellRate)).toFixed(2) : "-"}</div>
              <Badge className="mt-2" variant="outline">
                In Stock
              </Badge>
            </Card>
          ))}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Note: Availability of specific denominations may vary by branch.
        </div>
      </CardContent>
    </Card>
  )
}
