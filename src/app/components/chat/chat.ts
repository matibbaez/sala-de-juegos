import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('contenedorMensajes') contenedorMensajes!: ElementRef;

  mensajes: any[] = [];
  nuevoMensaje: string = '';
  usuarioActual: any = null;
  enviando: boolean = false;

  async ngOnInit() {
    this.usuarioActual = await this.authService.obtenerSesion();

    this.chatService.mensajes$.subscribe(historial => {
      this.mensajes = historial;
      this.cdr.detectChanges(); 
      this.hacerScrollAbajo(); 
    });
  }

  hacerScrollAbajo() {
    setTimeout(() => {
      try {
        this.contenedorMensajes.nativeElement.scrollTop = this.contenedorMensajes.nativeElement.scrollHeight;
      } catch(err) { }
    }, 100); 
  }

  async enviar() {
    if (!this.nuevoMensaje.trim() || !this.usuarioActual) return;

    this.enviando = true;
    this.cdr.detectChanges();

    try {
      const nombreMostrar = this.usuarioActual.user.user_metadata?.nombre || this.usuarioActual.user.email;
      
      await this.chatService.enviarMensaje(
        this.usuarioActual.user.id, 
        nombreMostrar, 
        this.nuevoMensaje
      );
      this.nuevoMensaje = ''; 
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      this.enviando = false;
      this.cdr.detectChanges();
    }
  }
}