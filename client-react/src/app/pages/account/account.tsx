import { Button } from "evergreen-ui";
import React from "react";
import { useShareRide } from "../../web3/provider";
import "./account.scss";

interface AccountProps {}

const Account: React.FC<AccountProps> = (props: AccountProps) => {
  const { loadWallet, wallet, tokenAccount } = useShareRide();

  const initializeWallet = () => {
    loadWallet()
      .then(() => {
        console.log("Complete");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container__account">
      <h1>Account</h1>
      {wallet ? (
        <div>Balance: {tokenAccount?.amount.toNumber()}</div>
      ) : (
        <Button onClick={() => initializeWallet()}>Connect Wallet</Button>
      )}
    </div>
  );
};

export default Account;
