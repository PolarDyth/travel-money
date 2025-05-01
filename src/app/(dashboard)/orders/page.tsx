import OrderFilters from "@/components/orders/orderFilters";
import OrderStats from "@/components/orders/orderStats";
import { Button } from "@/components/ui/button";
import OrderStatsSkeleton from "@/components/ui/skeletons/orders/orderStatsSkeleton";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { OrdersProvider } from "./context/OrdersContext";
import Orders from "@/components/orders/orders";

export default function OrdersPage() {
  return (
    <main className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Online Orders</h1>
          <p className="text-muted-foreground">
            Manage and track online currency exchange orders
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>
      <Suspense fallback={<OrderStatsSkeleton />}>
        <OrderStats />
      </Suspense>
      <OrdersProvider>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <OrderFilters />
          <Orders />
        </div>
      </OrdersProvider>
    </main>
  );
}
