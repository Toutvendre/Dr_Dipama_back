import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Commentaire } from "./Commentaire";

@Entity()
export class Actualite {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    titre!: string;

    @Column({ type: "text" })
    contenu!: string;

    // Type = "note" ou "analyse"
    @Column({ default: "note" })
    type!: "note" | "analyse";

    @Column({ nullable: true })
    auteur!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Commentaire, (commentaire) => commentaire.actualite, {
        cascade: true,
    })
    commentaires!: Commentaire[];
}
