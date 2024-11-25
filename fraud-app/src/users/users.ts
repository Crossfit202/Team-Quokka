import { IsNotEmpty, isNotEmpty } from "class-validator";
import { Audit_log } from "src/audit_log/audit_log";
import { Report_annotations } from "src/report_annotations/report_annotations";
import { Reports } from "src/reports/reports";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    user_id: number;

    @Column()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @Column()
    role: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    // @Column()
    // email: string;

    @OneToMany(() => Reports, report => report.users)
    reports: Reports[];

    @OneToMany(() => Report_annotations, report_annotations => report_annotations.users)
    report_annotations: Report_annotations[]

    @OneToMany(() => Audit_log, audit_log => audit_log.users)
    audit_log: Audit_log[]
}

