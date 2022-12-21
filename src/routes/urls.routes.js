import { Router } from "express";
import { shortenUrl, getShortUrl, openShortUrl, removeUrl } from "../controllers/urls.controllers.js";
import { validateToken, shortUrlExist, canDeleteUrl } from "../middlewares/validate.url.middleware.js";

const router = Router();

router.post("/urls/shorten", validateToken, shortenUrl);
router.get("/urls/:id", getShortUrl);
router.get("/urls/open/:shortUrl", shortUrlExist, openShortUrl);
router.delete("/urls/:id", validateToken, canDeleteUrl, removeUrl);

export default router