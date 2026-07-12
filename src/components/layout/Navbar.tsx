import { Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { formatPrice } from '../../lib/utils';

const Navbar = () => {
  const { items, subtotal } = useCart();
  const { openSearch } = useSearch();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-transparent hover:border-border transition-colors duration-300">
      <div className="container-padding h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-xl font-logo font-normal">
            Snuggle
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/category/sets"
            className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
          >
            Shop All
          </Link>
          <Link 
            to="/policy"
            className="text-sm uppercase tracking-widest hover:text-muted-foreground transition-colors"
          >
            Care & Policy
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={openSearch}
            className="p-2 hover:bg-muted rounded-full transition-colors" 
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-1" />
          </button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block" aria-label="Account">
            <User className="w-5 h-5 stroke-1" />
          </button>
          
          {/* Cart with Mini Summary */}
          <div className="relative group z-50">
            <Link to="/cart" className="p-2 hover:bg-muted rounded-full transition-colors block relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 stroke-1" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />
              )}
            </Link>

            <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-xl border border-muted opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div className="p-4 border-b border-muted">
                <span className="font-serif uppercase tracking-wide text-sm">Shopping Bag ({itemCount})</span>
              </div>
              <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Your bag is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted shrink-0">
                        <img 
                          src={item.img}
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color} / {item.size} / Qty: {item.quantity}</p>
                        <p className="text-xs font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-muted bg-muted/10">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <Link to="/cart" className="block w-full bg-black text-white text-center py-3 uppercase text-xs tracking-widest hover:bg-black/90 transition-colors">
                  View Bag & Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
