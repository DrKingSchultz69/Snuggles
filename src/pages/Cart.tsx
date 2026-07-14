import { Minus, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createCheckout } from '../lib/shopify';
import { formatPrice } from '../lib/utils';

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const handleCheckout = async () => {
    // Filter out items without Shopify variant IDs or mock IDs
    const shopifyItems = items
      .filter(item => item.variantId && !item.variantId.startsWith('mock-'))
      .map(item => ({
        variantId: item.variantId!,
        quantity: item.quantity
      }));

    if (shopifyItems.length > 0) {
      try {
        const checkoutUrl = await createCheckout(shopifyItems);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      } catch (error) {
        console.error("Failed to generate Shopify checkout link:", error);
      }
    }
    
    // Fallback to static mock checkout page if not configured
    navigate('/checkout');
  };

  return (
    <div className="container-padding py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl uppercase tracking-widest mb-12 text-center">Shopping Bag</h1>
      
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="flex gap-6 py-6 border-b border-muted">
            <div className="w-24 h-32 bg-muted shrink-0">
               <img 
                src={item.img}
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="tracking-wide mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4 border border-border px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-muted-foreground"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-muted-foreground"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-4 max-w-sm ml-auto">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-xs text-muted-foreground">(Calculated at checkout)</span>
        </div>
        <div className="flex justify-between text-lg font-medium pt-4 border-t border-muted">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-black/90 transition-colors mt-8"
        >
          Proceed to Checkout
        </button>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-black border-b border-transparent hover:border-black transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
