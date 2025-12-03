// src/controllers/ConceptController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Concept } from "../entities/Concept";

export class ConceptController {
    // ✅ LIRE (Un seul concept existe)
    static async get(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Concept);
            let concept = await repo.findOne({ where: {} });

            // Si aucun concept n'existe, en créer un par défaut
            if (!concept) {
                concept = repo.create({
                    contenu: "Bienvenue dans Le Nouvel Ordre Idéal. Définissez ici le concept de votre vision."
                });
                await repo.save(concept);
            }

            res.json(concept);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération", error });
        }
    }

    // ✅ MODIFIER
    static async update(req: Request, res: Response) {
        try {
            const { contenu } = req.body;

            if (!contenu) {
                return res.status(400).json({ message: "Le contenu est requis" });
            }

            const repo = AppDataSource.getRepository(Concept);
            let concept = await repo.findOne({ where: {} });

            if (!concept) {
                // Créer si n'existe pas
                concept = repo.create({ contenu });
            } else {
                // Mettre à jour
                concept.contenu = contenu;
            }

            await repo.save(concept);
            res.json(concept);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour", error });
        }
    }
}
