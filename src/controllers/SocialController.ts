import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Social } from "../entities/Social";

const socialRepository = AppDataSource.getRepository(Social);

export class SocialController {
    // 🔹 Créer ou mettre à jour les liens sociaux
    static async upsert(req: Request, res: Response) {
        try {
            const existing = await socialRepository.findOne({ where: {} });

            if (existing) {
                socialRepository.merge(existing, req.body);
                await socialRepository.save(existing);
                return res.json({ message: "Liens sociaux mis à jour avec succès.", data: existing });
            }

            const newSocial = socialRepository.create(req.body);
            await socialRepository.save(newSocial);
            return res.status(201).json({ message: "Liens sociaux enregistrés avec succès.", data: newSocial });
        } catch (error) {
            console.error("Erreur SocialController.upsert:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }

    // 🔹 Récupérer les liens sociaux
    static async get(req: Request, res: Response) {
        try {
            const social = await socialRepository.findOne({ where: {} });
            if (!social) {
                return res.status(404).json({ message: "Aucun lien social trouvé." });
            }
            return res.json(social);
        } catch (error) {
            console.error("Erreur SocialController.get:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
