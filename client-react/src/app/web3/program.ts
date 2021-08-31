import { Program, Provider, Idl } from "@project-serum/anchor";
import shareRideIdl from "./idls/share_ride.json";

const loadProgram = (provider: Provider, idl: any) => {
  console.log("Loading program", idl)
  return new Program(idl as Idl, idl.metadata.address, provider);
};

// export const loadEscrowProgram = (provider: Provider) => {
//   return new Program(escrowIdl as Idl, escrowIdl.metadata.address, provider);
//   return loadProgram()
// };

export const loadShareRideProgram = (provider: Provider) => {
  return loadProgram(provider, shareRideIdl);
};
