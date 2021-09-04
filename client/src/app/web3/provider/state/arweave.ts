import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import TestWeave from "testweave-sdk";
import WalletJson from "./wallet.json";

export type ArweaveDriver = {
  archive: string;
};

class ArweaveService {
  arweave: Arweave;
  testWeave?: TestWeave;
  walletKey?: JWKInterface;
  isLocal = false;

  constructor({ localhost = false }: { localhost?: boolean }) {
    this.isLocal = localhost;
    if (localhost) {
      this.arweave = Arweave.init({
        host: "localhost",
        port: 1984,
        protocol: "http",
      });

      TestWeave.init(this.arweave).then((testWeave: any) => {
        this.testWeave = testWeave;
        this.walletKey = this.testWeave?.rootJWK;
      });
    } else {
      this.arweave = Arweave.init({
        host: 'arweave.net'
      });
      this.walletKey = WalletJson;
    }
  }

  async saveData(message: unknown): Promise<string> {
    console.log("Saving data to arweave");
    const transaction = await this.arweave.createTransaction(
      { data: JSON.stringify(message) },
      this.walletKey!
    );
    // transaction.addTag("Content-Type", "text/plain");
    await this.arweave.transactions.sign(transaction, this.walletKey!);
    await this.arweave.transactions.post(transaction);
    console.log("posted transaction", transaction);
    if (this.isLocal) {
      console.log("forced mine");
      await this.testWeave!.mine(); // need this to force immediate mine of related block
    }
    const status = await this.arweave.transactions.getStatus(transaction.id);
    console.log("saveData status", status);
    return transaction.id;
  }

  async getData(drivers: Array<ArweaveDriver>): Promise<Array<unknown>> {
    const arweaveData = drivers.map(async ({ archive }) => {
      try {
        const data = await this.arweave.transactions.getData(archive, {
          decode: true,
          string: true,
        });
        return { ...JSON.parse(data?.toString()), archiveId: archive };     
      } catch(err) {
        return null
      }
    });
    const data = await Promise.all(arweaveData);
    return data.filter((d)=>d!==null)
  }
}

export default ArweaveService;
