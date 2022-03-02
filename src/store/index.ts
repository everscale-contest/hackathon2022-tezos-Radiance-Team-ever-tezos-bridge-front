import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";

import currentStep from "./reducers/currentStep";
import enteredValues from "./reducers/enteredValues";
import everTokens from "./reducers/everTokens";
import everWallet from "./reducers/everWallet";
import permissions from "./reducers/permissions";
import tezosTokens from "./reducers/tezosTokens";
import tezosWallet from "./reducers/tezosWallet";
import transactions from "./reducers/transactions";
import checkTezosPermissionsSaga from "./sagas/checkTezosPermissions";
import checkWalletsAvailabilitySaga from "./sagas/checkWalletsAvailability";
import connectEverWallet from "./sagas/connectEverWallet";
import connectTezosWallet from "./sagas/connectTezosWallet";
import depositSaga from "./sagas/deposit";
import fetchEverTokensSaga from "./sagas/fetchEverTokens";
import fetchTezosTokensSaga from "./sagas/fetchTezosTokens";
import requestTezosPermissionSaga from "./sagas/requestTezosPermission";
import subscribeToDepositSaga from "./sagas/subscribeToDeposit";
import subscribeToReceiveSaga from "./sagas/subscribeToReceive";

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  // mount it on the Store
  middleware: [sagaMiddleware],
  reducer: {
    currentStep,
    enteredValues,
    everTokens,
    everWallet,
    permissions,
    tezosTokens,
    tezosWallet,
    transactions,
  },
});

// then run the saga
sagaMiddleware.run(function* () {
  yield all([
    checkTezosPermissionsSaga(),
    checkWalletsAvailabilitySaga(),
    connectEverWallet(),
    connectTezosWallet(),
    depositSaga(),
    fetchEverTokensSaga(),
    fetchTezosTokensSaga(),
    requestTezosPermissionSaga(),
    subscribeToDepositSaga(),
    subscribeToReceiveSaga(),
  ]);
});

export default store;
