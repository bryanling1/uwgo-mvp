import React from "react";
import ReactDOM from "react-dom/client";
import { Home } from "views/home/home";
import { Navigation } from "views/navigation/Navigation";
import { HashRouter, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "styles/theme";

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/route" element={<Navigation />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
);
