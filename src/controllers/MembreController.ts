
// src/controllers/MembreController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Membre } from "../entities/Membre";

export class MembreController {
    // ✅ CREATE
    static async create(req: Request, res: Response) {
        try {
            const { nomComplet, profession, telephone } = req.body;

            if (!nomComplet || !profession || !telephone) {
                return res.status(400).json({
                    message: "Nom complet, profession et téléphone requis"
                });
            }

            const repo = AppDataSource.getRepository(Membre);
            const membre = repo.create({
                nomComplet,
                profession,
                telephone
            });

            await repo.save(membre);
            res.status(201).json(membre);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création", error });
        }
    }

    // ✅ LIRE TOUT
    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Membre);
            const membres = await repo.find({
                order: { createdAt: "DESC" },
            });
            res.json(membres);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    // ✅ LIRE UN
    static async getById(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Membre);
            const membre = await repo.findOneBy({ id: req.params.id });

            if (!membre)
                return res.status(404).json({ message: "Membre introuvable" });

            res.json(membre);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    // ✅ MODIFIER
    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Membre);
            const membre = await repo.findOneBy({ id: req.params.id });

            if (!membre)
                return res.status(404).json({ message: "Membre non trouvé" });

            repo.merge(membre, req.body);
            await repo.save(membre);

            res.json(membre);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour", error });
        }
    }

    // ✅ SUPPRIMER
    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Membre);
            const result = await repo.delete(req.params.id);

            if (result.affected === 0)
                return res.status(404).json({ message: "Membre non trouvé" });

            res.json({ message: "Membre supprimé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression", error });
        }
    }
}