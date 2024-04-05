import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthModel } from 'models/page.models';
import { UserModel } from 'models/user.models';
import { AppState } from 'store/type';

export type AuthState = AuthModel | null;
const initialState = null as AuthState;

export const slice = createSlice({
  name: 'authRedux',
  initialState,
  reducers: {
    SaveAuthRedux: (_, action: PayloadAction<AuthModel>) => {
      return action.payload;
    },
    ClearAuthRedux: () => {
      return null;
    },
    UpdateUser: (state, action: PayloadAction<UserModel>) => {
      if (state) state.user = action.payload;
    },
  },
});

export const GetToken = (state: AppState) => state.auth?.token;
export const SelectAuthInfo = (state: AppState) => state.auth?.user;

// Action creators are generated for each case reducer function
export const { SaveAuthRedux, ClearAuthRedux, UpdateUser } = slice.actions;

export default slice.reducer;
