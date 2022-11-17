import { Request, Response } from "express";

import { UserController } from "../controllers/user";
import { UserError } from "../errors/user";

const controller = new UserController();

export class UserService {
  public async login(req: Request, res: Response) {
    try {
      const data = await controller.login(req.body);

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof UserError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }

  public async register(req: Request, res: Response) {
    try {
      await controller.register(req.body);
      res.status(200).json();
    } catch (error) {
      if (error instanceof UserError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }

  public async token(req: Request, res: Response) {
    try {
      const newToken = await controller.token(
        req.headers["refresh-token"] as string
      );
      res.status(200).json(newToken);
    } catch (error) {
      if (error instanceof UserError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }

  public async removeToken(req: Request, res: Response) {
    try {
      const newToken = await controller.token(
        req.headers["refresh-token"] as string
      );
      res.status(200).json(newToken);
    } catch (error) {
      if (error instanceof UserError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }
}
