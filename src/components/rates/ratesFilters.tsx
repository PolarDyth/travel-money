"use client";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRatesContext } from "@/app/(dashboard)/rates/context/RatesContext";
import { useCurrencyContext } from "@/app/(dashboard)/transaction/context/CurrencyContext";
import { Currencies } from "@/lib/types/currency/type";

export function RatesFilters() {
  const { searchQuery, setSearchQuery, regionFilter, setRegionFilter } =
    useRatesContext();

  const { currencies: data, isLoading, error } = useCurrencyContext();


  if (isLoading) return <div>Loading...</div>;

  if (error) throw new Error("Failed to fetch currencies data");

  const currencies = JSON.parse(JSON.stringify(data));

  const allRegions = Array.from(
    new Set(
      currencies
        .flatMap((c: Currencies) =>
          c.region
            ? c.region.split("/").map((r: string) => r.trim())
            : []
        )
        .filter(Boolean)
    )
  ) as string[];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search currencies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {allRegions.map((region: string, index: number) => (
                <SelectItem key={index} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
