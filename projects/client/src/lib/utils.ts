import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToIDR(value: number | string) {
  const numericValue = value.toString().replace(/\D/g, "");
  const formattedValue = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(numericValue));

  return formattedValue;
}

export function convertToK(currencyValue: number): string {
  if (currencyValue >= 1000) {
    const valueInK = currencyValue / 1000;
    return `${valueInK}K`;
  } else {
    return currencyValue.toString();
  }
}

export function getDate(value: string) {
  const splitter = value.split("T");
  const date = splitter[0];

  return date;
}
