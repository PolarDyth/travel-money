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

type Currencies = Prisma.CurrencyGetPayload<{
  include: {
    rates: {
      where: { baseCode: "GBP" };
      select: {
        rate: true;
        buyRate: true;
        sellRate: true;
      };
    }
  }
}>

export async function CurrencyRates() {

  const currencyData = await getCurrencies({
    include: {
      rates: {
        where: { baseCode: "GBP" },
        select: {
          rate: true,
          buyRate: true,
          sellRate: true,
        },
      },
    },
  })

  const currencies = JSON.parse(JSON.stringify(currencyData));

  if (!currencies || currencies.length === 0) {
    return <div>No currencies found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">We Buy</TableHead>
          <TableHead className="text-right">We Sell</TableHead>
          <TableHead className="text-right">Change</TableHead>
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
            <TableCell className="text-right">{currency.rates[0]?.buyRate?.toString()}</TableCell>
            <TableCell className="text-right">{currency.rates[0]?.sellRate.toString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <ArrowUp className="h-4 w-4 text-green-500" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
