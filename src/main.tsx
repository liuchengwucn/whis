import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Editor from "./editor/editor";
import Layout from "./components/layout";
import Settings from "./settings/settings";
import Recent from "./recent/recent";
import Chat from "./chat/chat";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Editor />} />
            <Route path="settings" element={<Settings />} />
            <Route path="recent" element={<Recent />} />
            <Route path="chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  </React.StrictMode>
);
