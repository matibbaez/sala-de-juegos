import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase: SupabaseClient;
  
  private mensajesSubject = new BehaviorSubject<any[]>([]);
  mensajes$ = this.mensajesSubject.asObservable();

  private chatIniciado = false; 

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  inicializarChat() {
    if (this.chatIniciado) return;

    this.supabase.removeAllChannels(); 
    this.cargarMensajesViejos();
    this.escucharMensajesNuevos();
    this.chatIniciado = true;
  }

  async cargarMensajesViejos() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select('*')
      .order('creado_en', { ascending: true })
      .limit(100); 

    if (!error && data) {
      this.mensajesSubject.next(data);
    } else {
      console.error('Error cargando historial de chat:', error);
    }
  }

  escucharMensajesNuevos() {
    this.supabase
      .channel('chat_publico')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, (payload) => {
        const mensajesActuales = this.mensajesSubject.value;
        
        if (!mensajesActuales.find(m => m.id === payload.new['id'])) {
           this.mensajesSubject.next([...mensajesActuales, payload.new]);
        }
      })
      .subscribe();
  }

  async enviarMensaje(usuarioId: string, nombreUsuario: string, texto: string) {
    const mensajeLocal = {
      id: Math.random(),
      usuario_id: usuarioId,
      nombre_usuario: nombreUsuario,
      mensaje: texto,
      creado_en: new Date().toISOString()
    };

    const mensajesActuales = this.mensajesSubject.value;
    this.mensajesSubject.next([...mensajesActuales, mensajeLocal]);

    const { error } = await this.supabase.from('mensajes').insert([
      { usuario_id: usuarioId, nombre_usuario: nombreUsuario, mensaje: texto }
    ]);
    
    if (error) throw error;
  }
}