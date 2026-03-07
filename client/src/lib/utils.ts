import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 电话号码脱敏处理
 * 将完整手机号中间4位替换为****
 * @example maskPhone('13812341234') => '138****1234'
 */
export function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 验证手机号格式（11位中国手机号）
 */
export function isValidPhone(phone: string): boolean {
  return /^1\d{10}$/.test(phone);
}
