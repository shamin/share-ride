import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCallback } from "react";
import { SolanaWallet } from "./wallet/types";
import { connectWallet } from "./wallet";
import { Connection, PublicKey } from "@solana/web3.js";
import { Provider, Provider as SolanaProvider } from "@project-serum/anchor";
import { ShareRideState, useShareRideState } from "./state";
import { AccountInfo } from "@solana/spl-token";
import { intializeEscrow } from "./account/escrow";
import { useTokenAccount } from "./account";

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
  intializeEscrow: () => Promise<PublicKey> | undefined;
  mintAmountToTokenAccount: (amount: number) => Promise<void>
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
  // const [tokenAccount, setTokenAccount] = useState<AccountInfo>();
  const { tokenAccount, loadTokenAccount, mintAmountToTokenAccount } = useTokenAccount(
    provider as Provider
  );

  const loadWallet = useCallback(async () => {
    const _wallet = await connectWallet();
    setWallet(_wallet);
    const provider = new SolanaProvider(
      new Connection(SolanaNetworks.LOCAL),
      _wallet,
      {}
    );
    setProvider(provider);
    console.log("Set wallet");
  }, []);

  useEffect(() => {
    if (provider && !tokenAccount) {
      loadTokenAccount();
    }
  }, [provider]);

  const shareRideState = useShareRideState(provider);

  const _intializeEscrow = () => {
    if (provider && tokenAccount) {
      return intializeEscrow(provider, tokenAccount);
    }
  };

  const value = useMemo<ShareRideProviderContextType>(
    () => ({
      wallet,
      loadWallet,
      shareRideState,
      tokenAccount,
      intializeEscrow: _intializeEscrow,
      mintAmountToTokenAccount,
    }),
    [wallet, shareRideState, tokenAccount, provider]
  );

  return (
    <ShareRideProviderContext.Provider value={value}>
      {children}
    </ShareRideProviderContext.Provider>
  );
};

export default ShareRideProviderProvider;
