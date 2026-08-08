import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/clerk-react';
import { AddressForm, validateAddress, type ShippingAddress } from '../components/AddressForm';
import { fetchOrders, fetchSavedAddress, saveAddress, type OrderSummary } from '../lib/account';
import { formatPrice } from '../lib/utils';

const emptyAddress: ShippingAddress = {
  name: '', email: '', phone: '', addressLine: '', city: '', state: '', pincode: '',
};

const statusLabel: Record<string, string> = {
  created: 'Awaiting payment',
  paid: 'Paid',
  failed: 'Failed',
};

const AccountContent = () => {
  const { getToken } = useAuth();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not signed in');
      const [saved, orderList] = await Promise.all([
        fetchSavedAddress(token),
        fetchOrders(token),
      ]);
      if (saved) setAddress(saved);
      setOrders(orderList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your account');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not signed in');
      await saveAddress(token, address);
      setMessage('Address saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your address');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground text-center py-12">Loading your account…</p>;
  }

  return (
    <div className="space-y-16">
      <section className="max-w-md mx-auto w-full space-y-6">
        <AddressForm address={address} onChange={setAddress} />
        <button
          onClick={handleSave}
          disabled={saving || !validateAddress(address)}
          className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-black/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Address'}
        </button>
        {!validateAddress(address) && (
          <p className="text-xs text-muted-foreground text-center">
            Complete every field to save. Phone must be 10 digits, pincode 6.
          </p>
        )}
        {message && <p className="text-xs text-center">{message}</p>}
        {error && <p className="text-xs text-center text-red-600">{error}</p>}
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-medium uppercase tracking-widest text-center">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            No orders yet.{' '}
            <Link to="/category/sets" className="border-b border-black hover:text-muted-foreground">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.razorpayOrderId} className="border border-muted p-6 space-y-3">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.razorpayOrderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.amountPaise / 100)}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {statusLabel[order.status] ?? order.status}
                    </p>
                  </div>
                </div>

                <ul className="text-sm text-muted-foreground space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.label} &times; {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground border-t border-muted pt-3">
                  Shipped to: {order.shippedTo}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Account = () => (
  <div className="container-padding py-12 max-w-2xl mx-auto">
    <h1 className="text-3xl uppercase tracking-tight mb-12 mt-8 py-4 text-center">My Account</h1>

    <SignedOut>
      <div className="text-center space-y-6 py-12">
        <p className="text-muted-foreground">Sign in to see your orders and saved address.</p>
        <SignInButton mode="modal">
          <button className="bg-black text-white px-8 py-4 uppercase tracking-widest hover:bg-black/90 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    </SignedOut>

    <SignedIn>
      <AccountContent />
    </SignedIn>
  </div>
);

export default Account;
