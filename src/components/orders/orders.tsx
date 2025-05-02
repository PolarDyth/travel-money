"use client"

import {
  Calendar,
  Clock,
  CreditCard,
  Package,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  useOrdersControl,
  useOrdersState,
} from "@/app/(dashboard)/orders/context/OrdersContext";
import { OrderStatus } from "../../../generated/prisma";
import OrdersSkeleton from "../ui/skeletons/orders/ordersSkeleton";
import { OrderDetailsDialog } from "./orderDetails";

export default function Orders() {
  const { setActiveTab, setSelectedOrder, setIsDetailsOpen, setFilteredOrders } =
    useOrdersControl();
  const { filteredOrders, activeTab, isLoading, orders, selectedOrder, isDetailsOpen } = useOrdersState();

  if (isLoading) {
    return (
      <OrdersSkeleton />
    )
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "IN_PREPARATION":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <Package className="mr-1 h-3 w-3" />
            In Preparation
          </Badge>
        );
      case "READY":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            <ShoppingBag className="mr-1 h-3 w-3" />
            Ready
          </Badge>
        );
      case "COLLECTED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-600 border-purple-200"
          >
            <User className="mr-1 h-3 w-3" />
            Collected
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`)

    // For demo purposes, we'll update the local state
    const updatedOrders = (orders ?? []).map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })

    setFilteredOrders(updatedOrders)

    // If the selected order is being updated, update it too
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  return (
    <>
      <Card className="lg:col-span-3">
        <CardHeader className="p-4 sm:p-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "all" | "pending" | "ready")}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending & In Prep</TabsTrigger>
              <TabsTrigger value="ready">Ready for Collection</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-24rem)]">
            {!filteredOrders || filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No orders found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group cursor-pointer p-4 transition-colors hover:bg-muted/50 sm:p-6"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <User className="mr-1 inline-block h-3 w-3" />
                          {order.customer.firstNameEnc} {" "} {order.customer.lastNameEnc}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-lg font-bold">
                          £{Number(order.totalSterling)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Collection:{" "}
                            {new Date(order.collectionDate).toDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <Badge
                          key={item.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {item.currencyCode}{" "}
                          {item.foreignAmount.toLocaleString()}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        <span className="capitalize">
                          {typeof order.paymentMethod === "object" &&
                          order.paymentMethod !== null &&
                          "type" in order.paymentMethod
                            ? (order.paymentMethod.type as string).replace(
                                "_",
                                " "
                              )
                            : String(order.paymentMethod)}
                        </span>
                        {typeof order.paymentMethod === "object" &&
                          order.paymentMethod !== null &&
                          "processor" in order.paymentMethod &&
                          order.paymentMethod.processor && (
                            <span className="capitalize">
                              (
                              {
                                (order.paymentMethod as { processor: string })
                                  .processor
                              }
                              )
                            </span>
                          )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onStatusChange={(newStatus) =>
            updateOrderStatus(selectedOrder.id, newStatus)
          }
        />
      )}
    </>
  );
}
