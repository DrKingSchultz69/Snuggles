import { Router, type Request } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();

// Lazily initialize Razorpay so env vars are guaranteed to be loaded first
let razorpay: Razorpay | null = null;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }
  return razorpay;
};

interface CartItemInput {
  variantId: string;
  quantity: number;
  // Display-only fields: never used for pricing, only to make the order
  // notification email readable.
  name?: string;
  size?: string;
  color?: string;
}

const MAX_NOTED_ITEMS = 15; // Razorpay allows at most 15 note key-value pairs

async function sendOrderNotificationEmail(details: {
  orderId: string;
  paymentId: string;
  amount: number; // in paise
  items: { label: string; quantity: number }[];
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.ORDER_NOTIFY_TO || process.env.NEWSLETTER_NOTIFY_TO;
  const fromEmail = process.env.NEWSLETTER_FROM || 'Snuggle <onboarding@resend.dev>';

  if (!resendApiKey || !notifyTo) {
    console.log(`[order] Paid order ${details.orderId} (payment ${details.paymentId}), amount ₹${details.amount / 100}`);
    return;
  }

  const itemsHtml = details.items
    .map((item) => `<li>${item.label} &times; ${item.quantity}</li>`)
    .join('');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: notifyTo,
        subject: `New Snuggle order — ₹${(details.amount / 100).toFixed(2)}`,
        html: `
          <p>A new order was paid for.</p>
          <p><strong>Order ID:</strong> ${details.orderId}</p>
          <p><strong>Payment ID:</strong> ${details.paymentId}</p>
          <p><strong>Amount:</strong> ₹${(details.amount / 100).toFixed(2)}</p>
          <p><strong>Items:</strong></p>
          <ul>${itemsHtml}</ul>
        `,
      }),
    });

    if (!response.ok) {
      console.error('[order] Failed to send order notification email:', await response.text().catch(() => ''));
    }
  } catch (error) {
    console.error('[order] Failed to send order notification email:', error);
  }
}

// Looks up the authoritative price of each variant directly from Shopify,
// so the charge amount can never be dictated by the client.
async function getVariantPrices(variantIds: string[]): Promise<Map<string, number>> {
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const token = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error('Shopify credentials are not configured');
  }

  const query = `
    query getVariantPrices($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          price {
            amount
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables: { ids: variantIds } }),
  });

  const data = await response.json();
  const prices = new Map<string, number>();
  for (const node of data?.data?.nodes ?? []) {
    if (node?.id && node?.price?.amount) {
      prices.set(node.id, parseFloat(node.price.amount));
    }
  }
  return prices;
}

// Endpoint to create an order. The client only sends variant IDs + quantities;
// the actual price is looked up server-side so it can't be tampered with.
router.post('/create-order', async (req, res) => {
  try {
    const items = req.body?.items as CartItemInput[] | undefined;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'No items provided' });
      return;
    }

    for (const item of items) {
      if (!item.variantId || !Number.isInteger(item.quantity) || item.quantity < 1) {
        res.status(400).json({ success: false, error: 'Invalid cart item' });
        return;
      }
    }

    const prices = await getVariantPrices(items.map((item) => item.variantId));

    let total = 0;
    for (const item of items) {
      const price = prices.get(item.variantId);
      if (price === undefined) {
        res.status(400).json({ success: false, error: 'Could not verify price for one or more items' });
        return;
      }
      total += price * item.quantity;
    }

    const notes: Record<string, string> = {};
    items.slice(0, MAX_NOTED_ITEMS).forEach((item, index) => {
      const label = [item.name, item.size, item.color].filter(Boolean).join(' / ') || item.variantId;
      notes[`item_${index}`] = `${label} x${item.quantity}`.slice(0, 256);
    });

    const options = {
      amount: Math.round(total * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes,
    };

    const order = await getRazorpay().orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

// Endpoint to verify payment signature
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment successful! Normally the order notification email is sent
      // from the /webhook handler below, since that's reliable even if the
      // customer closes the tab. But until RAZORPAY_WEBHOOK_SECRET is set up
      // in the Razorpay dashboard, fall back to sending it from here so
      // orders aren't silently missed in the meantime.
      if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        const order = await getRazorpay().orders.fetch(razorpay_order_id);
        await sendOrderNotificationEmail({
          orderId: order.id,
          paymentId: razorpay_payment_id,
          amount: Number(order.amount),
          items: parseNotedItems(order.notes as Record<string, string | number> | undefined),
        });
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

function parseNotedItems(notes: Record<string, string | number> | undefined) {
  return Object.entries(notes || {})
    .filter(([key]) => key.startsWith('item_'))
    .map(([, value]) => {
      const match = /^(.*) x(\d+)$/.exec(String(value));
      return match ? { label: match[1], quantity: parseInt(match[2], 10) } : { label: String(value), quantity: 1 };
    });
}

// Razorpay calls this directly (server-to-server) once a payment is
// captured, independent of whether the customer's browser is still open.
// This is the authoritative source for order notifications.
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;

    if (!secret || !signature || !rawBody) {
      res.status(400).json({ success: false, error: 'Missing webhook signature' });
      return;
    }

    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (expectedSignature !== signature) {
      res.status(400).json({ success: false, error: 'Invalid webhook signature' });
      return;
    }

    // Acknowledge immediately so Razorpay doesn't retry; do the notification work after.
    res.status(200).json({ success: true });

    if (req.body?.event === 'payment.captured') {
      const payment = req.body?.payload?.payment?.entity;
      if (payment?.order_id) {
        const order = await getRazorpay().orders.fetch(payment.order_id);
        await sendOrderNotificationEmail({
          orderId: order.id,
          paymentId: payment.id,
          amount: Number(order.amount),
          items: parseNotedItems(order.notes as Record<string, string | number> | undefined),
        });
      }
    }
  } catch (error) {
    console.error('Error processing Razorpay webhook:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false });
    }
  }
});

export default router;
