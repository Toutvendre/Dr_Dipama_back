import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Resource } from "../entities/Resource";
import { createZoomMeeting } from "../services/zoom.service";

const resourceRepository = AppDataSource.getRepository(Resource);

export class ResourceController {
    // ------------------ CRÉER UNE RESSOURCE ------------------
    static async create(req: Request, res: Response): Promise<Response> {
        try {
            const {
                title,
                description,
                type,
                sourceUrl,
                modeConference,
                conferenceLink,
                localisation,
                nombreTotal,
                disponibleALivraison,
                messagePublic,
                estAssocieAMessage,
                start_time,
                duration,
            } = req.body;

            const imagePath = req.file ? req.file.filename : undefined;

            // Vérifications de base
            if (!title || !type) {
                return res.status(400).json({
                    message: "Le titre et le type sont obligatoires.",
                });
            }

            // ---------- Validation selon le type ----------
            let conferenceLinkToSave = conferenceLink;

            switch (type) {
                case "conference":
                    if (!modeConference) {
                        return res.status(400).json({
                            message: "Le mode de la conférence est requis (en_ligne, presentielle, mixte).",
                        });
                    }

                    if (modeConference === "en_ligne" && !conferenceLink) {
                        // Création automatique d'une réunion Zoom
                        const zoomMeeting = await createZoomMeeting({
                            topic: title,
                            start_time: start_time || new Date(Date.now() + 3600000).toISOString(),
                            duration: duration ? parseInt(duration) : 60,
                        });
                        conferenceLinkToSave = zoomMeeting.join_url;
                    }

                    if (modeConference === "presentielle" && !localisation) {
                        return res.status(400).json({
                            message: "La localisation est requise pour une conférence présentielle.",
                        });
                    }
                    break;

                case "livre":
                    if (!nombreTotal) {
                        return res.status(400).json({
                            message: "Le nombre total d'exemplaires est requis pour un livre.",
                        });
                    }
                    break;

                case "message":
                    if (!messagePublic) {
                        return res.status(400).json({
                            message: "Le contenu du message public est requis.",
                        });
                    }
                    break;

                default:
                    break;
            }

            const resource = resourceRepository.create({
                title,
                description: description || undefined,
                type,
                sourceUrl: sourceUrl || undefined,
                imagePath,
                modeConference: modeConference || undefined,
                conferenceLink: conferenceLinkToSave || undefined,
                localisation: localisation || undefined,
                nombreTotal: nombreTotal ? parseInt(nombreTotal) : undefined,
                disponibleALivraison: disponibleALivraison === "true" || disponibleALivraison === true,
                messagePublic: messagePublic || undefined,
                estAssocieAMessage: estAssocieAMessage === "true" || estAssocieAMessage === true,
                // 🔹 Champs Zoom
                startTime: start_time ? new Date(start_time) : undefined,
                duration: duration ? parseInt(duration) : undefined,
            });

            await resourceRepository.save(resource);

            return res.status(201).json({
                message: "Ressource créée avec succès.",
                data: resource,
            });
        } catch (error: any) {
            console.error("Erreur création ressource:", error);
            return res.status(500).json({
                message: "Erreur interne du serveur.",
                error: error.message,
            });
        }
    }

    // ------------------ OBTENIR TOUTES LES RESSOURCES ------------------
    static async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const resources = await resourceRepository.find({
                order: { createdAt: "DESC" },
            });
            return res.json(resources);
        } catch (error: any) {
            console.error("Erreur getAll:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }

    // ------------------ OBTENIR UNE RESSOURCE PAR ID ------------------
    static async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const resource = await resourceRepository.findOneBy({
                id: parseInt(id, 10),
            });

            if (!resource) {
                return res.status(404).json({ message: "Ressource non trouvée." });
            }

            return res.json(resource);
        } catch (error: any) {
            console.error("Erreur getById:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }

    // ------------------ METTRE À JOUR UNE RESSOURCE ------------------
    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                type,
                sourceUrl,
                modeConference,
                conferenceLink,
                localisation,
                nombreTotal,
                disponibleALivraison,
                messagePublic,
                estAssocieAMessage,
                start_time,
                duration,
            } = req.body;

            const imagePath = req.file ? req.file.filename : undefined;

            const resource = await resourceRepository.findOneBy({
                id: parseInt(id, 10),
            });

            if (!resource) {
                return res.status(404).json({ message: "Ressource non trouvée." });
            }

            let conferenceLinkToSave = conferenceLink ?? resource.conferenceLink;

            // Si c’est une conférence en ligne et qu’on veut la mettre à jour sans lien → recrée une réunion Zoom
            if (type === "conference" && modeConference === "en_ligne" && !conferenceLinkToSave) {
                const zoomMeeting = await createZoomMeeting({
                    topic: title || resource.title,
                    start_time: start_time || new Date(Date.now() + 3600000).toISOString(),
                    duration: duration ? parseInt(duration) : 60,
                });
                conferenceLinkToSave = zoomMeeting.join_url;
            }

            Object.assign(resource, {
                title: title ?? resource.title,
                description: description ?? resource.description,
                type: type ?? resource.type,
                sourceUrl: sourceUrl ?? resource.sourceUrl,
                imagePath: imagePath ?? resource.imagePath,
                modeConference: modeConference ?? resource.modeConference,
                conferenceLink: conferenceLinkToSave,
                localisation: localisation ?? resource.localisation,
                nombreTotal: nombreTotal ? parseInt(nombreTotal) : resource.nombreTotal,
                disponibleALivraison:
                    disponibleALivraison !== undefined
                        ? disponibleALivraison === "true" || disponibleALivraison === true
                        : resource.disponibleALivraison,
                messagePublic: messagePublic ?? resource.messagePublic,
                estAssocieAMessage:
                    estAssocieAMessage !== undefined
                        ? estAssocieAMessage === "true" || estAssocieAMessage === true
                        : resource.estAssocieAMessage,
                // 🔹 Champs Zoom
                startTime: start_time ? new Date(start_time) : resource.startTime,
                duration: duration ? parseInt(duration) : resource.duration,
            });

            await resourceRepository.save(resource);

            return res.json({
                message: "Ressource mise à jour avec succès.",
                data: resource,
            });
        } catch (error: any) {
            console.error("Erreur update:", error);
            return res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
        }
    }

    // ------------------ SUPPRIMER UNE RESSOURCE ------------------
    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const resource = await resourceRepository.findOneBy({
                id: parseInt(id, 10),
            });

            if (!resource) {
                return res.status(404).json({ message: "Ressource non trouvée." });
            }

            await resourceRepository.remove(resource);

            return res.json({ message: "Ressource supprimée avec succès." });
        } catch (error: any) {
            console.error("Erreur delete:", error);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }
}
