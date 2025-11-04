import { Router } from "express";
import { MediaController } from "../controllers/MediaController";
import { upload } from "../middlewares/upload";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques (accès libre)
router.get("/", MediaController.getAll);
router.get("/:id", MediaController.getById);

// Routes protégées (nécessite une authentification)
router.post(
    "/",
    authenticateJWT,
    authorizeAdmin,
    upload.single("file"),
    MediaController.create
);

router.put(
    "/:id",
    authenticateJWT,
    authorizeAdmin,
    upload.single("file"),
    MediaController.update
);

router.delete(
    "/:id",
    authenticateJWT,
    authorizeAdmin,
    MediaController.delete
);

export default router;