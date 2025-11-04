// src/middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 🔹 Détermine le dossier selon le type de fichier uploadé
        let folder = "resources"; // Par défaut

        // Si la route contient "medias", on utilise le dossier medias
        if (req.baseUrl.includes("/medias")) {
            folder = "medias";
        }

        const folderPath = path.join(uploadDir, folder);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB pour supporter les vidéos
    },
    fileFilter: (req, file, cb) => {
        // 🔹 Accepte images et vidéos pour les médias
        if (req.baseUrl.includes("/medias")) {
            if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
                cb(null, true);
            } else {
                cb(new Error("Seules les images et vidéos sont autorisées"));
            }
        } else {
            // Pour les resources, seulement les images
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Seules les images sont autorisées"));
            }
        }
    },
});