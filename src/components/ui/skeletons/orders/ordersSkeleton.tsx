import { Card, CardContent, CardHeader } from "../../card";
import { ScrollArea } from "../../scroll-area";
import { Skeleton } from "../../skeleton";

export default function OrdersSkeleton() {
  const skeletonOrders = Array.from({ length: 5 });

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="p-4 sm:p-6">
        <Skeleton className="h-6 w-1/3 rounded" />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-24rem)]">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 border-b last:border-b-0 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/4 rounded" />
                <Skeleton className="h-5 w-1/6 rounded" />
              </div>
              <Skeleton className="h-4 w-1/2 rounded" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-10 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
              </div>
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
