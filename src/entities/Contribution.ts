import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Contribution {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    titre!: string;

    @Column({ type: "text" })
    contenu!: string;

    // Exemples : "Article", "Projet", "Initiative", "Rapport", "Proposition", etc.
    @Column({ default: "Article" })
    typeProjet!: string;

    // Ex : "Éducation", "Santé", "Économie", "Gouvernance", etc.
    @Column({ nullable: true })
    theme!: string;

    // Lien vers la source externe ou média associé
    @Column({ nullable: true })
    link!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
