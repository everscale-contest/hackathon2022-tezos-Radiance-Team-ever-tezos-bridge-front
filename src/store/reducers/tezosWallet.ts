import {createSlice} from "@reduxjs/toolkit";

import {RootState, WalletState} from "../../types";

const initialState: WalletState = null as WalletState;

export const tezosWalletSlice = createSlice({
  initialState,
  name: "tezosWallet",
  reducers: {
    connect() {
      // Handled by saga
    },
    disconnect() {
      return null;
    },
  },
});

export const {connect, disconnect} = tezosWalletSlice.actions;

export const selectTezosWallet = (state: RootState) => state.tezosWallet;

export default tezosWalletSlice.reducer;
