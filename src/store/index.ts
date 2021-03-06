import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";

import currentStep from "./reducers/currentStep";
import enteredValues from "./reducers/enteredValues";
import everTezosTransactions from "./reducers/everTezosTransactions";
import everTokens from "./reducers/everTokens";
import everWallet from "./reducers/everWallet";
import permissions from "./reducers/permissions";
import tezosEverTransactions from "./reducers/tezosEverTransactions";
import tezosTokens from "./reducers/tezosTokens";
import tezosWallet from "./reducers/tezosWallet";
import transfers from "./reducers/transfers";
import checkTezosPermissionsSaga from "./sagas/checkTezosPermissions";
import checkWalletsAvailabilitySaga from "./sagas/checkWalletsAvailability";
import connectEverWallet from "./sagas/connectEverWallet";
import connectTezosWallet from "./sagas/connectTezosWallet";
import depositEverTezosSaga from "./sagas/depositEverTezos";
import depositTezosEverSaga from "./sagas/depositTezosEver";
import fetchEverTokensSaga from "./sagas/fetchEverTokens";
import fetchTezosTokensSaga from "./sagas/fetchTezosTokens";
import fetchTransfersSaga from "./sagas/fetchTransfers";
import requestTezosPermissionSaga from "./sagas/requestTezosPermission";
import subscribeEverSaga from "./sagas/subscribeEver";
import subscribeTezosSaga from "./sagas/subscribeTezos";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  // mount it on the Store
  middleware: [sagaMiddleware],
  reducer: {
    currentStep,
    enteredValues,
    everTezosTransactions,
    everTokens,
    everWallet,
    permissions,
    tezosEverTransactions,
    tezosTokens,
    tezosWallet,
    transfers,
  },
});

// then run the saga
sagaMiddleware.run(function* () {
  yield all([
    checkTezosPermissionsSaga(),
    checkWalletsAvailabilitySaga(),
    connectEverWallet(),
    connectTezosWallet(),
    depositEverTezosSaga(),
    depositTezosEverSaga(),
    fetchEverTokensSaga(),
    fetchTezosTokensSaga(),
    fetchTransfersSaga(),
    requestTezosPermissionSaga(),
    subscribeEverSaga(),
    subscribeTezosSaga(),
  ]);
});

export default store;
