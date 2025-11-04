import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type RDVStatus = "en_attente" | "confirme" | "rejete";

@Entity("rendezvous")
export class RendezVous {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nom!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    telephone?: string;

    @Column({ nullable: true })
    sujet?: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "enum", enum: ["en_attente", "confirme", "rejete"], default: "en_attente" })
    statut!: RDVStatus;

    @CreateDateColumn()
    dateDemande!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
