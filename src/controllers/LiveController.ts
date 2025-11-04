// backend/src/controllers/LiveController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { LiveSession } from "../entities/LiveSession";
import { User } from "../entities/User";

export const startLive = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(LiveSession);
        const userRepo = AppDataSource.getRepository(User);

        const { title, description } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const user = await userRepo.findOneBy({ id: userId });
        if (!user || (user.role !== "admin" && user.role !== "editor")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Marquer TOUS les anciens lives comme inactifs
        await repo.update({ isActive: true }, { isActive: false });

        const live = repo.create({
            title,
            description,
            isActive: true,
            streamUrl: "http://localhost:4001/radio",
            createdBy: user,
        });

        await repo.save(live);
        res.status(201).json({ message: "Live started", live });
    } catch (error) {
        console.error("startLive error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const stopLive = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(LiveSession);
        const live = await repo.findOne({ where: { isActive: true } });

        if (!live) {
            return res.status(404).json({ message: "No active live found" });
        }

        live.isActive = false;
        await repo.save(live);

        res.json({ message: "Live stopped", live });
    } catch (error) {
        console.error("stopLive error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getLive = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(LiveSession);
        const live = await repo.findOne({
            where: { isActive: true },
            relations: ["createdBy"],
        });

        // CORRECTION : Retourner null au lieu de 404
        if (!live) {
            return res.json(null);
        }

        res.json({
            id: live.id,
            title: live.title,
            description: live.description,
            streamUrl: live.streamUrl,
            isActive: live.isActive,
            createdBy: live.createdBy.email,
            startedAt: live.createdAt,
            createdAt: live.createdAt,
            updatedAt: live.updatedAt,
        });
    } catch (error) {
        console.error("getLive error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};