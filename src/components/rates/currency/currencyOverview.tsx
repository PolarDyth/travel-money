import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyPageType } from "./fullCurrencyPage";
import { notFound } from "next/navigation";
import { ExchangeRates } from "@/lib/types/currency/type";
import { ArrowUp } from "lucide-react";
import { useParamPrevRates } from "@/routes/currency";
import { RateHistoryChart } from "./rateHistoryChart";
import { DenominationsPreview } from "./denominationsPreview";

interface CurrencyOverviewProps {
  currency: CurrencyPageType;
}

export function CurrencyOverview({ currency }: CurrencyOverviewProps) {
  const { currencies: prevData, isLoading, error } = useParamPrevRates(currency.code);

  if (isLoading) return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) throw new Error("Failed to fetch currencies data");

  if (!prevData) {
    notFound();
  }

  const prevCurrencies = JSON.parse(JSON.stringify(prevData));

  console.log("prevCurrencies:", prevCurrencies);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>About {currency.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{currency.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Currency Code
              </div>
              <div>{currency.code}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Symbol
              </div>
              <div>{currency.symbol}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Country/Region
              </div>
              <div>{currency.country}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Buy Rate
              </div>
              <div>{Number(currency.rates[0].buyRate)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Sell Rate
              </div>
              <div>{Number(currency.rates[0].sellRate)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                24h Change
              </div>
              <div>
              {(() => {
                const yesterdayRate = prevCurrencies.find(
                  (rate: ExchangeRates) => rate.currencyCode === currency.code
                );
                const todayBuy = currency.rates[0]?.buyRate ?? null;
                const yesterdayBuy = yesterdayRate?.buyRate ?? null;

                if (todayBuy == null || yesterdayBuy == null) {
                  return <span>-</span>;
                }

                if (todayBuy > yesterdayBuy) {
                  return (
                    <div className="flex items-center text-green-500">
                      <ArrowUp className="h-4 w-4" />
                    </div>
                  );
                } else if (todayBuy < yesterdayBuy) {
                  return (
                    <div className="flex items-center text-red-500">
                      <ArrowUp className="h-4 w-4 rotate-180" />
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center text-gray-400">
                      <ArrowUp className="h-4 w-4 rotate-90" />
                    </div>
                  );
                }
              })()}
            </div>
            </div>
            
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rate History</CardTitle>
          </CardHeader>
          <CardContent>
            <RateHistoryChart currency={currency} period="1M" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Denominations</CardTitle>
          </CardHeader>
          <CardContent>
            <DenominationsPreview currency={currency} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
