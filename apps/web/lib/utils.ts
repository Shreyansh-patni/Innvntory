import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class-name composition helper used by the shadcn/ui primitives. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}