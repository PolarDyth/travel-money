import { Order } from "@/lib/types/orders/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOrders() {
  const { data, isLoading, error } = useSWR<Order[]>("/api/orders", fetcher);

  return { orders: data, isLoading, error };
}