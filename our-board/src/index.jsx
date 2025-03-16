import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

import Routes from "./Routes";

// Select the root element
const rootElement = document.getElementById("root");

// Create the root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
