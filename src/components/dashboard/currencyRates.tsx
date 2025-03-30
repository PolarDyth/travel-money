import { ArrowDown, ArrowUp, Minus } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const rates = [
  {
    code: "EUR",
    name: "Euro",
    buyRate: 1.13,
    sellRate: 1.21,
    change: "up",
  },
  {
    code: "USD",
    name: "US Dollar",
    buyRate: 1.23,
    sellRate: 1.31,
    change: "down",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    buyRate: 184.8,
    sellRate: 194.1,
    change: "up",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    buyRate: 1.87,
    sellRate: 1.97,
    change: "none",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    buyRate: 1.67,
    sellRate: 1.75,
    change: "down",
  },
]

export function CurrencyRates() {
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
        {rates.map((rate) => (
          <TableRow key={rate.code}>
            <TableCell>
              <div className="font-medium">{rate.code}</div>
              <div className="text-xs text-muted-foreground">{rate.name}</div>
            </TableCell>
            <TableCell className="text-right">{rate.buyRate.toFixed(4)}</TableCell>
            <TableCell className="text-right">{rate.sellRate.toFixed(4)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                {rate.change === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                {rate.change === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                {rate.change === "none" && <Minus className="h-4 w-4 text-muted-foreground" />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

