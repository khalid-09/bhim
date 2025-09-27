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

export const getQualityColor = (index: number, rowIndex: number) => {
  const adjustedIndex = (index + rowIndex) % 7;

  if (adjustedIndex === 0) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
  if (adjustedIndex === 1)
    return "bg-orange-100 text-orange-800 hover:bg-orange-200";
  if (adjustedIndex === 2)
    return "bg-purple-100 text-purple-800 hover:bg-purple-200";
  if (adjustedIndex === 3)
    return "bg-green-100 text-green-800 hover:bg-green-200";
  if (adjustedIndex === 4)
    return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
  if (adjustedIndex === 5) return "bg-pink-100 text-pink-800 hover:bg-pink-200";
  return "bg-gray-100 text-gray-800 hover:bg-gray-200";
};

export const convertTaarToString = (
  taar: number | null | undefined,
): string => {
  if (taar === null || taar === undefined) {
    return "";
  }
  return taar.toString();
};
