# Sistema de Gestión de Usuarios - Angular Matrix

Un sistema moderno de gestión de usuarios construido con Angular 20, con un diseño inspirado en Matrix y animaciones fluidas.

## 🚀 Características

- **Diseño Matrix**: Fondo animado con efecto de lluvia de caracteres
- **CRUD Completo**: Crear, Leer, Actualizar y Eliminar usuarios
- **Validación de Formularios**: Validación en tiempo real con mensajes de error
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Animaciones Modernas**: Transiciones suaves y efectos visuales
- **TailwindCSS**: Estilos modernos y utilitarios
- **TypeScript**: Código tipado y seguro

## 🛠️ Tecnologías Utilizadas

- **Angular 20.1.0**: Framework principal
- **TypeScript**: Lenguaje de programación
- **TailwindCSS**: Framework de CSS
- **RxJS**: Programación reactiva
- **Angular Forms**: Manejo de formularios reactivos

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI (se instalará automáticamente)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd go-users-front
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la API
El proyecto está configurado para comunicarse con una API Go en `http://localhost:8080/api/users`.

Si tu API está en una URL diferente, modifica el archivo:
```
src/app/services/user.service.ts
```
Y cambia la línea:
```typescript
private apiUrl = 'http://localhost:8080/api/users';
```

### 4. Ejecutar el proyecto en modo desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### 5. Compilar para producción
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/go-users-front/`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── matrix-background/     # Fondo animado Matrix
│   │   ├── user-form/             # Formulario de usuarios
│   │   ├── user-table/            # Tabla de usuarios
│   │   └── user-management/       # Componente principal
│   ├── models/
│   │   └── user.model.ts          # Interfaces de usuario
│   ├── services/
│   │   └── user.service.ts        # Servicio de API
│   └── styles.css                 # Estilos globales
├── index.html
└── main.ts
```

## 🎨 Estructura de Datos del Usuario

```typescript
{
  "id": "string",
  "name": "string",
  "email": "string",
  "age": number,
  "phone": "string",
  "address": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 🔧 Scripts Disponibles

- `npm start`: Ejecuta el servidor de desarrollo
- `npm run build`: Compila para producción
- `npm run watch`: Compila en modo watch
- `npm test`: Ejecuta las pruebas unitarias

## 🌐 Configuración de CORS

Si tu API Go tiene problemas de CORS, asegúrate de que esté configurada para permitir requests desde `http://localhost:4200`.

Ejemplo de configuración CORS en Go:
```go
cors.New(cors.Options{
    AllowedOrigins: []string{"http://localhost:4200"},
    AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
    AllowedHeaders: []string{"Content-Type"},
})
```

## 🎯 Funcionalidades

### Crear Usuario
- Haz clic en "Nuevo Usuario"
- Completa el formulario con validación
- Los campos requeridos: nombre, email, edad, teléfono, dirección

### Editar Usuario
- Haz clic en el ícono de editar en la tabla
- Modifica los campos necesarios
- Guarda los cambios

### Eliminar Usuario
- Haz clic en el ícono de eliminar en la tabla
- Confirma la eliminación

### Validaciones
- **Nombre**: Mínimo 2 caracteres
- **Email**: Formato válido de email
- **Edad**: Entre 1 y 120 años
- **Teléfono**: Formato internacional
- **Dirección**: Mínimo 10 caracteres

## 🎨 Personalización

### Colores Matrix
Los colores principales están definidos en `tailwind.config.js`:
- Verde Matrix: `#00ff41`
- Fondo oscuro: `#0a0a0a`
- Fondo más oscuro: `#000000`

### Animaciones
Las animaciones están definidas en `src/styles.css`:
- `matrix-rain`: Efecto de lluvia de caracteres
- `glow`: Efecto de brillo en botones
- `fade-in`: Animación de aparición
- `slide-up`: Animación de deslizamiento

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola del navegador:
1. Verifica que tu API Go esté ejecutándose
2. Asegúrate de que CORS esté configurado correctamente
3. Verifica la URL de la API en `user.service.ts`

### Error de Compilación
Si hay errores de compilación:
1. Ejecuta `npm install` para reinstalar dependencias
2. Verifica que Node.js esté actualizado
3. Limpia la caché: `npm cache clean --force`

### Problemas de Estilos
Si los estilos no se cargan correctamente:
1. Verifica que TailwindCSS esté configurado
2. Ejecuta `npm run build` para regenerar estilos

## 📝 Notas de Desarrollo

- El proyecto usa Angular standalone components
- Todos los componentes son standalone para mejor modularidad
- Los estilos usan TailwindCSS con clases personalizadas
- El fondo Matrix se renderiza en un canvas HTML5

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de Angular
2. Verifica los logs en la consola del navegador
3. Asegúrate de que todas las dependencias estén instaladas

---

**¡Disfruta tu sistema de gestión de usuarios con estilo Matrix!** 🎮
