import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Actualite } from "./Actualite";

@Entity()
export class Commentaire {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    auteur!: string;

    @Column({ type: "text" })
    contenu!: string;

    @ManyToOne(() => Actualite, (actualite) => actualite.commentaires, {
        onDelete: "CASCADE",
    })
    actualite!: Actualite;

    @CreateDateColumn()
    createdAt!: Date;
}
