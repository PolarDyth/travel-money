"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrdersStats } from "@/components/orders/orderStats"
import { OrdersList } from "@/components/orders/orderList"

// Define order status type
export type OrderStatus = "pending" | "in_preparation" | "ready" | "collected" | "cancelled"

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined)
  const [sortBy, setSortBy] = useState("collection_time")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Online Orders</h1>
          <p className="text-muted-foreground">Manage and track online currency exchange orders</p>
        </div>
      </div>

      <OrdersStats />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => setStatusFilter(value === "all" ? undefined : (value as OrderStatus))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_preparation">In Preparation</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="collected">Collected</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="collection_time">Collection Time</SelectItem>
            <SelectItem value="order_time">Order Time</SelectItem>
            <SelectItem value="customer_name">Customer Name</SelectItem>
            <SelectItem value="order_value">Order Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <OrdersList searchQuery={searchQuery} statusFilter={statusFilter} sortBy={sortBy} />
    </div>
  )
}
