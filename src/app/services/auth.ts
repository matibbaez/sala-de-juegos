import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor() {
    const supabaseUrl = 'https://yxycycoefifnibefcezm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4eWN5Y29lZmlmbmliZWZjZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDU4ODEsImV4cCI6MjA5NDYyMTg4MX0.tdXlRhjiVmGHO7Q-z7kpEVCD1UcJXLk0bMiKVXX_PQI';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user || null);
    });
  }

  async registrar(correo: string, contrasena: string, nombre: string, apellido: string, edad: number) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: correo,
      password: contrasena,
    });
    
    if (authError) throw authError;

    if (authData.user) {
      const { error: dbError } = await this.supabase.from('usuarios').insert([
        {
          id: authData.user.id,
          correo: correo,
          nombre: nombre,
          apellido: apellido,
          edad: edad
        }
      ]);

      if (dbError) {
        console.error('Error insertando en tabla usuarios:', dbError);
        throw new Error('Usuario creado en Auth, pero falló el guardado en la base de datos.');
      }
    }
    
    return authData;
  }

  async iniciarSesion(correo: string, contrasena: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    
    if (error) throw error;
    return data;
  }

  async cerrarSesion() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }
}