// controllers/rendezvous.controller.ts

import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { RendezVous } from "../entities/RendezVous";
import { sendEmail } from "../utils/mail";

// Création d'une demande
export const createRendezVous = async (req: Request, res: Response) => {
    const { nom, email, telephone, sujet, message } = req.body;

    if (!nom || !email || !message)
        return res.status(400).json({ error: "Nom, email et message requis." });

    try {
        const repo = AppDataSource.getRepository(RendezVous);
        const rdv = repo.create({ nom, email, telephone, sujet, message });
        await repo.save(rdv);

        return res.status(201).json({ success: true, rdv });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne serveur." });
    }
};

// Liste des demandes (Dashboard)
export const getAllRendezVous = async (_req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(RendezVous);
        const rdvs = await repo.find({ order: { dateDemande: "DESC" } });
        return res.json(rdvs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne serveur." });
    }
};

// Confirmer un RDV et envoyer un e-mail
export const confirmRendezVous = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(RendezVous);
        const rdv = await repo.findOneBy({ id: Number(id) });

        if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé." });
        if (rdv.statut === "confirme") return res.status(400).json({ error: "Déjà confirmé." });

        rdv.statut = "confirme";
        await repo.save(rdv);

        // Envoi du mail automatique
        await sendEmail(
            rdv.email,
            "Votre rendez-vous a été confirmé",
            `Bonjour ${rdv.nom},\n\nVotre demande de rendez-vous concernant "${rdv.sujet ?? 'sans sujet'}" a été confirmée.\nNous vous contacterons bientôt pour les détails.\n\nMerci !`
        );

        return res.json({ success: true, rdv });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne serveur." });
    }
};

// Rejeter un RDV et envoyer un e-mail
export const rejectRendezVous = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const repo = AppDataSource.getRepository(RendezVous);
        const rdv = await repo.findOneBy({ id: Number(id) });

        if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé." });
        if (rdv.statut === "rejete") return res.status(400).json({ error: "Déjà rejeté." });

        rdv.statut = "rejete";
        await repo.save(rdv);

        // Envoi du mail de rejet
        await sendEmail(
            rdv.email,
            "Concernant votre demande de rendez-vous",
            `Bonjour ${rdv.nom},\n\nNous avons bien reçu votre demande de rendez-vous concernant "${rdv.sujet ?? 'sans sujet'}".\n\nMalheureusement, nous ne sommes pas en mesure de donner suite à votre demande pour le moment.\n\nNous vous remercions de votre compréhension.\n\nCordialement`
        );

        return res.json({ success: true, rdv });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne serveur." });
    }
};