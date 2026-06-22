# MusicStore Web - Plataforma de Tienda de Música Digital

Sistema de información web de una tienda de música digital basado en la base de datos Chinook.

## Ejecutar Localmente

**Prerrequisitos:** Node.js

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar la app:
   ```bash
   npm run dev
   ```
   La app correrá en modo sandbox (datos mock) sin necesidad de base de datos.

## Desplegar en Vercel

1. Conecta este repositorio a [Vercel](https://vercel.com).
2. Configura las siguientes variables de entorno (opcional, solo si tienes base de datos):
   - `DATABASE_URL` - URL de conexión a PostgreSQL (Neon, etc.)
3. Vercel detectará automáticamente la configuración en `vercel.json` y construirá el proyecto.
4. La app usará datos mock automáticamente si no hay `DATABASE_URL` configurada.
