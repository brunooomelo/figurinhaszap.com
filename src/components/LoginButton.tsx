import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "./AuthContext";
import { hiddenPhone } from "@/utils/hiddenNumber";

export const LoginButton = () => {
  const { isLogged, openLogin, user, logout } = useAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => {
            if (!isLogged) {
              openLogin();
            }
          }}
        >
          {isLogged && user?.whatsapp ? hiddenPhone(user?.whatsapp) : "Entrar"}
        </button>
      </DropdownMenu.Trigger>

      {isLogged && (
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            sideOffset={5}
          >
            <DropdownMenu.Item
             className="group text-[13px] leading-none rounded flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-zinc-300 cursor-pointer"
             onClick={logout}
             >
              Sair
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      )}
    </DropdownMenu.Root>
  );
};
