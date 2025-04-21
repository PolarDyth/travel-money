import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionSuccessSkeleton() {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center justify-center py-8">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction ID and Date/Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
          {/* Customer Information */}
          <Skeleton className="h-24 w-full rounded-md" />
          {/* Currency Exchange Details */}
          <Skeleton className="h-32 w-full rounded-md" />
          {/* Payment Summary */}
          <Skeleton className="h-16 w-full rounded-md" />
          {/* Transaction Details */}
          <Skeleton className="h-24 w-full rounded-md" />
          {/* Receipt Options */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}