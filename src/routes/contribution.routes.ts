import { Router } from "express";
import { ContributionController } from "../controllers/ContributionController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Publique
router.get("/", ContributionController.getAll);
router.get("/:id", ContributionController.getById);

// Admin
router.post("/", authenticateJWT, authorizeAdmin, ContributionController.create);
router.put("/:id", authenticateJWT, authorizeAdmin, ContributionController.update);
router.delete("/:id", authenticateJWT, authorizeAdmin, ContributionController.delete);

export default router;
