import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CouponModel, ProductCartModel } from 'models/checkout.models';
import { AppState, CartReduxModel } from 'store/type';

const initialState: CartReduxModel = {};

export const slice = createSlice({
  name: 'cartRedux',
  initialState,
  reducers: {
    GetCart: (state, action: PayloadAction<ProductCartModel[]>) => {
      state.products = action.payload;
    },
    AddProductCartRedux: (state, action: PayloadAction<ProductCartModel>) => {
      let productsCart = [...(state.products ?? [])];
      productsCart.unshift(action.payload);
      return { ...state, products: productsCart };
    },
    RemoveProductCartRedux: (state, action: PayloadAction<string>) => {
      let productsCart = [...(state.products ?? [])];
      const index = productsCart.findIndex((i) => i.id === action.payload);
      productsCart.splice(index, 1);
      return { ...state, products: productsCart };
    },
    ResetCartRedux: (state) => {
      state.products = undefined;
    },
    ApplyCouponRedux: (state, action: PayloadAction<CouponModel>) => {
      state.coupon = action.payload;
    },
    RemoveCouponRedux: (state) => {
      delete state.coupon;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  GetCart,
  AddProductCartRedux,
  RemoveProductCartRedux,
  ResetCartRedux,
  ApplyCouponRedux,

  RemoveCouponRedux,
} = slice.actions;

export const isExistInCart = (state: AppState, productId: string) =>
  state.cart.products?.some((i) => i.market_item.id === productId);

export default slice.reducer;
