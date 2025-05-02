import { Card, CardContent, CardHeader } from "../../card";
import { Separator } from "../../separator";
import { Skeleton } from "../../skeleton";
import { TabsContent } from "../../tabs";

export default function CustomerTabSkeleton() {
  return (
    <TabsContent value="customer" className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-2/5 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <Skeleton className="h-8 w-1/2 mx-auto rounded" />
                    <Skeleton className="h-4 w-3/5 mx-auto mt-2 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Separator />
          <Skeleton className="h-5 w-1/5 rounded" />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
