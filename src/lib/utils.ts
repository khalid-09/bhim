import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertDate = (
  date: Date | string | undefined,
  formatString: string = "dd/MM/yyyy",
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return format(dateObj, formatString);
};

export const formatPrice = (price: number) => {
  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  };

  const formattedPrice = new Intl.NumberFormat("en-IN", formatOptions).format(
    price,
  );

  return formattedPrice;
};
