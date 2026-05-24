import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { ResultadosService } from '../../services/resultados.service';

interface Pais {
  nombre: string;
  bandera: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html'
})
export class PreguntadosComponent implements OnInit {
  private authService = inject(AuthService);
  private resultadosService = inject(ResultadosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);

  usuarioActual: any = null;
  
  cargandoAPI: boolean = true;
  todosLosPaises: Pais[] = [];
  
  juegoTerminado: boolean = false;
  puntaje: number = 0;
  tiempoInicio: number = 0;
  mensajeFinal: string = '';

  paisActual: Pais | null = null;
  opciones: Pais[] = [];

  mostrandoRespuesta: boolean = false;
  opcionSeleccionada: Pais | null = null;

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();
    this.cargarPaisesDesdeAPI();
  }

  cargarPaisesDesdeAPI() {
    this.cargandoAPI = true;
    this.cdr.detectChanges();

    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=translations,flags').subscribe({
      next: (data) => {
        this.todosLosPaises = data.map(p => ({
          nombre: p.translations.spa.common,
          bandera: p.flags.svg
        }));
        this.cargandoAPI = false;
        this.iniciarJuego();
      },
      error: (err) => {
        console.error('Error al conectar con la API', err);
        this.cargandoAPI = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.mostrandoRespuesta = false;
    this.opcionSeleccionada = null;
    this.tiempoInicio = Date.now();
    this.generarPregunta();
  }

  generarPregunta() {
    this.mostrandoRespuesta = false;
    this.opcionSeleccionada = null;

    const indiceCorrecto = Math.floor(Math.random() * this.todosLosPaises.length);
    this.paisActual = this.todosLosPaises[indiceCorrecto];

    this.opciones = [this.paisActual];
    while (this.opciones.length < 4) {
      const indiceAleatorio = Math.floor(Math.random() * this.todosLosPaises.length);
      const paisAleatorio = this.todosLosPaises[indiceAleatorio];
      
      if (!this.opciones.find(p => p.nombre === paisAleatorio.nombre)) {
        this.opciones.push(paisAleatorio);
      }
    }

    this.opciones.sort(() => Math.random() - 0.5);
    this.cdr.detectChanges();
  }

  evaluarRespuesta(paisSeleccionado: Pais) {
    if (this.juegoTerminado || !this.paisActual || this.mostrandoRespuesta) return;

    this.opcionSeleccionada = paisSeleccionado;
    this.mostrandoRespuesta = true;
    this.cdr.detectChanges();

    if (paisSeleccionado.nombre === this.paisActual.nombre) {
      this.puntaje++;
      setTimeout(() => {
        this.generarPregunta();
      }, 1000);
    } else {
      this.mensajeFinal = `¡Ups! Era la bandera de ${this.paisActual.nombre}.`;
      setTimeout(() => {
        this.finalizarJuego();
      }, 2000);
    }
  }

  async finalizarJuego() {
    this.juegoTerminado = true;
    const tiempoFinal = Math.floor((Date.now() - this.tiempoInicio) / 1000);

    if (this.usuarioActual) {
      const nombreMostrar = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
      
      await this.resultadosService.guardarResultado(
        this.usuarioActual.user.id,
        nombreMostrar,
        'preguntados',
        this.puntaje,
        tiempoFinal,
        { racha_aciertos: this.puntaje }
      );
    }
    this.cdr.detectChanges();
  }

  async volverAlHome() {
    if (!this.juegoTerminado && this.puntaje > 0) {
      await this.finalizarJuego();
    }
    this.router.navigate(['/home']);
  }
}