import "./login.scss";
import Logo from "../../../assets/images/logo.png";
import { useHistory } from "react-router-dom";

export const Login = () => {
  const history = useHistory();
  return (
    <div className="container">
      <div className="login">
        <img alt="share ride logo" src={Logo} />
        <h3>Welcome back to share ride</h3>
        <p>Ready to go somewhere? Connect your wallet to get started.</p>
        <button onClick={() => history.push('/')}>Connect with wallet</button>
      </div>
    </div>
  );
};
