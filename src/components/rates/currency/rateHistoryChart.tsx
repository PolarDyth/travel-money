"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useParamPrevRates } from "@/routes/currency"
import { Currencies, ExchangeRate } from "@/lib/types/currency/type"

interface RateHistoryChartProps {
  currency: Currencies
  period?: string
  height?: number
}

export function RateHistoryChart({ currency, period = "1M", height = 300 }: RateHistoryChartProps) {
  // Fetch rates if no data prop is provided
  const { currencies: fetchedRates, isLoading, error } = useParamPrevRates(currency.code)

  console.log("fetchedRates:", fetchedRates)

  // Normalize the data: prefer prop, else fetched, else empty array
  let chartData: ExchangeRate[] = []
  if (fetchedRates && Array.isArray(fetchedRates)) {
    chartData = fetchedRates
  } else if (fetchedRates && Array.isArray(fetchedRates)) {
    chartData = fetchedRates
  }

  const now = new Date();
  const startDate = new Date(now);
  if (period === "1W") startDate.setDate(now.getDate() - 7);
  else if (period === "1M") startDate.setMonth(now.getMonth() - 1);
  else if (period === "3M") startDate.setMonth(now.getMonth() - 3);
  else if (period === "1Y") startDate.setFullYear(now.getFullYear() - 1);

  // Format the date for the X axis
  const formattedData = chartData.map((item) => ({
    ...item,
    date: typeof item.date === "string"
      ? new Date(item.date).toLocaleDateString()
      : item.date,
      rate: Number(item.rate)
  }))

  const filteredData = formattedData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= now;
  });

  console.log("formattedData:", formattedData)

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-[300px] text-red-500">Failed to load chart data.</div>
  }

  if (!formattedData.length) {
    return <div className="flex items-center justify-center h-[300px]">No data available.</div>
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
      </div>
      <ChartContainer
        config={{
          rate: {
            label: "Rate",
            color: "hsl(var(--chart-1))",
          },
        }}
        className={`h-[${height}px}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value) => value}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => Number(value).toFixed(2)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
    </div>
  );
}