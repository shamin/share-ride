import React, { createContext, useContext, useMemo, useState } from "react";
import { useCallback } from "react";
import { SolanaWallet } from "./wallet/types";
import { connectWallet } from "./wallet";
import { Connection } from "@solana/web3.js";
import { Provider as SolanaProvider } from "@project-serum/anchor";
import { ShareRideState, useShareRideState } from "./state";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

interface ShareRideProviderContextType {
  wallet?: SolanaWallet;
  loadWallet: () => Promise<void>;
  shareRideState: ShareRideState
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
  const [provider, setProvider] = useState<SolanaProvider>();

  const loadWallet = useCallback(async () => {
    const _wallet = await connectWallet();
    setWallet(_wallet);
    setProvider(
      new SolanaProvider(new Connection(SolanaNetworks.LOCAL), _wallet, {})
    );
    console.log("Set wallet");
  }, []);

  const shareRideState = useShareRideState(provider);

  const value = useMemo<ShareRideProviderContextType>(
    () => ({
      wallet,
      loadWallet,
      shareRideState,
    }),
    [wallet, shareRideState]
  );

  return (
    <ShareRideProviderContext.Provider value={value}>
      {children}
    </ShareRideProviderContext.Provider>
  );
};

export default ShareRideProviderProvider;
