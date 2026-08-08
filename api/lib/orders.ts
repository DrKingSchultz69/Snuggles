import { getSql, hasDatabase } from './db.js';

export interface OrderAddress {
  name: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemRecord {
  label: string;
  quantity: number;
  variantId: string;
}

/**
 * Persists a newly created Razorpay order.
 *
 * Every database call here is best-effort: a checkout must never fail because
 * our bookkeeping did. Razorpay is still the authority on whether money moved,
 * and the notification email still goes out regardless, so the worst case of a
 * failure here is a missing row in "My Orders" — not a lost sale.
 */
export async function recordOrderCreated(order: {
  razorpayOrderId: string;
  userId: string | null;
  amountPaise: number;
  currency: string;
  address: OrderAddress;
  items: OrderItemRecord[];
}): Promise<void> {
  if (!hasDatabase()) return;

  try {
    const sql = getSql();
    await sql`
      INSERT INTO orders (
        user_id, razorpay_order_id, amount_paise, currency, status,
        ship_name, ship_email, ship_phone, ship_address_line,
        ship_city, ship_state, ship_pincode, items
      ) VALUES (
        ${order.userId}, ${order.razorpayOrderId}, ${order.amountPaise},
        ${order.currency}, 'created',
        ${order.address.name.trim()}, ${order.address.email.trim()},
        ${order.address.phone.trim()}, ${order.address.addressLine.trim()},
        ${order.address.city.trim()}, ${order.address.state.trim()},
        ${order.address.pincode.trim()}, ${JSON.stringify(order.items)}
      )
      ON CONFLICT (razorpay_order_id) DO NOTHING
    `;
  } catch (error) {
    console.error('[order] Failed to record created order:', error);
  }
}

/**
 * Marks an order paid.
 *
 * Both /verify and /webhook can reach this for the same order — the browser
 * round-trip and Razorpay's server-to-server callback race by design. The
 * `status <> 'paid'` guard makes the write idempotent so paid_at reflects the
 * first confirmation rather than the last one to arrive.
 */
export async function markOrderPaid(
  razorpayOrderId: string,
  razorpayPaymentId: string,
): Promise<void> {
  if (!hasDatabase()) return;

  try {
    const sql = getSql();
    await sql`
      UPDATE orders
         SET status = 'paid',
             razorpay_payment_id = ${razorpayPaymentId},
             paid_at = now()
       WHERE razorpay_order_id = ${razorpayOrderId}
         AND status <> 'paid'
    `;
  } catch (error) {
    console.error('[order] Failed to mark order paid:', error);
  }
}
