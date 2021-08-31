import React from "react";
import { SideBar } from "./components/sidebar";
import "./dashboard.scss";

export const Dashboard: React.FC = ({ children  }) => {
  return (
      <div>
        <SideBar />
        <div className="main">{children}</div>
      </div>
  );
};
