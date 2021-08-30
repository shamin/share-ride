import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/auth/login";
import "./index.scss";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Home } from "./pages/home/home";
import { Ride } from "./pages/ride/ride";
import { Offer } from "./pages/offer/offer";
import {
  RecoilRoot,
} from 'recoil';

const routes = [
  {
    path: "auth",
    component: Login,
    isExact: false,
    private: true,
  },
  {
    path: "/",
    component: Home,
    isExact: false,
    private: true,
  },
  {
    path: "ride",
    component: Ride,
    isExact: false,
    private: true,
  },
  {
    path: "offer",
    component: Offer,
    isExact: false,
    private: true,
  },
];

export const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Switch>
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
        </Switch>
      </Router>
    </RecoilRoot>
  );
};
