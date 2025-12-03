import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Resource } from "../entities/Resource";
import { Media } from "../entities/Media";
import { LiveSession } from "../entities/LiveSession";
import { Newsletter } from "../entities/Newsletter";
import { Actualite } from "../entities/Actualite";
import { Commentaire } from "../entities/Commentaire";
import { Social } from "../entities/Social";
import { Realisation } from "../entities/Realisation";
import { Event } from "../entities/Event";
import { RendezVous } from "../entities/RendezVous";
import { Membre } from "../entities/Membre";
import { Concept } from "../entities/Concept";

import { Parcours } from "../entities/Parcours";
import dotenv from "dotenv";


dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Resource, Media, LiveSession, Newsletter, Actualite, Commentaire, Social, Realisation, Event, RendezVous, Membre, Concept, Parcours],
});
