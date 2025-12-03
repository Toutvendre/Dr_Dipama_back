// src/entities/Membre.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Membre {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    nomComplet!: string;

    @Column()
    profession!: string;

    @Column()
    telephone!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
