import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  canonical: "https://www.figurinhaszap.com",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.figurinhaszap.com",
    siteName:
      "Figurinhas: Deixe Suas Conversas de WhatsApp Muito Mais Divertidas!",
    description:
      "Não perca a chance de surpreender seus amigos! Crie stickers incríveis e leve a diversão para suas conversas no WhatsApp. É fácil e viciante!",
    images: [
      {
        url: "https://www.figurinhaszap.com/home/cover.webp",
        width: 1280,
        height: 720,
        alt: "Imagem que representa a figurinhaszap.com",
      },
    ],
  },
  twitter: {
    site: "@figurinhas",
    handle: "@brunooomelo",
    cardType: "summary_large_image",
  },
};

export default config;
