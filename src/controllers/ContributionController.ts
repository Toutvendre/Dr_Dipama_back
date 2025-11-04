import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Contribution } from "../entities/Contribution";

export class ContributionController {
    // ✅ CREATE
    static async create(req: Request, res: Response) {
        try {
            const { titre, contenu, theme, link, typeProjet } = req.body;

            if (!titre || !contenu) {
                return res.status(400).json({ message: "Titre et contenu requis" });
            }

            const repo = AppDataSource.getRepository(Contribution);
            const contribution = repo.create({
                titre,
                contenu,
                theme,
                link,
                typeProjet
            });

            await repo.save(contribution);
            res.status(201).json(contribution);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création", error });
        }
    }

    // ✅ LIRE TOUT
    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Contribution);
            const contributions = await repo.find({
                order: { createdAt: "DESC" },
            });
            res.json(contributions);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    // ✅ LIRE UN
    static async getById(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Contribution);
            const contribution = await repo.findOneBy({ id: req.params.id });

            if (!contribution)
                return res.status(404).json({ message: "Contribution introuvable" });

            res.json(contribution);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    // ✅ MODIFIER
    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Contribution);
            const contribution = await repo.findOneBy({ id: req.params.id });

            if (!contribution)
                return res.status(404).json({ message: "Contribution non trouvée" });

            repo.merge(contribution, req.body);
            await repo.save(contribution);

            res.json(contribution);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour", error });
        }
    }

    // ✅ SUPPRIMER
    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Contribution);
            const result = await repo.delete(req.params.id);

            if (result.affected === 0)
                return res.status(404).json({ message: "Contribution non trouvée" });

            res.json({ message: "Contribution supprimée" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression", error });
        }
    }
}
