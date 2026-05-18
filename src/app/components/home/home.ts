import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  usuarioLogueado: any = null;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }
}