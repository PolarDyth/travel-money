import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="hidden md:table-cell">Operator</TableHead>
            <TableHead className="hidden lg:table-cell">Time</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-8 w-8 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-6 rounded" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-20 rounded" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-28 rounded" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 rounded ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="h-6 w-14 rounded" />
                  <Skeleton className="h-6 w-14 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}