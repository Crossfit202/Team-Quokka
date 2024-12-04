import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportsService } from '../services/reports.service'; // Adjust the path if necessary
import { tick } from '@angular/core/testing';
import { HeaderComponent } from '../header/header.component';



@Component({
  selector: 'app-make-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './make-report.component.html',
  styleUrls: ['./make-report.component.css']
})


export class MakeReportComponent {
  step = 1;
  crimeType: string = '';
  otherCrimeType: string = '';
  peopleInvolved: string = ''; // Tracks who was involved in the incident
  incidentDescription = '';
  incidentDate!: string;
  isAccurate: boolean | null = null; // Default to null
  isUnknownCrime: boolean = false; // For "Unknown" in crime type
  isUnknownPerson: boolean = false; // For "Unknown" in employee involved
  isOtherCrime: boolean = false;  // For showing/hiding the "Other" crime text box
  incidentDiscovery: string = ''; // Stores how the incident was discovered
  otherIncidentDiscovery: string = ''; // If "Other" is selected, capture details
  isOngoing: boolean | null = null; // Whether the reported crime is ongoing
  incidentLocation: string = ''; // Stores selected location
  otherIncidentLocation: string = ''; // For "Other" location details
  monetaryLoss: number | null = null; // Estimated monetary loss
  reputationDamage: boolean = false; // Checkbox for reputation damage
  customerRetention: boolean = false; // Checkbox for customer retention impact
  isSubmitted: boolean = false; // Tracks whether the report is submitted
  businessName: string = ''; // Tracks the business name
  businessAddress: string = ''; // Tracks the business address
  suspectName: string = ''; // Tracks the suspect's name
  totalSteps = 10; // Update this value to match the total number of steps

  

  isStepValid(): boolean {
    switch (this.step) {
      case 1:
        return !!this.crimeType;
      case 2:
        return !!this.peopleInvolved;
      case 3:
        return !!this.incidentLocation;
      case 4:
        return !!this.incidentDescription && this.incidentDescription.length >= 10;
      case 5:
        return !!this.businessName && !!this.businessAddress; // Ensure both fields are filled
      case 6:
        return !!this.suspectName || this.suspectName === ''; // Optional field
      case 7:
        return this.isOngoing !== undefined;
      case 8:
        return !!this.incidentDiscovery;
      case 9:
        return this.isAccurate !== null;
      default:
        return false;
    }
  }
  

  constructor(private reportsService: ReportsService) { }

  onSubmit() {
    const riskDetails = this.calculateRiskScore();


    // Align reportData fields with the database schema
    const reportData = {
      ticket_number: `TICK${Math.floor(Math.random() * 100000)}`, // Generate unique ticket number
      // ticket_number: `TKT120`,
      report_type: this.crimeType, // Maps to "report_type" in DB
      description: this.incidentDescription, // Maps to "description"
      status: 'Assigned', // Default status for new reports
      priority: 'High', // Default priority, or make it dynamic if needed
      created_by: 1, // Replace with logged-in user's ID
      perpetrator: this.peopleInvolved, // Maps to "perpetrator"
      incident_location: this.incidentLocation || this.otherIncidentLocation, // Maps to "incident_location"
      monetary_damage: this.monetaryLoss ? this.monetaryLoss.toString() : '0', // Convert to string for DB
      reputation_damage: this.reputationDamage, // Maps to "additional_damage1"
      customer_retention: this.customerRetention, // Maps to "additional_damage2"
      ongoing: this.isOngoing === true ? 'Yes' : this.isOngoing === false ? 'No' : 'Unknown', // Maps to "ongoing"
      discovery_method: this.incidentDiscovery || this.otherIncidentDiscovery, // Maps to "discovery_method"
      created_at: new Date().toISOString(), // Maps to "created_at" as a timestamp
      updated_at: new Date().toISOString(), // Maps to "updated_at" as a timestamp
      usersUserId: 1, // Replace with the logged-in user's ID, maps to "usersUserId"
      auditLogActionId: null, // If you don't have audit log actions now, set null
      business_name: this.businessName, // Maps to "business_name"
      business_address: this.businessAddress, // Maps to "business_address"
      suspect_name: this.suspectName // Maps to "suspect_name"
    };

    console.log('payload send to backend', reportData)

    console.log('Final Report Submitted:', reportData);

    // Show confirmation screen
    this.isSubmitted = true;

    // Send reportData to backend using a service (uncomment and implement this part)
    this.reportsService.create(reportData).subscribe(
      (response) => {
        console.log('Report created successfully:', response);
        this.isSubmitted = true; // Show confirmation message
      },
      (error) => {
        console.error('Error creating report:', error);
      }
    );
  }


  calculateRiskScore(): { score: number; category: string } {
    let score = 0;

    // Crime Type Scoring
    const crimeTypeScores: Record<string, number> = {
      Fraud: 2,
      Bribery: 3,
      Theft: 1,
      Other: 1,
    };
    score += crimeTypeScores[this.crimeType] || 0;

    // Impact Scoring
    if (this.monetaryLoss != null) { // Check if monetaryLoss is not null or undefined
      if (this.monetaryLoss > 10000) {
        score += 3;
      } else if (this.monetaryLoss > 0) {
        score += 1;
      }
    }

    if (this.reputationDamage) score += 2;
    if (this.customerRetention) score += 2;

    // Ongoing Crime Scoring
    if (this.isOngoing) score += 3;

    // Discovery Scoring
    const discoveryScores: Record<string, number> = {
      'Internal Audit': 1,
      Whistleblower: 2,
      'Self-Reporting': 0,
      Other: 1,
    };
    score += discoveryScores[this.incidentDiscovery] || 0;

    // Determine Risk Category
    let category = 'Low';
    if (score >= 9) {
      category = 'High';
    } else if (score >= 5) {
      category = 'Medium';
    }

    return { score, category };
  }


  nextStep() {
    if (this.step < this.totalSteps) {
      this.step++; // Increment the step to move to the next one
    }
  }
  
  previousStep() {
    if (this.step > 1) {
      this.step--; // Decrement the step to move to the previous one
    }
  }
  

  toggleOtherCrime() {
    if (this.isUnknownCrime) {
      this.crimeType = ''; // Clear other selected categories
      this.otherCrimeType = ''; // Clear any "Other" input
      this.isOtherCrime = false; // Deselect "Other"
    }
  }

  toggleUnknownPerson() {
    if (this.isUnknownPerson) {
      this.peopleInvolved = ''; // Clear other selected people
    }
  }

}
