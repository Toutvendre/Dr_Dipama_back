import { Router } from "express";
import { registerEditor, login, forgotPassword, resetPassword, getMe } from "../controllers/auth.controller";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register/admin", registerEditor);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


// Créer un éditeur → seulement admin
router.post("/register/editor", authenticateJWT, authorizeAdmin, registerEditor);
router.get("/me", authenticateJWT, getMe);

export default router;
