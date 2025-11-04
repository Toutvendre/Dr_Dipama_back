import axios from "axios";

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

/**
 * Génère un token d'accès temporaire (valable environ 1h)
 */
export async function getZoomAccessToken(): Promise<string> {
    try {
        const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
        const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64");

        const response = await axios.post(tokenUrl, null, {
            headers: {
                Authorization: `Basic ${credentials}`,
            },
        });

        return response.data.access_token;
    } catch (error: any) {
        console.error("Erreur lors de la génération du token Zoom :", error.response?.data || error.message);
        throw new Error("Impossible d'obtenir le token Zoom");
    }
}

/**
 * Crée une réunion Zoom planifiée
 */
export async function createZoomMeeting({
    topic,
    start_time,
    duration,
    timezone = "Africa/Ouagadougou",
}: {
    topic: string;
    start_time: string;
    duration: number;
    timezone?: string;
}) {
    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
            topic,
            type: 2, // planifiée
            start_time,
            duration,
            timezone,
            settings: {
                host_video: true,
                participant_video: true,
                join_before_host: false,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
}
