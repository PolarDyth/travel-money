import { Card, CardContent, CardHeader } from "../../card";
import { Skeleton } from "../../skeleton";

export function StatsSkeleton() {
  // Adjust the number 4 if you have more/less cards
  return (
    <div className="flex justify-center items-center py-4 gap-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="w-1/4 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}