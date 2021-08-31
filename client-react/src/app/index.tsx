import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Account from "./pages/account/account";
import ShareRideProvider from "./web3/provider";

import { Login } from "./pages/auth/login";
import { Home } from "./pages/home/home";
import { Dashboard } from "./pages/dashboard/dashboard";
import { MiddleWare } from "./middleware";
import { Ride } from "./pages/ride/ride";
import { Offer } from "./pages/offer/offer";

const routes = [
  {
    path: "/",
    component: Home,
    isExact: true,
  },
  {
    path: "ride",
    component: Ride,
    isExact: true,
  },
  {
    path: "offer",
    component: Offer,
    isExact: true,
  },
  {
    path: "account",
    component: Account,
    isExact: true,
  },
];

export const App = () => {
  return (
    // <RecoilRoot>
    <Router>
      <Switch>
        <Route exact={false} path="/auth" component={Login} />
        <MiddleWare>
          <ShareRideProvider>
            <Dashboard>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  exact={route.isExact}
                  path={`/${route.path}`}
                  component={route.component}
                />
              ))}
            </Dashboard>
          </ShareRideProvider>
        </MiddleWare>
      </Switch>
    </Router>
    // </RecoilRoot>
  );
};




// const App = () => {
//   return (
//     <ShareRideProvider>
//       <Account />
//     </ShareRideProvider>
//   );
// };

export default App;
