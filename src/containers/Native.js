import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Form,
  TextArea,
  Button,
  Grid,
  Divider,
  Header
} from "semantic-ui-react";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../web3/connectors";
import disperse from "../contracts/Disperse.json";
import { DISPERSEABI } from "../assets/disperse";

const UNIT = 1000000000000000000;
const address = "0xfCB4D494013CEa160A447a09230dB84425B2cB04";

const Native = () => {
  const [textValue, setTextValue] = useState("");
  const { chainId, account, activate, active } = useWeb3React();
  const [currency, setCurrency] = useState("");
  const ph =
    "(Toker Wallet Address) (Reward)\n" +
    "0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a 20\n" +
    "0x141ca95b6177615fb1417cf70e930e102bf8f584 25";

  const onButtonClick = () => {
    activate(injectedConnector);
  };

  const handleChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleClick = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let tempArray = textValue.valueOf().split(/[\s,;:\t\r\n]+/);

    let oddArray = tempArray.filter((v, i) => i % 2);
    let evenArray = tempArray.filter((v, i) => !(i % 2));

    let addArray = [];
    let amtArray = [];
    let total = 0.0;

    for (let i = 0; i < evenArray.length; ++i) {
      if (!isNaN(oddArray[i]) && parseFloat(oddArray[i]) > 0.0) {
        addArray.push(evenArray[i].trim());
        amtArray.push((oddArray[i] * UNIT).toString());
        total += parseFloat(oddArray[i]);
      }
    }

    const disperseContract = new ethers.Contract(
      address,
      disperse.abi,
      provider
    );
    const disperseSigned = disperseContract.connect(signer);

    let overrides = { value: ethers.utils.parseEther(total.toString()) };

    if (addArray.length === amtArray.length && addArray.length > 0) {
      let tx = await disperseSigned.tokerRewardsEth(
        addArray,
        amtArray,
        overrides
      );
    } else {
      alert("Please enter at least one valid transaction");
    }
  };

  useEffect(() => {
    if (chainId === 137) {
      setCurrency("MATIC");
    } else if (chainId === 1) {
      setCurrency("ETHEREUM");
    }
  }, [chainId]);

  if ((chainId === 137 || chainId === 1) && active) {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={10}>
            <Form>
              <Form.Field>
                <Header as="h2">
                  <Header.Content>Disperse {currency}</Header.Content>
                </Header>
                <Divider />
              </Form.Field>
              <Form.Field>
                <p>
                  Please enter each Toker address in a new line followed by a
                  separator (comma,colon or blank space) and then the amount.
                  <Divider />
                  Connected Contract: 0xfCB4D494013CEa160A447a09230dB84425B2cB04
                </p>
              </Form.Field>
              <Divider />
              <Form.Field>
                <TextArea placeholder={ph} onChange={handleChange} />
              </Form.Field>
              <Divider />
              <Form.Field>
                <Button basic color="green" onClick={handleClick}>
                  Disperse
                </Button>
              </Form.Field>
            </Form>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  } else {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={10}>
            <Grid.Row>
              {!(chainId === 137 || chainId === 1) ? (
                <div>
                  <p>
                    This DAPP was created for The Midnight Tokers Club Rewards.{" "}
                  </p>
                </div>
              ) : (
                <div></div>
              )}
            </Grid.Row>
            <Grid.Row>
              {!active ? (
                <Button basic color="green" onClick={onButtonClick}>
                  Connect To MetaMask
                </Button>
              ) : (
                <div></div>
              )}
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
};

export default Native;
