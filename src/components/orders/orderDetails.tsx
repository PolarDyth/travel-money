"use client"

import {
  Clock,
  Download,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import CustomerTab from "./tabs/customer"
import OrderSummary from "./tabs/summary"
import { OrderStatus } from "../../../generated/prisma"
import { Order } from "@/lib/types/orders/types"

interface OrderDetailsDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: OrderStatus) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange, onStatusChange }: OrderDetailsDialogProps) {

  // Function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "IN_PREPARATION":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <Package className="mr-1 h-3 w-3" />
            In Preparation
          </Badge>
        )
      case "READY":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <ShoppingBag className="mr-1 h-3 w-3" />
            Ready
          </Badge>
        )
      case "COLLECTED":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            <User className="mr-1 h-3 w-3" />
            Collected
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              Order {order.orderNumber}
              {getStatusBadge(order.status)}
            </DialogTitle>
            <DialogDescription>
              Placed on {new Date(order.createdAt).toDateString()}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="currencies">Currencies</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 overflow-auto">
            <OrderSummary order={order} onStatusChange={onStatusChange} />
            <CustomerTab order={order} />

          </ScrollArea>
        </Tabs>

        {/* <DialogFooter className="border-t pt-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">
                {order.paymentMethod.type.replace("_", " ")}
                {order.paymentMethod.processor && ` (${order.paymentMethod.processor})`}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-lg font-bold">£{order.totalSterling.toFixed(2)}</p>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
