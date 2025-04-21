import {
  ArrowUpDown,
  DollarSign,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { prisma } from "@/lib/prisma";

async function getTotalSold(start: Date, end: Date) {
  const soldResult = await prisma.transaction.aggregate({
    _sum: {
      totalSold: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return Number(soldResult._sum.totalSold || 0);
}

async function getTotalBought(start: Date, end: Date) {
  const boughtResult = await prisma.transaction.aggregate({
    _sum: {
      totalBought: true,
    },
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
  return  Number(boughtResult._sum.totalBought || 0);
}

async function getUniqueCustomersToday(start: Date, end: Date) {
  const result = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
    select: {
      customerId: true,
    },
    distinct: ['customerId'],
  });
  return result.length;
}

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function getYesterdayRange() {
  const now = new Date();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(yesterdayStart);
  yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);
  return { yesterdayStart, yesterdayEnd };
}

export default async function Stats() {

  const { start, end } = getTodayRange();

  const { yesterdayStart, yesterdayEnd } = getYesterdayRange();

  const todaysSales = await getTotalSold(start, end);
  const todaysPurchases = await getTotalBought(start, end);

  const yesterdaySales = await getTotalSold(yesterdayStart, yesterdayEnd);
  const yesterdayPurchases = await getTotalBought(yesterdayStart, yesterdayEnd);

  const salesChange = yesterdaySales
  ? ((todaysSales - yesterdaySales) / yesterdaySales) * 100
  : 0;
const purchasesChange = yesterdayPurchases
  ? ((todaysPurchases - yesterdayPurchases) / yesterdayPurchases) * 100
  : 0;

  const uniqueCustomersToday = await getUniqueCustomersToday(start, end);
  const yesterdayUniqueCustomers = await getUniqueCustomersToday(yesterdayStart, yesterdayEnd);

  const customersChange = yesterdayUniqueCustomers
  ? ((uniqueCustomersToday - yesterdayUniqueCustomers) / yesterdayUniqueCustomers) * 100
  : 0;

  const stats = [
    {
      title: "Today's Sales",
      icon: <DollarSign className="h-4 w-4" />,
      value: `£${todaysSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: salesChange >= 0 ? "up" : "down",
      percentage: Math.abs(Number(salesChange.toFixed(1))),
    },
    {
      title: "Today's Purchases",
      icon: <ArrowUpDown className="h-4 w-4" />,
      value: `£${todaysPurchases.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: purchasesChange >= 0 ? "up" : "down",
      percentage: Math.abs(Number(purchasesChange.toFixed(1))),
    },
    {
      title: "Pending Orders",
      icon: <ShoppingBag className="h-4 w-4" />,
      value: "7", // Replace with live data if available
      trend: "up",
      percentage: 24,
    },
    {
      title: "Total Customers",
      icon: <Users className="h-4 w-4" />,
      value: `${uniqueCustomersToday}`, // Replace with live data if available
      trend: customersChange >= 0 ? "up" : "down",
      percentage: 9,
    },
  ];
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
