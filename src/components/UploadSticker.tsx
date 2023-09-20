import {
  ImageIcon,
  PhoneOutgoing,
  PictureInPicture,
  PictureInPicture2Icon,
  PictureInPictureIcon,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAuth } from "./AuthContext";

export const UploadSticker = () => {
  const { isLogged, user } = useAuth();
  const [sticker, setSticker] = useState<File | null>(null);
  const { openLogin, isOpen } = useAuth();

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


  const handleSubmit = () => {
    if(!isLogged || !user?.isAuthenticated ) {
      alert('Eror')
      return
    }


    // await fetch()
  }

  return (
    <div className="flex justify-center items-center gap-4">
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
                e.stopPropagation();
                if (!user?.isAuthenticated) {
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
                disabled={isOpen}
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
            className="rounded"
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
          >
            Receber 
          </button>
        </div>
      )}
    </div>
  );
};
