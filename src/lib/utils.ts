import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts a string from snake_case to camelCase
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Recursively transforms an object's keys from snake_case to camelCase
export function transformToCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformToCamelCase) as unknown as T;
  }

  const camelCaseObj: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    const camelKey = toCamelCase(key);
    camelCaseObj[camelKey] = transformToCamelCase(obj[key]);
  });

  return camelCaseObj as T;
}
