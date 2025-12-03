
// src/entities/Concept.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class Concept {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    contenu!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
