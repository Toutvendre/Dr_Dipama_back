// src/app.ts
import express from "express";
import cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";
import resourceRoutes from "./routes/resource.routes";
import mediaRoutes from "./routes/media.routes";
import liveRoutes from "./routes/liveRoutes";
import newsletter from "./routes/newsletter.routes";
import actualiteRoutes from "./routes/actualite.routes";
import commentaireRoutes from "./routes/commentaire.routes";
import socialRoutes from "./routes/social.routes";
import realisationRoutes from "./routes/realisation.routes";
import eventRoutes from "./routes/event.routes";
import rendezvousRoutes from "./routes/rendezvous.routes";
import contributionRoutes from "./routes/contribution.routes";
import parcoursRoutes from "./routes/parcours.routes";

import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware CORS amélioré
app.use(cors({
    origin: ["http://localhost:3000", "https://dr-dipama-front.onrender.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir les fichiers uploadés
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/newsletter", newsletter);
app.use("/api/actualites", actualiteRoutes);
app.use("/api/commentaires", commentaireRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/realisations", realisationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rendezvous", rendezvousRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/parcours", parcoursRoutes);


AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => console.log("Database connection error:", error));

export default app;