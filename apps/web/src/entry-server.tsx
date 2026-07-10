import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/global.css";

export function render(url: string, helmetContext: { helmet?: HelmetServerState }) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
