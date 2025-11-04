import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("socials")
export class Social {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    facebook?: string;

    @Column({ nullable: true })
    tiktok?: string;

    @Column({ nullable: true })
    linkedin?: string;

    @Column({ nullable: true })
    youtube?: string;

    @Column({ nullable: true })
    instagram?: string;

    @Column({ nullable: true })
    telegram?: string;

    @Column({ nullable: true })
    twitch?: string;

    @Column({ nullable: true })
    whatsapp?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
