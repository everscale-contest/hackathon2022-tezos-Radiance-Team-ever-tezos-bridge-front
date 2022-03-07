import {PayloadAction} from "@reduxjs/toolkit";
import {
  call,
  put,
  SagaReturnType,
  select,
  takeLatest,
} from "redux-saga/effects";

import tezos from "../../lib/tezosRpcClient";
import {VAULT_ADDRESS} from "../../misc/constants";
import {CallReturnType, DepositAction, RootState} from "../../types";
import {debug} from "../../utils/console";
import {fetch as fetchEver} from "../reducers/everTokens";
import {
  deposit,
  setError,
  setLoading,
  setOpHash,
} from "../reducers/tezosEverTransactions";
import {fetch as fetchTezos} from "../reducers/tezosTokens";

function* depositFn(action: PayloadAction<DepositAction>) {
  yield put(setLoading());

  const tezosWallet: SagaReturnType<() => RootState["tezosWallet"]["data"]> =
    yield select((state: RootState) => state.tezosWallet.data);
  if (!tezosWallet) {
    yield put(setError("Tezos wallet not connected"));
    return;
  }

  const tokenContract: CallReturnType<typeof tezos.wallet.at> = yield call(
    tezos.wallet.at.bind(tezos.wallet),
    VAULT_ADDRESS,
  );
  const methodProvider = tokenContract.methodsObject.deposit_to_vault({
    amt_for_deposit: action.payload.amount,
    everscale_receiver: action.payload.receiver.slice(2),
    requests: [{owner: tezosWallet.address, token_id: 0}],
  });

  const op: CallReturnType<typeof methodProvider.send> = yield call(
    methodProvider.send.bind(methodProvider),
  );

  // Refresh balances
  yield put(fetchEver());
  yield put(fetchTezos());

  debug("deposit_operation", op);
  yield put(setOpHash(op.opHash));
}

export default function* depositTezosEverSaga() {
  yield takeLatest(deposit, depositFn);
}
