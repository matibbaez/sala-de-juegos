import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html' 
})
export class QuienSoyComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  perfilGithub: any = null;
  cargando: boolean = true;

  ngOnInit() {
    this.http.get('https://api.github.com/users/matibbaez')
      .subscribe({
        next: (data) => {
          this.perfilGithub = data;
          this.cargando = false; 
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error al cargar el perfil de GitHub', err);
          this.cargando = false; 
          this.cdr.detectChanges();
        }
      });
  }
}