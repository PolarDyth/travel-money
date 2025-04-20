import { ArrowUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function CurrencyRatesSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">We Buy</TableHead>
          <TableHead className="text-right">We Sell</TableHead>
          <TableHead className="text-right">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(6)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-16 mx-auto" />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <ArrowUp className="h-4 w-4 text-muted animate-pulse" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}