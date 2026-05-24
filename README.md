# 🎮 Sala de Juegos

Este proyecto es una Single Page Application (SPA) desarrollada en **Angular** como trabajo práctico. Consiste en una plataforma interactiva con sistema de autenticación, perfiles de usuario y gestión de base de datos en la nube.

## 🚀 Tecnologías Utilizadas

* **Framework:** Angular (Standalone Components, Zoneless Change Detection).
* **Estilos:** Tailwind CSS (Utility-first approach para diseño responsivo y estética arcade).
* **Backend as a Service:** Supabase (Autenticación y base de datos PostgreSQL).
* **Despliegue:** Vercel.

## 📋 Características y Sprints

### Sprint 1: Arquitectura Base y Ruteo
* Estructura modular de la aplicación implementando navegación SPA mediante `<router-outlet>`.
* Diseño de Navbar responsivo y menús móviles.
* **Sección "Quién Soy":** Consumo asíncrono de la API pública de GitHub utilizando `HttpClient` de Angular, sincronizado con la interfaz mediante `ChangeDetectorRef`.

### Sprint 2: Autenticación y Formularios
* Integración de **Supabase Auth** para la gestión de usuarios.
* Proceso de registro seguro con inserción doble: creación de credenciales y almacenamiento de perfil (nombre, edad) en tabla relacional.
* Validación síncrona y estricta de datos en el frontend utilizando **Reactive Forms** de Angular.
* Gestión de estado de sesión global y reactiva utilizando `BehaviorSubject` (RxJS).
* **Funcionalidad de Acceso Rápido** para agilizar pruebas de QA.

## ⚙️ Instalación y Configuración Local

1. Clonar el repositorio.
2. Instalar las dependencias del proyecto:
   ```bash
   npm install