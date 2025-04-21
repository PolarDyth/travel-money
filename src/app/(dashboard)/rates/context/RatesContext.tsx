"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface RatesContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  regionFilter: string
  setRegionFilter: (region: string) => void
  sortBy: string
  setSortBy: (column: string) => void
  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void
}

const RatesContext = createContext<RatesContextType | undefined>(undefined)

export function RatesProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [sortBy, setSortBy] = useState("code")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  return (
    <RatesContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        regionFilter,
        setRegionFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </RatesContext.Provider>
  )
}

export function useRatesContext() {
  const context = useContext(RatesContext)
  if (context === undefined) {
    throw new Error("useRatesContext must be used within a RatesProvider")
  }
  return context
}
