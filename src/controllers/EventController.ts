import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Event } from "../entities/Event";
import { Resource } from "../entities/Resource";

const eventRepository = AppDataSource.getRepository(Event);
const resourceRepository = AppDataSource.getRepository(Resource);

export class EventController {
    // ------------------ CRÉER UN ÉVÉNEMENT ------------------
    static async create(req: Request, res: Response) {
        try {
            const { title, description, startTime, duration, location, link, conferenceId } = req.body;

            let eventData: Partial<Event> = {
                title,
                description,
                startTime: new Date(startTime), // CORRECTION: Convertir en Date
                duration,
                location,
                link
            };

            if (conferenceId) {
                const conference = await resourceRepository.findOneBy({ id: conferenceId, type: "conference" });
                if (!conference) return res.status(404).json({ message: "Conférence introuvable." });

                eventData = {
                    title: conference.title,
                    description: conference.description || undefined,
                    startTime: conference.startTime ? new Date(conference.startTime) : new Date(), // CORRECTION
                    duration: conference.duration,
                    location: conference.localisation,
                    link: conference.modeConference === "en_ligne" ? conference.conferenceLink : undefined,
                    conference,
                    conferenceId: conference.id,
                };
            }

            const event = eventRepository.create(eventData);
            await eventRepository.save(event);

            return res.status(201).json({ message: "Événement créé avec succès.", data: event });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur.", error: error.message });
        }
    }

    // ------------------ LISTER TOUS LES ÉVÉNEMENTS ------------------
    static async getAll(req: Request, res: Response) {
        try {
            const events = await eventRepository.find({
                order: { startTime: "ASC" },
                relations: ["conference"],
            });
            return res.json(events);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur." });
        }
    }

    // ------------------ OBTENIR UN ÉVÉNEMENT PAR ID ------------------
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const eventId = parseInt(id, 10);

            if (isNaN(eventId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const event = await eventRepository.findOne({
                where: { id: eventId },
                relations: ["conference"],
            });

            if (!event) return res.status(404).json({ message: "Événement introuvable." });
            return res.json(event);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur." });
        }
    }

    // ------------------ METTRE À JOUR UN ÉVÉNEMENT ------------------
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const eventId = parseInt(id, 10);

            if (isNaN(eventId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const { title, description, startTime, duration, location, link, conferenceId } = req.body;

            const event = await eventRepository.findOneBy({ id: eventId });
            if (!event) return res.status(404).json({ message: "Événement introuvable." });

            if (conferenceId) {
                const conference = await resourceRepository.findOneBy({ id: conferenceId, type: "conference" });
                if (!conference) return res.status(404).json({ message: "Conférence introuvable." });

                Object.assign(event, {
                    title: conference.title,
                    description: conference.description,
                    startTime: conference.startTime ? new Date(conference.startTime) : new Date(), // CORRECTION
                    duration: conference.duration,
                    location: conference.localisation,
                    link: conference.modeConference === "en_ligne" ? conference.conferenceLink : undefined,
                    conference,
                    conferenceId: conference.id,
                });
            } else {
                Object.assign(event, {
                    title,
                    description,
                    startTime: startTime ? new Date(startTime) : event.startTime, // CORRECTION
                    duration,
                    location,
                    link,
                    conference: null,
                    conferenceId: null
                });
            }

            await eventRepository.save(event);
            return res.json({ message: "Événement mis à jour avec succès.", data: event });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur.", error: error.message });
        }
    }

    // ------------------ SUPPRIMER UN ÉVÉNEMENT ------------------
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const eventId = parseInt(id, 10);

            if (isNaN(eventId)) {
                return res.status(400).json({ message: "ID invalide." });
            }

            const event = await eventRepository.findOneBy({ id: eventId });
            if (!event) return res.status(404).json({ message: "Événement introuvable." });

            await eventRepository.remove(event);
            return res.json({ message: "Événement supprimé avec succès." });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur." });
        }
    }
}