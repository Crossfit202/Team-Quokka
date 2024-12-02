import { IsNotEmpty, isNotEmpty } from "class-validator";
import { on } from "events";
import { Reports } from "src/reports/reports";
import { Users } from "src/users/users";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Report_annotations {

    @PrimaryGeneratedColumn()
    @IsNotEmpty()
    annotation_id: number;

    @Column()
    @IsNotEmpty({ message: 'Annotation text cannot be empty.' })
    annotation_text: string;

    @Column()
    created_at: Date;

    @ManyToOne(() => Reports, report => report.report_annotations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "reportKey" })
    reports: Reports;

    @ManyToOne(() => Users, user => user.report_annotations)
    @JoinColumn({ name: "userKey" })
    users: Users

    @Column({ nullable: true })
    reportKey: number; // Foreign key for reports

    @Column({ nullable: true })
    userKey: number; // Foreign key for users

}

