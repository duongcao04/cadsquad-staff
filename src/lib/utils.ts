import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function removeVietnameseTones(string: string) {
    return string
        .normalize('NFD') // Tách chữ và dấu
        .replace(/[\u0300-\u036f]/g, '') // Xoá dấu
        .replace(/đ/g, 'd') // đ → d
        .replace(/Đ/g, 'D') // Đ → D
        .replace(/\s+/g, ' ') // loại bỏ khoảng trắng thừa
        .trim()
}

export function padToFourDigits(num: number | string): string {
    return num.toString().padStart(4, '0')
}

export function uniqueByKey<T extends Record<string, unknown>>(
    arr: T[],
    key: keyof T
): T[] {
    return Array.from(new Map(arr.map((obj) => [obj[key], obj])).values())
}
