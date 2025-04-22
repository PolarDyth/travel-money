import { Currencies } from "@/lib/types/currency/type"

interface CurrencyDetailHeaderProps {
  currency: Currencies
}

export async function CurrencyDetailHeader({ currency }: CurrencyDetailHeaderProps) {

  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl" aria-hidden="true">
        {currency.code}
      </span>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{currency.code}</h1>
        <p className="text-muted-foreground">
          {currency.name} • {currency.country}
        </p>
      </div>
    </div>
  )
}
