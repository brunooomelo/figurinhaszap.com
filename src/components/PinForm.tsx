import * as Dialog from "@radix-ui/react-dialog";

import { Controller, useForm } from "react-hook-form";
import { useAuth } from "./AuthContext";

export const PinForm = () => {
  const { isLogged, openLogin, user, setPin, isOpen } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      whatsapp: user?.whatsapp,
      token: "",
    },
  });
  console.log(user?.whatsapp)

  const onSubmit = async (data: any) => {
    // TODO: error
    if (!data.token) return 
    setPin(data.token);
  };

  if (user?.isAuthenticated) return null

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(state) => {
        if (!isSubmitting) {
          openLogin(state);
        }
      }}
    >
      <Dialog.Trigger />
      <Dialog.Portal>
        <Dialog.Overlay className="bg-zinc-900/60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content
          asChild
          className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
        >
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title className="text-zinc-900 m-0 text-[17px] font-medium">
              Acesso ao Sistema
            </Dialog.Title>
            <Dialog.Description className="text-zinc-600 mt-[10px] mb-5 text-[15px] leading-normal">
              Bem-vindo ao nosso sistema! Para proporcionar uma experiência
              personalizada e segura, solicitamos seu nome e número de contato.
            </Dialog.Description>
            <Controller
              control={control}
              name="whatsapp"
              render={(props) => (
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label
                    className="text-violet11 w-[90px] text-right text-[15px]"
                    htmlFor={props.field.name}
                  >
                    Whatsapp
                  </label>
                  <input
                    {...props.field}
                    data-loading={isSubmitting}
                    id={props.field.name}
                    className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] disabled:opacity-80 disabled:cursor-not-allowed "
                    disabled
                  />
                </fieldset>
              )}
            />

            {!user?.isAuthenticated && isLogged && (
              <Controller
                control={control}
                name="token"
                render={(props) => (
                  <fieldset className="mb-[15px] flex items-center gap-5">
                    <label
                      className="text-violet11 w-[90px] text-right text-[15px]"
                      htmlFor="pin"
                    >
                      PIN
                    </label>
                    <input
                      className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      id="pin"
                      {...props.field}

                    />
                  </fieldset>
                )}
              />
            )}
            <span className="text-xs text-zinc-400 leading-none">
              Seus dados serão usados exclusivamente para fins de autenticação e
              comunicação relacionados ao sistema. Obrigado por escolher nosso
              sistema.
            </span>
            <div className="mt-[25px] flex justify-end gap-4">
              <button
                type="button"
                className="inline-flex h-[35px] border items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none data-[loading=true]:cursor-not-allowed"
                onClick={() => openLogin(false)}
                disabled={isSubmitting}
              >
                Voltar
              </button>
              <button
                data-loading={isSubmitting}
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-400 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none data-[loading=true]:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando...." : "Cadastrar"}
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                {/* <Cross2Icon /> */}
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
