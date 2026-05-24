import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); 

  usuarioActual: any = null;
  nombreUsuario: string = '';

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();
    if (this.usuarioActual) {
      this.nombreUsuario = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
    }
    
    this.cdr.detectChanges();
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
    this.usuarioActual = null;
    this.router.navigate(['/login']);
    this.cdr.detectChanges(); 
  }
}