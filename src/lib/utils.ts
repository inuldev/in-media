import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNowStrict, formatDate } from "date-fns";
import { id } from "date-fns/locale"; // Import the Indonesian locale

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true, locale: id });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "d MMM", { locale: id });
    } else {
      return formatDate(from, "d MMM, yyyy", { locale: id });
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 0,
    signDisplay: "auto", // Handles negative numbers
  }).format(n);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
