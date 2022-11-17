import { Request, Response } from "express";

import { TransactionController } from "../controllers/transaction";
import { TransactionError } from "../errors/transaction";

const controller = new TransactionController();

export class TransactionService {
  public async create(req: Request, res: Response) {
    try {
      const data = await controller.create(req.body);
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof TransactionError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }

  public async getPagination(req: Request, res: Response) {
    try {
      const data = await controller.getPagination(
        parseInt(req.params["id"]),
        parseInt(req.params["page"])
      );
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof TransactionError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }

  public async getPaginationFilter(req: Request, res: Response) {
    try {
      const data = await controller.getPaginationFilter(
        parseInt(req.params["id"]),
        parseInt(req.params["page"]),
        req.params["filter"]
      );
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof TransactionError) {
        res.status(parseInt(error.name)).json(error.message);
      } else res.status(500).json("Erro interno no servidor.");
    }
  }
}
