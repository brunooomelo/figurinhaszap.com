import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/components/AuthContext";
import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import SEO from '../../next-seo.config'

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
      <DefaultSeo {...SEO} />
      <AuthProvider>
        <Component {...pageProps} />
        <MSWComponent />
      </AuthProvider>
      <Analytics />
    </>
  );
}
