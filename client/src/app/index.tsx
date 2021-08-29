import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login } from "./pages/auth/login";
import "./index.scss";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Home } from "./pages/home/home";
import { Ride } from "./pages/ride/ride";

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
];

export const App = () => {
  return (
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
  );
};
