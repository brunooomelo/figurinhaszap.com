import { environment } from "@/utils/environment";
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
type IContext = {
  user: User | null;
  isLogged: boolean;
  isOpen: boolean;
  openLogin: (status?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setPin: (token: string) => Promise<void>;
  login: ({ whatsapp }: { whatsapp: string }) => Promise<void>;
  token: string | null;
};

const Context = createContext({ user: null } as IContext);
export const useAuth = () => useContext(Context);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [token, setToken] = useState(null);

  const getSession = useCallback(async () => {
    if (!token) return;
    const session = await fetch("/session", {
      headers: {
        "x-auth-token": token,
      },
    }).then((res) => res.json());

    setUser(session.data);
    setIsLogged(true);
  }, []);

  const logout = useCallback(async () => {
    setIsLogged(false);
    setUser(null);
  }, []);

  const openLogin = useCallback(async (status = true) => {
    setOpen(status);
  }, []);

  const login = async ({ whatsapp }: { whatsapp: string }) => {
    try {
      const response = await fetch(`${environment.APIURL}/login`, {
        method: "POST",
        body: JSON.stringify({
          name,
          whatsapp: `55${whatsapp}@c.us`,
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
      setToken(response.token);
    } catch (error) {
      console.log(error);
      alert("Ocorreu um erro, tente mais tarde");
    }
  };

  useEffect(() => {
    getSession();
  }, []);

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
        token,
      }}
    >
      {children}
    </Context.Provider>
  );
};
