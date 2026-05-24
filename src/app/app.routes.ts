import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { QuienSoyComponent } from './components/quien-soy/quien-soy';
import { AhorcadoComponent } from './components/ahorcado/ahorcado';
import { MayorMenorComponent } from './components/mayor-menor/mayor-menor';
import { ReflejosComponent } from './components/reflejos/reflejos';
import { PreguntadosComponent } from './components/preguntados/preguntados';
import { ResultadosComponent } from './components/resultados/resultados';
import { ChatComponent } from './components/chat/chat';
import { publicGuard } from './guards/auth.guard'; 
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Para todos
  { path: 'home', component: HomeComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  
  // Bloqueadas si se inició sesión
  { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [publicGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  { path: 'ahorcado', component: AhorcadoComponent, canActivate: [authGuard] },
  { path: 'mayor-menor', component: MayorMenorComponent, canActivate: [authGuard] },
  { path: 'reflejos', component: ReflejosComponent, canActivate: [authGuard] },
  { path: 'preguntados', component: PreguntadosComponent, canActivate: [authGuard] },
  { path: 'resultados', component: ResultadosComponent, canActivate: [authGuard] }
  
];