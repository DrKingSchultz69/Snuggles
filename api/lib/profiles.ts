import { getSql, hasDatabase } from './db.js';
import type { OrderAddress } from './orders.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Same rules the checkout form and /create-order enforce, so a saved profile
 * can never hold an address that would be rejected at checkout.
 */
export function isValidProfileAddress(value: unknown): value is OrderAddress {
  const a = value as Partial<OrderAddress> | null;
  return (
    !!a &&
    typeof a.name === 'string' && a.name.trim().length > 0 &&
    typeof a.email === 'string' && emailPattern.test(a.email.trim()) &&
    typeof a.phone === 'string' && /^\d{10}$/.test(a.phone.trim()) &&
    typeof a.addressLine === 'string' && a.addressLine.trim().length > 0 &&
    typeof a.city === 'string' && a.city.trim().length > 0 &&
    typeof a.state === 'string' && a.state.trim().length > 0 &&
    typeof a.pincode === 'string' && /^\d{6}$/.test(a.pincode.trim())
  );
}

export async function getProfile(userId: string): Promise<OrderAddress | null> {
  if (!hasDatabase()) return null;

  const sql = getSql();
  const rows = (await sql`
    SELECT name, email, phone, address_line, city, state, pincode
      FROM profiles
     WHERE user_id = ${userId}
  `) as Record<string, string>[];

  const row = rows[0];
  if (!row) return null;

  return {
    name: row.name,
    email: row.email,
    phone: row.phone,
    addressLine: row.address_line,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
  };
}

/**
 * Creates or replaces the user's saved shipping address.
 *
 * One address per user by design — the schema keys on user_id. Supporting an
 * address book later means a separate addresses table, not a change here.
 */
export async function saveProfile(userId: string, address: OrderAddress): Promise<void> {
  if (!hasDatabase()) return;

  const sql = getSql();
  await sql`
    INSERT INTO profiles (
      user_id, name, email, phone, address_line, city, state, pincode, updated_at
    ) VALUES (
      ${userId}, ${address.name.trim()}, ${address.email.trim()},
      ${address.phone.trim()}, ${address.addressLine.trim()},
      ${address.city.trim()}, ${address.state.trim()},
      ${address.pincode.trim()}, now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      name         = EXCLUDED.name,
      email        = EXCLUDED.email,
      phone        = EXCLUDED.phone,
      address_line = EXCLUDED.address_line,
      city         = EXCLUDED.city,
      state        = EXCLUDED.state,
      pincode      = EXCLUDED.pincode,
      updated_at   = now()
  `;
}

export interface OrderSummary {
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  status: string;
  createdAt: string;
  items: { label: string; quantity: number }[];
  shippedTo: string;
}

export async function listOrders(userId: string): Promise<OrderSummary[]> {
  if (!hasDatabase()) return [];

  const sql = getSql();
  const rows = (await sql`
    SELECT razorpay_order_id, amount_paise, currency, status, created_at, items,
           ship_address_line, ship_city, ship_state, ship_pincode
      FROM orders
     WHERE user_id = ${userId}
     ORDER BY created_at DESC
     LIMIT 100
  `) as Record<string, unknown>[];

  return rows.map((row) => ({
    razorpayOrderId: String(row.razorpay_order_id),
    // amount_paise is BIGINT, which the driver returns as a string.
    amountPaise: Number(row.amount_paise),
    currency: String(row.currency),
    status: String(row.status),
    createdAt: new Date(row.created_at as string).toISOString(),
    items: (row.items as { label: string; quantity: number }[]) ?? [],
    shippedTo: `${row.ship_address_line}, ${row.ship_city}, ${row.ship_state} - ${row.ship_pincode}`,
  }));
}
