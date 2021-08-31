import { Button, TextInput } from "evergreen-ui";
import React, { useState } from "react";
import { useShareRide } from "../../web3/provider";
import "./account.scss";

interface AccountProps {}

const Account: React.FC<AccountProps> = (props: AccountProps) => {
  const {
    loadWallet,
    wallet,
    tokenAccount,
    intializeEscrow,
    exchangeEscrow,
    mintAmountToTokenAccount,
  } = useShareRide();
  const [amount, setAmount] = useState("");

  const initializeWallet = () => {
    loadWallet()
      .then(() => {
        console.log("Complete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const transactToken = async () => {
    const token = await intializeEscrow();
  };

  const creditToken = async () => {
    const token = await exchangeEscrow();
  };

  const mintToken = async () => {
    const tokenAmount = parseInt(amount) || 0;
    if (tokenAmount > 0) {
      mintAmountToTokenAccount(tokenAmount);
    }
  };

  return (
    <div className="container__account">
      <h1>Account</h1>
      {wallet ? (
        <div>Balance: {tokenAccount?.amount.toNumber()} Shere Khan</div>
      ) : (
        <Button onClick={() => initializeWallet()}>Connect Wallet</Button>
      )}
      <div>
        <h3>Credit Account</h3>
        <TextInput
          name="text-input"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e: any) => {
            setAmount(e.target.value);
          }}
        />
        <Button marginLeft={10} onClick={() => mintToken()}>
          Add Tokens
        </Button>
      </div>
      <div>
        <Button marginTop={20} onClick={() => transactToken()}>Transact Token</Button>
      </div>
      <div>
        <Button marginTop={20} onClick={() => creditToken()}>Credit Token</Button>
      </div>
    </div>
  );
};

export default Account;
