import type React from "react"
import { cn } from "@/lib/utils"

interface CustomBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger"
}

export function CustomBadge({ className, variant = "default", ...props }: CustomBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "success" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        variant === "warning" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        variant === "danger" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        className,
      )}
      {...props}
    />
  )
}

