import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Resource } from "./Resource";

@Entity("events")
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "timestamp" })
    startTime!: Date;

    @Column({ type: "int", nullable: true })
    duration?: number; // en minutes

    @Column({ type: "varchar", nullable: true })
    location?: string;

    @Column({ type: "varchar", nullable: true })
    link?: string; // lien pour événement en ligne

    // Relation optionnelle avec une conférence
    @ManyToOne(() => Resource, { nullable: true })
    @JoinColumn({ name: "conferenceId" })
    conference?: Resource;

    @Column({ type: "int", nullable: true })
    conferenceId?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
