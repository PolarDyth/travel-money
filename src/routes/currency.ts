import { ExchangeRate, ExchangeRates } from "@/lib/types/currency/type";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook for currencies with previous day's rates
export function usePrevRates() {
  const { data, isLoading, error } = useSWR<ExchangeRates[], Error>(
    "/api/currencies?prevRates=true",
    fetcher
  );

  return { currencies: data, isLoading, error };
}

export function useParamPrevRates(param: string) {
  const { data, isLoading, error } = useSWR<ExchangeRate[], Error>(
    `/api/currencies/historical-rate/${param}?prevRates=true`,
    fetcher
  );

  return { currencies: data, isLoading, error };
}