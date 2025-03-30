import { ArrowLeftRight, DollarSign, Euro, JapaneseYen } from "lucide-react";
import { Progress } from "../ui/progress";

const stock = [
  {
    name: "EUR",
    symbol: "€",
    quantity: 18235,
    icon: <Euro className="h-5 w-5 bg-muted rounded-md" />,
    capacity: 25000,
  },
  {
    name: "USD",
    symbol: "$",
    quantity: 12378,
    icon: <DollarSign className="h-5 w-5 bg-muted rounded-md" />,
    capacity: 25000,
  },
  {
    name: "TRY",
    symbol: "₺",
    quantity: 104300,
    icon: <ArrowLeftRight className="h-5 w-5 bg-muted rounded-md" />,
    capacity: 250000,
  },
  {
    name: "JPY",
    symbol: "¥",
    quantity: 534000,
    icon: <JapaneseYen className="h-5 w-5 bg-muted rounded-md" />,
    capacity: 1000000,
  },
];

export default function StockLevels() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {stock.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              <div className="mr-2 rounded-md bg-muted p-1">{item.icon}</div>
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.symbol}
                  {item.quantity.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="self-center text-sm font-medium">
              {(item.quantity / item.capacity) * 100 < 25 && (
                <span className="mr-2 rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900 dark:text-red-200">
                  Low
                </span>
              )}
              {Math.round((item.quantity / item.capacity) * 100)}%
            </div>
          </div>
          <Progress
            value={(item.quantity / item.capacity) * 100}
            className="h-2 mt-2"
          />
        </div>
      ))}
    </div>
  );
}
