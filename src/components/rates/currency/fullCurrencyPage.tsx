import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { CurrencyDetailHeader } from "@/components/rates/currency/currencyDetailHeader"
import { Prisma } from "../../../../generated/prisma"
import { CurrencyDetailOverview } from "./currencyDetailOverview"
import { CurrencyDetailTabs } from "./currencyDetailsTabs"

export type CurrencyPageType = Prisma.CurrencyGetPayload<{
  include: {
    rates: {
      select: {
        rate: true
        buyRate: true
        sellRate: true
        fetchedAt: true
      }
    }
  }
}>

export default async function CurrencyDetailPage({ code }: {code: string} ) {
  const currencyCode = code


  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const data = await prisma.currency.findUnique({
    where: { code: currencyCode },
    include: {
      rates: {
        where: {
          baseCode: 'GBP',
          date: today,
        },
        select: {
          rate: true,
          buyRate: true,
          sellRate: true,
          fetchedAt: true,
        },
      },
    }
  })

  if (!data) {
    notFound()
  }

  const currency = JSON.parse(JSON.stringify(data));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/rates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
            <CurrencyDetailHeader currency={currency} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/rates">View All Rates</Link>
          </Button>
          <Button asChild>
            <Link href={`/transaction?currency=${currency.code}`}>Exchange {currency.code}</Link>
          </Button>
        </div>
      </div>
        <CurrencyDetailOverview currency={currency} />

        <CurrencyDetailTabs currency={currency} />
    </div>
  )
}