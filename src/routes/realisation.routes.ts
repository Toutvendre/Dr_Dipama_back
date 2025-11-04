import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { RealisationController } from "../controllers/RealisationController";

const router = Router();

// CRUD Réalisations
router.post("/", authenticateJWT, RealisationController.create);
router.get("/", RealisationController.getAll);
router.get("/:id", RealisationController.getById);
router.put("/:id", authenticateJWT, RealisationController.update);
router.delete("/:id", authenticateJWT, RealisationController.delete);

export default router;
