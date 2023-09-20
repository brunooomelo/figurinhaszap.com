import { Inter } from "next/font/google";
import "react-international-phone/style.css";
import { UploadSticker } from "@/components/UploadSticker";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PinForm } from "@/components/PinForm";
import { LoginButton } from "@/components/LoginButton";
const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const { isLogged, user } = useAuth();

  return (
    <div className={`h-screen flex flex-col ${inter.className}`}>
      <div className="flex items-center justify-center gap-x-6 bg-emerald-800 px-6 py-2.5 sm:px-3.5 ">
        {" "}
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
            da evolução. Nós cuidaremos deles. 🌿&nbsp;
            {/* <span aria-hidden="true">&rarr;</span> */}
          </a>
        </p>
        {/* <div className="flex flex-1 justify-end">
          <button
            type="button"
            className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-white" aria-hidden="true" />
          </button>
        </div> */}
      </div>
      <section className="shadow-sm">
        <header className="container h-16 mx-auto flex items-center">
          {/* <Github className="w-8 h-8" /> */}
          <div className="flex items-stretch justify-end flex-1 px-2">
            <LoginButton />
          </div>
        </header>
      </section>

      <main className="w-full h-full max-w-7xl mx-auto container">
        <section className="flex items-center py-10">
          <div className="flex flex-col flex-1 gap-4">
            <h1 className="text-4xl font-bold text-zinc-800">
              Domine o WhatsApp com Stickers Incríveis! Crie, Produza e Arrase!
              😎
            </h1>
            <p className="text-sm text-zinc-500">
              Você ama WhatsApp e está pronto para se destacar? Bem-vindo à
              revolução dos stickers! 🌟 Chega de conversas chatas e monótonas.
              É hora de incendiar suas mensagens com os stickers mais incríveis
              e personalizados que você já viu! Na Stickers Incríveis, você é o
              mestre da criação e da produção de stickers. 💥
            </p>
          </div>
          <div className="flex-1">
            <UploadSticker />
          </div>
        </section>
      </main>
      {!isLogged && <LoginForm />}
      {isLogged && !user?.isAuthenticated && !!user?.whatsapp && <PinForm />}

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
  );
}
