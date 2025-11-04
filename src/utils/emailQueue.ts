import { sendEmail } from "./mail";

interface EmailQueueItem {
    email: string;
    nomComplet: string;
    motif?: string;
    documentPath?: string;
}

const emailQueue: EmailQueueItem[] = [];
let isProcessingQueue = false;

/**
 * Ajouter un email à la queue
 */
export const enqueueEmail = (item: EmailQueueItem) => {
    emailQueue.push(item);
    processQueue(); // lancer le traitement si pas déjà en cours
};

/**
 * Traiter la queue
 */
const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (emailQueue.length > 0) {
        const item = emailQueue.shift()!;
        try {
            await sendEmail(
                item.email,
                "Nouvelle Newsletter",
                `Bonjour ${item.nomComplet},\n\n${item.motif || "Veuillez consulter le document joint."}`,
                item.documentPath ? [{ path: item.documentPath }] : []
            );
        } catch (err) {
            console.error("Erreur envoi email queue:", err);
        }
    }

    isProcessingQueue = false;
};
