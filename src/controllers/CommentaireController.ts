import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Commentaire } from "../entities/Commentaire";
import { Actualite } from "../entities/Actualite";

export class CommentaireController {
    static async create(req: Request, res: Response) {
        try {
            const { actualiteId, auteur, contenu } = req.body;

            const actualiteRepo = AppDataSource.getRepository(Actualite);
            const actualite = await actualiteRepo.findOneBy({ id: actualiteId });
            if (!actualite)
                return res.status(404).json({ message: "Actualité introuvable" });

            const commentaireRepo = AppDataSource.getRepository(Commentaire);
            const commentaire = commentaireRepo.create({
                auteur,
                contenu,
                actualite,
            });
            await commentaireRepo.save(commentaire);

            res.status(201).json(commentaire);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l’ajout", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Commentaire);
            const result = await repo.delete(req.params.id);
            if (result.affected === 0)
                return res.status(404).json({ message: "Commentaire non trouvé" });

            res.json({ message: "Commentaire supprimé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la suppression", error });
        }
    }
}
