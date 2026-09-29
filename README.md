# IE Ultimate Team — Futdraft (Victory Road)

Web para armar un equipo de *Inazuma Eleven: Victory Road* con cartas reales de
[inazuma-draft](https://github.com/ale-dm/inazuma-draft) (misma base de datos,
solo lectura) y exportarlo como mod jugable de verdad, compatible con
**VictoryMods** (Tonsy) — arrastra el `.zip` generado y se carga como cualquier
equipo personalizado del Stade BB.

Proyecto fan, no oficial, sin relación con Level-5 ni con Tonsy. Reutiliza
datos ya curados por inazuma-draft (README, licencia y créditos propios).

## Cómo funciona

- Las cartas y técnicas vienen de la misma Supabase de `inazuma-draft`, con
  dos columnas/tabla añadidas ahí: `techniques.victorymods_id` (id real de la
  técnica en Victory Road) y `card_victorymods_map` (código de personaje real
  al que corresponde cada carta/versión).
- Al exportar, se genera `mod_data.json` + `victorymods.json` — el mismo
  formato que ya usa VictoryMods para sus equipos personalizados — y se
  empaquetan en un `.zip` descargable, todo en el navegador (sin backend).

## Desarrollo

```bash
npm install
npm run dev
```

Variables opcionales `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY` (por defecto
usa la clave publishable pública del proyecto).

## Modos

- **Creador de equipo** — busca y añade jugadores libremente hasta completar
  11 titulares + 5 suplentes.
- **Draft normal** — sale un jugador al azar, lo fichas o pides otro, hasta
  completar la plantilla.
- **Presets** — pendiente: plantillas predefinidas listas para exportar.

## Estado / pendiente

- Formaciones: 115 reales disponibles, sin nombre legible todavía (se
  muestran por su perfil ataque/defensa).
- ~6% de cartas y técnicas aún sin resolver a un id real de Victory Road
  (quedan fuera del catálogo exportable hasta que se resuelvan a mano).
