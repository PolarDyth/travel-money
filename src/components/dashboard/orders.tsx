import { CheckCircle2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "../ui/badge"

// Sample online orders data
const orders = [
  {
    id: "ORD7821",
    customer: "Sarah Johnson",
    currency: "EUR",
    sterlingAmount: 430.9,
    foreignAmount: 500.0,
    status: "Ready",
    orderDate: "Today, 08:15",
    collection: "Today, 16:30",
  },
  {
    id: "ORD7820",
    customer: "Michael Chen",
    currency: "USD",
    sterlingAmount: 393.7,
    foreignAmount: 500.0,
    status: "Ready",
    orderDate: "Yesterday, 15:40",
    collection: "Today, 17:00",
  },
  {
    id: "ORD7819",
    customer: "Emily Williams",
    currency: "AUD",
    sterlingAmount: 260.42,
    foreignAmount: 500.0,
    status: "Processing",
    orderDate: "Yesterday, 12:30",
    collection: "Tomorrow, 11:15",
  },
  {
    id: "ORD7818",
    customer: "James Taylor",
    currency: "CAD",
    sterlingAmount: 584.8,
    foreignAmount: 1000.0,
    status: "Processing",
    orderDate: "Yesterday, 09:45",
    collection: "Tomorrow, 14:30",
  },
]

export function OnlineOrdersList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Collection</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.currency}</TableCell>
              <TableCell className="text-right">
                £{order.sterlingAmount.toFixed(2)}
                <div className="text-xs text-muted-foreground">
                  {order.currency === "EUR"
                    ? `€${order.foreignAmount.toFixed(2)}`
                    : `${
                        order.currency === "USD" || order.currency === "AUD" || order.currency === "CAD" ? "$" : ""
                      }${order.foreignAmount.toFixed(2)}`}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "Ready" ? "success" : "secondary"}
                  className="flex w-fit items-center gap-1"
                >
                  {order.status === "Ready" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{order.collection}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

