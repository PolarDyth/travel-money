import { Skeleton } from "../../skeleton";

export default function ChatHistorySkeleton() {
  return (
    <div className="w-64 flex-shrink-0">
    <Skeleton className="h-10 w-full mb-4" />
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" />
      ))}
    </div>
  </div>
  );
}
