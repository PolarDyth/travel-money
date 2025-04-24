"use client"

import { useState } from "react"
import { CheckCircle2, Clock, ExternalLink, MoreHorizontal, Package, ShoppingBag, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { OrderStatus } from "@/app/(dashboard)/orders/page"
import { OrderDetailsDialog } from "./orderDetailsDialog"

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    orderTime: new Date("2023-04-22T09:30:00"),
    collectionTime: new Date("2023-04-22T14:00:00"),
    status: "pending" as OrderStatus,
    totalValue: 1250.75,
    currencies: [
      { code: "USD", amount: 500, value: 400.25 },
      { code: "EUR", amount: 300, value: 350.5 },
      { code: "GBP", amount: 400, value: 500.0 },
    ],
    notes: "Customer requested small denominations",
    verificationStatus: "verified",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Jane Doe",
    customerEmail: "jane@example.com",
    orderTime: new Date("2023-04-22T10:15:00"),
    collectionTime: new Date("2023-04-22T15:30:00"),
    status: "in_preparation" as OrderStatus,
    totalValue: 750.5,
    currencies: [
      { code: "JPY", amount: 50000, value: 350.25 },
      { code: "CHF", amount: 400, value: 400.25 },
    ],
    notes: "",
    verificationStatus: "pending",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    customerId: "CUST-003",
    customerName: "Robert Johnson",
    customerEmail: "robert@example.com",
    orderTime: new Date("2023-04-22T11:00:00"),
    collectionTime: new Date("2023-04-22T16:00:00"),
    status: "ready" as OrderStatus,
    totalValue: 2000.0,
    currencies: [
      { code: "USD", amount: 1000, value: 800.5 },
      { code: "EUR", amount: 1000, value: 1199.5 },
    ],
    notes: "Customer will send ID via email",
    verificationStatus: "verified",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
  },
  {
    id: "ORD-004",
    customerId: "CUST-004",
    customerName: "Sarah Williams",
    customerEmail: "sarah@example.com",
    orderTime: new Date("2023-04-22T12:30:00"),
    collectionTime: new Date("2023-04-23T10:00:00"),
    status: "pending" as OrderStatus,
    totalValue: 500.25,
    currencies: [{ code: "AUD", amount: 800, value: 500.25 }],
    notes: "First time customer",
    verificationStatus: "not_started",
    paymentMethod: "credit_card",
    paymentStatus: "pending",
  },
  {
    id: "ORD-005",
    customerId: "CUST-005",
    customerName: "Michael Brown",
    customerEmail: "michael@example.com",
    orderTime: new Date("2023-04-22T13:45:00"),
    collectionTime: new Date("2023-04-23T11:30:00"),
    status: "cancelled" as OrderStatus,
    totalValue: 1500.0,
    currencies: [
      { code: "USD", amount: 1000, value: 800.5 },
      { code: "CAD", amount: 1000, value: 699.5 },
    ],
    notes: "Customer requested cancellation",
    verificationStatus: "verified",
    paymentMethod: "bank_transfer",
    paymentStatus: "refunded",
  },
  {
    id: "ORD-006",
    customerId: "CUST-006",
    customerName: "Emily Davis",
    customerEmail: "emily@example.com",
    orderTime: new Date("2023-04-22T14:30:00"),
    collectionTime: new Date("2023-04-23T13:00:00"),
    status: "collected" as OrderStatus,
    totalValue: 900.75,
    currencies: [{ code: "EUR", amount: 800, value: 900.75 }],
    notes: "",
    verificationStatus: "verified",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
  },
]

interface OrdersListProps {
  searchQuery: string
  statusFilter?: OrderStatus
  sortBy: string
}

export function OrdersList({ searchQuery, statusFilter, sortBy }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter orders based on search query and status filter
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort orders based on sort criteria
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "collection_time":
        return a.collectionTime.getTime() - b.collectionTime.getTime()
      case "order_time":
        return a.orderTime.getTime() - b.orderTime.getTime()
      case "customer_name":
        return a.customerName.localeCompare(b.customerName)
      case "order_value":
        return b.totalValue - a.totalValue
      default:
        return 0
    }
  })

  // Function to update order status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`)

    // For demo purposes, we'll update the mock data
    const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId)
    if (orderIndex !== -1) {
      MOCK_ORDERS[orderIndex].status = newStatus
      // Force a re-render
      setSelectedOrder(null)
    }
  }

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

  // Function to get action buttons based on status
  const getActionButtons = (order: any) => {
    switch (order.status) {
      case "pending":
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={() => updateOrderStatus(order.id, "in_preparation")}
          >
            <Package className="mr-2 h-4 w-4" />
            Start Preparation
          </Button>
        )
      case "in_preparation":
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-green-500 border-green-500 hover:bg-green-50"
            onClick={() => updateOrderStatus(order.id, "ready")}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark as Ready
          </Button>
        )
      case "ready":
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-purple-500 border-purple-500 hover:bg-purple-50"
            onClick={() => updateOrderStatus(order.id, "collected")}
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
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Collection Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.collectionTime.toDateString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">£{order.totalValue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {getActionButtons(order)}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status === "pending" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "in_preparation")}>
                              Start Preparation
                            </DropdownMenuItem>
                          )}
                          {order.status === "in_preparation" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "ready")}>
                              Mark as Ready
                            </DropdownMenuItem>
                          )}
                          {order.status === "ready" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "collected")}>
                              Mark as Collected
                            </DropdownMenuItem>
                          )}
                          {(order.status === "pending" || order.status === "in_preparation") && (
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onStatusChange={(newStatus) => updateOrderStatus(selectedOrder.id, newStatus)}
        />
      )}
    </div>
  )
}
