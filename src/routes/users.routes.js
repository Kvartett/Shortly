import { Router } from "express";
import { userInfo, getRanking } from "../controllers/users.controllers.js";
import { validateTokenUser } from "../middlewares/validate.users.middleware.js";

const router = Router();

router.get("/users/me", validateTokenUser, userInfo);
router.get("/ranking", getRanking);

export default router