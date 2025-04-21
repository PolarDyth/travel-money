"use client"

import { ArrowDown, ArrowUp, ChevronRight, Minus } from "lucide-react"
import Link from "next/link"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useRatesContext } from "@/app/(dashboard)/rates/context/RatesContext"
import { Currencies } from "@/lib/types/currency/type"
import { useCurrencyContext } from "@/app/(dashboard)/transaction/context/CurrencyContext"

export function RatesTable() {
  const { searchQuery, regionFilter, sortBy, setSortBy, sortOrder, setSortOrder, activeTab } = useRatesContext()

  const { currencies: data, error } = useCurrencyContext();

  const currencies = JSON.parse(JSON.stringify(data));

  if (error) throw new Error("Failed to fetch currencies data")

  // Filter currencies based on search query and region
  const filteredCurrencies = currencies.filter((currency: Currencies) => {
    const matchesSearch =
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === "all" || currency.region === regionFilter

    return matchesSearch && matchesRegion
  })

  // Sort currencies based on sort criteria
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    let comparison = 0

    if (sortBy === "code") {
      comparison = a.code.localeCompare(b.code)
    } else if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === "buyRate") {
      comparison = a.buyRate - b.buyRate
    } else if (sortBy === "sellRate") {
      comparison = a.sellRate - b.sellRate
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleSort = (column: "code" | "name" | "buyRate" | "sellRate") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (column: "code" | "name" | "buyRate" | "sellRate") => {
    if (sortBy !== column) return null

    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
  }

  return (
    <Tabs value={activeTab}>
      <TabsContent value="all" className="m-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("code")}>
                  <div className="flex items-center">Currency {getSortIcon("code")}</div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("buyRate")}>
                  <div className="flex items-center justify-end">We Buy {getSortIcon("buyRate")}</div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort("sellRate")}>
                  <div className="flex items-center justify-end">We Sell {getSortIcon("sellRate")}</div>
                </TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCurrencies.map((currency) => (
                <TableRow key={currency.code} className="group cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/rates/${currency.code}`} className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">
                        {currency.flag}
                      </span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-muted-foreground">{currency.name}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">{currency.buyRate.toFixed(4)}</TableCell>
                  <TableCell className="text-right">{currency.sellRate.toFixed(4)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      {currency.change === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                      {currency.change === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                      {currency.change === "none" && <Minus className="h-4 w-4 text-muted-foreground" />}
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
      </TabsContent>

      <TabsContent value="popular" className="m-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Currency</TableHead>
                <TableHead className="text-right">We Buy</TableHead>
                <TableHead className="text-right">We Sell</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCurrencies
                .filter((currency) => currency.popular)
                .map((currency) => (
                  <TableRow key={currency.code} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/rates/${currency.code}`} className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                          {currency.flag}
                        </span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-muted-foreground">{currency.name}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{currency.buyRate.toFixed(4)}</TableCell>
                    <TableCell className="text-right">{currency.sellRate.toFixed(4)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        {currency.change === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
                        {currency.change === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                        {currency.change === "none" && <Minus className="h-4 w-4 text-muted-foreground" />}
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
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}
