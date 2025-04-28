import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserCrudComponent } from './user-crud/user-crud.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserCrudComponent }
];
