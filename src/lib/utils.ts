import { defaultRules, ThresholdRule } from "@/data/currencies";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Currencies } from "./types/currency/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundUpToNearest(num: number, multiple: GLfloat): number {
  const val = Math.ceil(num / multiple) * multiple;
  return parseFloat(val.toFixed(2));
}

export function calculateDenomThreshold(
  data: Currencies,
  fallbackThreshold?: number
): Record<number, number> {
  const currency = JSON.parse(JSON.stringify(data));
  const rules: ThresholdRule[] = currency.thresholdRule ?? defaultRules;
  const sortedRules = [...rules].sort((a, b) => a.maxSterling - b.maxSterling);
  const thresholds: Record<number, number> = {};

  currency.denominations.forEach((denom: number) => {
    const sterlingValue = denom / currency.rate;
    const rule = sortedRules.find((rule) => sterlingValue < rule.maxSterling);

    thresholds[denom] = rule
      ? rule.threshold
      : fallbackThreshold ?? 5000;
  });

  return thresholds;
}
