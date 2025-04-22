"use client";

import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRatesContext } from "@/app/(dashboard)/rates/context/RatesContext";
import { Currencies } from "@/lib/types/currency/type";
import {
  useCurrencyContext,
} from "@/app/(dashboard)/transaction/context/CurrencyContext";
import { Prisma } from "../../../generated/prisma";
import { usePrevRates } from "@/routes/currency";

type ExchangeRates = Prisma.ExchangeRateGetPayload<{
  where: { baseCode: "GBP" };
  select: {
    currencyCode: true;
    buyRate: true;
    sellRate: true;
  };
}>;

export function RatesTable() {
  const {
    searchQuery,
    regionFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useRatesContext();

  const { currencies: data, error, isLoading } = useCurrencyContext();

  const {
    currencies: prevCurrenciesData,
    isLoading: prevLoading,
    error: prevError,
  } = usePrevRates();

  if (isLoading || prevLoading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;

  const currencies = JSON.parse(JSON.stringify(data));
  const prevCurrencies = JSON.parse(JSON.stringify(prevCurrenciesData)) ?? [];

  console.log("Prev Currencies", prevCurrencies);

  if (error || prevError) throw new Error("Failed to fetch currencies data");

  // Filter currencies based on search query and region
  const filteredCurrencies = currencies.filter((currency: Currencies) => {
    const matchesSearch =
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      regionFilter === "all" || currency.region === regionFilter;

    return matchesSearch && matchesRegion;
  });

  // Sort currencies based on sort criteria
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "code") {
      comparison = a.code.localeCompare(b.code);
    } else if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "buyRate") {
      comparison = a.buyRate - b.buyRate;
    } else if (sortBy === "sellRate") {
      comparison = a.sellRate - b.sellRate;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (column: "code" | "name" | "buyRate" | "sellRate") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column: "code" | "name" | "buyRate" | "sellRate") => {
    if (sortBy !== column) return null;

    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[250px] cursor-pointer"
              onClick={() => handleSort("code")}
            >
              <div className="flex items-center">
                Currency {getSortIcon("code")}
              </div>
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => handleSort("buyRate")}
            >
              <div className="flex items-center justify-end">
                We Buy {getSortIcon("buyRate")}
              </div>
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => handleSort("sellRate")}
            >
              <div className="flex items-center justify-end">
                We Sell {getSortIcon("sellRate")}
              </div>
            </TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCurrencies.map((currency: Currencies) => (
            <TableRow
              key={currency.code}
              className="group cursor-pointer hover:bg-muted/50"
            >
              <TableCell>
                <Link
                  href={`/rates/${currency.code}`}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl" aria-hidden="true">
                    {currency.code}
                  </span>
                  <div>
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-muted-foreground">
                      {currency.name}
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {Number(currency.rates[0].buyRate)}
              </TableCell>
              <TableCell className="text-right">
                {Number(currency.rates[0].sellRate)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  {(() => {
                    const yesterdayRate = prevCurrencies.find(
                      (rate: ExchangeRates) =>
                        rate.currencyCode === currency.code
                    );
                    const todayBuy = currency.rates[0]?.buyRate ?? null;
                    const yesterdayBuy = yesterdayRate?.buyRate ?? null;

                    if (todayBuy == null || yesterdayBuy == null) {
                      return <span>-</span>;
                    }

                    if (todayBuy > yesterdayBuy) {
                      return (
                        <div className="flex items-center justify-end text-green-500">
                          <ArrowUp className="h-4 w-4" />
                        </div>
                      );
                    } else if (todayBuy < yesterdayBuy) {
                      return (
                        <div className="flex items-center justify-end text-red-500">
                          <ArrowUp className="h-4 w-4 rotate-180" />
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-end text-gray-400">
                          <ArrowUp className="h-4 w-4 rotate-90" />
                        </div>
                      );
                    }
                  })()}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/rates/${currency.code}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {sortedCurrencies.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No currencies found matching your criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
