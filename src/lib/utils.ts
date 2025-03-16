import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(inputStr: string): string {
  if (!inputStr) return inputStr;

  return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
}