import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        const repo = AppDataSource.getRepository(User);

        // Vérifie si un admin existe déjà
        const existing = await repo.findOne({ where: { role: "admin" } });
        if (existing) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10);

        const admin = repo.create({
            email: process.env.ADMIN_EMAIL,
            password: hash,
            role: "admin",
        });

        await repo.save(admin);
        console.log("Admin created successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seeder error:", error);
        process.exit(1);
    }
};

seedAdmin();
