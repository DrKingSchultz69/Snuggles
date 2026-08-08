import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { useCart } from '../context/CartContext';
import { RazorpayButton } from '../components/RazorpayButton';
import { AddressForm, useShippingAddress, validateAddress } from '../components/AddressForm';
import { fetchSavedAddress } from '../lib/account';

const CheckoutPending = () => {
  const { items, subtotal } = useCart();
  const [address, setAddress] = useShippingAddress();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [prefilled, setPrefilled] = useState(false);
  const addressValid = validateAddress(address);

  // Pre-fill from the saved profile for signed-in customers. This only ever
  // runs once, so it can't clobber edits the customer makes afterwards — the
  // address stays fully editable and whatever is submitted wins.
  useEffect(() => {
    if (!isLoaded || !isSignedIn || prefilled) return;

    let cancelled = false;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const saved = await fetchSavedAddress(token);
        if (saved && !cancelled) setAddress(saved);
      } catch {
        // A missing or unreachable profile just means an empty form.
      } finally {
        if (!cancelled) setPrefilled(true);
      }
    })();

    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, prefilled, getToken, setAddress]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in py-24">
      <h1 className="text-3xl md:text-5xl mb-4">Checkout</h1>
      <div className="max-w-md w-full p-8 border border-muted bg-muted/10 rounded-sm space-y-6 flex flex-col items-center">
        {items.length > 0 ? (
          <>
            {isLoaded && !isSignedIn && (
              <p className="text-xs text-muted-foreground">
                <SignInButton mode="modal">
                  <button className="border-b border-black hover:text-muted-foreground transition-colors">
                    Sign in
                  </button>
                </SignInButton>{' '}
                to save your address and track this order. You can also check out as a guest.
              </p>
            )}

            <AddressForm address={address} onChange={setAddress} />

            {isSignedIn && (
              <p className="text-xs text-muted-foreground">
                This address will be saved to your account.
              </p>
            )}

            <div className="w-full border-t border-muted pt-6 space-y-4 flex flex-col items-center">
              <h2 className="text-xl font-medium uppercase tracking-wide">Secure Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Complete your purchase securely using Razorpay.
              </p>
              {addressValid ? (
                <RazorpayButton amount={subtotal} items={items} address={address} />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Fill in your shipping address above to continue.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            Your cart is empty.
          </p>
        )}
      </div>
      <Link
        to="/cart"
        className="mt-8 inline-block border-b border-black pb-1 uppercase tracking-widest text-sm hover:text-muted-foreground hover:border-muted-foreground transition-all"
      >
        Return to Cart
      </Link>
    </div>
  );
};

export default CheckoutPending;
