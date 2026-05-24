import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resultados.html'
})
export class ResultadosComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private supabase: SupabaseClient;

  cargando: boolean = true;
  
  topAhorcado: any[] = [];
  topMayorMenor: any[] = [];
  topReflejos: any[] = [];
  topPreguntados: any[] = [];

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    await this.obtenerHistorialResultados();
  }

  async obtenerHistorialResultados() {
    this.cargando = true;
    this.cdr.detectChanges();

    const { data, error } = await this.supabase
      .from('resultados')
      .select('*')
      .order('puntaje', { ascending: false });

    if (error) {
      console.error('Error al recuperar las estadísticas:', error);
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    if (data) {
      this.topAhorcado = data.filter(r => r.juego === 'ahorcado').slice(0, 5);
      this.topMayorMenor = data.filter(r => r.juego === 'mayor_menor').slice(0, 5);
      this.topReflejos = data.filter(r => r.juego === 'reflejos').slice(0, 5);
      this.topPreguntados = data.filter(r => r.juego === 'preguntados').slice(0, 5);
    }

    this.cargando = false;
    this.cdr.detectChanges();
  }
}