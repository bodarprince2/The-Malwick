import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../data/products';

export interface CartItem {
  id: string; // unique cart item id (e.g., productId-size-color)
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  size?: string;
  status?: "coming_soon" | "available";
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  subtotal: 0,
};

// Helper function to generate unique ID for cart items based on selected variants
export const generateCartItemId = (productId: string, size?: string) => {
  return `${productId}${size ? `-${size}` : ''}`;
};

const calculateTotals = (state: CartState) => {
  let quantity = 0;
  let total = 0;
  state.items.forEach(item => {
    quantity += item.quantity;
    total += item.price * item.quantity;
  });
  state.totalQuantity = quantity;
  state.subtotal = total;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData(state, action: PayloadAction<CartState>) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.subtotal = action.payload.subtotal;
    },
    addToCart(state, action: PayloadAction<{ product: Product; size?: string; quantity?: number }>) {
      const { product, size, quantity = 1 } = action.payload;
      const cartItemId = generateCartItemId(product.id, size);
      
      const existingItem = state.items.find(item => item.id === cartItemId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity,
          size,
          status: product.status,
        });
      }
      
      calculateTotals(state);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const cartItemId = action.payload;
      state.items = state.items.filter(item => item.id !== cartItemId);
      calculateTotals(state);
    },
    increaseQuantity(state, action: PayloadAction<string>) {
      const cartItemId = action.payload;
      const item = state.items.find(item => item.id === cartItemId);
      if (item) {
        item.quantity += 1;
        calculateTotals(state);
      }
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const cartItemId = action.payload;
      const item = state.items.find(item => item.id === cartItemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        calculateTotals(state);
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        calculateTotals(state);
      }
    },
    updateItemSize(state, action: PayloadAction<{ id: string; newSize: string }>) {
      const { id, newSize } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === id);
      
      if (existingItemIndex !== -1) {
        const item = state.items[existingItemIndex];
        const newId = generateCartItemId(item.productId, newSize);
        
        const duplicateItemIndex = state.items.findIndex(i => i.id === newId);
        
        if (duplicateItemIndex !== -1 && duplicateItemIndex !== existingItemIndex) {
          state.items[duplicateItemIndex].quantity += item.quantity;
          state.items.splice(existingItemIndex, 1);
        } else {
          item.size = newSize;
          item.id = newId;
        }
        
        calculateTotals(state);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
    },
  },
});

export const {
  setCartData,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  updateItemSize,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartQuantity = (state: { cart: CartState }) => state.cart.totalQuantity;
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.subtotal;
export const selectShippingFee = () => 0; // FREE Shipping
export const selectCartMrpTotal = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + (item.originalPrice || item.price) * item.quantity, 0);
};
export const selectDiscountAmount = (state: { cart: CartState }) => {
  return selectCartMrpTotal(state) - state.cart.subtotal;
};
export const selectCartTotal = (state: { cart: CartState }) => {
  return state.cart.subtotal + selectShippingFee();
};

export default cartSlice.reducer;
