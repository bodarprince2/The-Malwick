'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setCartData } from './slices/cartSlice';
import { setWishlistData } from './slices/wishlistSlice';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Hydrate state from localStorage
      const savedCart = localStorage.getItem('themalwick_cart');
      if (savedCart) {
        try {
          store.dispatch(setCartData(JSON.parse(savedCart)));
        } catch (e) {
          console.error('Failed to parse cart data from localStorage', e);
        }
      }

      const savedWishlist = localStorage.getItem('themalwick_wishlist');
      if (savedWishlist) {
        try {
          store.dispatch(setWishlistData(JSON.parse(savedWishlist)));
        } catch (e) {
          console.error('Failed to parse wishlist data from localStorage', e);
        }
      }
      
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
