import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true, // Declares this component as standalone
  imports: [RouterModule, RouterOutlet], // Importing RouterModule and RouterOutlet for navigation
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fi-Rep'; // Title for the application
}
