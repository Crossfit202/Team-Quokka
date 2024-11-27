import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminHomeComponent } from "../admin-home/admin-home.component";

interface Report {
  report_id: number;
  ticket_number: string;
  report_type: string;
  description: string;
  perpetrator: string;
  incident_location: string;
  monetary_damage: string;
  additional_damage1: boolean;
  additional_damage2: boolean;
  ongoing: string;
  discovery_method: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  created_at: Date;
  updated_at: Date;
}

@Component({
  selector: 'app-advanced-user',
  standalone: true,
  templateUrl: './advanced-user.component.html',
  styleUrls: ['./advanced-user.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, AdminHomeComponent],
})
export class AdvancedUserComponent {
  currentView: 'dashboard' | 'viewReports' | 'approveReports' | null = 'dashboard';
  activeCard: string | null = null;
  deleteReportId: string | number | null = '';
  confirmationInput: string = '';
  selectedReport: Report | null = null;
  currentAnnotations: any[] = [];
  reportSearchClicked: boolean = false;

  dummyReports: Report[] = [
    {
      report_id: 1,
      ticket_number: 'ABC123',
      report_type: 'Fraud',
      description: 'Unauthorized transactions detected.',
      perpetrator: 'John Doe',
      incident_location: 'Main Office',
      monetary_damage: '15000',
      additional_damage1: true,
      additional_damage2: false,
      ongoing: 'Yes',
      discovery_method: 'Audit',
      status: 'Assigned',
      priority: 'High',
      created_at: new Date('2024-11-01'),
      updated_at: new Date('2024-11-20'),
    }
  ];

  setCurrentView(view: 'dashboard' | 'viewReports' | 'approveReports'): void {
    this.currentView = view;
  }

  findReport(): void {
    const reportId = Number(this.deleteReportId);
    this.selectedReport = this.dummyReports.find(r => r.report_id === reportId) || null;
  }

  resetFocus(): void {
    this.deleteReportId = '';
    this.selectedReport = null;
    this.currentAnnotations = [];
    this.activeCard = null;
  }

  deleteReport(): void {
    if (this.selectedReport) {
      console.log(`Deleted report: ${this.selectedReport.ticket_number}`);
      this.resetFocus();
    }
  }
}
