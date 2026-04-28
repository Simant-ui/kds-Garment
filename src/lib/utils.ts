import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : (price ?? 0);
  
  try {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0
    }).format(Number(numericPrice))
  } catch (e) {
    return `Rs. ${numericPrice}`
  }
}
