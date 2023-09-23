import { HelpCircle } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { event } from "@/utils/gtag";

export const Support = () => {
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      obs: "",
    },
  });

  const onSubmit = (data: { name: string; obs: string }) => {
    try {
      const text = `Olá,\n${data.obs} \nObrigado:\n${data.name}`;
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/5511998881910?text=${encodedText}`, "_blank");
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <div className="absolute right-5 bottom-5 p-1 cursor-pointer rounded-full">
          <HelpCircle className="w-10 h-10 text-emerald-500" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="flex flex-col gap-4 min-w-[220px] bg-white rounded-md p-4 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="end"
          alignOffset={200}
          side="left"
          asChild
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: true,
                min: 3,
              }}
              render={(props) => (
                <div>
                  <label
                    htmlFor={props.field.name}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nome *
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

            <Controller
              control={control}
              name="obs"
              render={(prop) => (
                <div>
                  <label
                    htmlFor={prop.field.name}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Dúvida / Problema / Observação *
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      id={prop.field.name}
                      className="block resize-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Deixe sua dúvida, problema ou Observação"
                      {...prop.field}
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
                  action: "support",
                  label: "Ajuda",
                  category: "help",
                  value: 1,
                });
              }}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Enviando ..." : "Enviar"}
            </button>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
