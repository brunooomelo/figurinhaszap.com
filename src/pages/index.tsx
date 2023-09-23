import { UploadSticker } from "@/components/UploadSticker";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PinForm } from "@/components/PinForm";
import { LoginButton } from "@/components/LoginButton";
import Head from "next/head";
import { pageview } from "@/utils/gtag";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Inter } from "next/font/google";
const font = Inter({ subsets: ["latin"] });

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
        title="Figurinhaszap: Deixe Suas Conversas de WhatsApp Muito Mais Divertidas!"
        description="Não perca a chance de surpreender seus amigos! Crie stickers incríveis e leve a diversão para suas conversas no WhatsApp. É fácil e viciante!"
      />
      <div className={`h-full lg:h-screen flex flex-col ${font.className}`}>
        <div className="flex items-center justify-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 ">
          {/* sm:before:flex-1} */}
          <p className="text-sm leading-6 text-white">
            <a href="#">
              <strong className="font-semibold">Versão BETA</strong>
              <svg
                viewBox="0 0 2 2"
                className="mx-2 inline h-0.5 w-0.5 fill-current"
                aria-hidden="true"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              Relaxe e aproveite a fase beta. Erros são apenas uma parte natural
              da evolução. Nós cuidaremos deles.
              {/* <span aria-hidden="true">&rarr;</span> */}
            </a>
          </p>
        </div>
        <section className="shadow-sm">
          <header className="container h-16 mx-auto flex items-center">
            {/* <Github className="w-8 h-8" /> */}
            <div className="flex items-stretch justify-end flex-1 px-2">
              <LoginButton />
            </div>
          </header>
        </section>

        <main className="w-full h-full max-w-7xl mx-auto text-center lg:text-left px-4 md:container">
          <section className="flex flex-col gap-20 lg:gap-0 lg:flex-row items-center py-10">
            <div className="flex flex-col flex-1 gap-4">
              <h1 className="text-[56px] leading-tight font-bold text-zinc-800">
                Crie figurinhas incríveis para seu WhatsApp e brilhe nas
                conversas! 🔥
              </h1>
              <p className="text-lg text-zinc-500">
                Quer ser a estrela das conversas no WhatsApp? Crie figurinhas
                incríveis que vão deixar todos impressionados! Torne-se o gênio
                das figurinhas agora mesmo! 💥
              </p>
            </div>
            <UploadSticker />
          </section>
        </main>

        <footer className="text-center font-bold text-xs p-4">
          Criado Por{" "}
          <Link
            href="https://github.com/brunooomelo"
            target="_blank"
            className="text-indigo-600"
          >
            Bruno Melo
          </Link>
        </footer>
      </div>
      {!isLogged && <LoginForm />}
      {isLogged && !user?.isAuthenticated && !!user?.whatsapp && <PinForm />}
    </>
  );
}
