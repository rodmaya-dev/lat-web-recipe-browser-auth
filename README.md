# Buscador de recetas — Autenticación en el frontend

Código inicial del capítulo «Autenticación y seguridad en el frontend».

El proyecto tiene dos partes: un back-end local (Express) que sirve las recetas y un front-end (React) al que le irás añadiendo la autenticación a lo largo del capítulo.

## Puesta en marcha

Instala las dependencias de ambos subproyectos:

```bash
npm run install:all  # instala las dependencias de server/ y client/
```

Luego arranca cada servidor en su propia terminal:

```bash
npm run dev:server   # API de Express en http://localhost:3001
npm run dev:client   # aplicación de React en http://localhost:5173
```

## Pruebas

Las pruebas de cada lección están en `client/tests/` y se ejecutan desde la raíz del proyecto:

```bash
node client/tests/lesson-04.js
```

Cambia `04` por el número de la lección (hay pruebas para las lecciones 4 a 9). Cuando todas las comprobaciones pasan, se muestra el código de verificación de la lección.
