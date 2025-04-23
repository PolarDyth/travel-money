import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyPageType } from "./fullCurrencyPage"
import { RateCalculator } from "./rateCalculator"

interface CurrencyDetailOverviewProps {
  currency: CurrencyPageType
}

export function CurrencyDetailOverview({ currency }: CurrencyDetailOverviewProps) {

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Current Exchange Rate</CardTitle>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(currency.rates[0].fetchedAt).toLocaleString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">We Buy</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{Number(currency.rates[0].buyRate)}</div>
                <div className="text-sm text-muted-foreground">{currency.code} per £1</div>
              </div>
              <div className="text-sm">
                £1 = {currency.symbol}
                {(1 * Number(currency.rates[0].buyRate)).toFixed(5)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">We Sell</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{Number(currency.rates[0].sellRate)}</div>
                <div className="text-sm text-muted-foreground">{currency.code} per £1</div>
              </div>
              <div className="text-sm">
                £1 = {currency.symbol}
                {(1 * Number(currency.rates[0].sellRate))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Quick Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <RateCalculator currency={currency} />
        </CardContent>
      </Card>
    </div>
  )
}
