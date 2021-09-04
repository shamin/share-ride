import React, { useState } from "react";
import "./login.scss";
import Logo from "../../../assets/images/logo.png";
import { useHistory } from "react-router-dom";
import { Button } from "evergreen-ui";
import { useShareRide } from "../../web3/provider";

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const history = useHistory();
  const { loadWallet } = useShareRide();

  const login = async () => {
    setLoading(true)
    await loadWallet();
    history.push("/");
  };

  return (
    <div className="container">
      <div className="login">
        <img alt="share ride logo" src={Logo} />
        <h3>Welcome back to Share Ride</h3>
        <p>Ready to go somewhere? Connect your wallet to get started.</p>
        <Button isLoading={loading} onClick={login}>Connect with wallet</Button>
      </div>
    </div>
  );
};
