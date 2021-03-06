import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {useDispatch} from "react-redux";

import useAppSelector from "../hooks/useAppSelector";
import {TOKEN_DECIMALS} from "../misc/constants";
import {
  prev as prevStep,
  selectCurrentStep,
} from "../store/reducers/currentStep";
import {
  resetValues,
  selectEnteredValues,
} from "../store/reducers/enteredValues";
import {selectEverWallet} from "../store/reducers/everWallet";
import {
  permitTezosToken,
  selectPermissionsLoading,
  selectPermittedTezosTokens,
} from "../store/reducers/permissions";
import {
  deposit,
  resetTransaction,
  selectCurrentTezosEverTransaction,
} from "../store/reducers/tezosEverTransactions";
import {Step} from "../types";

export default function ConfirmTezosEver() {
  const dispatch = useDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const enteredValues = useAppSelector(selectEnteredValues);
  const permittedTezosTokens = useAppSelector(selectPermittedTezosTokens);
  const permissionLoading = useAppSelector(selectPermissionsLoading);
  const everWallet = useAppSelector(selectEverWallet);
  const currentTransaction = useAppSelector(selectCurrentTezosEverTransaction);

  function handleBack() {
    dispatch(prevStep());
  }

  function handleApprove() {
    dispatch(permitTezosToken());
  }

  function handleReset() {
    dispatch(prevStep());
    dispatch(resetValues());
    dispatch(resetTransaction());
  }

  function handleDeposit() {
    if (enteredValues.data && everWallet)
      dispatch(
        deposit({
          amount: enteredValues.data.amount * 10 ** TOKEN_DECIMALS,
          receiver: everWallet.address,
        }),
      );
  }

  if (currentStep !== Step.ConfirmTezosEver || !enteredValues.data) return null;

  const step1Finished = permittedTezosTokens.length !== 0;
  const step21Finished = currentTransaction.opHash;
  const step22Finished = currentTransaction.tezosId;
  const step3Finished = currentTransaction.everId;

  return (
    <Stack spacing={2}>
      <Paper sx={{borderRadius: "40px", p: 4}}>
        <Stack component="ol" spacing={2} sx={{m: 0, p: 0}}>
          <Stack alignItems="flex-start" component="li" spacing={1}>
            {step1Finished ? (
              <Typography>Access to the token has been given</Typography>
            ) : (
              <Typography>
                Approve access by the vault to the selected token
              </Typography>
            )}
            <Button
              disabled={step1Finished}
              endIcon={
                permissionLoading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : null
              }
              onClick={handleApprove}
            >
              Approve
            </Button>
          </Stack>
          <Stack alignItems="flex-start" component="li" spacing={1}>
            {step21Finished && step22Finished ? (
              <Typography>Tokens deposited to the vault</Typography>
            ) : (
              <Typography>Deposit tokens to the vault</Typography>
            )}
            <Button
              disabled={Boolean(step21Finished)}
              endIcon={
                step21Finished && !step22Finished ? (
                  <CircularProgress color="inherit" size={25} />
                ) : null
              }
              onClick={handleDeposit}
            >
              Deposit
            </Button>
          </Stack>
          {step22Finished && (
            <Stack alignItems="flex-start" component="li" spacing={1}>
              {step3Finished ? (
                <Typography>Your tokens have arrived!</Typography>
              ) : (
                <Typography>Waiting for tokens to be received</Typography>
              )}
              {!step3Finished && <CircularProgress />}
            </Stack>
          )}
        </Stack>
      </Paper>
      {currentTransaction.everId ? (
        <Button onClick={handleReset}>Make another transfer</Button>
      ) : (
        <Button onClick={handleBack}>Back</Button>
      )}
    </Stack>
  );
}
