import {
  CrossIcon,
  FileImage,
  ImageIcon,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { environment } from "@/utils/environment";
import { parseCookies } from "nookies";
import { event } from "@/utils/gtag";
import { Controller, useForm } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import ImageCrop from "./ImageCrop";
import { useCrop } from "@/hooks/useCrop";

export const UploadSticker = () => {
  const { isLogged, user, openLogin } = useAuth();
  const [sticker, setSticker] = useState<File | Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogSubmit, setDialogSubmit] = useState(false);
  const previewImagem = useMemo(
    () => (sticker ? URL.createObjectURL(sticker) : null),
    [sticker]
  );
  const crop = useCrop();

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { name } = getValues();

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
      if (!sticker) {
        alert("Deu erro ao editar sua imagem.");
        return;
      }
      body.append("file", sticker);
      body.append("y", String(crop.croppedAreaPixels?.y));
      body.append("x", String(crop.croppedAreaPixels?.x));
      body.append("width", String(crop.croppedAreaPixels?.width));
      body.append("height", String(crop.croppedAreaPixels?.height));
      body.append("name", name || "");

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
      crop.reset();
      reset();
    }
  }, [crop, reset, sticker]);

  const onSubmit = async () => {
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
      crop.reset();
      reset();
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

  const handleDialogSubmit = (open: boolean) => {
    if (open) {
      setDialogSubmit(true);
    } else {
      setDialogSubmit(false);
      setSticker(null);
      crop.reset();
      reset();
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

          <Dialog.Root
            open={dialogSubmit && !!previewImagem}
            onOpenChange={handleDialogSubmit}
          >
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Gerar figurinha para receber pelo Whatsapp"
                className="rounded bg-indigo-600 px-2.5 py-1 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                onClick={() => {
                  event({
                    action: "upload_image",
                    label: "envio de imagem",
                    category: "upload",
                    value: 1,
                  });
                }}
                disabled={!sticker || isLoading}
              >
                {isLoading ? "Gerando e enviando ..." : "Gerar figurinha 🪄"}
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="bg-zinc-700/90 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Close asChild>
                <button
                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <CrossIcon />
                </button>
              </Dialog.Close>
              <Dialog.Content
                className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none grid grid-cols-2 gap-2"
                asChild
              >
                {previewImagem && (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <ImageCrop previewImagem={previewImagem} {...crop} />
                    <div>
                      <div className="flex items-center gap-4">
                        <span>Scale</span>
                        <FileImage />
                        <input
                          type="range"
                          min={1}
                          step={0.1}
                          max={3}
                          onChange={(e) => crop.setZoom(Number(e.target.value))}
                          value={crop.zoom}
                        />
                        <FileImage size="30" />
                      </div>
                      <Controller
                        control={control}
                        name="name"
                        rules={{
                          required: false,
                          min: 3,
                        }}
                        render={(props) => (
                          <div>
                            <label
                              htmlFor={props.field.name}
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Nome do sticker
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                              <input
                                type="text"
                                id={props.field.name}
                                className="block w-full ring-1 ring-inset ring-gray-300 border-0 rounded-md py-1.5 pr-10 sm:text-sm sm:leading-6"
                                placeholder="Seu nome"
                                {...props.field}
                              />
                            </div>
                          </div>
                        )}
                      />
                      <button
                        type="submit"
                        className="w-full rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => {
                          event({
                            action: "upload_image",
                            label: "envio de imagem",
                            category: "upload",
                            value: 1,
                          });
                        }}
                        disabled={!isValid || isSubmitting || isLoading}
                      >
                        {isSubmitting || isLoading ? "Enviando ..." : "Enviar"}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};
