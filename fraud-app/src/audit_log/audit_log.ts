import { IsNotEmpty, isNotEmpty } from "class-validator";
import { Reports } from "src/reports/reports";
import { Users } from "src/users/users";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Audit_log {

    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    action_id: number;

    @Column()
    user_id: number;

    @Column()
    @IsNotEmpty()
    action_type: string;

    @Column()
    report_id: number;

    @Column()
    action_date: Date;

    @OneToOne(() => Reports, report => report.audit_log)
    reports: Reports

    @ManyToOne(() => Users, user => user.audit_log)
    @JoinColumn({ name: "user_id" })
    users: Users
}

