import React, { useState } from "react";
import Account from "./pages/account/account";
import ShareRideProvider from "./web3/provider";

// const Data = () => {
//   const { loadWallet, wallet } = useShareRide();

//   const initializeWallet = () => {
//     loadWallet()
//       .then(() => {
//         console.log("Complete");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div className="container__account">
//       <h1>Account</h1>
//       {wallet ? (
//         <div>Balance:</div>
//       ) : (
//         <button onClick={() => initializeWallet()}>Connect Wallet</button>
//       )}
//     </div>
//   );
// };

const App = () => {
  return (
    <ShareRideProvider>
      <Account />
    </ShareRideProvider>
  );
};

export default App;
