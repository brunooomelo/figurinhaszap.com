import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

type User = {
  id: string;
  name: string;
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
  login: ({
    name,
    whatsapp,
  }: {
    name: string;
    whatsapp: string;
  }) => Promise<void>;
};

const mock = {
  id: "7047ca31-af1e-42d3-9a01-401c40e24db6",
  name: "bruno",
  whatsapp: "5511998881910@c.us",
  isAuthenticated: true,
};
const API_URL = "http://localhost:3333";
const Context = createContext({ user: null } as IContext);
export const useAuth = () => useContext(Context);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mock);
  const [isLogged, setIsLogged] = useState(!!mock ?? false);
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

  const login = async ({
    name,
    whatsapp,
  }: {
    name: string;
    whatsapp: string;
  }) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        body: JSON.stringify({
          name,
          whatsapp,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      console.log(response);
      if (response.error) {
        // adicionar toast error
        return;
      }

      setUser({
        id: response.id,
        isAuthenticated: false,
        name,
        whatsapp: response.wpp,
      });
      setIsLogged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const setPin = async (token: string) => {
    try {
      if (!user?.id || !token) {
        // TODO: error
        return 
      }
      const response = await fetch(`${API_URL}/phone/validade`, {
        method:'POST',
        body: JSON.stringify({
          id: user.id,
          token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log(response)
      if (response.error) {
        alert(response.error)
        return 
      }

      alert(response.message)
      setToken(response.token)
    } catch (error) {
      console.log(error)
      alert('Ocorreu um erro, tente mais tarde')
    }
    
  };


  useEffect(() => {
    getSession();
  }, []);

  return (
    <Context.Provider
      value={{ user, logout, isLogged, openLogin, isOpen, login, setPin }}
    >
      {children}
    </Context.Provider>
  );
};
