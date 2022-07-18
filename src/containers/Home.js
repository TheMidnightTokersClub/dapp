import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, Divider } from "semantic-ui-react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../web3/connectors";
import { Balance } from "../components/WalletConnector";
import Front from "../components/Front";
import {
  weeklyPerToker,
  highestWeeklyEarner,
  totalRewards,
  totalWeeklyReward
} from "../dataConfig/data";

const Home = () => {
  const { chainId, account, activate, active } = useWeb3React();
  const contAddress = "0xfCB4D494013CEa160A447a09230dB84425B2cB04";

  const onButtonClick = () => {
    activate(injectedConnector);
  };
  console.log(active);
  console.log(account);
  console.log(chainId);

  const Wallet = () => {
    return (
      <div>
        <h4>USER ACCOUNT/WALLET DETAILS</h4>
        <Divider />
        {active ? (
          <div>
            <div>ChainId: {chainId}</div>
            <div>Connected Account: {account}</div>
            <div>Contract Addresss: {contAddress}</div>
          </div>
        ) : (
          <Button basic color="green" onClick={onButtonClick}>
            Connect To MetaMask
          </Button>
        )}
        {active && (
          <>
            <Balance />
          </>
        )}
        <Divider />

        <br />
        <div>
          {" "}
          <b>This Weeks Total Rewards</b> : {totalWeeklyReward}
        </div>
        <div>
          {" "}
          <b>This Weeks Reward per Toker</b> : {weeklyPerToker}{" "}
        </div>
        <div>
          {" "}
          <b>This Weeks Highest Return</b> : {highestWeeklyEarner}
        </div>
        <div>
          {" "}
          <b>Total Rewards Dispersed</b> : {totalRewards}{" "}
        </div>
        <br />
        <Divider />
        <br />
        <br />
      </div>
    );
  };

  if (active) {
    return (
      <Grid centered>
        <Grid.Row>
          <Wallet />
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column textAlign="center">
            <Grid.Row>
              <h4>Matic Rewards</h4>
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Button basic color="green" as={Link} to="/Native">
                Disperse Matic
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Grid.Row>
              <h4>Other Rewards (Qi)</h4>
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Button basic color="green" as={Link} to="/Tokens">
                Disperse Tokens
              </Button>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <div>
      <Front onButtonClick={onButtonClick} />
    </div>
  );
};

export default Home;
