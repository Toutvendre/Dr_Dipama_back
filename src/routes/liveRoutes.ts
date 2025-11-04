import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { startLive, stopLive, getLive } from "../controllers/LiveController";

const router = Router();

router.post("/start", authenticateJWT, startLive);
router.post("/stop", authenticateJWT, stopLive);
router.get("/current", getLive);

export default router;
