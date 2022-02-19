import {TempleWallet} from "@temple-wallet/dapp";
import {call, put, takeLatest} from "redux-saga/effects";

import tezos from "../../lib/tezosRpcClient";
import {CallReturnType} from "../../types";
import {setError} from "../reducers/everWallet";
import {setConnected, setConnecting} from "../reducers/tezosWallet";
import {connect} from "../reducers/tezosWallet";

function* connectTezosWallet() {
  yield put(setConnecting());

  const available: CallReturnType<typeof TempleWallet.isAvailable> = yield call(
    TempleWallet.isAvailable.bind(TempleWallet),
  );
  if (!available) {
    yield put(
      setError(
        "Temple wallet isn't available. Make sure it is installed and unlocked",
      ),
    );
    return;
  }

  const permissions: CallReturnType<typeof TempleWallet.getCurrentPermission> =
    yield call(TempleWallet.getCurrentPermission.bind(TempleWallet));

  const wallet = new TempleWallet("everscale-bridge-front", permissions);
  if (!wallet.connected) {
    yield call(wallet.connect.bind(wallet), "hangzhounet", {
      forcePermission: true,
    });
  }

  tezos.setWalletProvider(wallet);

  if (!wallet.connected) {
    yield put(setError("Wallet wasn't connected"));
    return;
  }

  const pkh: CallReturnType<typeof wallet.getPKH> = yield call(
    wallet.getPKH.bind(wallet),
  );
  if (!pkh) {
    yield put(setError("Wallet wasn't connected"));
    return;
  }

  yield put(
    setConnected({
      address: pkh,
      balance: 0,
    }),
  );
}

export default function* connectTezosWalletSaga() {
  yield takeLatest(connect, connectTezosWallet);
}
