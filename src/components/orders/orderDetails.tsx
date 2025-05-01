"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  User,
  X,
  XCircle,
} from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Order, OrderStatus } from "../page"

interface OrderDetailsDialogProps {
  order: Order
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (status: OrderStatus) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange, onStatusChange }: OrderDetailsDialogProps) {
  const [operatorNotes, setOperatorNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "in_preparation":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <Package className="mr-1 h-3 w-3" />
            In Preparation
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <ShoppingBag className="mr-1 h-3 w-3" />
            Ready
          </Badge>
        )
      case "collected":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            <User className="mr-1 h-3 w-3" />
            Collected
          </Badge>
        )
      case "cancelled":
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

  // Function to get payment badge
  const getPaymentBadge = (status: string) => {
    if (order.paidAt) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    )
  }

  // Function to get action buttons based on status
  const getActionButtons = () => {
    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onStatusChange("in_preparation")}>
              <Package className="mr-2 h-4 w-4" />
              Start Preparation
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onStatusChange("cancelled")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          </div>
        )
      case "in_preparation":
        return (
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => onStatusChange("ready")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Ready
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onStatusChange("cancelled")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          </div>
        )
      case "ready":
        return (
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => onStatusChange("collected")}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mark as Collected
          </Button>
        )
      default:
        return null
    }
  }

  const handleSaveNotes = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Saving notes:", operatorNotes)
      setIsSaving(false)
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              Order {order.orderNumber}
              {getStatusBadge(order.status)}
            </DialogTitle>
            <DialogDescription>
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
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
            <TabsContent value="details" className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Status</span>
                      <span>{getStatusBadge(order.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Payment</span>
                      <span>{getPaymentBadge(order.paymentMethod.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Payment Method</span>
                      <span className="text-sm capitalize">
                        {order.paymentMethod.type.replace("_", " ")}
                        {order.paymentMethod.processor && ` (${order.paymentMethod.processor})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Value</span>
                      <span className="font-bold">£{order.totalSterling.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Service Fee</span>
                      <span>£{order.totalFee.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Collection Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{format(new Date(order.collectionTime), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{format(new Date(order.collectionTime), "h:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">In-store collection</span>
                    </div>
                    {order.operatorName && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Assigned to:</span>
                        <span className="text-sm">{order.operatorName}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Currency</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">GBP</TableHead>
                        <TableHead className="text-right">Foreign</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.currencyCode}</TableCell>
                          <TableCell>{item.transactionType}</TableCell>
                          <TableCell className="text-right">{item.exchangeRate.toFixed(4)}</TableCell>
                          <TableCell className="text-right">£{item.sterlingAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {item.foreignAmount.toLocaleString()} {item.currencyCode}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3} className="font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">£{order.totalSterling.toFixed(2)}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex justify-end">{getActionButtons()}</div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4 p-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Customer Information</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <User className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {order.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{order.customerName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{order.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Customer History</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-xs text-muted-foreground">Previous Orders</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">£1,250</p>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">2 weeks</p>
                          <p className="text-xs text-muted-foreground">Last Order</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Verification Status</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">ID verified via passport on April 15, 2025</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="currencies" className="space-y-4 p-4">
              {order.items.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {item.currencyCode} - {item.transactionType}
                      </span>
                      <span className="text-sm font-normal">
                        {item.foreignAmount.toLocaleString()} {item.currencyCode} (£{item.sterlingAmount.toFixed(2)})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Exchange Rate</span>
                        <span className="text-sm">
                          1 GBP = {item.exchangeRate.toFixed(4)} {item.currencyCode}
                        </span>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Requested Denominations</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {item.requestedDenoms.map((denom, index) => (
                            <Card key={index} className="bg-muted/50">
                              <CardContent className="p-3 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {item.currencyCode} {denom.denomination}
                                </span>
                                <Badge variant="secondary">x{denom.quantity}</Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 p-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customer Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-4 bg-muted/20">
                    {order.notes || "No notes provided by the customer."}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Operator Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={operatorNotes}
                    onChange={(e) => setOperatorNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotes} disabled={isSaving || !operatorNotes}>
                      {isSaving ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="border-t pt-4">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
