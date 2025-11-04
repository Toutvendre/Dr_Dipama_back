import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Actualite } from "../entities/Actualite";

export class ActualiteController {
    static async create(req: Request, res: Response) {
        try {
            const { titre, contenu, type, auteur } = req.body;

            if (!titre || !contenu) {
                return res.status(400).json({ message: "Titre et contenu requis" });
            }

            const repo = AppDataSource.getRepository(Actualite);
            const actualite = repo.create({ titre, contenu, type, auteur });
            await repo.save(actualite);

            res.status(201).json(actualite);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la création", error });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Actualite);
            const actualites = await repo.find({
                relations: ["commentaires"],
                order: { createdAt: "DESC" },
            });
            res.json(actualites);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Actualite);
            const actualite = await repo.findOne({
                where: { id: req.params.id },
                relations: ["commentaires"],
            });
            if (!actualite)
                return res.status(404).json({ message: "Actualité introuvable" });
            res.json(actualite);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Actualite);
            const actualite = await repo.findOneBy({ id: req.params.id });
            if (!actualite)
                return res.status(404).json({ message: "Actualité non trouvée" });

            repo.merge(actualite, req.body);
            await repo.save(actualite);

            res.json(actualite);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Actualite);
            const result = await repo.delete(req.params.id);
            if (result.affected === 0)
                return res.status(404).json({ message: "Actualité non trouvée" });

            res.json({ message: "Actualité supprimée" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression", error });
        }
    }
}
