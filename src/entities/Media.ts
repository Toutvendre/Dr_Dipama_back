import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export type MediaType = "video" | "photo";

@Entity("medias")
export class Media {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({
        type: "enum",
        enum: ["video", "photo"],
    })
    type!: MediaType;

    @Column({ type: "varchar", nullable: true })
    filePath?: string | null;

    @Column({ type: "varchar", nullable: true })
    sourceUrl?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
