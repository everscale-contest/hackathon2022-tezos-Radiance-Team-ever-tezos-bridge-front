import {Box, Container, CssBaseline} from "@mui/material";
import {useEffect} from "react";

import Header from "./components/Header";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import StepIndicator from "./components/StepIndicator";
import Subheader from "./components/Subheader";
import useAppDispatch from "./hooks/useAppDispatch";
import useAppSelector from "./hooks/useAppSelector";
import {fetch as fetchEverTokens} from "./store/reducers/everTokens";
import {selectEverWallet} from "./store/reducers/everWallet";
import {getTezosPermissions} from "./store/reducers/permissions";
import {fetch as fetchTezosTokens} from "./store/reducers/tezosTokens";
import {selectTezosWallet} from "./store/reducers/tezosWallet";
import {
  subscribeDeposit,
  subscribeReceive,
} from "./store/reducers/transactions";

export default function App() {
  const dispatch = useAppDispatch();
  const everWallet = useAppSelector(selectEverWallet);
  const tezosWallet = useAppSelector(selectTezosWallet);

  useEffect(() => {
    if (everWallet) {
      dispatch(fetchEverTokens());
      dispatch(subscribeReceive());
    }
  }, [everWallet, dispatch]);

  useEffect(() => {
    if (tezosWallet) {
      dispatch(fetchTezosTokens());
      dispatch(getTezosPermissions());
      dispatch(subscribeDeposit());
    }
  }, [tezosWallet, dispatch]);

  return (
    <>
      <CssBaseline />
      <Container>
        <Header />
        <Box sx={{mb: 2}}>
          <Subheader sx={{mb: 1}} />
          <StepIndicator />
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Step1 />
        <Step2 />
      </Container>
    </>
  );
}
