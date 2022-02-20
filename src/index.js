import React from "react";
import ReactDOM from "react-dom";
import "./frontend/styles/App.css";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { appTheme } from "./frontend/styles/theme";

ReactDOM.render(
  <ThemeProvider theme={appTheme}>
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
    ,
  </ThemeProvider>,
  document.getElementById("root")
);
