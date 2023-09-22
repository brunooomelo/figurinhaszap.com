import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/components/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const MSWComponent = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const { worker } = require("../../mocks/browser");
      worker.start();
    }
  }, []);
  return null;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
        <MSWComponent />
      </AuthProvider>
      <Analytics />
    </>
  );
}
