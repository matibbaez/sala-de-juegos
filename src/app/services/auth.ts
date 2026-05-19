import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  private currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl, 
      environment.supabaseKey
    );
    
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