import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { CatListComponent } from './cat-list/cat-list';
import { CatFormComponent } from './cat-form/cat-form';
import { ChatComponent } from './chat/chat';

export const routes: Routes = [
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cats', component: CatListComponent },
  { path: 'cats/new', component: CatFormComponent },
  { path: 'cats/:id/edit', component: CatFormComponent },
  { path: 'chat', component: ChatComponent }
];