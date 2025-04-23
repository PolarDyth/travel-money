import { Badge } from "@/components/ui/badge"
import { CurrencyPageType } from "./fullCurrencyPage"

interface DenominationsPreviewProps {
  currency: CurrencyPageType
}

export function DenominationsPreview({ currency }: DenominationsPreviewProps) {
  if (!currency.denominations || !Array.isArray(currency.denominations)) {
    return <div>No denomination information available</div>
  }

  // Optionally, split denominations into notes and coins based on value
  const notes = currency.denominations.filter((d) => d >= 1)

  const formatDenomination = (value: number) => {
    if (value < 1) {
      return `${currency.symbol}${value.toFixed(2).replace(/\.?0+$/, "")}`
    }
    return `${currency.symbol}${value}`
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Notes</h4>
        <div className="flex flex-wrap gap-2">
          {notes.length > 0 ? notes.map((note) => (
            <Badge key={note} variant="outline" className="text-sm py-1 px-2">
              {formatDenomination(note)}
            </Badge>
          )) : <span className="text-muted-foreground">None</span>}
        </div>
      </div>
    </div>
  )
}
