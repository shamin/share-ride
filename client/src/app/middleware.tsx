import React, { useEffect } from "react";
import { useShareRide } from "./web3/provider";
import { useHistory } from "react-router-dom";

export const MiddleWare: React.FC = ({ children }) => {
  const history = useHistory();
  const { wallet } = useShareRide();
  useEffect(() => {
    if (!wallet) {
      history.push("/auth");
    }
  }, []);

  return <>{children}</>;
};
