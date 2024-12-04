import { IsNotEmpty } from "class-validator";
import { Audit_log } from "src/audit_log/audit_log";
import { Report_annotations } from "src/report_annotations/report_annotations";
import { Report_status_history } from "src/report_status_history/report_status_history";
import { Users } from "src/users/users";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reports {
    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    report_id: number;

    @Column()
    @IsNotEmpty()
    ticket_number: string;

    @Column()
    @IsNotEmpty()
    report_type: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    priority: string;

    @Column()
    created_by: number;


    @Column()
    perpetrator: string;

    @Column()
    incident_location: string;

    @Column()
    monetary_damage: string;

    @Column()
    reputation_damage: boolean;

    @Column()
    customer_retention: boolean;

    @Column()
    ongoing: string;

    @Column()
    discovery_method: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @ManyToOne(() => Users, (user) => user.reports)
    @JoinColumn({ name: 'usersUserId' })
    users: Users;

    @OneToMany(() => Report_status_history, (statusHistory) => statusHistory.report, { cascade: true }) // One-to-Many relationship
    status_history: Report_status_history[];

    @OneToMany(() => Report_annotations, (report_annotations) => report_annotations.reports)
    report_annotations: Report_annotations[];

    @OneToOne(() => Audit_log, (audit_log) => audit_log.reports)
    @JoinColumn()
    audit_log: Audit_log;

    @Column()
    business_name: string;

    @Column()
    business_address: string;

    @Column()
    suspect_name: string;

    @Column()
    previous_user: string;

}
