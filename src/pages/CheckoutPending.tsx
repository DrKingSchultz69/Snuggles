import { Link } from 'react-router-dom';

const CheckoutPending = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in py-24">
      <h1 className="text-3xl md:text-5xl mb-4">Checkout</h1>
      <div className="max-w-md p-8 border border-muted bg-muted/10 rounded-sm space-y-4">
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto text-xl">
          !
        </div>
        <h2 className="text-xl font-medium uppercase tracking-wide">Integration Pending</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Shopify checkout integration is currently in progress. 
          <br/>
          Please check back soon to complete your purchase of Snuggle pieces.
        </p>
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
