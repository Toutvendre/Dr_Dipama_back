// src/routes/membre.routes.ts
import { Router } from "express";
import { MembreController } from "../controllers/MembreController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Publique - Lecture et création (pour voir les membres et rejoindre la communauté)
router.get("/", MembreController.getAll);
router.get("/:id", MembreController.getById);
router.post("/", MembreController.create);

// Admin uniquement - Modification et suppression
router.put("/:id", authenticateJWT, authorizeAdmin, MembreController.update);
router.delete("/:id", authenticateJWT, authorizeAdmin, MembreController.delete);

export default router;
