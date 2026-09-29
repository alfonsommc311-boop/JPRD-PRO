# JPRD PRO

App formativa **sin internet** para prevenir y resolver disputas en obra pública con la Junta de Prevención y Resolución de Disputas (JPRD), y para formarse como el profesional que la Junta requiere.

- **14 áreas · 91 lecciones** (resumen, ideas clave, pasos, errores, ejemplo, práctica y quiz), con progreso guardado en el dispositivo.
- **8 herramientas:** diagnóstico "¿mi caso está listo?", escritos modelo, plazos hábiles con feriados del Perú y cronómetro, cuantificación (adicionales y mayores gastos generales), checklists, simulacro de audiencia, perfil del profesional y banco de 16 casos.
- PWA instalable en Android y con service worker para uso offline.

## Uso
Servir la carpeta por HTTP(S) (p. ej. `npx http-server .`), abrir en Chrome de Android y elegir **Instalar app / Añadir a la pantalla de inicio**. Después funciona sin conexión.

## Desarrollo
- `data/catalog.js`: áreas y títulos de lecciones. `data/lessons-*.js`: contenido (formato en `REGLAS-AGENTE.md`).
- `node validate_lessons.js` → debe imprimir `problemas=0`.

## Reglas de rigor
Normas siempre por nombre (sin artículos ni numerales inventados), sin prometer resultados y con la coletilla "verificar la norma vigente y el expediente técnico aprobado". Material formativo con fecha de corte septiembre 2026; no reemplaza asesoría legal.
