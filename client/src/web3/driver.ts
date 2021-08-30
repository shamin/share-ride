import { Idl, Program, Provider } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { programId } from "./program";
import { getSolanaWallet } from "./wallet";
import shareRideIdl from "./idls/share_ride.json";
import arweaveService from "./arweave/arweave"

class Driver {
  constructor(properties: any) {
    Object.keys(properties).forEach((key) => {
      // @ts-expect-error
      this[key] = properties[key];
    });
  }
}


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
    const wallet  = getSolanaWallet();
    if(!wallet) {
      return;
    }
    this.provider = new Provider(
      new Connection(SolanaNetworks.LOCAL),
      wallet,
      {}
    );
    this.program = new Program(shareRideIdl as Idl, programId, this.provider);
    this.initialize();
  }

  async initialize() {
    if (!this.program || !this.provider) {
      return;
    }
    try {
      await this.getDrivers();
    } catch {
      await this.program.state.rpc.new({
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
    }
  }

  getDrivers() {
    return new Promise(async (resolve, reject) => {
      if (!this.program) {
        return [];
      }
      try {
        const state = await this.program.state.fetch();
        resolve((state as any).drivers);
      } catch (err) {
        reject("State not initialized");
      }
    });
  }

  async addDrivers(driverData: any) {
    if (!this.program || !this.provider) {
      return;
    }
    try {
      const txid = await arweaveService.saveData(driverData);
      console.log("Arweave txid", txid)
      const driver = new Driver({
        archive: txid,
      });
      await this.program.state.rpc.addDriver(driver, {
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
    } catch {
      console.log("Error while adding driver");
    }
  }
}

