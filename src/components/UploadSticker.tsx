import {
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { environment } from "@/utils/environment";

export const UploadSticker = () => {
  const { isLogged, user } = useAuth();
  const [sticker, setSticker] = useState<File | null>(null);
  const { openLogin, token } = useAuth();

  const previewImagem = useMemo(
    () => (sticker ? URL.createObjectURL(sticker) : null),
    [sticker]
  );

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isLogged || !user?.isAuthenticated) {
      openLogin();
      return;
    }
    const { files } = event.currentTarget;

    if (!files) return;

    const FIRST_ITEM = 0;
    const selectedFile = files.item(FIRST_ITEM);
    setSticker(selectedFile);
  }


  const handleSubmit = async () => {
    if(!isLogged || !user?.isAuthenticated || !token) {
      alert('Eror')
      return
    }
    
    const body = new FormData()
    body.append('file', sticker!)
     
    const response = await fetch(`${environment.APIURL}/stickers`, {
      method: 'POST',
      body,
      headers: {
        'x-auth-token': token
      }
    }).then(res => res.json())
    if (response.error) {
      alert(response.error)
      return
    }

    
    alert('Sucesso')
    setSticker(null)
  }

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-4">
      <div className="flex max-w-xs h-full justify-center rounded-lg border border-dashed border-gray-900/25 p-6">
        <div className="text-center">
          <ImageIcon
            className="mx-auto h-16 w-16 text-gray-400"
            aria-hidden="true"
          />
          <div className="mt-4 flex flex-col text-sm leading-6 text-gray-600">
            <strong>Transforme seus arquivos</strong> em stickers mágicos!
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
              onClick={(e) => {
                if (!user?.isAuthenticated) {
                  e.stopPropagation();
                  openLogin();
                }
              }}
            >
              <span>Faça o upload</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelected}
                disabled={!isLogged}
              />
            </label>
            <p className="pl-1"> e veja a diversão acontecer. 😄🎉</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF, WEBP até 25MB
          </p>
        </div>
      </div>

      {!!previewImagem && (
        <div className="flex flex-col gap-3">
          <Image
            className="rounded w-full max-w-[278px]"
            alt=""
            src={previewImagem}
            width={200}
            height={200}
            objectPosition="center"
            objectFit="fill"
          />
          <button
            className="rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={handleSubmit}
            disabled={!sticker}
          >
            Receber agora!
          </button>
        </div>
      )}
    </div>
  );
};
