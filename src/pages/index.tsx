import { UploadSticker } from "@/components/UploadSticker";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PinForm } from "@/components/PinForm";
import Head from "next/head";
import { pageview } from "@/utils/gtag";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Support } from "@/components/Support";

export default function Home() {
  const { isLogged, user } = useAuth();
  const router = useRouter();
  const logPageView = useCallback(() => pageview(router.pathname), [router]);
  useEffect(() => {
    router.events.on("routeChangeComplete", logPageView);
    return () => {
      router.events.off("routeChangeComplete", logPageView);
    };
  }, [router, logPageView]);

  return (
    <>
      <Head>
        <meta
          name="ahrefs-site-verification"
          content="0ff7ff9de03f88bcd24fe4511f725298dc7d90f3c915636975575d8b463daf90"
        ></meta>
      </Head>
      <NextSeo
        title="Crie Figurinhas WhatsApp Grátis em 3 Passos | Online e Divertido"
        description="Saiba como fazer figurinhas para WhatsApp de forma fácil e gratuita. Com nossa aplicação online, autentique-se, escolha a imagem e receba no WhatsApp. Diversão garantida! Começe agora."
      />

      {/* <section className="shadow-sm">
          <header className="container h-16 mx-auto flex items-center">
            <Github className="w-8 h-8" />
            {isLogged && (
              <div className="flex items-stretch justify-end flex-1 px-2">
                <LoginButton />
              </div>
            )}
          </header>
        </section> */}

      <main className="w-full h-full max-w-7xl mx-auto text-center lg:text-left px-4 md:container mt-16">
        <section className="flex flex-col gap-20 lg:gap-0 lg:flex-row items-center py-10">
          <div className="flex flex-col flex-1 gap-4">
            <h1 className="text-[56px] leading-tight font-bold text-zinc-800">
              Fazer Figurinhas para WhatsApp Nunca Foi Tão Fácil!
            </h1>
            <h2 className="text-lg text-zinc-500">
              Descubra a maneira mais simples, gratuita e online de criar suas
              próprias figurinhas para WhatsApp. Com apenas três passos -
              autenticar, selecionar imagem e receber no WhatsApp - você estará
              gerando figurinhas engraçadas em um piscar de olhos.
            </h2>
          </div>
          <UploadSticker />
        </section>
      </main>

      <footer className="text-center font-bold text-xs p-4">
        Criado Por{" "}
        <Link
          title="github do fundador do figurinhas Bruno"
          href="https://github.com/brunooomelo"
          target="_blank"
          className="text-indigo-600"
        >
          Bruno Melo
        </Link>
      </footer>
      <Support />
      {!isLogged && <LoginForm />}
      {isLogged && !user?.isAuthenticated && !!user?.whatsapp && <PinForm />}
    </>
  );
}
