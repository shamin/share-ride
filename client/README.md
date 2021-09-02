# Share ride client

## Design considerations
- Support for phantom wallet.
- Arweave for storing the ride details.
- Escrow for secure token exchange b/w the riders.

## Mint
For the ease of testing mint authority is hardcoded in the client source code. 

### Creating a mint for development

To create a mint public key with our mint authority use the npm script
```sh
npm run create-mint
```

Copy and paste the mint public key to [mint.ts](https://github.com/shamin/share-ride/blob/main/client/src/app/web3/provider/account/mint.ts) file.