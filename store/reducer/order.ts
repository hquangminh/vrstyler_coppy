import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataOrderActionModel, OrderActionModel, TypeOrderActionModel } from 'store/type';

const initialState: OrderActionModel = {};

export const slice = createSlice({
  name: 'orderRedux',
  initialState,
  reducers: {
    CreateOrderActionRedux: (
      state,
      action: PayloadAction<{ type: TypeOrderActionModel; order?: DataOrderActionModel }>
    ) => {
      state.type = action.payload.type;
      state.order = action.payload.order;
    },
  },
});

// Action creators are generated for each case reducer function
export const { CreateOrderActionRedux } = slice.actions;

export default slice.reducer;
