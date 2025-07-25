import React from "react";
import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./App.css";
import Editor from "./editor/editor";
import Layout from "./components/layout";
import Settings from "./settings/settings";
import TranslationPromptPage from "./translation-prompt/translation-prompt";
import GlossaryPage from "./glossary/glossary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="editor" element={<Editor />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="translation-prompt"
              element={<TranslationPromptPage />}
            />
            <Route path="glossary" element={<GlossaryPage />} />
            <Route path="*" element={<Navigate to="/editor" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  </React.StrictMode>,
);
