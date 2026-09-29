// Uso: node validate_lessons.js  → imprime problemas y "problemas=N"
global.window={};const fs=require('fs');
['catalog','lessons-a','lessons-b','lessons-c','lessons-d','lessons-e','lessons-f','casos','simulacro'].forEach(f=>{try{require('./data/'+f+'.js')}catch(e){console.log('ERROR carga',f,e.message)}});
const J=window.JPRD;let p=0;const bad=m=>{p++;console.log('-',m)};
// patrones prohibidos: artículos/numerales inventados y promesas de resultado
const ART=/\b(art[íi]culo|art\.|numeral|cl[áa]usula)\s*\d+/i, PROM=/(siempre ganar|garantiza(do)? (que )?(ganar|el resultado)|seguro que (ganar|te))/i, DIR=/directiva\s*(n[°ºo.]*\s*)?\d/i;
J.areas.forEach(a=>a.l.forEach((t,i)=>{const id=a.id+'.'+(i+1),L=J.lessons[id];
 if(!L)return bad(id+' sin contenido');
 ['resumen','ejemplo','practica'].forEach(k=>{if(!L[k])bad(id+' falta '+k)});
 ['ideas','pasos','errores'].forEach(k=>{if(!Array.isArray(L[k])||L[k].length<3)bad(id+' '+k+' <3')});
 if(!Array.isArray(L.quiz)||L.quiz.length<2)bad(id+' quiz<2');
 (L.quiz||[]).forEach((q,qi)=>{if(!q.o||q.o.length!==4||!(q.ok>=0&&q.ok<4)||!q.why)bad(id+' quiz'+qi+' inválido')});
 const txt=JSON.stringify(L);if(ART.test(txt))bad(id+' cita artículo/numeral/cláusula con número');if(PROM.test(JSON.stringify(Object.assign({},L,{quiz:(L.quiz||[]).map(q=>({q:q.q,why:q.why}))}))))bad(id+' promete resultado');if(DIR.test(txt))bad(id+' número de directiva');
}));
Object.keys(J.lessons).forEach(id=>{const [a,n]=id.split('.').map(Number);if(!J.areas[a-1]||!J.areas[a-1].l[n-1])bad('id huérfano '+id)});
if(!J.casos.length)bad('sin casos');
console.log('lecciones='+Object.keys(J.lessons).length,'casos='+J.casos.length);
console.log('problemas='+p);
