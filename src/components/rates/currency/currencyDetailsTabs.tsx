"use client"

import { useState } from "react"
import { Globe, Info, LineChart, Wallet } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencyPageType } from "./fullCurrencyPage"
import { CurrencyOverview } from "./currencyOverview"

interface CurrencyDetailTabsProps {
  currency: CurrencyPageType;
}

export function CurrencyDetailTabs({ currency }: CurrencyDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 md:w-[400px]">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-1">
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </TabsTrigger>
        <TabsTrigger value="denominations" className="flex items-center gap-1">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Denominations</span>
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Insights</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
          <CurrencyOverview currency={currency} />
      </TabsContent>

      {/* <TabsContent value="history" className="space-y-4">
          <CurrencyHistory currency={currency} />
      </TabsContent>

      <TabsContent value="denominations" className="space-y-4">
          <CurrencyDenominations currency={currency} />
      </TabsContent> */}
    </Tabs>
  )
}
