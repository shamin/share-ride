import { Program, Provider } from "@project-serum/anchor";
import { Ride } from ".";
import { loadShareRideProgram } from "../../program";
import ArweaveService, { ArweaveDriver } from "./arweave";

const DUMMY_TX_ID = "___________________________________________";

class Driver {
  constructor(properties: any) {
    Object.keys(properties).forEach((key) => {
      // @ts-expect-error
      this[key] = properties[key];
    });
  }
}

interface State {
  drivers: any;
}

export class ShareRideModel {
  provider: Provider;
  program: Program;
  arweaveService: ArweaveService;

  constructor(provider: Provider) {
    this.provider = provider;
    this.program = loadShareRideProgram(provider);
    this.arweaveService = new ArweaveService();
  }

  async initialize() {
    try {
      const drivers = await this.getActiveDrivers();
      const rides = await this.getActiveRides();
      return {
        drivers,
        rides,
      };
    } catch (err) {
      console.log("Error getting drivers", err);
      console.log(
        "Initializing new state",
        this.provider.wallet.publicKey.toString()
      );
      await this.program.state.rpc.new({
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
      return {
        drivers: [],
        rides: [],
      };
    }
  }

  getAllDrivers() {
    return new Promise(async (resolve, reject) => {
      try {
        const state = (await this.program.state.fetch()) as State;
        console.log("Getting state", state.drivers);
        resolve(state.drivers);
      } catch (err) {
        reject("State not initialized");
      }
    });
  }

  async getActiveDrivers() {
    const drivers = await this.getAllDrivers();
    console.log(drivers);
    const filteredDrivers = (drivers as ArweaveDriver[]).filter(
      ({ archive }: any) => archive !== DUMMY_TX_ID
    );
    console.log(filteredDrivers);
    const driverData = await this.arweaveService.getData(filteredDrivers);
    console.log(driverData);
    return driverData;
  }

  async addDrivers(driverData: any) {
    try {
      const txid = await this.arweaveService.saveData(driverData);
      console.log("Arweave txid", txid);
      const driver = new Driver({
        archive: txid,
      });
      await this.program.state.rpc.addDriver(driver, {
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
    } catch (err) {
      console.log("Error while adding driver", err);
    }
  }

  getAllRides() {
    return new Promise(async (resolve, reject) => {
      try {
        const state = await this.program.state.fetch();
        resolve((state as any).rides);
      } catch (err) {
        reject("State not initialized");
      }
    });
  }

  async getActiveRides() {
    const drivers = await this.getAllRides();
    const filteredRides = (drivers as ArweaveDriver[]).filter(
      ({ archive }) => archive !== DUMMY_TX_ID
    );
    const ridesData = (await this.arweaveService.getData(filteredRides)) as Ride[];
    return ridesData;
  }

  async addRides(rideData: any) {
    try {
      const txid = await this.arweaveService.saveData(rideData);
      console.log("Arweave txid", txid);
      const driver = new Driver({
        archive: txid,
      });
      await this.program.state.rpc.addRide(driver, {
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
    } catch {
      console.log("Error while adding ride");
    }
  }

  async removeDriver(archiveId: string) {
    try {
      const driver = new Driver({
        archive: archiveId,
      });
      await this.program.state.rpc.removeDriver(driver, {
        accounts: {
          authority: this.provider.wallet.publicKey,
        },
      });
    } catch {
      console.log("Error while removing ride");
    }
  }
}
