import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import { TransactionService } from "../services/transaction";

const router = Router();
const service = new TransactionService();

router.get("/:id/:page", verifyToken, service.getPagination);
router.get("/:id/:page/:filter", verifyToken, service.getPaginationFilter);
router.post("/", verifyToken, service.create);

export default router;
