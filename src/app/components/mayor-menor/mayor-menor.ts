import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ResultadosService } from '../../services/resultados.service';
import { Router } from '@angular/router'; 

interface Carta {
  valor: number;
  palo: string;
  color: string;
  simbolo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.html'
})
export class MayorMenorComponent implements OnInit {
  private authService = inject(AuthService);
  private resultadosService = inject(ResultadosService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router); 

  mazo: Carta[] = [];
  cartaActual!: Carta;
  cartaAnterior: Carta | null = null;
  
  puntaje: number = 0;
  tiempoInicio: number = 0;
  
  juegoTerminado: boolean = false;
  mensajeFinal: string = '';
  usuarioActual: any = null;

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.generarMazo();
    this.mezclarMazo();
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.cartaAnterior = null;
    this.tiempoInicio = Date.now();
    
    this.cartaActual = this.mazo.pop()!;
    this.cdr.detectChanges();
  }

  generarMazo() {
    this.mazo = [];
    const palos = [
      { nombre: 'corazones', color: 'text-red-500', simbolo: '♥️' },
      { nombre: 'diamantes', color: 'text-red-500', simbolo: '♦️' },
      { nombre: 'treboles', color: 'text-gray-800', simbolo: '♣️' },
      { nombre: 'picas', color: 'text-gray-800', simbolo: '♠️' }
    ];

    for (let palo of palos) {
      for (let valor = 1; valor <= 13; valor++) {
        this.mazo.push({ valor: valor, palo: palo.nombre, color: palo.color, simbolo: palo.simbolo });
      }
    }
  }

  mezclarMazo() {
    for (let i = this.mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
    }
  }

  adivinar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado || this.mazo.length === 0) return;

    const proximaCarta = this.mazo.pop()!;
    this.cartaAnterior = this.cartaActual; 
    
    let acerto = false;

    if (eleccion === 'mayor' && proximaCarta.valor > this.cartaActual.valor) {
      acerto = true;
    } else if (eleccion === 'menor' && proximaCarta.valor < this.cartaActual.valor) {
      acerto = true;
    } else if (proximaCarta.valor === this.cartaActual.valor) {
      acerto = false; 
    }

    this.cartaActual = proximaCarta;

    if (acerto) {
      this.puntaje++;
    } else {
      this.finalizarJuego();
    }

    if (this.mazo.length === 0 && !this.juegoTerminado) {
      this.mensajeFinal = '¡Increíble! Te pasaste todo el mazo.';
      this.finalizarJuego();
    }

    this.cdr.detectChanges();
  }

  // Convierte el 1 en 'A', el 11 en 'J'
  obtenerLetraValor(valor: number): string {
    switch (valor) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return valor.toString();
    }
  }

  async finalizarJuego() {
    this.juegoTerminado = true;
    const tiempoFinal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    this.mensajeFinal = this.mensajeFinal || `Perdiste. Tu racha fue de ${this.puntaje} aciertos.`;

    if (this.usuarioActual) {
      const nombreMostrar = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
      
      await this.resultadosService.guardarResultado(
        this.usuarioActual.user.id,
        nombreMostrar,
        'mayor_menor',
        this.puntaje,
        tiempoFinal,
        { cartas_restantes: this.mazo.length }
      );
    }
  }

  async volverAlHome() {
    if (!this.juegoTerminado && this.cartaActual) {
      await this.finalizarJuego();
    }
    this.router.navigate(['/home']);
  }
}