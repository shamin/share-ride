## Share Ride

A decentralized and fully transparent ride-sharing dapp.

The app is deployed at [https://share-ride.surge.sh/](https://share-ride.surge.sh/)

## Features

Some of the main features of Share Ride

### Custom secure token for transaction

Share ride uses custom token sherekhan (share ride coin) for transactions through Solana block chain. The driver can then convert this token for sol coins or can use the token to do transactions within share ride.

### Fast, secure and easy authentication

Users can use phantom wallet to signin /signup to the app. You just need to connect your wallet to get started with the project.

### Data security and privacy

We are storing all the data in the blockchain including user's data and ride details. We are using arweave to store all our raw data and the arweave transaction ids are stored to the user's program account so that they can be retrieved easily and securely. Also we are using a global state to store data that need to be retrieved by all the users of the program.

### Escrow account for safe transactions

When starting a ride the tokens from the passenger's account is transferred to a safe escrow account connected to driver's account. The driver can easily withdraw the amount when the drive is completed.

### Best user experiance

Its very easy to offer a new ride / accepting an already existing ride. UI provides everything the user needs. It shows the easiest route in a map. The cost for the ride and driver details.

## Quick Start

This app requires the following dependancies. Before continuing, download and install them:

- [Node.js](https://nodejs.org/en/download/). Node.js 10 or higher is required.
- [Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-solana)
- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools)
- [Testweave](https://github.com/ArweaveTeam/testweave-docker)

## Running the program locally

```
cd program
npm run deploy // This will deploy the program to the local solana network and copy idls generated to the client app.
```

## Running the app locally

### Update environment variables.

For a quick start we have added them, Feel free to update if required.

```
VITE_APP_ID=<algolia appid>
VITE_ALGOLIA_API=<algolia api token>
VITE_MAPBOX_ACCESS_TOKEN=<mapbox access token>
```

### Install dependencies

```
cd client
npm install
```

### Create a mint authority

```
npm run create-mint
```

Copy and paste the mint public key to [mint.ts](https://github.com/shamin/share-ride/blob/main/client/src/app/web3/provider/account/mint.ts) file.

### Start the development server

```
npm run dev
```

view share ride at [http://localhost:5000/](http://localhost:5000/)

### Future scope

- This project is currently an `MVP`. It supports all the functionalities required for a carpooling app but there are some loose ends too.
- We can only store limited amount of data in user accounts. Even though we are only using user accounts to store arweave archive id still it have some limitations. So instead of using user accounts to store we need to to have a better data store that can store any amount of data and is scalable.
- There are some bugs and the user might end up in some bad state if some steps in the flow is failed. We need to add retry logic if something is failed.
- Now sherekhan (Share ride coins) can only be used to choose a ride. We need to introduce more methods by which a user can spend their tokens.
