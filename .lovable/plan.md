## Objetivo
Al abrir la app por primera vez, pedir login/registro (Google o email + contraseña, con nombre de usuario). Guardar Objetivos, Hábitos, Técnicas y favoritos de Explora BA en tablas por usuario en Lovable Cloud.

## 1. Autenticación

- Habilitar Google managed OAuth (`configure_social_auth ["google"]`) y dejar email/password activo.
- Nueva ruta pública `/auth` con dos modos: **Iniciar sesión** y **Crear cuenta**.
  - Registro: nombre de usuario + email + contraseña + botón "Continuar con Google".
  - El nombre de usuario va en `options.data.username` para que el trigger `handle_new_user` (ya existente) lo guarde en `profiles`.
  - Google usa `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`.
- Nuevo layout `src/routes/_authenticated.tsx` con `beforeLoad` que redirige a `/auth` si no hay sesión.
- Mover `index.tsx`, `habitos.tsx`, `tecnicas.tsx`, `explora.tsx`, `ajustes.tsx` a `src/routes/_authenticated/`.
- Listener `onAuthStateChange` en `__root.tsx` para invalidar router/queries.
- En Ajustes: mostrar usuario actual y botón "Cerrar sesión".

## 2. Tablas por usuario (migración)

```
user_goals          (id, user_id, day [date], text, done, position, created_at)
user_mood_logs      (id, user_id, day [date], mood, created_at)  — único por (user_id, day)
user_habit_ratings  (id, user_id, habit_id, served [bool], rated_at)
user_technique_log  (id, user_id, technique_id, completed_at)
user_explora_saved  (id, user_id, item_id, item_type ['place'|'event'], saved_at)
```

Cada tabla con RLS: `user_id = auth.uid()` para SELECT/INSERT/UPDATE/DELETE propio.

## 3. Capa de datos en el cliente

- Reemplazar las escrituras a `localStorage` (`app-store.ts`) por llamadas directas con `supabase` (browser client respeta RLS).
- Las preferencias de UI (tema, sonido, notificaciones, isPremium) siguen en localStorage — son ajustes de dispositivo.
- Cargar al montar cada pantalla:
  - `Mi Día`: mood + goals del día actual.
  - `Hábitos`: historial para evitar repetir hoy + contadores.
  - `Técnicas`: marcar las ya completadas.
  - `Explora BA`: lista de guardados con botón ❤︎ por evento/lugar.

## 4. Detalles técnicos

- `signUp` con `emailRedirectTo: window.location.origin` y auto-confirm **desactivado** (el usuario debe verificar email; Google entra directo).
- Sin página `/reset-password` por ahora (no pedida).
- El `index.tsx` actual (raíz `/`) redirige a `/mi-dia` autenticado o `/auth` si no hay sesión.

## Archivos
- **Migración SQL**: 5 tablas + RLS.
- **Nuevos**: `src/routes/auth.tsx`, `src/routes/_authenticated.tsx`, `src/lib/user-data.ts`.
- **Movidos**: rutas principales a `_authenticated/`.
- **Editados**: `__root.tsx` (listener), `ajustes.tsx` (logout), `app-store.ts` (solo preferencias UI).

¿Procedo?
