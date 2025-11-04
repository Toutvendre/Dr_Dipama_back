import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/mail";

export const register = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(User);
        const { email, password } = req.body;

        const existing = await repo.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already used" });

        const hash = await bcrypt.hash(password, 10);
        const user = repo.create({ email, password: hash });
        await repo.save(user);

        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(User);
        const { email, password } = req.body;

        const user = await repo.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: "Invalid password" });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// 👇 NOUVELLE FONCTION
export const getMe = async (req: Request, res: Response) => {
    try {
        // Le middleware authenticateJWT a déjà attaché req.user
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOne({
            where: { id: userId },
            select: ["id", "email", "role",]  // Ne pas retourner le mot de passe
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const registerEditor = async (req: Request, res: Response) => {
    try {
        const repo = AppDataSource.getRepository(User);
        const { email, password } = req.body;

        // Vérifier si l'email existe déjà
        const existing = await repo.findOne({ where: { email } });
        if (existing) return res.status(400).json({ message: "Email already used" });

        const hash = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec rôle "editor"
        const user = repo.create({ email, password: hash, role: "editor" });
        await repo.save(user);

        res.status(201).json({ message: "Editor created successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Génère un code OTP 5 chiffres
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expire = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = otp;
    user.resetOtpExpire = expire;
    await repo.save(user);

    // Envoie email
    await sendEmail(email, "Réinitialisation de mot de passe", `Votre code de réinitialisation est : ${otp}`);

    res.json({ message: "OTP sent to your email" });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOtp || !user.resetOtpExpire) {
        return res.status(400).json({ message: "No OTP requested" });
    }

    if (user.resetOtp !== otp || user.resetOtpExpire < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await repo.save(user);

    res.json({ message: "Password reset successfully" });
};