import React, { useState } from "react";
import { Provider } from "@project-serum/anchor";
import { AccountInfo } from "@solana/spl-token";
import {
  createTokenAccount,
  getTokenAccount,
  mintToTokenAccount,
} from "./tokenAccount";
import { getMintAuthority, mintPublicKey } from "./mint";
import { PublicKey } from "@solana/web3.js";

const TOKEN_ACCOUNT = "TOKEN_ACCOUNT";

const saveToken = (tokenAccount: string) => {
  localStorage.setItem(TOKEN_ACCOUNT, tokenAccount);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_ACCOUNT);
};

export const useTokenAccount = (provider: Provider) => {
  const [tokenAccount, setTokenAccount] = useState<AccountInfo>();

  const loadTokenAccount = async () => {
    console.log("Loading token account");
    let token = getToken();
    if (!token) {
      console.log("Account does not exist creating new one");
      token = (await createTokenAccount(provider, mintPublicKey)).toString();
      saveToken(token);
    }

    const _tokenAccount = await getTokenAccount(
      provider,
      mintPublicKey,
      new PublicKey(token)
    );

    setTokenAccount(_tokenAccount);
    console.log("token account", _tokenAccount);
    return _tokenAccount;
  };

  const mintAmountToTokenAccount = async (amount: number) => {
    if (tokenAccount) {
      await mintToTokenAccount(
        provider,
        mintPublicKey,
        getMintAuthority(),
        tokenAccount.address,
        amount
      );
      await loadTokenAccount()
    }
  };

  return {
    tokenAccount,
    loadTokenAccount,
    mintAmountToTokenAccount
  };
};
