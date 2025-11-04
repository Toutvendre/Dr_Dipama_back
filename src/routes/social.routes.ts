import { Router } from "express";
import { SocialController } from "../controllers/SocialController";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// 🔹 Mettre à jour ou créer les liens sociaux (protégé)
router.post("/update", authenticateJWT, SocialController.upsert);

// 🔹 Récupérer les liens sociaux (public)
router.get("/", SocialController.get);

export default router;
