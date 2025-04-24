"use client"

import { ArrowDown, ArrowUp, Clock, Package, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrdersStats() {
  // In a real app, these would come from an API
  const stats = {
    pending: 5,
    inPreparation: 3,
    ready: 2,
    collected: 12,
    pendingChange: 20, // percentage
    inPreparationChange: -10, // percentage
    readyChange: 50, // percentage
    collectedChange: 25, // percentage
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingChange > 0 ? (
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                {stats.pendingChange}% from last week
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                {Math.abs(stats.pendingChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Preparation</CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inPreparation}</div>
          <p className="text-xs text-muted-foreground">
            {stats.inPreparationChange > 0 ? (
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                {stats.inPreparationChange}% from last week
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                {Math.abs(stats.inPreparationChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ready for Collection</CardTitle>
          <ShoppingBag className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ready}</div>
          <p className="text-xs text-muted-foreground">
            {stats.readyChange > 0 ? (
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                {stats.readyChange}% from last week
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                {Math.abs(stats.readyChange)}% from last week
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collected Today</CardTitle>
          <ShoppingBag className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.collected}</div>
          <p className="text-xs text-muted-foreground">
            {stats.collectedChange > 0 ? (
              <span className="flex items-center text-green-500">
                <ArrowUp className="mr-1 h-3 w-3" />
                {stats.collectedChange}% from yesterday
              </span>
            ) : (
              <span className="flex items-center text-red-500">
                <ArrowDown className="mr-1 h-3 w-3" />
                {Math.abs(stats.collectedChange)}% from yesterday
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
