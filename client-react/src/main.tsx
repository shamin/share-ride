import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./app";

console.log(window.global, global);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
