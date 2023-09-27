import { Analytics } from "@/components/Analytics";
import { AuthProvider } from "@/components/AuthContext";
import "@/styles/globals.css";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import SEO from "../../next-seo.config";
import Head from "next/head";
import { Banner } from "@/components/Banner";
import { Inter } from "next/font/google";
const font = Inter({ subsets: ["latin"] });

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
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <DefaultSeo {...SEO} />
      <AuthProvider>
        <div
          className={`h-full lg:h-screen flex flex-col ${font.className} relative`}
        >
          <Banner />
          <Component {...pageProps} />
          <MSWComponent />
        </div>
      </AuthProvider>
      <Analytics />
    </>
  );
}
