# app

Minimal Expo Router + TypeScript + Supabase starter.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your env file (or edit the existing `.env`):
   ```bash
   cp .env.example .env
   ```
3. Add your Supabase project URL and anon key to `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   These use the `EXPO_PUBLIC_` prefix so Expo exposes them to client-side code. Never put a service-role key in this file.

4. Start the app:
   ```bash
   npm run start
   ```
5. Run on a simulator/device:
   ```bash
   npm run ios
   npm run android
   ```

## Structure

- `app/` — Expo Router screens (`(tabs)` holds the 4-tab navigator)
- `components/Header.tsx` — reusable screen header
- `lib/supabase.ts` — the single Supabase client
- `constants/theme.ts` — design tokens used by components (mirrors `globals.css`)
- `globals.css` — source-of-truth reference for colors, typography, spacing, and radii
