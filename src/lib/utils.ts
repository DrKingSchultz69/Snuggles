import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Route to a cart item's product page.
 *
 * Items added before `handle` was stored on the cart fall back to deriving it
 * from the product name, and carts live in localStorage, so those older items
 * are still out there.
 */
export function productPath(item: { handle?: string; name: string }) {
  const handle =
    item.handle ||
    item.name.toLowerCase().replace('snuggle ', '').replace(/ - /g, '-').replace(/ /g, '-');
  return `/product/${handle}`;
}

export function formatPrice(amount: number | string, currencyCode: string = 'INR') {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
