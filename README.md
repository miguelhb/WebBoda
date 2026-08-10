# WebBoda

Boceto de pagina de boda hecho con Next.js.

## Probar en local

En PowerShell, desde esta carpeta:

```bash
npm.cmd run dev
```

Despues abre:

```txt
http://127.0.0.1:3000
```

Uso `npm.cmd` porque en este Windows PowerShell bloquea `npm.ps1`.

## Supabase

Copia `.env.example` a `.env.local` y rellena:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

El esquema inicial de tablas esta en:

```txt
supabase/schema.sql
```
