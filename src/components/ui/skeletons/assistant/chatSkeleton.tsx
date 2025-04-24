import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px] gap-5">
      {/* Sidebar Skeleton */}
      <div className="w-64 flex-shrink-0">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      </div>

      {/* Chat Area Skeleton */}
      <div className="flex flex-1 flex-col rounded-lg border bg-card shadow-sm">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Skeleton className="h-6 w-1/3" />
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          ))}
        </div>

        {/* Input Skeleton */}
        <div className="border-t p-4 flex space-x-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>
    </div>
  );
}