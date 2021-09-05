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
import { exchangeEscrow, intializeEscrow } from "./account/escrow";
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
  intializeEscrow: any;
  exchangeEscrow: () => void;
  mintAmountToTokenAccount: (amount: number) => Promise<void>;
  loadingText: string;
  completeRide: (rideId: string) => Promise<void>;
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
  const [loadingText, _setLoadingText] = useState("");
  const [provider, setProvider] = useState<SolanaProvider>();
  // const [tokenAccount, setTokenAccount] = useState<AccountInfo>();

  const setLoadingText = (loading: string) => {
    _setLoadingText(loading);
  };

  const { tokenAccount, loadTokenAccount, mintAmountToTokenAccount, tokenAccountCreateLoading } =
    useTokenAccount(provider as Provider, setLoadingText);

  const loadWallet = useCallback(async () => {
    const _wallet = await connectWallet();
    setWallet(_wallet);
    const provider = new SolanaProvider(
      new Connection(SolanaNetworks.DEV),
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

  const shareRideState = useShareRideState(
    provider,
    tokenAccount,
    setLoadingText
  );

  const _intializeEscrow = () => {
    if (provider && tokenAccount) {
      // return intializeEscrow(provider, tokenAccount);
    }
  };

  const _exchangeEscrow = () => {
    if (provider && tokenAccount) {
      // return exchangeEscrow(provider, tokenAccount);
    }
  };

  const completeRide = async (driverId: string) => {
    const rides = shareRideState.rides.filter(
      ({ driveId }) => driveId === driverId
    );
    console.log("Complete ride", rides);

    console.log("Remove driver", driverId);
    console.log(
      "Remove rides",
      rides.map((r) => r.archiveId)
    );
    setLoadingText("Transfering sherekhans to your account");

    if (provider && tokenAccount) {
      await Promise.all(
        rides.map(async (r) => {
          await exchangeEscrow(provider, tokenAccount, r.escrow);
        })
      );
    }

    setLoadingText("Reloading token account");
    await loadTokenAccount();
    await shareRideState.removeDriver(driverId);
    setLoadingText("Reloading rides");
    await shareRideState.loadDrivers();
  };

  const value = useMemo<ShareRideProviderContextType>(
    () => ({
      wallet,
      loadWallet,
      shareRideState,
      tokenAccount,
      intializeEscrow: _intializeEscrow,
      exchangeEscrow: _exchangeEscrow,
      mintAmountToTokenAccount,
      loadingText: tokenAccountCreateLoading ? "Creating token account" : loadingText,
      completeRide,
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
