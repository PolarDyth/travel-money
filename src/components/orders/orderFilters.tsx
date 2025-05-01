"use client";

import { ArrowUpDown, Filter, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  useOrdersControl,
  useOrdersState,
} from "@/app/(dashboard)/orders/context/OrdersContext";
import { useEffect } from "react";

export default function OrderFilters() {
  const {
    setSearchQuery,
    setStatusFilter,
    setTimeFilter,
    setSortBy,
    setSortDirection,
    setActiveTab,
    setFilteredOrders,
  } = useOrdersControl();
  const {
    searchQuery,
    statusFilter,
    timeFilter,
    sortBy,
    sortDirection,
    activeTab,
    isLoading,
    orders,
  } = useOrdersState();

  // Filter and sort orders
  useEffect(() => {
    
    if (isLoading) return;

    if (!orders || orders.length === 0) return;
    let result = [...(orders ?? [])];
    console.log(orders);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((order) => {
        // guard against undefined encrypted fields
        const firstNameEnc = order.customer.firstNameEnc ?? ""
        const firstName = firstNameEnc
          ? firstNameEnc
          : ""
        const emailEnc = order.customer.emailEnc ?? ""
        const email = emailEnc ? emailEnc : ""
        const operatorName = order.operator?.firstName?.toLowerCase() ?? ""

        return (
          order.orderNumber.toLowerCase().includes(query) ||
          firstName.toLowerCase().includes(query) ||
          email.toLowerCase().includes(query) ||
          operatorName.includes(query)
        )
      })
    }

    // Apply status filter from tabs
    if (activeTab !== "all") {
      if (activeTab === "pending") {
        result = result.filter(
          (order) =>
            order.status === "PENDING" || order.status === "IN_PREPARATION"
        );
      } else if (activeTab === "ready") {
        result = result.filter((order) => order.status === "READY");
      }
    }

    // Apply additional status filter if set
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply time filter
    if (timeFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      result = result.filter((order) => {
        const collectionDate = new Date(order.collectionDate);
        if (timeFilter === "today") {
          return collectionDate >= today && collectionDate < tomorrow;
        } else if (timeFilter === "tomorrow") {
          return (
            collectionDate >= tomorrow && collectionDate < dayAfterTomorrow
          );
        }
        return true;
      });
    }

    // Sort orders
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "collection_time") {
        comparison =
          new Date(a.collectionDate).getTime() -
          new Date(b.collectionDate).getTime();
      } else if (sortBy === "created_time") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "value") {
        comparison = Number(a.totalSterling) - Number(b.totalSterling);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    setFilteredOrders(result);
  }, [
    searchQuery,
    statusFilter,
    timeFilter,
    sortBy,
    sortDirection,
    setFilteredOrders,
    activeTab,
    orders,
    isLoading,
  ]);

  if (isLoading) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-3/5 bg-muted rounded animate-pulse" />
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-2/5 bg-muted rounded mt-1 animate-pulse" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine the orders list</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Order #, customer, email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(
                value as
                  | "all"
                  | "PENDING"
                  | "IN_PREPARATION"
                  | "READY"
                  | "COLLECTED"
                  | "CANCELLED"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Order Status</SelectLabel>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PREPARATION">In Preparation</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="COLLECTED">Collected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Collection Time</label>
          <Select
            value={timeFilter}
            onValueChange={(value) =>
              setTimeFilter(value as "all" | "today" | "tomorrow")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by collection time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Collection Time</SelectLabel>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "collection_time" | "created_time" | "value")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort Options</SelectLabel>
                <SelectItem value="created_time">Order Time</SelectItem>
                <SelectItem value="value">Order Value</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Sort Direction</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortDirection === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        <Separator />

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setTimeFilter("all");
            setSortBy("collection_time");
            setSortDirection("asc");
            setActiveTab("all");
          }}
        >
          <Filter className="h-4 w-4" />
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
