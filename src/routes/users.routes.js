import { Router } from "express";
import { userInfo } from "../controllers/users.controllers.js";
import { validateTokenUser } from "../middlewares/validate.users.middleware.js";

const router = Router();

router.get("/users/me", validateTokenUser, userInfo);

export default router