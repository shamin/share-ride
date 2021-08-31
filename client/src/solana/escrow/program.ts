import { Program, Provider, Idl } from "@project-serum/anchor";
import escrowIdl from "./escrow-idl.json";

export const loadEscrowProgram = (provider: Provider) => {
  return new Program(escrowIdl as Idl, escrowIdl.metadata.address, provider);
};
