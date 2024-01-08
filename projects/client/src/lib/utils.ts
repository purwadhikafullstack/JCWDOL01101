import service from "@/service";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

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

export function getWarehouse(
  value: number,
  setWarehouses: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>
) {
  service
    .get(`/warehouses/user/${value}`)
    .then((response) => {
      setWarehouses((prevState) => ({
        ...prevState,
        [value]: response.data.data.name,
      }));
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
}
