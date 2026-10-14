// Default import: the dev vendor bundle only exposes clsx's CommonJS default.
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Joins class names and lets later Tailwind classes win over earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
