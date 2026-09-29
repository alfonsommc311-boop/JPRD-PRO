# JPRD PRO

App formativa Android (familia Experto/PRO: Flutter WebView + voz, sin internet) para prevenir y resolver disputas en obra pública con la Junta de Prevención y Resolución de Disputas (JPRD) y formarse como el profesional que la Junta requiere.

- **14 áreas · 91 lecciones** (teoría, audio, fichas de repaso, quiz) · **8 herramientas** (diagnóstico, escritos, plazos con feriados, cuantificación, checklists, simulacro de audiencia, perfil del profesional, banco de 16 casos).
- Identidad: `com.alfonso.jprdpro` · puerto **9054** · prefijo de storage `jprd` · tema morado (#7c3aed → #1e1b4b).

## Compilar (en tu PC)
```powershell
flutter pub get
dart run flutter_launcher_icons ; dart run flutter_native_splash:create
flutter build apk --release
```
Vista previa sin Flutter: `cd assets/web && python3 -m http.server 9054`.

## Contenido
- `assets/web/assets/catalog.js` y `assets/web/lessons/*.js` se **generan** con `node _fuentes/convert.js` desde `_fuentes/` (fuente editable). Si editas una lección, hazlo en `_fuentes/lessons-*.js` y vuelve a generar, o edita el archivo de `lessons/` directamente y deja de regenerar.
- Validar: `cd assets/web && node ../../scripts/validate_lessons.js` → `problemas=0`.

## Reglas de rigor
Normas siempre por nombre (sin artículos/numerales inventados), sin prometer resultados, coletilla «verificar la norma vigente y el expediente técnico aprobado». Material formativo con fecha de corte 2026-09; no reemplaza asesoría legal. Requisitos para ser miembro de Junta: verificar en el reglamento y en el organismo que la administra.

## Pendiente en la PC
Compilar el APK, instalarlo por adb, añadir la fila 9054 en `ports.md` (color de ícono violeta→índigo, glifo balanza) y `apps_db.py construir && indexar`.
