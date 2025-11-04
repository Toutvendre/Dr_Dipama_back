// src/controllers/MediaController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Media } from "../entities/Media";

const mediaRepository = AppDataSource.getRepository(Media);

export class MediaController {

    // 🔹 Créer un média
    static async create(req: Request, res: Response) {
        try {
            const { title, description, type, sourceUrl } = req.body;

            // 🔹 CORRECTION : Sauvegarder seulement le chemin relatif comme pour les resources
            const filePath = req.file ? `uploads/medias/${req.file.filename}` : null;

            // Validation du titre
            if (!title || !title.trim()) {
                return res.status(400).json({ message: "Le titre est obligatoire." });
            }

            // Validation du type
            if (!type || !["video", "photo"].includes(type)) {
                return res.status(400).json({ message: "Le type doit être 'video' ou 'photo'." });
            }

            // Vérifier qu'au moins un fichier ou une URL source est fourni
            if (!filePath && !sourceUrl) {
                return res.status(400).json({
                    message: "Veuillez fournir soit un fichier, soit une URL source."
                });
            }

            const media = mediaRepository.create({
                title: title.trim(),
                description: description?.trim() || null,
                type,
                filePath: filePath || null,
                sourceUrl: sourceUrl?.trim() || null,
            });

            await mediaRepository.save(media);

            return res.status(201).json({
                message: "Média créé avec succès.",
                data: media
            });
        } catch (error) {
            console.error("Erreur création média:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }

    // 🔹 Récupérer tous les médias
    static async getAll(req: Request, res: Response) {
        try {
            const medias = await mediaRepository.find({
                order: { createdAt: "DESC" }
            });
            return res.json(medias);
        } catch (error) {
            console.error("Erreur getAll:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }

    // 🔹 Récupérer un média par ID
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const mediaId = parseInt(id, 10);

            if (isNaN(mediaId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const media = await mediaRepository.findOneBy({ id: mediaId });

            if (!media) {
                return res.status(404).json({ message: "Média non trouvé." });
            }

            return res.json(media);
        } catch (error) {
            console.error("Erreur getById:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }

    // 🔹 Mettre à jour un média
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, description, type, sourceUrl } = req.body;

            // 🔹 CORRECTION : Sauvegarder seulement le chemin relatif
            const filePath = req.file ? `uploads/medias/${req.file.filename}` : undefined;

            const mediaId = parseInt(id, 10);

            if (isNaN(mediaId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const media = await mediaRepository.findOneBy({ id: mediaId });
            if (!media) {
                return res.status(404).json({ message: "Média non trouvé." });
            }

            // Validation du type si fourni
            if (type && !["video", "photo"].includes(type)) {
                return res.status(400).json({
                    message: "Le type doit être 'video' ou 'photo'."
                });
            }

            // Mise à jour des champs
            if (title) media.title = title.trim();
            if (description !== undefined) media.description = description?.trim() || null;
            if (type) media.type = type;
            if (sourceUrl !== undefined) media.sourceUrl = sourceUrl?.trim() || null;
            if (filePath !== undefined) media.filePath = filePath;

            await mediaRepository.save(media);

            return res.json({
                message: "Média mis à jour avec succès.",
                data: media
            });
        } catch (error) {
            console.error("Erreur update:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }

    // 🔹 Supprimer un média
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const mediaId = parseInt(id, 10);

            if (isNaN(mediaId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const media = await mediaRepository.findOneBy({ id: mediaId });
            if (!media) {
                return res.status(404).json({ message: "Média non trouvé." });
            }

            await mediaRepository.remove(media);
            return res.json({ message: "Média supprimé avec succès." });
        } catch (error) {
            console.error("Erreur delete:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error instanceof Error ? error.message : "Erreur inconnue"
            });
        }
    }
}