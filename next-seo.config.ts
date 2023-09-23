import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://figurinhaszap.com",
    siteName: "Figurinhaszap: Deixe Suas Conversas de WhatsApp Muito Mais Divertidas!",
    description:
      "Não perca a chance de surpreender seus amigos! Crie stickers incríveis e leve a diversão para suas conversas no WhatsApp. É fácil e viciante!",
    images: [
      {
        url: "/home/cover.png",
        width: 1280,
        height: 720,
        alt: "",
      },
    ],
  },
  twitter: {
    handle: "@figurinhas",
    site: "@brunooomelo",
    cardType: "summary_large_image",
  },
};

export default config;