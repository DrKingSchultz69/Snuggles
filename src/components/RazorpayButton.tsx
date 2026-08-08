import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import type { CartItem } from '../context/CartContext';
import type { ShippingAddress } from './AddressForm';

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

// Dynamically load the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RazorpayButton = ({
  amount,
  items,
  address,
}: {
  amount: number;
  items: CartItem[];
  address: ShippingAddress;
}) => {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handlePayment = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // Create Order on your backend. The server looks up real prices from Shopify
      // using these variant IDs — it never trusts a price/amount from the client.
      // Sent when signed in so the server can attach the order to the account
      // and remember the address. Guests simply send no token.
      const token = await getToken();

      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            name: item.name,
            size: item.size,
            color: item.color,
          })),
          address,
        }),
      });

      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => null);
        alert(errBody?.error || 'Unable to start payment. Please try again.');
        setLoading(false);
        return;
      }

      const { order } = await orderRes.json();

      // Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: order.currency,
        name: 'Snuggles',
        description: 'Transaction',
        order_id: order.id,
        handler: async (response: RazorpayPaymentResponse) => {
          // Verify Payment on your backend
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            alert('Payment Successful!');
          } else {
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#000000',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-black/90 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};
