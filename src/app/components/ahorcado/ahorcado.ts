import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ResultadosService } from '../../services/resultados.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.html'
})
export class AhorcadoComponent implements OnInit {
  private authService = inject(AuthService);
  private resultadosService = inject(ResultadosService);
  private cdr = inject(ChangeDetectorRef);

  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  palabras: string[] = ['DESARROLLADOR', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'COMPONENTES', 'OBSERVABLE', 'FORMULARIOS', 'FRAMEWORK'];
  
  palabraSecreta: string = '';
  palabraOculta: string[] = [];
  letrasSeleccionadas: string[] = [];
  
  intentosMaximos: number = 6;
  intentosRealizados: number = 0;
  
  juegoTerminado: boolean = false;
  mensajeFinal: string = '';
  victoria: boolean = false;

  tiempoInicio: number = 0;
  tiempoFinal: number = 0;

  usuarioActual: any = null;

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();
    this.iniciarJuego();
  }

  iniciarJuego() {
    const indice = Math.floor(Math.random() * this.palabras.length);
    this.palabraSecreta = this.palabras[indice];
    
    this.palabraOculta = Array(this.palabraSecreta.length).fill('_');
    this.letrasSeleccionadas = [];
    this.intentosRealizados = 0;
    this.juegoTerminado = false;
    this.victoria = false;
    this.tiempoInicio = Date.now();
    
    this.cdr.detectChanges();
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasSeleccionadas.includes(letra)) return;

    this.letrasSeleccionadas.push(letra);

    if (this.palabraSecreta.includes(letra)) {
      for (let i = 0; i < this.palabraSecreta.length; i++) {
        if (this.palabraSecreta[i] === letra) {
          this.palabraOculta[i] = letra;
        }
      }
      this.verificarVictoria();
    } else {
      this.intentosRealizados++;
      this.verificarDerrota();
    }
    
    this.cdr.detectChanges();
  }

  verificarVictoria() {
    if (!this.palabraOculta.includes('_')) {
      this.finalizarJuego(true);
    }
  }

  verificarDerrota() {
    if (this.intentosRealizados >= this.intentosMaximos) {
      this.finalizarJuego(false);
    }
  }

  async finalizarJuego(ganador: boolean) {
    this.juegoTerminado = true;
    this.victoria = ganador;
    this.mensajeFinal = ganador ? '¡Excelente! Adivinaste la palabra.' : `Fin del juego. La palabra era ${this.palabraSecreta}.`;
    
    this.tiempoFinal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    
    const puntaje = ganador ? (this.intentosMaximos - this.intentosRealizados) * 10 : 0;

    if (this.usuarioActual) {
      const nombreMostrar = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
      const detalles = { palabra: this.palabraSecreta, letras_erradas: this.intentosRealizados };
      
      await this.resultadosService.guardarResultado(
        this.usuarioActual.user.id,
        nombreMostrar,
        'ahorcado',
        puntaje,
        this.tiempoFinal,
        detalles
      );
    }
    
    this.cdr.detectChanges();
  }
}