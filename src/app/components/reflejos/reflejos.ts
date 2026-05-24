import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-reflejos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reflejos.html'
})
export class ReflejosComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private resultadosService = inject(ResultadosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuarioActual: any = null;
  
  juegoActivo: boolean = false;
  juegoTerminado: boolean = false;
  puntaje: number = 0;
  vidas: number = 3;
  tiempoInicio: number = 0;
  tiempoTranscurrido: number = 0;

  pelotaActiva: boolean = false;
  posicionX: number = 0;
  posicionY: number = 0;
  tiempoReaccionLimite: number = 1500; 
  mostrarFallo: boolean = false;
  porcentajeTiempo: number = 100;
  
  private timeoutId: any;
  private cronometroId: any;
  mensajeFinal: string = '';

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();
  }

  ngOnDestroy() {
    this.limpiarTimer();
    clearInterval(this.cronometroId);
  }

  iniciarJuego(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.puntaje = 0;
    this.vidas = 3;
    this.tiempoReaccionLimite = 1500;
    this.juegoTerminado = false;
    this.juegoActivo = true;
    this.mostrarFallo = false;
    this.tiempoInicio = Date.now();
    this.tiempoTranscurrido = 0;
    
    clearInterval(this.cronometroId);
    this.cronometroId = setInterval(() => {
      if (this.juegoActivo && !this.mostrarFallo) {
        this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
        this.cdr.detectChanges();
      }
    }, 1000);

    this.spawnPelota();
  }

  spawnPelota() {
    if (!this.juegoActivo) return;

    // Se calcula un porcentaje aleatorio del 0% al 85%.
    // El límite es 85 para que la pelota no se "caiga" del borde derecho o inferior de la cancha.
    this.posicionX = Math.floor(Math.random() * 85);
    this.posicionY = Math.floor(Math.random() * 85);
    
    this.porcentajeTiempo = 100;
    this.pelotaActiva = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.porcentajeTiempo = 0;
      this.cdr.detectChanges();
    }, 50);

    this.limpiarTimer();
    this.timeoutId = setTimeout(() => {
      this.fallarPelota();
    }, this.tiempoReaccionLimite);
  }

  impactarPelota(event: MouseEvent) {
    event.stopPropagation(); 
    if (!this.juegoActivo || !this.pelotaActiva || this.mostrarFallo) return;

    this.limpiarTimer();
    this.pelotaActiva = false;
    this.puntaje += 10;
    
    this.tiempoReaccionLimite = Math.max(400, this.tiempoReaccionLimite - 50);
    
    this.cdr.detectChanges();

    setTimeout(() => this.spawnPelota(), 300);
  }

  fallarPelota() {
    if (!this.juegoActivo || this.mostrarFallo) return;
    
    this.limpiarTimer();
    this.pelotaActiva = false;
    this.mostrarFallo = true; 
    this.vidas--;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.mostrarFallo = false;
      if (this.vidas <= 0) {
        this.finalizarJuego();
      } else {
        this.spawnPelota();
      }
    }, 800);
  }

  clicEnCancha() {
    if (this.juegoActivo && this.pelotaActiva && !this.mostrarFallo) {
      this.fallarPelota();
    }
  }

  limpiarTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  async finalizarJuego() {
    this.juegoActivo = false;
    this.juegoTerminado = true;
    this.pelotaActiva = false;
    this.mostrarFallo = false;
    this.limpiarTimer();
    clearInterval(this.cronometroId);
    
    this.mensajeFinal = `¡Buen intento! Tu velocidad máxima de reacción llegó a ${this.tiempoReaccionLimite}ms.`;

    if (this.usuarioActual) {
      const nombreMostrar = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
      
      await this.resultadosService.guardarResultado(
        this.usuarioActual.user.id,
        nombreMostrar,
        'reflejos',
        this.puntaje,
        this.tiempoTranscurrido,
        { reflejo_maximo_ms: this.tiempoReaccionLimite }
      );
    }
    this.cdr.detectChanges();
  }

  async volverAlHome() {
    if (this.juegoActivo) {
      await this.finalizarJuego();
    }
    this.router.navigate(['/home']);
  }
}