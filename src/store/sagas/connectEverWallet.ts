import BigNumber from "bignumber.js";
import {call, put, takeLatest} from "redux-saga/effects";

import {getBalance} from "../../lib/everApiClient";
import everRpcClient from "../../lib/everRpcClient";
import {CallReturnType} from "../../types";
import {
  connect,
  setConnected,
  setConnecting,
  setError,
} from "../reducers/everWallet";

function* connectWalletEver() {
  yield put(setConnecting());

  const has: CallReturnType<typeof everRpcClient.hasProvider> = yield call(
    everRpcClient.hasProvider.bind(everRpcClient),
  );
  if (!has) {
    yield put(setError("Extension is not installed"));
    return;
  }

  yield call(everRpcClient.ensureInitialized.bind(everRpcClient));

  const {
    accountInteraction,
  }: CallReturnType<typeof everRpcClient.requestPermissions> = yield call(
    everRpcClient.requestPermissions.bind(everRpcClient),
    {
      permissions: ["basic", "accountInteraction"],
    },
  );
  if (accountInteraction == null) {
    yield put(setError("Insufficient permissions"));
    return;
  }
  const {
    data: {
      data: {
        accounts: [{balance}],
      },
    },
  }: CallReturnType<typeof getBalance> = yield call(
    getBalance,
    accountInteraction.address.toString(),
  );

  yield put(
    setConnected({
      address: accountInteraction.address.toString(),
      balance: new BigNumber(balance, 16).div(1e9).dp(3).toNumber(),
    }),
  );
}

export default function* connectEverWalletSaga() {
  yield takeLatest(connect, connectWalletEver);
}
