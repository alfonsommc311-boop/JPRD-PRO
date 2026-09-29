# Reglas de contenido — JPRD PRO

Formato: `data/lessons-<grupo>.js`. Cada lección se identifica como `"<area>.<n>"` donde n es la posición (1..) del título en `window.JPRD.areas[area-1].l` (ver `data/catalog.js`).

```js
window.JPRD = window.JPRD || { lessons: {} };
Object.assign(window.JPRD.lessons, {
 "4.2": {
  resumen: "2-3 frases.",
  ideas: ["5-7 ideas clave, cada una 1-2 frases"],
  pasos: ["4-7 pasos accionables, verbo en infinitivo"],
  errores: ["3-5 errores comunes y cómo evitarlos"],
  ejemplo: "Un ejemplo/mini-caso realista de obra pública peruana (5-8 líneas). Montos/plazos ilustrativos, marcados como tales.",
  practica: "Ejercicio de aplicación de 2-3 líneas.",
  quiz: [{q:"Pregunta", o:["A","B","C","D"], ok:1, why:"Por qué"}]   // 2 preguntas por lección
 }
});
```

Reglas de la casa (obligatorias):
1. Español neutro de Perú, claro y práctico. Sin relleno. Solo texto plano en los strings (sin HTML ni markdown; usa "\n" sólo si es imprescindible).
2. Normas SIEMPRE por nombre (p. ej. "Ley de Contrataciones Públicas y su Reglamento vigentes", "directivas del OSCE", "reglas del organismo que administra la Junta", "el contrato de obra"). NUNCA inventes número de artículo, numeral, cláusula ni número de directiva. Se puede mencionar que la Ley 32069 reemplazó el régimen anterior de contrataciones, nada más específico.
3. Cuando algo dependa de plazos, montos, requisitos o competencias exactas, indica que deben verificarse en la norma vigente, el reglamento de la Junta/organismo y el contrato. La lección debe terminar en `practica` o `ejemplo` sin prometer resultado; incluye en alguna idea o paso la coletilla: "Verificar la norma vigente y el expediente técnico aprobado."
4. NUNCA prometer resultados de una decisión, adicional, ampliación de plazo o ensayo. Nada de "siempre ganarás".
5. Los requisitos exactos para ser miembro de Junta no se afirman: se indica "verificar en el reglamento y en el organismo que administra la Junta".
6. No es asesoría legal; enfoque formativo. No copies textos protegidos; redacta con tus palabras.
7. Cada lección: contenido sustantivo y específico de obra pública (residente, supervisor, cuaderno de obra, valorizaciones, ruta crítica, adicionales, etc.), ~250-450 palabras en total.
8. Salida: un archivo JS válido (verifica con `node -e "global.window={};require('./data/<archivo>')"`). Las 4 opciones del quiz con `ok` = índice 0-3; reparte las respuestas correctas entre las posiciones.
