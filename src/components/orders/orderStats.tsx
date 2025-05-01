import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Clock, Package, ShoppingBag, User, X } from "lucide-react";

export default async function OrderStats() {
  const todaysOrders = await prisma.order.findMany({
    where: {
      OR: [
        { collectedAt: null },
        {
          collectedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      ],
    },
    select: {
      status: true,
    },
  });

  const stats = [
    {
      name: "Pending Orders",
      value: todaysOrders.filter((order) => order.status === "PENDING").length,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      name: "In Preparation",
      value: todaysOrders.filter((order) => order.status === "IN_PREPARATION")
        .length,
      icon: <Package className="h-4 w-4 text-blue-500" />
    },
    {
      name: "Ready for Pickup",
      value: todaysOrders.filter((order) => order.status === "READY").length,
      icon: <ShoppingBag className="h-4 w-4 text-green-500" />
    },
    {
      name: "Collected Today",
      value: todaysOrders.filter((order) => order.status === "COLLECTED")
        .length,
      icon: <User className="h-4 w-4 text-purple-500" />
    },
    {
      name: "Cancelled",
      value: todaysOrders.filter((order) => order.status === "CANCELLED")
        .length,
      icon: <X className="h-4 w-4 text-red-500" />
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.name}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
