import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function CurrencyNotFound() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/rates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Currency Not Found</h1>
      </div>
      <p>The requested currency code was not found in our system.</p>
      <Button asChild>
        <Link href="/rates">View All Currencies</Link>
      </Button>
    </div>
  )
}
