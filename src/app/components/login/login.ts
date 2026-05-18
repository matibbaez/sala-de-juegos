import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios

  loginForm: FormGroup;
  cargando = false;
  
  // Modal de error
  mostrarModalError = false;
  mensajeError = '';

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  async iniciarSesion() {
    if (this.loginForm.invalid) {
      this.mostrarError('Por favor, ingresá un correo y contraseña válidos.');
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges(); // Le avisamos a Angular que muestre el spinner

    const { correo, contrasena } = this.loginForm.value;

    try {
      await this.authService.iniciarSesion(correo, contrasena);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en login:', error);
      this.mostrarError('Credenciales incorrectas. Verificá tu correo y contraseña.');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); // Le avisamos a Angular que apague el spinner y muestre el modal si hubo error
    }
  }

  accesoRapido(tipoUsuario: string) {
    let correo = '';
    let contrasena = '123456';

    switch (tipoUsuario) {
      case 'tester1':
        correo = 'tester1@test.com';
        break;
      case 'tester2':
        correo = 'tester2@test.com';
        break;
      case 'tester3':
        correo = 'tester3@test.com';
        break;
    }

    this.loginForm.patchValue({
      correo: correo,
      contrasena: contrasena
    });

    this.iniciarSesion();
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
    this.cdr.detectChanges(); // Forzamos la actualización visual del modal
  }

  cerrarModal() {
    this.mostrarModalError = false;
    this.cdr.detectChanges(); // Forzamos la actualización al cerrar
  }
}