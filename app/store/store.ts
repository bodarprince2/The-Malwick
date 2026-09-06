import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import cartReducer, { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity, clearCart } from './slices/cartSlice';
import wishlistReducer, { addToWishlist, removeFromWishlist, toggleWishlist } from './slices/wishlistSlice';

// Create a listener middleware to persist state changes to localStorage
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addToCart, removeFromCart, increaseQuantity, decreaseQuantity, updateQuantity, clearCart),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    if (typeof window !== 'undefined') {
      localStorage.setItem('themalwick_cart', JSON.stringify(state.cart));
    }
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addToWishlist, removeFromWishlist, toggleWishlist),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    if (typeof window !== 'undefined') {
      localStorage.setItem('themalwick_wishlist', JSON.stringify(state.wishlist));
    }
  }
});

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
