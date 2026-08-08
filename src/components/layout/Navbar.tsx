import { useEffect, useRef, useState } from 'react';
import { Search, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context/SearchContext';
import { formatPrice, productPath } from '../../lib/utils';

const Navbar = () => {
  const { items, subtotal } = useCart();
  const { openSearch } = useSearch();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // The bag summary opens on hover, and clicking the bag pins it open so it
  // survives the mouse leaving. Two separate flags rather than one `open`:
  // un-pinning while the cursor is still inside must not make the panel
  // vanish, and hovering away from a pinned panel must not close it.
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartOpen = pinned || hovered;

  const closeCart = () => {
    setPinned(false);
    setHovered(false);
  };

  // Only armed while pinned — an unpinned panel closes on mouseleave anyway.
  useEffect(() => {
    if (!pinned) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!cartRef.current?.contains(event.target as Node)) closeCart();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [pinned]);

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
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
                aria-label="Sign in"
              >
                <User className="w-5 h-5 stroke-1" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/account"
              className="p-2 hover:bg-muted rounded-full transition-colors hidden md:block"
              aria-label="My account"
            >
              <User className="w-5 h-5 stroke-1" />
            </Link>
            <div className="hidden md:flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          
          {/* Cart with Mini Summary */}
          <div
            ref={cartRef}
            className="relative z-50"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              type="button"
              onClick={() => setPinned((wasPinned) => !wasPinned)}
              className="p-2 hover:bg-muted rounded-full transition-colors block relative"
              aria-label="Cart"
              aria-haspopup="true"
              aria-expanded={cartOpen}
            >
              <ShoppingBag className="w-5 h-5 stroke-1" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-80 bg-white shadow-xl border border-muted transition-all duration-300 transform z-50 ${
                cartOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
              }`}
            >
              <div className="p-4 border-b border-muted">
                <span className="uppercase tracking-wide text-sm">Shopping Bag ({itemCount})</span>
              </div>
              <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Your bag is empty.</p>
                ) : (
                  items.map((item) => (
                    <Link
                      key={item.id}
                      to={productPath(item)}
                      onClick={closeCart}
                      className="flex gap-4 group/item hover:bg-muted/40 transition-colors -m-1 p-1"
                    >
                      <div className="w-16 h-20 bg-muted shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover/item:text-muted-foreground transition-colors">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color} / {item.size} / Qty: {item.quantity}</p>
                        <p className="text-xs font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-muted bg-muted/10">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="block w-full bg-black text-white text-center py-3 uppercase text-xs tracking-widest hover:bg-black/90 transition-colors"
                >
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
