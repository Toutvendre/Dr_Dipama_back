import { Router } from "express";
import { ParcoursController } from "../controllers/ParcoursController";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// Création d’un parcours (protégé)
router.post("/", authenticateJWT, ParcoursController.create);

// Récupérer tous les parcours
router.get("/", ParcoursController.getAll);

// Récupérer un parcours par ID
router.get("/:id", ParcoursController.getById);

// Mise à jour d’un parcours (protégé)
router.put("/:id", authenticateJWT, ParcoursController.update);

// Suppression d’un parcours (protégé)
router.delete("/:id", authenticateJWT, ParcoursController.delete);

export default router;
