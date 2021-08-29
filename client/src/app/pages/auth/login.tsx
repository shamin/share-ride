import "./login.scss";
import Logo from "../../../assets/images/logo.png";
import { useHistory } from "react-router-dom";
import { connectWallet, getSolanaWallet, WalletType } from "../../../solana/wallet";
import { Button } from "evergreen-ui";
import { useEffect } from "react";

export const Login = () => {
  const history = useHistory();

  const initializeWallet = async () => {
    await connectWallet(WalletType.PHANTOM);
    history.push('/')
  }

  return (
    <div className="container">
      <div className="login">
        <img alt="share ride logo" src={Logo} />
        <h3>Welcome back to share ride</h3>
        <p>Ready to go somewhere? Connect your wallet to get started.</p>
        <Button onClick={() => initializeWallet()}>Connect with wallet</Button>
      </div>
    </div>
  );
};
