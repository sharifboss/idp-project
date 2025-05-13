import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('bookstore-cart');
      return savedCart ? JSON.parse(savedCart) : {};
    }
    return {};
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookstore-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback((book) => {
    setCart(prev => {
      const existingItem = prev[book._id];
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      
      // Check stock availability
      if (newQuantity > book.stock) {
        console.warn(`Cannot add more items. Only ${book.stock} available in stock.`);
        return prev;
      }

      return {
        ...prev,
        [book._id]: {
          book,
          quantity: newQuantity
        }
      };
    });
  }, []);

  const updateCart = useCallback((bookId, newQuantity) => {
    setCart(prev => {
      const existingItem = prev[bookId];
      if (!existingItem) return prev;

      // Check stock availability when increasing quantity
      if (newQuantity > existingItem.quantity && 
          newQuantity > existingItem.book.stock) {
        console.warn(`Cannot add more items. Only ${existingItem.book.stock} available in stock.`);
        return prev;
      }

      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[bookId];
        return newCart;
      }

      return {
        ...prev,
        [bookId]: { 
          ...existingItem, 
          quantity: newQuantity 
        }
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookstore-cart');
    }
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[bookId];
      return newCart;
    });
  }, []);

  const total = Object.values(cart).reduce(
    (sum, item) => sum + (item.book.price * item.quantity),
    0
  );

  const itemCount = Object.values(cart).reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        updateCart, 
        removeFromCart,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};