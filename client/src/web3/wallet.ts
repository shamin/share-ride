/* eslint-disable no-case-declarations */
import { WalletAdapter } from './types'
import { PhantomWalletAdapter } from './phantom'
import Wallet from '@project-serum/sol-wallet-adapter'
export enum WalletType {
  PHANTOM,
  SOLLET
}
let _wallet: WalletAdapter
const getSolanaWallet = (): WalletAdapter | null => {
  if (_wallet) {
    return _wallet
  }
  return null;
}
// Here we will pass wallet type right
const connectWallet = async (wallet: WalletType): Promise<WalletAdapter> => {
  return await new Promise(resolve => {
    switch (wallet) {
      case WalletType.PHANTOM:
        _wallet = new PhantomWalletAdapter()
        _wallet.on('connect', () => {
          resolve(_wallet)
        })
        _wallet.connect()
        break
      case WalletType.SOLLET:
        const providerUrl = 'https://www.sollet.io'
        // @ts-expect-error
        _wallet = new Wallet(providerUrl) as WalletAdapter

        _wallet.on('connect', () => {
          resolve(_wallet)
        })
        _wallet.connect()
        break

      default:
        _wallet = new PhantomWalletAdapter()
        _wallet.on('connect', () => {
          resolve(_wallet)
        })
        _wallet.connect()
        break
    }
  })
}

const disconnectWallet = () => {
  if (_wallet) {
    _wallet.disconnect()
  }
}

const initializeWallet = async () => {
  await connectWallet(WalletType.PHANTOM);
}

export { getSolanaWallet, connectWallet, disconnectWallet, initializeWallet }
