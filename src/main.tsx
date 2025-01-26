import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import "./App.css";
import Editor from "./editor/editor";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  </React.StrictMode>
);
