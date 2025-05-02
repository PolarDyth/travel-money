import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerTabError from "@/components/ui/errors/orders/customerTabError";
import { Separator } from "@/components/ui/separator";
import CustomerTabSkeleton from "@/components/ui/skeletons/orders/customerTabSkeleton";
import { TabsContent } from "@/components/ui/tabs";
import { Order } from "@/lib/types/orders/types";
import { useCustomerOrders } from "@/routes/orders";
import { CheckCircle2, Mail, Phone, User } from "lucide-react";

interface CustomerTabProps {
  order: Order;
}

export default function CustomerTab( { order }: CustomerTabProps) {

  const { customerInfo, isLoading, error } = useCustomerOrders(order.customerId);

  if (isLoading) {
    return <CustomerTabSkeleton />
  }

  if (error) {
    return <CustomerTabError />
  }

  return (
    <>
      <TabsContent value="customer" className="space-y-4 p-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Customer Information
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                View Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{order.customer.firstNameEnc} {" "} {order.customer.lastNameEnc}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {order.customer.emailEnc ? (
                    <span>{order.customer.emailEnc}</span>
                  ) : (
                    <span className="text-muted-foreground">No email provided</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {order.customer.phoneEnc ? (
                    <span>{order.customer.phoneEnc}</span>
                  ) : (
                    <span className="text-muted-foreground">No phone number provided</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Customer History</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{customerInfo?.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">
                      Previous Orders
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">£{customerInfo?.totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">2 weeks</p>
                    <p className="text-xs text-muted-foreground">Last Order</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Verification Status</h4>
              { order.customer.primaryIdNumberEnc ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Unverified</Badge>
                </div>
              ) }
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
