import { Buffer } from 'buffer';
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./app";

window.Buffer = Buffer;

console.log(window.global, global);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
