import { createSlice } from '@reduxjs/toolkit';
import { AppStateModal } from 'store/type';

const initialState: AppStateModal = {
  search: false,
  cartPreview: false,
  menuMobile: false,
  menuAvatar: false,
  sellerRegister: false,
  isCloseBanner: false,
};

export const slice = createSlice({
  name: 'modalRedux',
  initialState,
  reducers: {
    OpenCart: (state) => {
      state.cartPreview = true;
    },
    CloseCart: (state) => {
      state.cartPreview = false;
    },
    OpenSearch: (state) => {
      state.search = true;
    },
    CloseSearch: (state) => {
      state.search = false;
    },
    OpenMenuMobile: (state) => {
      state.menuMobile = true;
    },
    CloseMenuMobile: (state) => {
      state.menuMobile = false;
    },
    OpenMenuAvatar: (state) => {
      state.menuAvatar = true;
    },
    CloseMenuAvatar: (state) => {
      state.menuAvatar = false;
    },
    OpenSellerRegister: (state) => {
      state.sellerRegister = true;
    },
    CloseSellerRegister: (state) => {
      state.sellerRegister = false;
    },
    CloseBanner: (state) => {
      state.isCloseBanner = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  OpenCart,
  CloseCart,
  OpenSearch,
  CloseSearch,
  OpenMenuMobile,
  CloseMenuMobile,
  OpenMenuAvatar,
  CloseMenuAvatar,
  OpenSellerRegister,
  CloseSellerRegister,
  CloseBanner,
} = slice.actions;

export default slice.reducer;
