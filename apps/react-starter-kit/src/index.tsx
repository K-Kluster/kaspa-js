import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App";
import { RpcProvider } from "./context/RpcContext";
import { ThemeProvider } from "./context/ThemeProvider";

export const startApplicationRendering = async () => {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
  );

  root.render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RpcProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </BrowserRouter>
      </RpcProvider>
    </ThemeProvider>,
  );
};
