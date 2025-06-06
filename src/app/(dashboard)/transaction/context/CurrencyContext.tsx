"use client";

import { Currencies } from "@/lib/types/currency/type";
import { createContext, useContext } from "react";
import useSWR from "swr";

type CurrencyContextType = {
  currencies: Currencies[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default fetch (just currencies)
  const { data, isLoading, error } = useSWR<Currencies[], Error>(
    "/api/currencies",
    fetcher
  );

  return (
    <CurrencyContext.Provider
      value={{
        currencies: data,
        isLoading,
        error,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook for currencies (today)
export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      "useCurrencyContext must be used within a CurrencyProvider"
    );
  }
  return context;
}

