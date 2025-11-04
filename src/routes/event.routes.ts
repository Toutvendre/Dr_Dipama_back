import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques
router.get("/", EventController.getAll);
router.get("/:id", EventController.getById);

// Routes protégées (création, update, suppression)
router.post("/", authenticateJWT, authorizeAdmin, EventController.create);
router.put("/:id", authenticateJWT, authorizeAdmin, EventController.update);
router.delete("/:id", authenticateJWT, authorizeAdmin, EventController.delete);

export default router;
