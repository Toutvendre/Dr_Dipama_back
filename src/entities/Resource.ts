import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type ResourceType = "article" | "livre" | "conference" | "enseignement" | "message";
export type ConferenceMode = "en_ligne" | "presentielle" | "mixte";

@Entity("resources")
export class Resource {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({
        type: "enum",
        enum: ["article", "livre", "conference", "enseignement", "message"],
    })
    type!: ResourceType;

    // ---------- COMMUN ----------
    @Column({ type: "varchar", nullable: true })
    imagePath?: string; // image de couverture (utilisée pour les livres)

    @Column({ type: "varchar", nullable: true })
    sourceUrl?: string; // lien d'une ressource externe si besoin

    // ---------- LIVRES ----------
    @Column({ type: "int", nullable: true })
    nombreTotal?: number; // nombre total de livres disponibles

    @Column({ type: "boolean", default: false })
    disponibleALivraison!: boolean; // option se faire livrer un livre

    // ---------- CONFÉRENCES ----------
    @Column({
        type: "enum",
        enum: ["en_ligne", "presentielle", "mixte"],
        nullable: true,
    })
    modeConference?: ConferenceMode;

    @Column({ type: "varchar", nullable: true })
    conferenceLink?: string; // lien Zoom/Meet si en ligne

    @Column({ type: "varchar", nullable: true })
    localisation?: string; // lieu si présentielle

    // NOUVEAU : date/heure de la conférence
    @Column({ type: "timestamp", nullable: true })
    startTime?: Date;

    // NOUVEAU : durée en minutes
    @Column({ type: "int", nullable: true })
    duration?: number;

    // ---------- MESSAGES ----------
    @Column({ type: "text", nullable: true })
    messagePublic?: string; // simple message adressé au public

    // ---------- ENSEIGNEMENT ----------
    @Column({ type: "boolean", default: false })
    estAssocieAMessage!: boolean; // pour indiquer si c’est un enseignement lié à un message

    // ---------- TIMESTAMPS ----------
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
