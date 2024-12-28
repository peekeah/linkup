import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDate(date: string, returnToday?: boolean): string {
  dayjs.extend(isToday)
  dayjs.extend(isYesterday)

  if (dayjs(date).isToday()) {
    return returnToday ?
      "Today" :
      dayjs(date).format("h:mm A")
  } else if (dayjs(date).isYesterday()) {
    return "Yesterday";
  } else {
    return dayjs(date).format("DD/MM/YYYY")
  }
}
