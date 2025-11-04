import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";

@Entity()
export class Parcours {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    titre!: string; // Exemple : "Développeur Web", "Licence en Informatique"

    @Column({ type: "date" })
    dateDebut!: Date;

    @Column({ type: "date", nullable: true })
    dateFin!: Date;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ nullable: true })
    categorie!: string; // Exemple : "Formation", "Professionnel", "Projet"

    @ManyToOne(() => Parcours, (parcours) => parcours.sousParcours, { nullable: true })
    parent!: Parcours | null;

    @OneToMany(() => Parcours, (parcours) => parcours.parent, { cascade: true })
    sousParcours!: Parcours[];

    @Column({ default: 0 })
    ordre!: number; // Pour trier visuellement si besoin

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
