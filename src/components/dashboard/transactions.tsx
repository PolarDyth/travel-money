import { ArrowDownUp, ArrowRightLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample transaction data
const transactions = [
  {
    id: "TX123456",
    type: "sell",
    currency: "EUR",
    sterlingAmount: 215.45,
    foreignAmount: 250.12,
    paymentMethod: "Card",
    timestamp: "Today, 14:32",
  },
  {
    id: "TX123455",
    type: "buy",
    currency: "USD",
    sterlingAmount: 78.74,
    foreignAmount: 100.0,
    paymentMethod: "Cash",
    timestamp: "Today, 13:15",
  },
  {
    id: "TX123454",
    type: "sell",
    currency: "JPY",
    sterlingAmount: 524.0,
    foreignAmount: 100000.0,
    paymentMethod: "Cash",
    timestamp: "Today, 11:42",
  },
  {
    id: "TX123453",
    type: "buy",
    currency: "EUR",
    sterlingAmount: 172.36,
    foreignAmount: 200.0,
    paymentMethod: "Cash",
    timestamp: "Today, 10:17",
  },
  {
    id: "TX123452",
    type: "sell",
    currency: "AUD",
    sterlingAmount: 104.17,
    foreignAmount: 200.0,
    paymentMethod: "Card",
    timestamp: "Today, 09:03",
  },
]

export function RecentTransactions() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Payment</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === "sell" ? "outline" : "secondary"}>
                  {transaction.type === "sell" ? (
                    <ArrowRightLeft className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownUp className="mr-1 h-3 w-3" />
                  )}
                  {transaction.type === "sell" ? "Sell" : "Buy"}
                </Badge>
              </TableCell>
              <TableCell>{transaction.currency}</TableCell>
              <TableCell className="text-right">
                £{transaction.sterlingAmount.toFixed(2)}
                <div className="text-xs text-muted-foreground">
                  {transaction.currency === "JPY"
                    ? `¥${transaction.foreignAmount.toLocaleString()}`
                    : `${transaction.currency === "EUR" ? "€" : "$"}${transaction.foreignAmount.toFixed(2)}`}
                </div>
              </TableCell>
              <TableCell className="text-right">{transaction.paymentMethod}</TableCell>
              <TableCell className="text-right">{transaction.timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

