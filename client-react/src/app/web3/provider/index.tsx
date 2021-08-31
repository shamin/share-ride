import React, { createContext, useContext, useMemo, useState } from "react";
import { useCallback } from "react";
import { SolanaWallet } from "./wallet/types";
import { connectWallet } from "./wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { Provider as SolanaProvider } from "@project-serum/anchor";
import { ShareRideState, useShareRideState } from "./state";
import { getTokenAccount } from "./account/tokenAccount";
import { mintPublicKey } from "./account/mint";
import { AccountInfo } from "@solana/spl-token";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

interface ShareRideProviderContextType {
  wallet?: SolanaWallet;
  loadWallet: () => Promise<void>;
  shareRideState: ShareRideState;
  tokenAccount?: AccountInfo;
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
  const [tokenAccount, setTokenAccount] = useState<AccountInfo>();

  const loadWallet = useCallback(async () => {
    const _wallet = await connectWallet();
    setWallet(_wallet);
    const provider = new SolanaProvider(
      new Connection(SolanaNetworks.LOCAL),
      _wallet,
      {}
    );
    setProvider(provider);

    const tokenAcc = await getTokenAccount(
      provider,
      mintPublicKey,
      new PublicKey("Fg8GVFCXnxiUo5Xjr2fMTsEN5HYaJN6SYCZWJJT6kYsK") // TODO: Change and retrive this
    );
    setTokenAccount(tokenAcc);
    console.log(tokenAcc.amount.toNumber());

    console.log("Set wallet");
  }, []);

  const shareRideState = useShareRideState(provider);

  const value = useMemo<ShareRideProviderContextType>(
    () => ({
      wallet,
      loadWallet,
      shareRideState,
      tokenAccount,
    }),
    [wallet, shareRideState, tokenAccount]
  );

  return (
    <ShareRideProviderContext.Provider value={value}>
      {children}
    </ShareRideProviderContext.Provider>
  );
};

export default ShareRideProviderProvider;
