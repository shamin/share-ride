import { Program, Provider, Idl } from "@project-serum/anchor";
import shareRideIdl from "./idls/share_ride.json";
import escrowIdl from "./idls/escrow-idl.json";

const loadProgram = (provider: Provider, idl: any) => {
  console.log("Loading program", idl);
  return new Program(idl as Idl, idl.metadata.address, provider);
};

export const loadEscrowProgram = (provider: Provider) => {
  return loadProgram(provider, escrowIdl);
};

export const loadShareRideProgram = (provider: Provider) => {
  return loadProgram(provider, shareRideIdl);
};
