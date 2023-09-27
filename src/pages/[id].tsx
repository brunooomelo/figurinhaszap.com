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
import { GetStaticPaths, GetStaticProps } from "next";
import { PageSEO, SEO_MULTI_PAGE } from "../utils/SEO";

export default function GenerateSEO({
  description,
  heading,
  heading_description,
  title,
}: PageSEO) {
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
      <NextSeo title={title} description={description} />

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
              {heading}
            </h1>
            <h2 className="text-lg text-zinc-500">{heading_description}</h2>
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

export const getStaticPaths: GetStaticPaths = () => {
  const paths = SEO_MULTI_PAGE.map(({ url }) => ({ params: { id: url } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hasSlug = SEO_MULTI_PAGE.find(({ url }) => params?.id === url);

  if (!hasSlug) {
    return {
      notFound: true,
    };
  }

  return {
    props: hasSlug,
  };
};
