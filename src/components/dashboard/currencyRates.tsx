import { ArrowUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Currency } from "@/data/currencies";

export async function CurrencyRates() {
  let currencies: Currency[] = [];

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/currencies`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Request": process.env.INTERNAL_API_SECRET || "",
      }
    });
    const data = await res.json();
    // Ensure data is an array
    if (Array.isArray(data)) {
      currencies = data;
    } else {
      return <div>No currencies found</div>;
    }
  } catch (error) {
    console.error(error);
    return <div className="flex justify-center">Error fetching currencies</div>;
  }

  if (!currencies.length) {
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
        {currencies.map((currency: Currency) => (
          <TableRow key={currency.code}>
            <TableCell>
              <div className="font-medium">{currency.code}</div>
              <div className="text-xs text-muted-foreground">
                {currency.name}
              </div>
            </TableCell>
            <TableCell className="text-right">{currency.buyRate}</TableCell>
            <TableCell className="text-right">{currency.sellRate}</TableCell>
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
