import React, { useEffect } from "react";
// import { getSolanaWallet, initializeWallet } from "../../../web3/wallet";

export const MiddleWare: React.FC = ({ children }) => {
  // const wallet = getSolanaWallet();
  useEffect(() => {
    // if (!wallet) {
    // initializeWallet();
    // }
  }, []);

  return <>{children}</>;
};
