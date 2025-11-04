import { Router } from "express";
import multer from "multer";
import { NewsletterController } from "../controllers/NewsletterController";
import { authenticateJWT, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({ dest: "uploads/newsletters/" });

// 🔹 Inscription à la newsletter (publique)
router.post("/subscribe", NewsletterController.subscribe);

// 🔹 Récupérer tous les emails (protégé)
router.get("/emails", authenticateJWT, authorizeAdmin, NewsletterController.getAllEmails);

// 🔹 Diffuser une newsletter avec document PDF (protégé)
router.post(
    "/broadcast",
    authenticateJWT,
    authorizeAdmin,
    upload.single("document"),
    NewsletterController.broadcast
);

export default router;
