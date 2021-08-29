import { SideBar } from "./components/sidebar";
import "./dashboard.scss";
import React from "react";

export const Dashboard: React.FC = ({ children  }) => {
  return (
      <div>
        <SideBar />
        <div className="main">{children}</div>
      </div>
  );
};
