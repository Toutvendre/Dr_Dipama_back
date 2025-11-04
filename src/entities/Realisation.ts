import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("realisations")
export class Realisation {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    titre!: string; // Nom ou titre de la réalisation

    @Column({ type: "text" })
    contenu!: string; // Description détaillée ou résumé

    // Exemple de type : "projet", "initiative", "distinction", "réforme", etc.
    @Column({ default: "projet" })
    type!: string;

    @Column({ nullable: true })
    auteur!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
