import { Router } from "express";
import { ResourceController } from "../controllers/ResourceController";
import { upload } from "../middlewares/upload";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques (accès libre)
router.get("/", ResourceController.getAll);
router.get("/:id", ResourceController.getById);

// Routes protégées (nécessite une authentification)
router.post(
    "/",
    authenticateJWT,
    authorizeAdmin,
    upload.single("image"),
    ResourceController.create
);

router.put(
    "/:id",
    authenticateJWT,
    authorizeAdmin,
    upload.single("image"),
    ResourceController.update
);

router.delete(
    "/:id",
    authenticateJWT,
    authorizeAdmin,
    ResourceController.delete
);

export default router;