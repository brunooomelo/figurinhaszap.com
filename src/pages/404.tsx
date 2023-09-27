import { NextSeo } from "next-seo";
import Link from "next/link";

const NotFound = () => {
  return (
    <>
      <NextSeo
        title="Figurinhas: Página Não Encontrada"
        description="A página que você estava procurando não foi encontrada. Desculpe pelo inconveniente. Explore nosso site para encontrar conteúdo relevante."
      />
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Página Não Encontrada
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Parece que você se aventurou em território desconhecido! A página
            que você estava procurando não foi encontrada, mas não se preocupe.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Volte para a Página Inicial
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;
