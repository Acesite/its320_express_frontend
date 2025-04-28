import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'todo-list', component: TodoListComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default to login
];
