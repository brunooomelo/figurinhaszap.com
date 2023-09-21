import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { environment } from "@/utils/environment";
import { parseCookies } from "nookies";

export const UploadSticker = () => {
  const { isLogged, user } = useAuth();
  const [sticker, setSticker] = useState<File | null>(null);
  const { openLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const previewImagem = useMemo(
    () => (sticker ? URL.createObjectURL(sticker) : null),
    [sticker]
  );

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const FIRST_ITEM = 0;
    const selectedFile = files.item(FIRST_ITEM);
    setSticker(selectedFile);
  }

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!isLogged || !user?.isAuthenticated) {
      openLogin();
      setIsLoading(false);
      return;
    }

    const body = new FormData();
    body.append("file", sticker!);

    const cookies = parseCookies();
    const token = cookies.phone_token;
    try {
      const response = await fetch(`${environment.APIURL}/stickers`, {
        method: "POST",
        body,
        headers: {
          "x-auth-token": token,
        },
      }).then((res) => res.json());
      if (response.error) {
        alert(response.error);
        return;
      }

      alert(response.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setSticker(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-4">
      <div className="flex flex-col gap-3">
        {previewImagem ? (
          <>
            <label htmlFor="file-upload">
              <Image
                className="rounded w-full max-w-[278px]"
                alt=""
                src={previewImagem}
                width={259}
                height={259}
                objectPosition="center"
                objectFit="fill"
              />
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelected}
                disabled={isLoading}
              />
            </label>
          </>
        ) : (
          <div className="flex max-w-xs h-full justify-center rounded-lg border border-dashed border-gray-900/25 p-6">
            <div className="text-center">
              <ImageIcon
                className="mx-auto h-16 w-16 text-gray-400"
                aria-hidden="true"
              />
              <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
                <strong>Transforme suas imagens</strong> em figurinhas mágicas!
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  <span>Faça o upload</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileSelected}
                  />
                </label>
                <p className="pl-1"> e veja a mágicas acontecer. 🪄</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF, WEBP até 25MB
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <button
            className="rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => setSticker(null)}
            disabled={!sticker || isLoading}
          >
            Remover
          </button>
          <button
            className="rounded bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
            onClick={handleSubmit}
            disabled={!sticker || isLoading}
          >
            {isLoading ? "Gerando e enviando ..." : "Gerar figurinha 🪄"}
          </button>
        </div>
      </div>
    </div>
  );
};
