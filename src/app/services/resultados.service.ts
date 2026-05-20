import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async guardarResultado(usuarioId: string, nombreUsuario: string, juego: string, puntaje: number, tiempo: number, detalles: any) {
    const { error } = await this.supabase.from('resultados').insert([
      {
        usuario_id: usuarioId,
        nombre_usuario: nombreUsuario,
        juego: juego,
        puntaje: puntaje,
        tiempo_segundos: tiempo,
        detalles: detalles
      }
    ]);
    
    if (error) {
      console.error('Error al guardar el resultado:', error);
    }
  }
}