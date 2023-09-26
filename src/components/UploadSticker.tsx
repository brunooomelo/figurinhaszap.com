import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { environment } from "@/utils/environment";
import { parseCookies } from "nookies";
import { event } from "@/utils/gtag";

export const UploadSticker = () => {
  const { isLogged, user, openLogin } = useAuth();
  const [sticker, setSticker] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewImagem = useMemo(
    () => (sticker ? URL.createObjectURL(sticker) : null),
    [sticker]
  );

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) return;

    const FIRST_ITEM = 0;

    const selectedFile = files.item(FIRST_ITEM);
    if (!selectedFile) return;
    const maxAllowedSize = 25 * 1024 * 1024;
    setSticker(selectedFile?.size > maxAllowedSize ? null : selectedFile);
  }

  const generateFormData = useCallback(async () => {
    try {
      const body = new FormData();
      body.append("file", sticker!);

      const cookies = parseCookies();
      const token = cookies.phone_token;
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
      setIsSubmitting(false);
      setSticker(null);
    }
  }, [sticker]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!isLogged || !user?.isAuthenticated) {
        setIsSubmitting(true);
        await openLogin();
        return;
      }
      await generateFormData();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitting && isLogged && user?.isAuthenticated) {
      generateFormData();
    }
  }, [isSubmitting, generateFormData, isLogged, user?.isAuthenticated]);

  const handlePaste = (e: ClipboardEvent) => {
    const item = Array.from(e.clipboardData?.items || []).find((x) =>
      /^image\//.test(x.type)
    );

    if (item) {
      const blob = item.getAsFile();

      if (blob) {
        setSticker(blob);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-4">
      <div className="flex flex-col gap-3">
        {previewImagem ? (
          <>
            <label htmlFor="file-upload-preview">
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
                id="file-upload-preview"
                name="file-upload-preview"
                type="file"
                className="sr-only"
                onChange={handleFileSelected}
                disabled={isLoading}
                accept="image/png, image/webp, image/gif, image/jpeg"
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
                    accept="image/png, image/webp, image/gif, image/jpeg"
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
            aria-label="Remover a imagem selecionada"
            className="rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => setSticker(null)}
            disabled={!sticker || isLoading}
          >
            Remover
          </button>
          <button
            aria-label="Gerar figurinha para receber pelo Whatsapp"
            className="rounded bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => {
              event({
                action: "upload_image",
                label: "envio de imagem",
                category: "upload",
                value: 1,
              });
              return handleSubmit();
            }}
            disabled={!sticker || isLoading}
          >
            {isLoading ? "Gerando e enviando ..." : "Gerar figurinha 🪄"}
          </button>
        </div>
      </div>
    </div>
  );
};
