import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundUpToNearest(num: number, multiple: GLfloat): number {
  const val = Math.ceil(num / multiple) * multiple;
  return parseFloat(val.toFixed(2));
}