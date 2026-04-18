#  International Weather App de Clima (Usuarios y Estado Global)- Módulo VII
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Vuex](https://img.shields.io/badge/vuex-%2342b883.svg?style=for-the-badge&logo=vue.js&logoColor=white)
![Vue Router](https://img.shields.io/badge/vue%20router-%2342b883.svg?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white)

______________________________________________________________________________________________________________________


App Clima-International Weather evoluciona en esta entrega para convertirse en una plataforma personalizada. 
Además de mostrar el clima mundial y pronósticos de 5 días mediante la API de OpenWeatherMap, la aplicación ahora incorpora 
un sistema de autenticación y gestión de estado global. 

Gracias a la implementación de Vuex, la app "reconoce" al usuario, permitiendo proteger rutas privadas y manejar preferencias de visualización de forma reactiva.

Vistas y Rutas del SistemaLa navegación se gestiona con Vue Router 4, incorporando protecciones de acceso (Navigation Guards) para secciones privadas:

* Login (/login): Formulario de acceso donde el usuario ingresa sus credenciales para iniciar sesión.
* Registro (/registro): Vista opcional para la creación de nuevos usuarios simulados.
* Home (/): Se mantienen las 10 capitales del mundo, flip cards que al girar muestran su T°actual y pronostico de 5 días, incluyendo minimo y maximo, humedad, viento y presion atmosferica.
* Detalle de Lugar (/lugar/:id): Información técnica detallada y pronóstico extendido. Presionando boton "ver detalles" al girar la flip card.
* Favoritos (/favoritos): (Ruta Protegida) Sección exclusiva para usuarios autenticados donde se listan sus ciudades preferidas.
* Contacto: Formulario de consultas con validaciones integradas.

# Gestión de Estado Global (Vuex)
Se ha implementado un Store centralizado para manejar de forma consistente la información que fluye por la aplicación:
* Autenticación: Un estado global (isAuthenticated) y un objeto user que almacena el nombre, email y perfil de la persona conectada.
* Persistencia y Limpieza: Al iniciar sesión, los datos se cargan en el estado; al utilizar la función de Cerrar Sesión, el estado de Vuex se limpia por completo y se redirige al usuario a la vista pública.
*  Personalización: Las preferencias del usuario (C° o F°) se leen directamente desde el Store, ajustando la interfaz de manera dinámica

##  Tecnologías Utilizadas

* **Vue.js 3** (Composition API / SFC)
* **Vuex** (Gestión de estado global para autenticación y favoritos) 
* **Vue Router** (Navegación entre Home, Contacto, Login y Favoritos)
* **Vite** (Herramienta de construcción rápida)
* **Sass / SCSS** (Arquitectura 7-1 y metodología BEM)
* **Vitest** (Framework de pruebas unitarias)
* **Bootstrap 5** (Base de estilos y componentes responsivos)
  
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)


##  Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone "https://github.com/AleRoa2025/weather-frontend-m7.git"
    ```

2.  **Instalar dependencias:**
    Entra a la carpeta del proyecto y ejecuta:
    ```bash
    npm install
 
##  Comandos de la Terminal

### Ejecutar en entorno de desarrollo
Para ver la aplicación funcionando en el navegador (habitualmente en `http://localhost:5173`):
```bash
npm run dev
## Ejecución de Pruebas Unitarias (Vitest):
Dado que este módulo incluye lógica crítica en el Store de Vuex y validaciones de login, puedes ejecutar los tests unitarios con:
''' Bash
npm run test:unit
'''
