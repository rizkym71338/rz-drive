import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { api as convexApi } from '../../convex/_generated/api'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const api = convexApi
