import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { ActualiteController } from "../controllers/ActualiteController";

const router = Router();
// Routes pour les actualités
router.post("/", authenticateJWT, ActualiteController.create);
router.get("/", ActualiteController.getAll);
router.get("/:id", ActualiteController.getById);
router.put("/:id", authenticateJWT, ActualiteController.update);
router.delete("/:id", authenticateJWT, ActualiteController.delete);

export default router;
