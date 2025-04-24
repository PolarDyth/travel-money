"use client"

import { CheckCircle2, Clock, Package, ShoppingBag, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderStatus } from "@/app/(dashboard)/orders/page"

interface OrderDetailsDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: OrderStatus) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange, onStatusChange }: OrderDetailsDialogProps) {
  // Function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "in_preparation":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
            <Package className="h-3 w-3" />
            In Preparation
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Ready
          </Badge>
        )
      case "collected":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-purple-500 text-purple-500">
            <ShoppingBag className="h-3 w-3" />
            Collected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-red-500 text-red-500">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to get verification status badge
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Verification Pending
          </Badge>
        )
      case "not_started":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Payment Pending
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Function to get action buttons based on status
  const getActionButtons = () => {
    switch (order.status) {
      case "pending":
        return (
          <Button
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
            variant="outline"
            onClick={() => onStatusChange("in_preparation")}
          >
            <Package className="mr-2 h-4 w-4" />
            Start Preparation
          </Button>
        )
      case "in_preparation":
        return (
          <Button
            className="text-green-500 border-green-500 hover:bg-green-50"
            variant="outline"
            onClick={() => onStatusChange("ready")}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Ready
          </Button>
        )
      case "ready":
        return (
          <Button
            className="text-purple-500 border-purple-500 hover:bg-purple-50"
            variant="outline"
            onClick={() => onStatusChange("collected")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mark as Collected
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order {order.id}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>Ordered on {order.orderTime}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Collection Time</h4>
                <p className="text-base">{order.collectionTime}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Value</h4>
                <p className="text-base font-bold">£{order.totalValue.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                <p className="text-base capitalize">{order.paymentMethod.replace("_", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Payment Status</h4>
                <p>{getPaymentBadge(order.paymentStatus)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="rounded-md border p-3 text-sm">{order.notes || "No notes provided"}</p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Operator Notes</h4>
              <textarea
                className="w-full rounded-md border p-3 text-sm"
                rows={3}
                placeholder="Add notes about this order..."
              />
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Customer ID</h4>
                <p className="text-base">{order.customerId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Verification Status</h4>
                <p>{getVerificationBadge(order.verificationStatus)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p className="text-base">{order.customerName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                <p className="text-base">{order.customerEmail}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Customer History</h4>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Previous orders: 3</p>
                <p className="text-sm text-muted-foreground">Last order: 2 weeks ago</p>
                <p className="text-sm text-muted-foreground">Total spent: £3,250.50</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="currencies" className="space-y-4 pt-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Currency</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-right">Value (GBP)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.currencies.map((currency: any, index: number) => (
                    <tr key={index} className={index !== order.currencies.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-2">{currency.code}</td>
                      <td className="px-4 py-2 text-right">{currency.amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">£{currency.value.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted/50">
                    <td className="px-4 py-2 font-bold">Total</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2 text-right font-bold">£{order.totalValue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Denomination Requests</h4>
              <p className="rounded-md border p-3 text-sm">
                {order.notes.includes("denomination") ? order.notes : "No specific denomination requests"}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          {(order.status === "pending" || order.status === "in_preparation") && (
            <Button
              variant="outline"
              className="text-red-500 hover:bg-red-50 hover:text-red-500"
              onClick={() => onStatusChange("cancelled")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {getActionButtons()}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
