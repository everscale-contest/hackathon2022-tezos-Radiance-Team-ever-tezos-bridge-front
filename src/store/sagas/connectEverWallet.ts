import {call, put, takeLatest} from "redux-saga/effects";

import everRpcClient from "../../lib/everRpcClient";
// import everRpcClient from "../../lib/everRpcClient";
import {HasProviderReturn, RequestPermissionsReturn} from "../../types";
import {
  connect,
  setConnected,
  setConnecting,
  setError,
} from "../reducers/everWallet";

function* connectWalletEver() {
  yield put(setConnecting());

  const has: HasProviderReturn = yield call(
    everRpcClient.hasProvider.bind(everRpcClient),
  );
  if (!has) {
    yield put(setError("Extension is not installed"));
    return;
  }

  yield call(everRpcClient.ensureInitialized.bind(everRpcClient));

  const {accountInteraction}: RequestPermissionsReturn = yield call(
    everRpcClient.requestPermissions.bind(everRpcClient),
    {
      permissions: ["basic", "accountInteraction"],
    },
  );
  if (accountInteraction == null) {
    yield put(setError("Insufficient permissions"));
    return;
  }

  yield put(
    setConnected({
      address: accountInteraction.address.toString(),
      balance: 0,
    }),
  );
}

export default function* connectEverWalletSaga() {
  yield takeLatest(connect, connectWalletEver);
}