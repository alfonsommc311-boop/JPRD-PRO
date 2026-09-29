(function(){
'use strict';
window.JPRD=window.JPRD||{};var J=window.JPRD;
J.areas=CATALOG.map(function(a,i){return {id:i+1,l:a.lessons.map(function(x){return x.t}),s:a.lessons.map(function(x){return x.id})}});
J.coletilla='Verificar la norma vigente y el expediente técnico aprobado.';
var S={get:function(k,d){try{var v=localStorage.getItem('jprd:t:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem('jprd:t:'+k,JSON.stringify(v))}catch(e){}}};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function $(el,sel){return el.querySelector(sel)}
function fmt(n){return isFinite(n)?n.toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2}):'—'}
function lessonLink(id){var p=id.split('.').map(Number),a=J.areas[p[0]-1];return '<a href="lesson.html?l='+a.s[p[1]-1]+'">'+esc(a.l[p[1]-1])+'</a>'}

/* ---------- Diagnóstico ---------- */
var DIAG=[
 {d:"Materia",q:["La controversia está dentro de las materias que la Junta puede conocer según el contrato y el reglamento.","Identifiqué el tipo de materia (plazo, adicional, valorización, etc.).","Verifiqué que no sea una materia excluida de la competencia de la Junta."],l:["5.1","3.5"]},
 {d:"Plazos",q:["Conozco el plazo para plantear la disputa y no ha vencido.","Calculé los plazos con el calendario de días hábiles correcto.","Tengo fecha cierta de los hechos que originan la controversia."],l:["7.6","8.6"]},
 {d:"Prueba",q:["Cuento con cuaderno de obra, actas y cartas que respaldan los hechos.","Tengo registro fotográfico, ensayos o informes con fecha verificable.","Organicé anexos numerados y referenciados en el escrito."],l:["7.5","6.2"]},
 {d:"Cuantificación",q:["Mi pretensión tiene un monto o plazo calculado.","El cálculo es trazable (metrados, precios, gastos generales, ruta crítica).","Revisé el método de cálculo que exigen el contrato y la normativa vigente."],l:["7.4","10.1"]},
 {d:"Comunicación previa",q:["Comuniqué formalmente el hecho en su oportunidad.","Existe respuesta o silencio documentado de la contraparte.","Intenté una negociación o reunión previa documentada."],l:["6.3","6.7"]},
 {d:"Estrategia",q:["Tengo una teoría del caso: hechos, norma, prueba y pedido.","Evalué el efecto del pedido sobre la obra, el costo y la relación contractual.","Definí alternativas (acuerdo parcial, conciliación) y mi punto de equilibrio."],l:["11.1","11.4"]}
];
function diagnostico(el){
 var st=S.get('diag',{});
 function draw(){
  var h='<p>Marca cada afirmación: <b>Sí</b> (2), <b>Parcial</b> (1), <b>No</b> (0).</p>';
  DIAG.forEach(function(g,gi){h+='<div class="card" style="margin-bottom:10px"><b>'+esc(g.d)+'</b>'+g.q.map(function(q,qi){var k=gi+'_'+qi;
   return '<label style="font-weight:400">'+esc(q)+'</label><select data-k="'+k+'"><option value="">—</option><option value="2"'+(st[k]==='2'?' selected':'')+'>Sí</option><option value="1"'+(st[k]==='1'?' selected':'')+'>Parcial</option><option value="0"'+(st[k]==='0'?' selected':'')+'>No</option></select>'}).join('')+'</div>'});
  h+='<div id="res"></div>';el.innerHTML=h;
  Array.prototype.forEach.call(el.querySelectorAll('select'),function(s){s.onchange=function(){st[s.dataset.k]=s.value;S.set('diag',st);res()}});res();
 }
 function res(){var out='',all=0,cnt=0;
  DIAG.forEach(function(g,gi){var s=0,c=0;g.q.forEach(function(_,qi){var v=st[gi+'_'+qi];if(v!==undefined&&v!==''){s+=+v;c++}});
   if(c===g.q.length){var p=s/(2*c);var col=p>=.8?'g':p>=.5?'y':'r';all+=s;cnt+=c*2;
    out+='<p><span class="sem '+col+'"></span><b>'+esc(g.d)+'</b>: '+Math.round(p*100)+'%'+(col!=='g'?' → refuerza: '+g.l.map(lessonLink).join(' · '):'')+'</p>'}
   else out+='<p class="mut"><span class="sem" style="background:#999"></span>'+esc(g.d)+': incompleto</p>'});
  var t=cnt?Math.round(all/cnt*100):null;
  $(el,'#res').innerHTML='<h2>Resultado</h2>'+out+(t!=null?'<p class="tot">Preparación global: '+t+'%</p><p class="mut">'+(t>=80?'Caso bien encaminado: revisa detalles finales.':t>=50?'Hay brechas: atiéndelas antes de presentar.':'Caso poco preparado: prevé, documenta y refuerza antes de plantear la disputa.')+' Un buen puntaje no garantiza la decisión.</p>':'');
 }
 draw();
}

/* ---------- Escritos ---------- */
var ESC=[
 {n:"Solicitud de disputa",f:["entidad","contratista","obra","contrato","materia","hechos","pretension","cuantia","anexos"],t:"SOLICITUD DE INICIO DE DISPUTA ANTE LA JUNTA\n\nSeñores miembros de la Junta de Prevención y Resolución de Disputas:\n\n{contratista}, en el contrato de obra «{contrato}» ({obra}) con {entidad}, solicita que la Junta conozca la siguiente controversia sobre {materia}.\n\nI. HECHOS\n{hechos}\n\nII. PRETENSIÓN\n{pretension}\n\nIII. CUANTÍA (sustentada en anexo de cálculo)\n{cuantia}\n\nIV. FUNDAMENTOS\nLa controversia se sustenta en el contrato de obra y en la normativa de contrataciones vigente (verificar la norma vigente y el expediente técnico aprobado).\n\nV. ANEXOS\n{anexos}\n\nLima, ____ de ________ de 20__.\n\n______________________\nFirma y sello"},
 {n:"Respuesta / contestación",f:["solicitante","obra","contrato","posicion","hechos","prueba"],t:"CONTESTACIÓN A LA SOLICITUD DE DISPUTA\n\nEl suscrito, por la parte respondiente, en la controversia promovida por {solicitante} respecto del contrato «{contrato}» ({obra}), manifiesta:\n\nI. POSICIÓN\n{posicion}\n\nII. HECHOS\n{hechos}\n\nIII. PRUEBA QUE SE OFRECE\n{prueba}\n\nSe solicita a la Junta tener presente lo expuesto (verificar la norma vigente y el expediente técnico aprobado).\n\n______________________\nFirma y sello"},
 {n:"Pedido de decisión",f:["obra","contrato","materia","sintesis","pedido"],t:"PEDIDO DE DECISIÓN A LA JUNTA\n\nContrato: «{contrato}» — Obra: {obra}\nMateria: {materia}\n\nLuego de la audiencia y la instrucción, se solicita a la Junta:\n\n{pedido}\n\nSíntesis de la posición:\n{sintesis}\n\n______________________\nFirma y sello"},
 {n:"Comunicación de riesgo",f:["destinatario","obra","contrato","riesgo","evidencia","fecha_limite","medida"],t:"CARTA DE COMUNICACIÓN DE RIESGO\n\nA: {destinatario}\nObra: {obra} — Contrato: «{contrato}»\n\nPor la presente comunico oportunamente el siguiente riesgo que puede afectar el plazo, costo o calidad:\n\n{riesgo}\n\nEvidencia disponible: {evidencia}\n\nMedida propuesta: {medida}\nSe solicita respuesta hasta: {fecha_limite}\n\nSe deja constancia de esta comunicación también en el cuaderno de obra.\n\n______________________\nFirma y sello"},
 {n:"Acta de reunión",f:["obra","fecha","asistentes","temas","acuerdos","pendientes"],t:"ACTA DE REUNIÓN\n\nObra: {obra}\nFecha: {fecha}\nAsistentes: {asistentes}\n\nTEMAS TRATADOS\n{temas}\n\nACUERDOS (con responsable y fecha)\n{acuerdos}\n\nPENDIENTES\n{pendientes}\n\nLos asistentes firman en señal de conformidad o dejan constancia de sus observaciones.\n\n______________________"},
 {n:"Recusación",f:["miembro","causal","hechos","prueba","fecha_conocimiento"],t:"ESCRITO DE RECUSACIÓN\n\nSe formula recusación contra {miembro} por la causal de: {causal}.\n\nHECHOS\n{hechos}\n\nFecha en que se tomó conocimiento: {fecha_conocimiento}\n\nPRUEBA\n{prueba}\n\nSe presenta dentro del plazo y por la vía establecidos en el reglamento aplicable (verificar).\n\n______________________\nFirma y sello"},
 {n:"Cumplimiento de decisión",f:["contraparte","obra","decision","plazo","medidas"],t:"COMUNICACIÓN DE CUMPLIMIENTO DE DECISIÓN\n\nA: {contraparte}\nObra: {obra}\n\nEn atención a la decisión de la Junta: {decision}\n\nSe comunica la ejecución de las siguientes medidas:\n{medidas}\n\nPlazo de cumplimiento: {plazo}\n\nSe solicita a la contraparte acreditar el cumplimiento que le corresponde.\n\n______________________\nFirma y sello"}
];
function escritos(el){
 var cur=0;
 function draw(){var t=ESC[cur];
  var h='<label>Modelo</label><select id="m">'+ESC.map(function(x,i){return '<option value="'+i+'"'+(i===cur?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select>';
  h+=t.f.map(function(f){var lg=/hechos|pretension|riesgo|temas|acuerdos|pendientes|sintesis|pedido|anexos|prueba|medidas|posicion|decision/.test(f);
   return '<label>'+esc(f.replace('_',' '))+'</label>'+(lg?'<textarea data-f="'+f+'" style="min-height:70px"></textarea>':'<input data-f="'+f+'">')}).join('');
  h+='<div class="row" style="margin-top:12px"><button class="btn" id="cp">Copiar texto</button><button class="btn alt" id="pr">Imprimir</button></div><h2>Vista previa</h2><pre class="out" id="pv"></pre>';
  el.innerHTML=h;$(el,'#m').onchange=function(e){cur=+e.target.value;draw()};
  Array.prototype.forEach.call(el.querySelectorAll('[data-f]'),function(i){i.oninput=pv});
  $(el,'#cp').onclick=function(){var x=$(el,'#pv').textContent;(navigator.clipboard?navigator.clipboard.writeText(x):Promise.reject()).then(function(){$(el,'#cp').textContent='¡Copiado!'},function(){var r=document.createRange();r.selectNodeContents($(el,'#pv'));var s=getSelection();s.removeAllRanges();s.addRange(r)})};
  $(el,'#pr').onclick=function(){window.print()};pv();}
 function pv(){var v={};Array.prototype.forEach.call(el.querySelectorAll('[data-f]'),function(i){v[i.dataset.f]=i.value});
  $(el,'#pv').textContent=ESC[cur].t.replace(/\{(\w+)\}/g,function(_,k){return v[k]||'[' +k.replace('_',' ')+']'})}
 draw();
}

/* ---------- Plazos ---------- */
function easter(y){var a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da)}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function holidays(y,extra){var s={},fixed=['01-01','05-01','06-29','07-28','07-29','08-30','10-08','11-01','12-08','12-09','12-25'];
 fixed.forEach(function(x){s[y+'-'+x]=1});var e=easter(y);[-3,-2].forEach(function(o){var d=new Date(e);d.setDate(d.getDate()+o);s[iso(d)]=1});
 (extra||[]).forEach(function(x){s[x]=1});return s}
function plazos(el){
 var extra=S.get('feriadosExtra',[]),dl=S.get('plazos',[]);
 function calc(start,n,tipo,sab){var d=new Date(start+'T00:00:00'),c=0,hol={};if(isNaN(d))return null;
  while(c<n){d.setDate(d.getDate()+1);if(tipo==='cal'){c++;continue}
   var y=d.getFullYear();if(!hol[y])hol[y]=holidays(y,extra);var w=d.getDay();
   if(w===0||(w===6&&!sab)||hol[y][iso(d)])continue;c++}
  return d}
 function days(to){var t=new Date();t.setHours(0,0,0,0);return Math.round((to-t)/864e5)}
 function draw(){
  el.innerHTML='<div class="card"><label>Fecha de inicio del cómputo (hecho o notificación)</label><input type="date" id="f"><label>Cantidad de días</label><input type="number" id="n" min="1" value="10"><label>Tipo</label><select id="t"><option value="hab">Días hábiles</option><option value="cal">Días calendario</option></select><label><input type="checkbox" id="s" style="display:inline-block;vertical-align:middle"> Contar sábados como hábiles</label><label>Rótulo (opcional)</label><input id="r" placeholder="Ej.: Contestación de la disputa"><p><button class="btn" id="go">Calcular</button></p><div id="o"></div></div>'+
  '<h2>Cronómetro de plazos</h2><div id="dl"></div><h2>Feriados adicionales</h2><p class="mut">El cómputo incluye feriados nacionales fijos y Semana Santa. Agrega aquí feriados o días no laborables decretados (AAAA-MM-DD). Verifica el calendario oficial y las reglas de cómputo del contrato y del reglamento.</p><div class="row"><input id="x" placeholder="2026-10-31" style="flex:1"><button class="btn alt sm" id="ax">Agregar</button></div><p class="mut" id="xl">'+esc(extra.join(', ')||'Ninguno')+'</p>';
  $(el,'#f').value=iso(new Date());
  $(el,'#go').onclick=function(){var r=calc($(el,'#f').value,+$(el,'#n').value,$(el,'#t').value,$(el,'#s').checked);
   if(!r){$(el,'#o').textContent='Fecha inválida';return}
   var lab=$(el,'#r').value||'Plazo';$(el,'#o').innerHTML='<p class="tot">Vence: '+r.toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</p><button class="btn alt sm" id="sv">Guardar en cronómetro</button>';
   $(el,'#sv').onclick=function(){dl.push({l:lab,d:iso(r)});S.set('plazos',dl);draw()}};
  $(el,'#ax').onclick=function(){var v=$(el,'#x').value.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(v)){extra.push(v);S.set('feriadosExtra',extra);draw()}};
  $(el,'#dl').innerHTML=dl.length?dl.map(function(p,i){var n=days(new Date(p.d+'T00:00:00')),c=n<0?'r':n<=2?'r':n<=5?'y':'g';
   return '<div class="card" style="margin-bottom:8px"><span class="sem '+c+'"></span><b>'+esc(p.l)+'</b> — '+esc(p.d)+' · '+(n<0?'vencido hace '+(-n)+' d':n===0?'vence hoy':'faltan '+n+' d')+' <button class="btn alt sm" data-i="'+i+'" style="float:right">✕</button></div>'}).join(''):'<p class="mut">Sin plazos guardados.</p>';
  Array.prototype.forEach.call(el.querySelectorAll('[data-i]'),function(b){b.onclick=function(){dl.splice(+b.dataset.i,1);S.set('plazos',dl);draw()}});
 }
 draw();
}

/* ---------- Cuantificación ---------- */
function cuantifica(el){
 var rows=S.get('cuRows',[{d:'',m:0,p:0}]);
 function draw(){
  el.innerHTML='<div class="row"><button class="tag on" id="a">Adicional</button><button class="tag" id="b">Mayores gastos generales</button></div><div id="v"></div>';
  $(el,'#a').onclick=function(){this.className='tag on';$(el,'#b').className='tag';adic()};
  $(el,'#b').onclick=function(){this.className='tag on';$(el,'#a').className='tag';mgg()};adic();
 }
 function adic(){var v=$(el,'#v');
  v.innerHTML='<h3>Presupuesto de adicional</h3><table><tr><th>Partida</th><th>Metrado</th><th>P. unit.</th><th>Parcial</th></tr>'+rows.map(function(r,i){return '<tr><td><input data-i="'+i+'" data-k="d" value="'+esc(r.d)+'"></td><td><input type="number" step="any" data-i="'+i+'" data-k="m" value="'+r.m+'"></td><td><input type="number" step="any" data-i="'+i+'" data-k="p" value="'+r.p+'"></td><td id="pa'+i+'">'+fmt(r.m*r.p)+'</td></tr>'}).join('')+'</table><p><button class="btn alt sm" id="add">+ Partida</button></p>'+
  '<label>Gastos generales (%)</label><input type="number" id="gg" value="10" step="any"><label>Utilidad (%)</label><input type="number" id="ut" value="5" step="any"><label>IGV (%) — verificar tasa vigente</label><input type="number" id="ig" value="18" step="any"><div id="t"></div>';
  function tot(){var cd=rows.reduce(function(a,r){return a+r.m*r.p},0),gg=cd*$(el,'#gg').value/100,ut=cd*$(el,'#ut').value/100,st=cd+gg+ut,ig=st*$(el,'#ig').value/100;
   $(el,'#t').innerHTML='<table><tr><td>Costo directo</td><td>'+fmt(cd)+'</td></tr><tr><td>Gastos generales</td><td>'+fmt(gg)+'</td></tr><tr><td>Utilidad</td><td>'+fmt(ut)+'</td></tr><tr><td>Subtotal</td><td>'+fmt(st)+'</td></tr><tr><td>IGV</td><td>'+fmt(ig)+'</td></tr></table><p class="tot">Total: S/ '+fmt(st+ig)+'</p><p class="mut">Sustenta cada partida con metrado, análisis de precios unitarios y expediente técnico aprobado. Verifica la normativa vigente sobre adicionales y sus límites.</p>'}
  Array.prototype.forEach.call(v.querySelectorAll('input[data-i]'),function(i){i.oninput=function(){var r=rows[+i.dataset.i];r[i.dataset.k]=i.dataset.k==='d'?i.value:+i.value||0;S.set('cuRows',rows);$(el,'#pa'+i.dataset.i).textContent=fmt(r.m*r.p);tot()}});
  ['gg','ut','ig'].forEach(function(k){$(el,'#'+k).oninput=tot});
  $(el,'#add').onclick=function(){rows.push({d:'',m:0,p:0});S.set('cuRows',rows);adic()};tot();}
 function mgg(){var v=$(el,'#v');
  v.innerHTML='<h3>Mayores gastos generales por ampliación de plazo</h3><label>Gastos generales fijos del contrato (S/)</label><input type="number" id="gf" step="any" value="0"><label>Plazo contractual (días)</label><input type="number" id="pc" value="180"><label>Gastos generales variables por día (S/)</label><input type="number" id="gv" step="any" value="0"><label>Días de ampliación reconocibles</label><input type="number" id="dd" value="0"><label>IGV (%) — verificar</label><input type="number" id="ig" value="18"><div id="t"></div>';
  function tot(){var f=+$(el,'#gf').value/(+$(el,'#pc').value||1),d=+$(el,'#dd').value,base=(f+ +$(el,'#gv').value)*d,ig=base*$(el,'#ig').value/100;
   $(el,'#t').innerHTML='<table><tr><td>GG fijos por día</td><td>'+fmt(f)+'</td></tr><tr><td>GG variables por día</td><td>'+fmt(+$(el,'#gv').value)+'</td></tr><tr><td>Subtotal ('+d+' días)</td><td>'+fmt(base)+'</td></tr><tr><td>IGV</td><td>'+fmt(ig)+'</td></tr></table><p class="tot">Total: S/ '+fmt(base+ig)+'</p><p class="mut">Las reglas de reconocimiento (qué gastos y qué días) dependen de la normativa vigente y del contrato: verifícalas. Sustenta con la ampliación aprobada, cronograma y comprobantes.</p>'}
  Array.prototype.forEach.call(v.querySelectorAll('input'),function(i){i.oninput=tot});tot();}
 draw();
}

/* ---------- Checklists ---------- */
var CHK=[
 {n:"Expediente de disputa",i:[["Pretensión formulada con claridad",1],["Fundamento contractual identificado",1],["Cuaderno de obra: anotaciones pertinentes",1],["Cartas y comunicaciones con cargo de recepción",1],["Cálculo de cuantía y anexo técnico",1],["Registro fotográfico/ensayos con fecha",0],["Cronograma vigente y análisis de ruta crítica (si hay plazo)",0],["Plazos verificados y dentro de término",1],["Anexos numerados y foliados",0],["Revisión de legibilidad y firmas",0]]},
 {n:"Audiencia",i:[["Guion de exposición de 5 minutos",1],["Documentos clave impresos y marcados",0],["Responsables técnicos citados/presentes",1],["Preguntas difíciles anticipadas",1],["Propuesta de solución alternativa definida",0],["Autorización de negociación confirmada",1],["Equipo de apoyo asignado (actas, cronómetro)",0]]},
 {n:"Cumplimiento de decisión",i:[["Decisión leída completa y entendida",1],["Plazos de cumplimiento anotados",1],["Responsables y presupuesto asignados",0],["Efecto en cronograma y valorizaciones evaluado",1],["Comunicación formal a la contraparte",1],["Anotación en el cuaderno de obra",0],["Evaluación de vías posteriores (conciliación/arbitraje) con plazos",1]]}
];
function checklist(el){var st=S.get('chk',{}),cur=0;
 function draw(){var c=CHK[cur],h='<label>Lista</label><select id="m">'+CHK.map(function(x,i){return '<option value="'+i+'"'+(i===cur?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')+'</select>';
  h+=c.i.map(function(it,i){var k=cur+'_'+i;return '<label class="opt'+(st[k]?' sel':'')+'" style="font-weight:400"><input type="checkbox" data-k="'+k+'"'+(st[k]?' checked':'')+'> <span>'+esc(it[0])+(it[1]?' <b style="color:var(--bad)">· crítico</b>':'')+'</span></label>'}).join('')+'<div id="r"></div><p><button class="btn alt sm" id="rs">Limpiar lista</button></p>';
  el.innerHTML=h;$(el,'#m').onchange=function(e){cur=+e.target.value;draw()};
  Array.prototype.forEach.call(el.querySelectorAll('input[type=checkbox]'),function(b){b.onchange=function(){st[b.dataset.k]=b.checked;S.set('chk',st);draw()}});
  $(el,'#rs').onclick=function(){c.i.forEach(function(_,i){delete st[cur+'_'+i]});S.set('chk',st);draw()};
  var ok=c.i.filter(function(_,i){return st[cur+'_'+i]}).length,miss=c.i.filter(function(it,i){return it[1]&&!st[cur+'_'+i]});
  $(el,'#r').innerHTML='<p class="tot">'+ok+' / '+c.i.length+'</p>'+(miss.length?'<div class="box err"><b>Faltan ítems críticos:</b>'+'<ul>'+miss.map(function(m){return '<li>'+esc(m[0])+'</li>'}).join('')+'</ul></div>':'<div class="box ok">Ítems críticos cubiertos.</div>')}
 draw();
}

/* ---------- Simulacro ---------- */
function simulacro(el){var ans={},sim=J.sim,shown=false;
 function draw(){el.innerHTML=sim.map(function(q,qi){return '<div class="card" style="margin-bottom:10px"><b>'+(qi+1)+'. '+esc(q.q)+'</b>'+q.o.map(function(o,oi){var c='opt'+(ans[qi]===oi?' sel':'');if(shown&&ans[qi]===oi)c+=o.p===2?' right':o.p===1?'':' wrong';
   return '<div class="'+c+'" data-q="'+qi+'" data-o="'+oi+'" role="button" tabindex="0">'+esc(o.t)+'</div>'}).join('')+(shown&&ans[qi]!=null?'<p class="mut">'+esc(q.o[ans[qi]].c)+'</p>':'')+'</div>'}).join('')+
  (shown?score():'<button class="btn" id="ok">Ver resultado</button>');
  Array.prototype.forEach.call(el.querySelectorAll('.opt'),function(o){var f=function(){if(shown)return;ans[+o.dataset.q]=+o.dataset.o;draw()};o.onclick=f;o.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  var b=$(el,'#ok');if(b)b.onclick=function(){shown=true;draw();window.scrollTo(0,document.body.scrollHeight)}}
 function score(){var s=0;sim.forEach(function(_,i){if(ans[i]!=null)s+=sim[i].o[ans[i]].p});var p=Math.round(s/(2*sim.length)*100);
  return '<h2>Resultado</h2><p class="tot">'+s+' / '+2*sim.length+' ('+p+'%)</p><p>'+(p>=80?'Desempeño sólido en audiencia.':p>=50?'Buen punto de partida: repasa 8.3, 11.1 y 11.2.':'Practica más: revisa las áreas 7, 8 y 11.')+'</p><button class="btn alt" id="rs">Repetir</button>'}
 el.addEventListener('click',function(e){if(e.target.id==='rs'){ans={};shown=false;draw()}});draw();
}

/* ---------- Perfil ---------- */
var PERF=[
 {g:"Técnicas",c:["Lectura de expediente técnico y planos","Metrados, valorizaciones y costos","Programación y ruta crítica","Control de calidad y ensayos"],l:["10.2","10.3","10.6"]},
 {g:"Jurídicas",c:["Contratos de obra y ley de contrataciones","Procedimiento y plazos","Redacción de escritos y decisiones","Prueba y motivación"],l:["2.2","8.6","11.2","9.1"]},
 {g:"Blandas",c:["Escucha activa y síntesis","Neutralidad e independencia","Negociación y mediación","Comunicación oral en audiencia"],l:["12.4","11.4","11.5","8.3"]},
 {g:"Ética y trayectoria",c:["Revelación de conflictos de interés","Confidencialidad","Experiencia documentada en obra","Formación y certificaciones"],l:["4.4","11.6","12.7","12.8"]}
];
function perfil(el){var st=S.get('perfil',{});
 function draw(){var h='<p>Califica de 1 (bajo) a 5 (alto). Los requisitos formales de miembro de Junta se verifican en el reglamento y en el organismo que administra la Junta.</p>';
  PERF.forEach(function(g,gi){h+='<div class="card" style="margin-bottom:10px"><b>'+esc(g.g)+'</b>'+g.c.map(function(c,ci){var k=gi+'_'+ci;return '<label style="font-weight:400">'+esc(c)+'</label><select data-k="'+k+'"><option value="">—</option>'+[1,2,3,4,5].map(function(n){return '<option'+(st[k]==n?' selected':'')+'>'+n+'</option>'}).join('')+'</select>'}).join('')+'</div>'});
  h+='<div id="r"></div>';el.innerHTML=h;
  Array.prototype.forEach.call(el.querySelectorAll('select'),function(s){s.onchange=function(){st[s.dataset.k]=+s.value||'';S.set('perfil',st);res()}});res()}
 function res(){var o='',gaps=[];PERF.forEach(function(g,gi){var s=0,c=0;g.c.forEach(function(_,ci){var v=st[gi+'_'+ci];if(v){s+=+v;c++}});if(c){var a=s/c;o+='<p><b>'+esc(g.g)+'</b>: '+a.toFixed(1)+' / 5 <span class="sem '+(a>=4?'g':a>=3?'y':'r')+'"></span></p>';if(a<4)gaps.push(g)}});
  $(el,'#r').innerHTML=o?'<h2>Tu perfil</h2>'+o+(gaps.length?'<h3>Plan de formación sugerido</h3><ul>'+gaps.map(function(g){return '<li>'+esc(g.g)+': '+g.l.map(lessonLink).join(' · ')+'</li>'}).join('')+'</ul>':'<p class="box ok">Perfil sólido. Documenta tu experiencia y postula donde corresponda.</p>'):''}
 draw();
}

/* ---------- Casos ---------- */
function casos(el){var f='Todas';
 function draw(){var cs=J.casos||[],ms=['Todas'].concat(cs.map(function(c){return c.materia}).filter(function(x,i,a){return a.indexOf(x)===i}));
  el.innerHTML='<div class="row">'+ms.map(function(m){return '<button class="tag'+(m===f?' on':'')+'" data-m="'+esc(m)+'">'+esc(m)+'</button>'}).join('')+'</div><div style="margin-top:12px">'+
   (cs.length?cs.filter(function(c){return f==='Todas'||c.materia===f}).map(function(c){return '<div class="card" style="margin-bottom:10px"><span class="pill">'+esc(c.materia)+'</span> <span class="pill">'+esc(c.desenlace)+'</span><b>'+esc(c.titulo)+'</b><p>'+esc(c.resumen)+'</p>'+(c.claves?'<ul>'+c.claves.map(function(k){return '<li>'+esc(k)+'</li>'}).join('')+'</ul>':'')+'</div>'}).join(''):'<p class="mut">Sin casos cargados.</p>')+'</div><p class="mut">Casos ilustrativos, sin nombres reales; no anticipan el resultado de ningún caso concreto.</p>';
  Array.prototype.forEach.call(el.querySelectorAll('[data-m]'),function(b){b.onclick=function(){f=b.dataset.m;draw()}})}
 draw();
}

window.JTOOLS={diagnostico:diagnostico,escritos:escritos,plazos:plazos,cuantifica:cuantifica,checklist:checklist,simulacro:simulacro,perfil:perfil,casos:casos};
})();
