import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { MakeReportComponent } from './make-report/make-report.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { AdvancedUserComponent } from './advanced-user/advanced-user.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'create-report', component: MakeReportComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'advanced-user', component: AdvancedUserComponent },
  { path: 'login-screen', component: LoginScreenComponent }

];
