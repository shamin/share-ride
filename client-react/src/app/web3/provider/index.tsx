import React, { createContext, useContext, useMemo, useState } from "react";
import { useCallback } from "react";
import { SolanaWallet } from "./wallet/types";
import { connectWallet } from "./wallet";

interface ShareRideProviderContextType {
  wallet?: SolanaWallet;
  loadWallet: () => Promise<void>;
}

const ShareRideProviderContext = createContext<ShareRideProviderContextType>(
  {} as ShareRideProviderContextType
);

export const useShareRide = () => useContext(ShareRideProviderContext);

interface ShareRideProviderProviderProps {
  children: React.ReactNode;
}

const ShareRideProviderProvider: React.FC<ShareRideProviderProviderProps> = ({
  children,
}: ShareRideProviderProviderProps) => {
  const [wallet, setWallet] = useState<SolanaWallet>();

  const loadWallet = useCallback(async () => {
    const _wallet = await connectWallet();
    setWallet(_wallet);
    console.log("Set wallet");
  }, []);

  const value = useMemo<ShareRideProviderContextType>(
    () => ({
      wallet,
      loadWallet,
    }),
    [wallet]
  );

  return (
    <ShareRideProviderContext.Provider value={value}>
      {children}
    </ShareRideProviderContext.Provider>
  );
};

export default ShareRideProviderProvider;
