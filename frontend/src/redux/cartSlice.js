import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: []
  },
  reducers: {
    addCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if(item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if(item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    removeFromCart: (state, action) => {
      state.items.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { addCart , removeFromCart , increaseQuantity , decreaseQuantity , clearCart} = cartSlice.actions;

export default cartSlice.reducer;