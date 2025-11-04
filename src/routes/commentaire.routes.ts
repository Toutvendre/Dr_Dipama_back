import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { CommentaireController } from "../controllers/CommentaireController";

const router = Router();

router.post("/", authenticateJWT, CommentaireController.create);
router.delete("/:id", authenticateJWT, CommentaireController.delete);

export default router;
