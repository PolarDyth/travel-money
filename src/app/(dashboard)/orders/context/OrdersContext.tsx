"use client";

import { Order } from "@/lib/types/orders/types";
import { createContext, useContext, useState } from "react";
import useSWR from "swr";
import { OrderStatus } from "../../../../../generated/prisma";

type OrdersContextType = {
  orders: Order[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
  filteredOrders: Order[] | undefined;
  setFilteredOrders: (orders: Order[] | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: OrderStatus | "all";
  setStatusFilter: (status: OrderStatus | "all") => void;
  timeFilter: "today" | "tomorrow" | "all";
  setTimeFilter: (time: "today" | "tomorrow" | "all") => void;
  sortBy: "collection_time" | "created_time" | "value";
  setSortBy: (sortBy: "collection_time" | "created_time" | "value") => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (isOpen: boolean) => void;
  activeTab: "all" | "pending" | "ready";
  setActiveTab: (tab: "all" | "pending" | "ready") => void;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default fetch (just currencies)
  const { data, isLoading, error } = useSWR<Order[], Error>(
    "/api/orders",
    fetcher
  );

  const [filteredOrders, setFilteredOrders] = useState<Order[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<"today" | "tomorrow" | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "collection_time" | "created_time" | "value"
  >("collection_time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "ready">(
    "all"
  );

  return (
    <OrdersContext.Provider
      value={{
        orders: data,
        isLoading,
        error,
        filteredOrders,
        setFilteredOrders,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        timeFilter,
        setTimeFilter,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        selectedOrder,
        setSelectedOrder,
        isDetailsOpen,
        setIsDetailsOpen,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

// Hook for currencies (today)
function useOrderContext() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error(
      "useCurrencyContext must be used within a OrdersProvider"
    );
  }
  return context;
}

export function useOrdersState() {
  const context = useOrderContext();

  return {
    orders: context.orders,
    isLoading: context.isLoading,
    error: context.error,
    filteredOrders: context.filteredOrders,
    searchQuery: context.searchQuery,
    statusFilter: context.statusFilter,
    timeFilter: context.timeFilter,
    sortBy: context.sortBy,
    sortDirection: context.sortDirection,
    selectedOrder: context.selectedOrder,
    isDetailsOpen: context.isDetailsOpen,
    activeTab: context.activeTab,
  };
}

export function useOrdersControl() {
  const context = useOrderContext();

  return {
    setFilteredOrders: context.setFilteredOrders,
    setSearchQuery: context.setSearchQuery,
    setStatusFilter: context.setStatusFilter,
    setTimeFilter: context.setTimeFilter,
    setSortBy: context.setSortBy,
    setSortDirection: context.setSortDirection,
    setSelectedOrder: context.setSelectedOrder,
    setIsDetailsOpen: context.setIsDetailsOpen,
    setActiveTab: context.setActiveTab,
  };
}
