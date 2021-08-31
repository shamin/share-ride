import React, { useEffect } from "react";
import "./login.scss";
import Logo from "../../../assets/images/logo.png";
import { useHistory } from "react-router-dom";
// import { initializeWallet, WalletType } from "../../../web3/wallet";
import { Button } from "evergreen-ui";

export const Login = () => {
  const history = useHistory();



  useEffect(() => {
    const initialize = async() => {
      // await initializeWallet();
      // history.push('/');
    }
    initialize();
  }, [])

  return (
    <div className="container">
      <div className="login">
        <img alt="share ride logo" src={Logo} />
        <h3>Welcome back to share ride</h3>
        <p>Ready to go somewhere? Connect your wallet to get started.</p>
        <Button>Connect with wallet</Button>
      </div>
    </div>
  );
};
