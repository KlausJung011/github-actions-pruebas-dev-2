# Backend de musica

Proyecto simple de practica con NestJS. Permite crear, listar y consultar canciones guardadas en un archivo JSON.

## Ejecutar

Necesitas Node.js 22 y npm.

```bash
npm ci
npm run start:dev
```

En PowerShell puedes usar `npm.cmd` si `npm` esta bloqueado por la politica de scripts.

## API

| Metodo | Ruta | Funcion |
| --- | --- | --- |
| POST | `/api/songs` | Crear una cancion |
| GET | `/api/songs` | Listar canciones |
| GET | `/api/songs/:id` | Buscar por id (404 si no existe) |

Ejemplo de cuerpo para POST en `http://localhost:3000/api/songs`:

```json
{
  "title": "Imagine",
  "artist": "John Lennon"
}
```

Los dos campos son obligatorios y deben ser textos no vacios. El id se genera automaticamente. El servicio lee y escribe `data/music.json`, creado al guardar la primera cancion. No hace falta instalar una base de datos.

## Pruebas

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
```

- **2 unitarias:** buscar una cancion y manejar un id inexistente, con datos simulados.
- **2 de integracion:** guardar desde el controlador hasta el JSON y recuperar los datos desde otra instancia.
- **2 E2E:** crear y listar por HTTP, y rechazar datos incompletos.

Las pruebas usan archivos temporales para no cambiar las canciones del proyecto.

## GitHub Actions

El workflow `.github/workflows/dev-tests.yml` compila y ejecuta las seis pruebas al hacer **push a la rama `dev`**. Tambien se ejecuta en pull requests hacia `dev`.

Despues de hacer commit, sube tus cambios a esa rama y revisa la pestana **Actions** de GitHub.

## Archivos principales

- `src/songs/songs.controller.ts`: rutas HTTP.
- `src/songs/songs.service.ts`: logica y lectura/escritura del JSON.
- `src/songs/song.dto.ts`: validacion de titulo y artista.
- `test/`: los tres tipos de pruebas.

Para compilar: `npm run build`. Para ejecutar lo compilado: `npm run start:prod`.

Es un ejemplo educativo para una sola instancia y pocos datos. Las operaciones del archivo son sincronas. El JSON de uso local y la carpeta generada `dist/` no se suben a Git. El puerto se puede cambiar con `PORT` y el archivo con `MUSIC_DB_PATH` como variables de entorno.
