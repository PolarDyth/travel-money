import { ArrowUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "../../../generated/prisma";
import { getCurrencies } from "@/lib/db/currencyHelpers";
import { getExchangeRates } from "@/lib/db/exchangeHelper";
import { Badge } from "../ui/badge";

type Currencies = Prisma.CurrencyGetPayload<{
  include: {
    rates: {
      where: { baseCode: "GBP" };
      select: {
        rate: true;
        buyRate: true;
        sellRate: true;
        fetchedAt: true;
      };
    };
  };
}>;

type ExchangeRates = Prisma.ExchangeRateGetPayload<{
  where: { baseCode: "GBP" };
  select: {
    currencyCode: true;
    buyRate: true;
    sellRate: true;
  };
}>;

export async function CurrencyRates() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 2);

  const currencyData = await getCurrencies({
    include: {
      rates: {
        where: { baseCode: "GBP", date: date },
        select: {
          rate: true,
          buyRate: true,
          sellRate: true,
          fetchedAt: true,
        },
      },
    },
  });

  const yesterdayExchangeRates = await getExchangeRates({
    where: {
      baseCode: "GBP",
      date: yesterday,
    },
    select: {
      currencyCode: true,
      buyRate: true,
      sellRate: true,
    },
  });

  const currencies = JSON.parse(JSON.stringify(currencyData));

  if (!currencies || currencies.length === 0) {
    return <div>No currencies found</div>;
  }

  const fetchedAt = new Date(currencies[0].rates[0]?.fetchedAt);

  const localTime = fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">We Buy</TableHead>
          <TableHead className="text-right">We Sell</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="text-right">Last Updated</TableHead>{" "}
          {/* New column */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {currencies.map((currency: Currencies) => (
          <TableRow key={currency.code}>
            <TableCell>
              <div className="font-medium">{currency.code}</div>
              <div className="text-xs text-muted-foreground">
                {currency.name}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {currency.rates[0]?.buyRate?.toString()}
            </TableCell>
            <TableCell className="text-right">
              {currency.rates[0]?.sellRate.toString()}
            </TableCell>
            <TableCell className="text-right">
              {(() => {
                const yesterdayRate = yesterdayExchangeRates.find(
                  (rate: ExchangeRates) => rate.currencyCode === currency.code
                );
                const todayBuy = currency.rates[0]?.buyRate ?? null;
                const yesterdayBuy = yesterdayRate?.buyRate ?? null;

                if (todayBuy == null || yesterdayBuy == null) {
                  return <span>-</span>;
                }

                if (todayBuy > yesterdayBuy) {
                  return (
                    <div className="flex items-center justify-end text-green-500">
                      <ArrowUp className="h-4 w-4" />
                    </div>
                  );
                } else if (todayBuy < yesterdayBuy) {
                  return (
                    <div className="flex items-center justify-end text-red-500">
                      <ArrowUp className="h-4 w-4 rotate-180" />
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center justify-end text-gray-400">
                      <ArrowUp className="h-4 w-4 rotate-90" />
                    </div>
                  );
                }
              })()}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline">
              {currency.rates[0]?.fetchedAt
                ? localTime
                : "-"}
                </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
