import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LambdaService } from '../lambda.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  constructor(private lambdaService: LambdaService) {}

  invokeLambda() {  

    console.log("lambda has been invoked");

    this.lambdaService.callLambda(5).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Open PDF in a new tab
      },
      (error) => {
        console.error('Error downloading PDF:', error);
      }
    );
  }
}
