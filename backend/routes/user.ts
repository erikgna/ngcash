import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

import { UserService } from "../services/user";

const router = Router();
const service = new UserService();

router.post("/login", service.login);
router.post("/register", service.register);

router.get("/token", service.token);
router.get("/remove-token", verifyToken, service.removeToken);

export default router;
