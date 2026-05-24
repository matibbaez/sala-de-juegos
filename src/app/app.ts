import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html'
})
export class AppComponent implements OnInit {
  title = 'sala-de-juegos';
  menuAbierto = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  
  usuarioLogueado: any = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
    this.menuAbierto = false; 
    this.router.navigate(['/login']);
  }
}