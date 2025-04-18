import { CurrencyRates } from "@/components/dashboard/currencyRates";
import { OnlineOrdersList } from "@/components/dashboard/orders";
import Stats from "@/components/dashboard/stats";
import StockLevels from "@/components/dashboard/stockLevels";
import { RecentTransactions } from "@/components/dashboard/transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { decrypt, decryptFromString, encrypt, encryptToString } from "@/lib/encryption";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  Clock,
  PackageOpen,
  Repeat,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const encrypted = encrypt("what a wonderful wordl");
  console.log(encrypted);
  console.log(decrypt(encrypted));
  return (
    <main>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, User!</p>
        </div>
        <Link href={"/transaction"}>
        <Button className="hidden md:inline-flex">
          <span className="mr-2 flex items-center gap-4">
            <ArrowLeftRight /> New Transaction
          </span>
        </Button>
        </Link>
      </div>
      <Stats />
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent transactions and orders
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <Tabs defaultValue="transactions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="orders">Online Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="mt-4">
                <RecentTransactions />
              </TabsContent>
              <TabsContent value="orders" className="mt-4">
                <OnlineOrdersList />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Currency Rates</CardTitle>
            <CardDescription>Today&#39;s exchange rates</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <CurrencyRates />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Rates
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 py-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>
              Current stock levels for all currencies
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <StockLevels />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <PackageOpen /> View All Stock
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" className="h-auto justify-start py-4">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start gap-1">
                <span>Sell Currency</span>
                <span className="text-xs text-muted-foreground">
                  Process a sale
                </span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4">
              <Repeat className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start gap-1">
                <span>Buy Currency</span>
                <span className="text-xs text-muted-foreground">
                  Process a purchase
                </span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start gap-1">
                <span>Prepare Order</span>
                <span className="text-xs text-muted-foreground">
                  Process online orders
                </span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4">
              <Clock className="mr-2 h-4 w-4" />
              <div className="flex flex-col items-start gap-1">
                <span>End of Day</span>
                <span className="text-xs text-muted-foreground">
                  Run closure report
                </span>
              </div>
            </Button>
          </CardContent>
          <CardFooter>
            <Link
              href="/help"
              className="text-sm text-muted-foreground hover:underline"
            >
              Need help? View the operator guide
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
