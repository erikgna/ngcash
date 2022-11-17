import { Request, Response } from "express";

import { AccountController } from "../controllers/account";
import { AccountError } from "../errors/account";

const controller = new AccountController();

export class AccountService {
  public async getOne(req: Request, res: Response) {
    try {
      const data = await controller.getOne(req.params["id"]);

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof AccountError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }
}
