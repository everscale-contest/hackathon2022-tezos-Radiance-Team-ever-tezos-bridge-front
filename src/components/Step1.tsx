import {Box, Button, Stack} from "@mui/material";
import {useDispatch} from "react-redux";

import useAppSelector from "../hooks/useAppSelector";
import {
  next as nextStep,
  selectCurrentStep,
} from "../store/reducers/currentStep";
import { selectEverTokens } from "../store/reducers/everTokens";
import {connect as connectEver} from "../store/reducers/everWallet";
import { selectTezosTokens } from "../store/reducers/tezosTokens";
import {connect as connectTezos} from "../store/reducers/tezosWallet";
import SwapButton from "./SwapButton";
import TokenInput from "./TokenInput";

export default function Step1() {
  const dispatch = useDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const everTokens = useAppSelector(selectEverTokens);
  const tezosTokens = useAppSelector(selectTezosTokens);

  if (currentStep !== 1) return null;

  function handleConnectTezosWallet() {
    dispatch(connectTezos());
  }

  function handleConnectEverWallet() {
    dispatch(connectEver());
  }

  return (
    <Stack spacing={2}>
      <TokenInput
        label="From (Tezos)"
        onConnectWallet={handleConnectTezosWallet}
        onSelectToken={() => {}}
        tokens={tezosTokens}
      />
      <Box sx={{display: "flex", justifyContent: "center"}}>
        <SwapButton />
      </Box>
      <TokenInput
        label="To (Everscale)"
        onConnectWallet={handleConnectEverWallet}
        onSelectToken={() => {}}
        tokens={everTokens}
      />
      <Button
        onClick={() => {
          dispatch(nextStep());
        }}
      >
        Next
      </Button>
    </Stack>
  );
}
