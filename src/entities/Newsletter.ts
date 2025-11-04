import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("newsletters")
export class Newsletter {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nomComplet!: string;

    @Column()
    email!: string;

    @Column({ type: "text", nullable: true })
    motif?: string;

    @Column({ nullable: true })
    documentPath?: string;

    @CreateDateColumn()
    createdAt!: Date;
}
