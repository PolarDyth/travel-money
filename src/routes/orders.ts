import { CustomerOrder, Order } from "@/lib/types/orders/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOrders() {
  const { data, isLoading, error } = useSWR<Order[]>("/api/orders", fetcher);

  return { orders: data, isLoading, error };
}

export function useCustomerOrders(customerId: number) {
  const { data, isLoading, error } = useSWR<CustomerOrder>(
    `/api/orders/customer/${customerId}`,
    fetcher
  );

  return { customerInfo: data, isLoading, error };
}