import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/auth/login";
import "./index.scss";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Home } from "./pages/home/home";
import { Ride } from "./pages/ride/ride";
import { Offer } from "./pages/offer/offer";
import { RecoilRoot } from "recoil";
import { MiddleWare } from "./pages/middleware/middleware";

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
];

export const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact={false} path="/auth" component={Login} />
          <MiddleWare>
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
          </MiddleWare>
        </Switch>
      </Router>
    </RecoilRoot>
  );
};
