import {
  ArrowUpDown,
  DollarSign,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const stats = [
  {
    title: "Today's Sales",
    icon: <DollarSign className="h-4 w-4" />,
    value: "£2,834.00",
    trend: "up",
    percentage: 12,
  },
  {
    title: "Today's Purchases",
    icon: <ArrowUpDown className="h-4 w-4" />,
    value: "£1213.00",
    trend: "down",
    percentage: 8,
  },
  {
    title: "Pending Orders",
    icon: <ShoppingBag className="h-4 w-4" />,
    value: "7",
    trend: "up",
    percentage: 24,
  },
  {
    title: "Total Customers",
    icon: <Users className="h-4 w-4" />,
    value: "29",
    trend: "up",
    percentage: 9,
  },
];

export default function Stats() {
  return (
    <div className="flex justify-center items-center py-4 gap-2">
      {stats.map((stat, index) => (
        <Card key={index} className="w-1/4 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="mt-1 flex items-center text-xs">
              {stat.trend === "up" ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={stat.trend === "up" ? "text-green-500" : "text-red-500"}
              >
                {stat.percentage}%
              </span>
              <span className="text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
