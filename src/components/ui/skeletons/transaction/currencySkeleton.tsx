import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function CurrencySkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Left section */}
      <div className="grid gap-4 md:col-span-2">
        {/* Add Currency Exchange */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/3" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Currency Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-1/2" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>

            <Skeleton className="h-20 w-full rounded-md" />

            <div>
              <Skeleton className="h-4 w-1/3 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-12 rounded-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right section - Transaction Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-10" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Skeleton className="h-10 w-10 rounded-full mb-2" />
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
