import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { RazorpayButton } from '../components/RazorpayButton';
import { AddressForm, useShippingAddress, validateAddress } from '../components/AddressForm';

const CheckoutPending = () => {
  const { items, subtotal } = useCart();
  const [address, setAddress] = useShippingAddress();
  const addressValid = validateAddress(address);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in py-24">
      <h1 className="text-3xl md:text-5xl mb-4">Checkout</h1>
      <div className="max-w-md w-full p-8 border border-muted bg-muted/10 rounded-sm space-y-6 flex flex-col items-center">
        {items.length > 0 ? (
          <>
            <AddressForm address={address} onChange={setAddress} />
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
