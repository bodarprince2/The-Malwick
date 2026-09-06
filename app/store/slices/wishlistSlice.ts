import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data/products';

export interface WishlistItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
}

export interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistData(state, action: PayloadAction<WishlistState>) {
      state.items = action.payload.items;
    },
    addToWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
    },
    toggleWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== product.id);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
    },
  },
});

export const { setWishlistData, addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
