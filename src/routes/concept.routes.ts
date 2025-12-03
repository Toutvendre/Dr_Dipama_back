// src/routes/concept.routes.ts
import { Router } from "express";
import { ConceptController } from "../controllers/ConceptController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Publique - Lecture seule
router.get("/", ConceptController.get);

// Admin uniquement - Modification
router.put("/", authenticateJWT, authorizeAdmin, ConceptController.update);

export default router;