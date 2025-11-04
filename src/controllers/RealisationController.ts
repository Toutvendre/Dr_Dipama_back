import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Realisation } from "../entities/Realisation";

export class RealisationController {
    static async create(req: Request, res: Response) {
        try {
            const { titre, contenu, type, auteur } = req.body;

            if (!titre || !contenu) {
                return res.status(400).json({ message: "Titre et contenu requis" });
            }

            const repo = AppDataSource.getRepository(Realisation);
            const realisation = repo.create({ titre, contenu, type, auteur });
            await repo.save(realisation);

            res.status(201).json(realisation);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Realisation);
            const realisations = await repo.find({ order: { createdAt: "DESC" } });
            res.json(realisations);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Realisation);
            const realisation = await repo.findOneBy({ id: req.params.id });
            if (!realisation)
                return res.status(404).json({ message: "Réalisation introuvable" });

            res.json(realisation);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Realisation);
            const realisation = await repo.findOneBy({ id: req.params.id });
            if (!realisation)
                return res.status(404).json({ message: "Réalisation non trouvée" });

            repo.merge(realisation, req.body);
            await repo.save(realisation);

            res.json(realisation);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Realisation);
            const result = await repo.delete(req.params.id);
            if (result.affected === 0)
                return res.status(404).json({ message: "Réalisation non trouvée" });

            res.json({ message: "Réalisation supprimée" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression", error });
        }
    }
}
