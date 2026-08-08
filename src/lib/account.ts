import type { ShippingAddress } from '../components/AddressForm';

export interface OrderSummary {
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  status: string;
  createdAt: string;
  items: { label: string; quantity: number }[];
  shippedTo: string;
}

/**
 * The account API is authenticated with the Clerk session token. Callers get
 * the token from useAuth().getToken() and pass it in, so this module stays a
 * plain function rather than a hook.
 */
async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.error || 'Request failed');
  }
  return body as T;
}

export async function fetchSavedAddress(token: string): Promise<ShippingAddress | null> {
  const body = await request<{ address: ShippingAddress | null }>('/api/account/profile', token);
  return body.address;
}

export async function saveAddress(token: string, address: ShippingAddress): Promise<void> {
  await request('/api/account/profile', token, {
    method: 'PUT',
    body: JSON.stringify({ address }),
  });
}

export async function fetchOrders(token: string): Promise<OrderSummary[]> {
  const body = await request<{ orders: OrderSummary[] }>('/api/account/orders', token);
  return body.orders;
}
