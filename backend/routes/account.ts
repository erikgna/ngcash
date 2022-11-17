import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import { AccountService } from "../services/account";

const router = Router();
const service = new AccountService();

router.get("/:id", verifyToken, service.getOne);

export default router;
