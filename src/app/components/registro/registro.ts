import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); 

  registroForm: FormGroup;
  cargando = false;
  
  mostrarModalError = false;
  mensajeError = '';

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async registrar() {
    if (this.registroForm.invalid) {
      this.mostrarError('Por favor, revisá los campos marcados en rojo antes de continuar.');
      return;
    }

    this.cargando = true;
    this.cdr.detectChanges(); 

    const { correo, contrasena, nombre, apellido, edad } = this.registroForm.value;

    try {
      await this.authService.registrar(correo, contrasena, nombre, apellido, edad);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.message.includes('already registered')) {
        this.mostrarError('Este correo electrónico ya se encuentra registrado.');
      } else {
        this.mostrarError(error.message || 'Ocurrió un error al intentar registrarte.');
      }
    } finally {
      this.cargando = false;
      this.cdr.detectChanges(); 
    }
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    this.mostrarModalError = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModalError = false;
    this.cdr.detectChanges(); 
  }
}