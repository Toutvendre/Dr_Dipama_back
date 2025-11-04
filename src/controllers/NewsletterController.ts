import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Newsletter } from "../entities/Newsletter";
import { enqueueEmail } from "../utils/emailQueue";

const newsletterRepo = AppDataSource.getRepository(Newsletter);

export class NewsletterController {

    // 🔹 Inscription à la newsletter
    static async subscribe(req: Request, res: Response) {
        try {
            const { nomComplet, email } = req.body;

            if (!nomComplet || !email) {
                return res.status(400).json({ message: "Nom complet et email obligatoires." });
            }

            const existing = await newsletterRepo.findOneBy({ email });
            if (existing) return res.status(409).json({ message: "Cet email est déjà inscrit." });

            const subscriber = newsletterRepo.create({ nomComplet, email });
            await newsletterRepo.save(subscriber);

            return res.status(201).json({ message: "Inscription réussie à la newsletter." });
        } catch (err) {
            console.error("Erreur inscription newsletter:", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }

    // 🔹 Récupérer tous les emails
    static async getAllEmails(req: Request, res: Response) {
        try {
            const subscribers = await newsletterRepo.find({
                select: ["nomComplet", "email"],
                order: { createdAt: "DESC" },
            });
            return res.json(subscribers);
        } catch (err) {
            console.error("Erreur récupération emails:", err);
            return res.status(500).json({ message: "Erreur interne du serveur." });
        }
    }

    // 🔹 Diffuser une newsletter avec queue
    static async broadcast(req: Request, res: Response) {
        try {
            const { motif } = req.body;
            const documentPath = req.file ? req.file.path : undefined;

            if (!motif && !documentPath) {
                return res.status(400).json({ message: "Veuillez fournir un motif ou un document." });
            }

            const subscribers = await newsletterRepo.find();
            if (subscribers.length === 0) return res.status(404).json({ message: "Aucun abonné trouvé." });

            // Ajouter tous les abonnés à la queue
            for (const subscriber of subscribers) {
                enqueueEmail({
                    email: subscriber.email,
                    nomComplet: subscriber.nomComplet,
                    motif,
                    documentPath,
                });
            }

            return res.json({ message: "Diffusion de la newsletter en cours. Les emails seront envoyés en arrière-plan." });
        } catch (err) {
            console.error("Erreur envoi newsletter:", err);
            return res.status(500).json({ message: "Erreur lors de la diffusion." });
        }
    }
}
