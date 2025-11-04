import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Parcours } from "../entities/Parcours";

export class ParcoursController {
    // Créer un parcours
    static async create(req: Request, res: Response) {
        try {
            const { titre, dateDebut, dateFin, description, categorie, parentId, ordre } = req.body;

            if (!titre || !dateDebut) {
                return res.status(400).json({ message: "Titre et date de début sont requis" });
            }

            const repo = AppDataSource.getRepository(Parcours);
            const parcours = repo.create({
                titre,
                dateDebut,
                dateFin,
                description,
                categorie,
                ordre,
            });

            // Associer un parent si fourni (pour créer une hiérarchie)
            if (parentId) {
                const parent = await repo.findOneBy({ id: parentId });
                if (!parent) {
                    return res.status(404).json({ message: "Parcours parent introuvable" });
                }
                parcours.parent = parent;
            }

            await repo.save(parcours);
            return res.status(201).json(parcours);
        } catch (error) {
            console.error("Erreur création parcours:", error);
            return res.status(500).json({ message: "Erreur lors de la création du parcours" });
        }
    }

    // Récupérer tous les parcours (avec sous-parcours)
    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Parcours);
            const parcours = await repo.find({
                relations: ["sousParcours", "parent"],
                order: {
                    ordre: "ASC",
                    dateDebut: "ASC",
                },
            });

            return res.status(200).json(parcours);
        } catch (error) {
            console.error("Erreur récupération parcours:", error);
            return res.status(500).json({ message: "Erreur lors de la récupération" });
        }
    }

    // Récupérer un parcours par ID
    static async getById(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Parcours);
            const parcours = await repo.findOne({
                where: { id: req.params.id },
                relations: ["sousParcours", "parent"],
            });

            if (!parcours) {
                return res.status(404).json({ message: "Parcours introuvable" });
            }

            return res.status(200).json(parcours);
        } catch (error) {
            console.error("Erreur récupération par ID:", error);
            return res.status(500).json({ message: "Erreur lors de la récupération du parcours" });
        }
    }

    // Mettre à jour un parcours
    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Parcours);
            const parcours = await repo.findOneBy({ id: req.params.id });

            if (!parcours) {
                return res.status(404).json({ message: "Parcours non trouvé" });
            }

            const { parentId } = req.body;
            if (parentId) {
                const parent = await repo.findOneBy({ id: parentId });
                if (!parent) {
                    return res.status(404).json({ message: "Parcours parent introuvable" });
                }
                parcours.parent = parent;
            }

            repo.merge(parcours, req.body);
            await repo.save(parcours);

            return res.status(200).json(parcours);
        } catch (error) {
            console.error("Erreur mise à jour parcours:", error);
            return res.status(500).json({ message: "Erreur lors de la mise à jour du parcours" });
        }
    }

    // Supprimer un parcours
    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Parcours);
            const result = await repo.delete(req.params.id);

            if (result.affected === 0) {
                return res.status(404).json({ message: "Parcours non trouvé" });
            }

            return res.status(200).json({ message: "Parcours supprimé avec succès" });
        } catch (error) {
            console.error("Erreur suppression parcours:", error);
            return res.status(500).json({ message: "Erreur lors de la suppression du parcours" });
        }
    }
}
