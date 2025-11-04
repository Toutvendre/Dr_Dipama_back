import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { LiveSession } from "./LiveSession";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: "user" })
    role!: string;

    @Column({ nullable: true })
    resetOtp?: string;

    @Column({ type: "bigint", nullable: true })
    resetOtpExpire?: number;

    @OneToMany(() => LiveSession, session => session.createdBy)
    liveSessions?: LiveSession[];
}
