import { environment } from "@/utils/environment";
import { setCookie, parseCookies } from "nookies";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  whatsapp: string;
  isAuthenticated: boolean;
};
type IOpenLogin = {
  status?: boolean;
  reset?: boolean;
};
type IContext = {
  user: User | null;
  isLogged: boolean;
  isOpen: boolean;
  openLogin: (data?: IOpenLogin) => Promise<void>;
  changeNumber: () => Promise<void>;
  logout: () => Promise<void>;
  setPin: (token: string) => Promise<void>;
  login: ({ whatsapp }: { whatsapp: string }) => Promise<void>;
};

const Context = createContext({ user: null } as IContext);
export const useAuth = () => useContext(Context);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const getSession = useCallback(async () => {
    const cookies = parseCookies();
    const token = cookies.phone_token;

    if (!token) return;
    const session = await fetch(`${environment.APIURL}/session`, {
      headers: {
        "x-auth-token": token,
      },
    }).then((res) => res.json());

    if (session.error) {
      alert(session.error);
      return;
    }
    setUser(session.data);
    setIsLogged(true);
  }, []);

  const logout = useCallback(async () => {
    setIsLogged(false);
    setUser(null);
  }, []);

  const openLogin = useCallback(
    async ({ status = true, reset = false } = {} as IOpenLogin) => {
      if (reset) {
        setUser(null);
        setIsLogged(false);
      }
      setOpen(status);
    },
    []
  );

  const login = async ({ whatsapp }: { whatsapp: string }) => {
    try {
      const response = await fetch(`${environment.APIURL}/login`, {
        method: "POST",
        body: JSON.stringify({
          whatsapp,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      if (response.error) {
        // adicionar toast error
        alert(response.error);
        return;
      }

      setUser({
        id: response.id,
        isAuthenticated: response.isAuthenticated,
        whatsapp: response.whatsapp,
      });
      setIsLogged(true);
    } catch (error) {
      console.log(error);
      alert("Ocorreu um erro, tente mais tarde");
    }
  };

  const setPin = async (token: string) => {
    try {
      if (!user?.id || !token) {
        // TODO: error
        return;
      }
      const response = await fetch(`${environment.APIURL}/phone/validade`, {
        method: "POST",
        body: JSON.stringify({
          id: user.id,
          token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (response.error) {
        alert(response.error);
        return;
      }

      alert(response.message);
      const { id, isAuthenticated, whatsapp } = response.data;
      setUser({ id, isAuthenticated, whatsapp });

      setCookie(null, "phone_token", response.token, {
        maxAge: 86400 * 7,
        path: "/",
      });
    } catch (error) {
      console.log(error);
      alert("Ocorreu um erro, tente mais tarde");
    }
  };

  const changeNumber = async () => {
    setUser(null);
    setIsLogged(false);
  };

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <Context.Provider
      value={{
        user,
        logout,
        isLogged,
        openLogin,
        isOpen,
        login,
        setPin,
        changeNumber,
      }}
    >
      {children}
    </Context.Provider>
  );
};
