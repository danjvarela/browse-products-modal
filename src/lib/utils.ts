import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const searchStr = (str: string, keyword: string) => {
  return new RegExp(keyword, "i").test(str);
};
