import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-advanced-user',
  standalone: true,
  templateUrl: './advanced-user.component.html',
  styleUrls: ['./advanced-user.component.css'],
  imports: [FormsModule], // Import FormsModule here
})

export class AdvancedUserComponent {
  deleteReportId: string = '';
  editReportId: string = '';

  // Placeholder methods for functionality
  deleteReport() {
    alert(`Attempting to delete report with ID: ${this.deleteReportId}`);
  }

  editReport() {
    alert(`Attempting to edit report with ID: ${this.editReportId}`);
  }
}
