import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  variantId?: string;
  name: string;
  size: string;
  color: string;
  price: number;
  img: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([
    { id: 1, variantId: 'mock-variant-1', name: 'Snuggle Cami Set', size: 'M', color: 'Cream', price: 299, img: 'minimal fashion cream cami set lounge studio', quantity: 1 },
    { id: 2, variantId: 'mock-variant-2', name: 'Snuggle Cami Set', size: 'S', color: 'Brown', price: 299, img: 'minimal fashion brown cami set lounge studio', quantity: 1 }
  ]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.name === newItem.name && i.size === newItem.size && i.color === newItem.color);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      const newId = Math.max(0, ...prev.map(i => i.id)) + 1;
      return [...prev, { ...newItem, id: newId }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeItem, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
