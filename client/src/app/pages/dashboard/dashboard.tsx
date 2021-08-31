import React from "react";
import { useShareRide } from "../../web3/provider";
import { SideBar } from "./components/sidebar";
import "./dashboard.scss";

export const Dashboard: React.FC = ({ children }) => {
  const { tokenAccount } = useShareRide();
  return (
    <div>
      <SideBar />
      <div className="main">
        <div className="topBar">
          <div>Balance: {tokenAccount?.amount.toNumber()} Shere Khan</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
