// routes/rendezvous.routes.ts

import { Router } from "express";
import {
    createRendezVous,
    getAllRendezVous,
    confirmRendezVous,
    rejectRendezVous
} from "../controllers/rendezvous.controller";

const router = Router();

router.post("/", createRendezVous);
router.get("/", getAllRendezVous);
router.patch("/:id/confirmer", confirmRendezVous);
router.patch("/:id/rejeter", rejectRendezVous);

export default router;