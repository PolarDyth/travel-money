import { AlertTriangle } from "lucide-react";
import { Button } from "../../button";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import { TabsContent } from "../../tabs";
import { useRouter } from "next/router";

export default function CustomerTabError() {

  const router = useRouter()

  return (
    <TabsContent value="customer" className="space-y-4 p-4">
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-red-600">
            Error Loading Customer
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => router.reload()}>
            Retry
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-6">
        <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
        <p className="text-sm text-red-700">
          An unknown error has occurred while loading the customer information. Please try again later.
        </p>
      </CardContent>
    </Card>
  </TabsContent>
  )
}