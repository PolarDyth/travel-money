import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Order } from "@/lib/types/orders/types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  User,
  X,
  XCircle,
} from "lucide-react";
import { OrderStatus } from "../../../../generated/prisma";
import { Badge } from "@/components/ui/badge";

interface OrderSummaryProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
}

export default function OrderSummary({
  order,
  onStatusChange,
}: OrderSummaryProps) {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-600 border-amber-200"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "IN_PREPARATION":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <Package className="mr-1 h-3 w-3" />
            In Preparation
          </Badge>
        );
      case "READY":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            <ShoppingBag className="mr-1 h-3 w-3" />
            Ready
          </Badge>
        );
      case "COLLECTED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-600 border-purple-200"
          >
            <User className="mr-1 h-3 w-3" />
            Collected
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get action buttons based on status
  const getActionButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <div className="flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onStatusChange("IN_PREPARATION")}
            >
              <Package className="mr-2 h-4 w-4" />
              Start Preparation
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onStatusChange("CANCELLED")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          </div>
        );
      case "IN_PREPARATION":
        return (
          <div className="flex gap-2">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onStatusChange("READY")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Ready
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => onStatusChange("CANCELLED")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          </div>
        );
      case "READY":
        return (
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => onStatusChange("COLLECTED")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mark as Collected
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TabsContent value="details" className="space-y-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Status</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payment Method</span>
                <span className="text-sm capitalize">
                  {typeof order.paymentMethod === "string"
                    ? order.paymentMethod.replace("_", " ")
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Value</span>
                <span className="font-bold">
                  £{Number(order.totalSterling)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Service Fee</span>
                <span>£{Number(order.totalFee)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Collection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(order.collectionDate).toDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">In-store collection</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">GBP</TableHead>
                  <TableHead className="text-right">Foreign</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.currencyCode}
                    </TableCell>
                    <TableCell>{item.transactionType}</TableCell>
                    <TableCell className="text-right">
                      {Number(item.exchangeRate)}
                    </TableCell>
                    <TableCell className="text-right">
                      £{Number(item.sterlingAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(item.foreignAmount)} {item.currencyCode}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    £{Number(order.totalSterling)}
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end">{getActionButtons()}</div>
      </TabsContent>
    </>
  );
}
