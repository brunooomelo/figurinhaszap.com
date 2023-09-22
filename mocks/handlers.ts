import { rest } from "msw";
import { nanoid } from "nanoid";

type UserModel = {
  id: string;
  isAuthenticated: boolean;
  whatsapp: string;
  token: string | null;
};

interface Whatsapp {
  whatsapp: string;
}

export const generateToken = () => {
  return Array.from({ length: 4 })
    .map(() => String(Math.floor(Math.random() * 10)))
    .join("");
};
let tokens = [] as string[];

const usersDatabase = () => {
  let db = [] as UserModel[];
  const getUsers = sessionStorage.getItem("users");
  if (!getUsers) {
    sessionStorage.setItem("users", JSON.stringify([]));
  } else {
    db = JSON.parse(getUsers);
  }

  return {
    docs: db,
    save: (data: UserModel[]) =>
      sessionStorage.setItem("users", JSON.stringify(data)),
  };
};
export const handlers = [
  rest.post("/login", async (request, response, context) => {
    const { docs, save } = usersDatabase();
    let users = docs
    const { whatsapp } = await request.json<Whatsapp>();
    // const token = req.headers?.['x-auth-token']
    const user = users.find((wpp) => wpp.whatsapp === whatsapp);
    const token = generateToken();
    if (user) {
      users = users.map((user) => {
        if (user.whatsapp === whatsapp) {
          user.token = token;
          user.isAuthenticated = false;
        }
        return user;
      });
    } else {
      users.push({
        id: nanoid(),
        whatsapp,
        isAuthenticated: false,
        token,
      });
    }

    const userReturned = users
      .map(({ id, isAuthenticated, whatsapp }) => ({
        id,
        isAuthenticated,
        whatsapp,
      }))
      .find((wpp) => wpp.whatsapp === whatsapp);

    console.log(`PIN: ${token}`);

    save(users)
    return response(context.status(200), context.json(userReturned));
  }),
  rest.post("/phone/validade", async (request, response, context) => {
    const { docs, save } = usersDatabase();
    let users = docs
    const { id, token } = await request.json();

    const user = users.find((wpp) => wpp.id === id);

    if (!user) {
      return response(
        context.status(400),
        context.json({
          error: "Não foi possivel fazer a autenticação",
        })
      );
    }

    console.log(user.token, token);
    if (user.token !== token.trim()) {
      return response(
        context.status(400),
        context.json({
          error: "PIN incorreto. Verifique no dispositivo o pin.",
        })
      );
    }

    const jwtToken = `${id}:${user.whatsapp}`;
    tokens.push(jwtToken);

    users = users.map((usr) => {
      if (usr.whatsapp === user.whatsapp) {
        user.isAuthenticated = true;
      }
      return user;
    });
    save(users)
    return response(
      context.status(200),
      context.json({
        message: "Você está autenticado. Gere seus stickers",
        data: { ...user, isAuthenticated: true },
        token: jwtToken,
      })
    );
  }),
  rest.post("/stickers", async (request, response, context) => {
    const { docs, save } = usersDatabase();
    let users = docs
    const data = await request.body;
    const token = request.headers.get("x-auth-token") as string;
    if (!token) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Você não está autenticado.",
        })
      );
    }
    const [idToken, wppToken] = token.split(":");
    const isTokenValid = tokens.includes(token);
    if (!idToken || !wppToken || isTokenValid) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Você não esta autenticado. Por favor entre com seu whatsapp",
        })
      );
    }
    const user = users.find((wpp) => wpp.id === idToken);

    console.log(users, idToken);
    if (!user) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Você não esta autenticado. Por favor entre com seu whatsapp",
        })
      );
    }

    if (!data) {
      return response(
        context.delay(),
        context.status(400),
        context.json({
          error: "Não foi enviado uma imagem",
        })
      );
    }
    const isTrue = Math.random() < 0.5;
    if (isTrue) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Não foi possivel gerar o sticker, tente outra imagem.",
        })
      );
    }

    return response(
      context.delay(),
      context.status(200),
      context.json({
        message: "Figurinha enviado",
      })
    );
  }),
  rest.get("/session", async (request, response, context) => {
    const { docs, save } = usersDatabase();
    let users = docs
    const token = request.headers.get("x-auth-token") as string;
    if (!token) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Você não está autenticado.",
        })
      );
    }
    const [idToken, wppToken] = token.split(":");
    const isTokenValid = tokens.includes(token);
    if (!idToken || !wppToken || isTokenValid) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "PIN incorreto. Verifique no dispositivo o pin.",
        })
      );
    }
    const user = users.find((wpp) => wpp.id === idToken);

    console.log(users, idToken);
    if (!user) {
      return response(
        context.delay(),
        context.status(401),
        context.json({
          error: "Não foi possivel fazer a autenticação",
        })
      );
    }
    return response(
      context.delay(),
      context.status(401),
      context.json({
        data: { ...user, token: undefined },
        message: "Você está autenticado.",
        token,
      })
    );
  }),
];
