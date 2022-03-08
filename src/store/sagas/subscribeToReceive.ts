import {abiContract, AbiModule} from "@eversdk/core";
import {Address, Contract} from "everscale-inpage-provider";
import {channel} from "redux-saga";
import {call, put, select, takeEvery, takeLatest} from "redux-saga/effects";

import everRpcClient from "../../lib/everRpcClient";
import client from "../../lib/everWSClient";
import {EVER_DECIMALS, TOKEN_PROXY_ADDRESS} from "../../misc/constants";
import {TokenProxy} from "../../misc/ever-abi";
import {CallReturnType, RootState} from "../../types";
import {debug} from "../../utils/console";
import {fetch as fetchEverTokens} from "../reducers/everTokens";
import {setEverId, subscribeReceive} from "../reducers/tezosEverTransactions";
import {fetch as fetchTezosTokens} from "../reducers/tezosTokens";

const callbackChannel = channel();

function* subscribeToReceive() {
  const abiModule = new AbiModule(client);

  const id: CallReturnType<typeof client.net.subscribe_collection> = yield call(
    client.net.subscribe_collection.bind(client.net),
    {
      collection: "messages",
      filter: {
        dst: {eq: TOKEN_PROXY_ADDRESS},
      },
      result: "id boc",
    },
    (d, responseType) => {
      debug("ever_callback", {d, responseType});
      abiModule
        .decode_message({
          abi: abiContract(TokenProxy as any),
          message: d.result.boc,
        })
        .then((r) => callbackChannel.put(r));
    },
  );

  debug("ever_subscribe_id", id);

  yield takeEvery(callbackChannel, function* (r: any) {
    debug("ever_encoded_callback", r);

    // Check if it is callback
    if (r.name !== "transferTokenCallback") return;

    // Decode callback
    const proxyContract = new Contract(
      everRpcClient,
      TokenProxy,
      new Address(TOKEN_PROXY_ADDRESS),
    );
    const proxyCall = proxyContract.methods.decodeTezosEventData({
      data: r.value.data,
    });
    const proxyRes: CallReturnType<typeof proxyCall.call> = yield call(
      proxyCall.call.bind(proxyCall),
      {},
    );
    const resRecipient = "0:" + BigInt(proxyRes.recipient).toString(16);
    const resAmount = +proxyRes.amount / 10 ** EVER_DECIMALS;
    debug("ever_decoded_callback", {resAmount, resRecipient});

    const everAddr: string = yield select(
      (state: RootState) => state.everWallet.data?.address,
    );
    const enteredAmount: number = yield select(
      (state: RootState) => state.enteredValues.data?.amount,
    );
    debug("local_data_for_receiver", {enteredAmount, everAddr});

    if (resRecipient === everAddr && resAmount === enteredAmount) {
      yield put(setEverId(Math.random()));

      // Refetch tokens
      yield put(fetchTezosTokens());
      yield put(fetchEverTokens());
    }
  });
}

export default function* subscribeToReceiveSaga() {
  yield takeLatest(subscribeReceive, subscribeToReceive);
}
