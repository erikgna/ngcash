import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants";
import { UserError } from "../errors/user";
import { IRegisterUser, IUser } from "../interfaces/user";
import { getOne, create } from "../models/user";
import { getOneRedis, removeOneRedis, saveToRedis } from "../redis/functions";
import { hasNumber, hasUppercase } from "../utils/stringUtils";

export class UserController {
  public async login(data: IUser) {
    const user = await getOne(data).catch(() => {
      throw new UserError("Não foi possível recuperar seu usuário.", 502);
    });

    if (!user)
      throw new UserError("Nenhum usuário com essas credenciais.", 400);

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) throw new UserError("Credenciais inválidas.", 400);

    if (!JWT_SECRET) throw new UserError("Ocorreu um erro interno.", 500);

    const token = jwt.sign(
      { id: user.id, username: user.username, account: user.accountid },
      JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      JWT_REFRESH_SECRET,
      { expiresIn: "24h" }
    );

    await saveToRedis(user.username, refreshToken).catch(() => {
      throw new UserError("Ocorreu um erro interno.", 500);
    });

    return { token, refreshToken };
  }

  public async register(data: IRegisterUser) {
    if (data.password.length < 8)
      throw new UserError("Senha muito curta.", 400);

    if (data.confirmPassword !== data.password)
      throw new UserError("As senhas não combinam.", 400);

    if (!hasNumber(data.password) || !hasUppercase(data.password))
      throw new UserError("Senha inválida.", 400);

    const salt = await bcrypt.genSalt(10).catch(() => {
      throw new UserError("Ocorreu um erro interno.", 500);
    });

    const hashedPassword = await bcrypt.hash(data.password, salt).catch(() => {
      throw new UserError("Ocorreu um erro interno.", 500);
    });

    const user: IUser = {
      username: data.username,
      password: hashedPassword,
    };

    return await create(user).catch(() => {
      throw new UserError("Não foi possível criar sua conta.", 502);
    });
  }

  public async token(token: string) {
    try {
      const decodedToken = jwt.decode(token) as {
        username: string;
        exp: number;
      };
      const nowTimestamp = parseInt((Date.now() / 1000).toString());
      if (nowTimestamp > decodedToken["exp"]) throw new Error("erro");
      if (!decodedToken) throw new Error("erro");

      const dbToken = await getOneRedis(decodedToken.username);
      if (dbToken === token) {
        const user = await getOne({ username: decodedToken.username } as IUser);
        const newToken = jwt.sign(
          { id: user.id, username: user.username, account: user.accountid },
          JWT_SECRET,
          {
            expiresIn: "5m",
          }
        );
        return newToken;
      }
      throw new UserError("Falha na autenticação.", 401);
    } catch (error) {
      throw new UserError("Falha na autenticação.", 401);
    }
  }

  public async removeToken(token: string) {
    if (!token || token === "")
      throw new UserError("Nenhum token provido.", 401);

    const decodedToken = jwt.decode(token) as { username: string; exp: number };
    if (!decodedToken) throw new UserError("Nenhum token válido provido.", 400);

    await removeOneRedis(decodedToken.username).catch(() => {
      throw new UserError("Falha ao remover token.", 502);
    });

    throw new UserError("Falha ao remover token.", 502);
  }
}
