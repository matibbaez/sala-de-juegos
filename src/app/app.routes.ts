import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';
import { publicGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Para todos
  { path: 'home', component: HomeComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  
  // Bloqueadas si se inició sesión
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [publicGuard] }
];