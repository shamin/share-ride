import { Program, Provider } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { programId } from "./program";
import { connectWallet, getSolanaWallet, WalletType } from "./wallet";
import { useState } from "react";

enum SolanaNetworks {
  DEV = "https://api.devnet.solana.com",
  TEST = "https://api.testnet.solana.com",
  MAIN = "https://api.mainnet-beta.solana.com",
  LOCAL = "http://127.0.0.1:8899",
}

export class DriversSolana {
  provider?: Provider;

  program?: Program;

  constructor() {
    this.provider = new Provider(
      new Connection(SolanaNetworks.LOCAL),
      getSolanaWallet(),
      {}
    );

    // https://explorer.solana.com/address/A5ws9phjEaNwrSjzGkRRxH53QDzmaJuQY1xompPpBwXf?cluster=devnet
    this.program = new Program(require("./idl.json"), programId, this.provider);
    this.initialize();
  }

  async initialize() {
    if (!this.program || !this.provider) {
      return;
    }
    console.log("initializing");
    console.log(this.provider.wallet.publicKey);
    try {
      await this.program.state.rpc.new({
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
      console.log(this.program);
    } catch (err) {
      console.log(this.program);
    }
  }

  async getDrivers() {
    if (!this.program) {
      return [];
    }
    const state = await this.program.state.fetch();
    return (state as any).drivers;
  }
}

export const useDrivers = (setInitialized: any) => {
  const [drivers, setDrivers] = useState([]);
  let driversInstance: any;

  const initialize = async () => {
    await connectWallet(WalletType.SOLLET);
    driversInstance = new DriversSolana();
  };

  const getDrivers = async () => {
    if (!driversInstance) {
      await initialize();
    }
    const drivers = await driversInstance.getDrivers();
    setDrivers(drivers);
  };

  return {
    initialize,
    getDrivers,
    drivers,
  };
};
