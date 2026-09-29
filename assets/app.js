(function(){
'use strict';
var J=window.JPRD, $app=document.getElementById('app');
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
window.esc=esc;
var store={
 get:function(k,d){try{var v=localStorage.getItem('jprd.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
 set:function(k,v){try{localStorage.setItem('jprd.'+k,JSON.stringify(v))}catch(e){}}
};
window.jstore=store;
var done=store.get('done',{}), scores=store.get('quiz',{});
function lid(a,n){return a+'.'+n}
function total(){var n=0;J.areas.forEach(function(a){n+=a.l.length});return n}
function doneCount(){return Object.keys(done).length}
function hasContent(id){return !!J.lessons[id]}
function nextLesson(){for(var i=0;i<J.areas.length;i++){var a=J.areas[i];for(var j=0;j<a.l.length;j++){var id=lid(a.id,j+1);if(!done[id])return id}}return null}
function find(id){var p=id.split('.').map(Number),a=J.areas[p[0]-1];return a?{a:a,n:p[1],t:a.l[p[1]-1]}:null}
function list(arr,tag){return arr&&arr.length?'<'+tag+'>'+arr.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</'+tag+'>':''}

function home(){
 var pct=Math.round(doneCount()/total()*100), nx=nextLesson();
 var h='<section class="hero"><h1>JPRD PRO</h1><p>Previene y resuelve disputas en obra pública. Conviértete en el profesional que la Junta requiere.</p><p><b>'+doneCount()+'</b> de '+total()+' lecciones · '+pct+'%</p><div class="bar"><i style="width:'+pct+'%"></i></div>'+
 (nx?'<p style="margin-top:14px"><a class="btn" style="background:#fbbf24;color:#1e1b4b" href="#/l/'+nx+'">'+(doneCount()?'Continuar':'Empezar')+' · '+esc(find(nx).t)+'</a></p>':'<p>¡Completaste el curso! 🏆</p>')+'</section>';
 h+='<h2>Áreas de formación</h2><div class="grid">'+J.areas.map(function(a){
  var d=0;a.l.forEach(function(_,i){if(done[lid(a.id,i+1)])d++});
  return '<a class="card" href="#/area/'+a.id+'"><span class="ic">'+a.icon+'</span><b>'+a.id+'. '+esc(a.t)+'</b><small>'+esc(a.d)+'</small><br><span class="pill">'+d+'/'+a.l.length+'</span></a>'}).join('')+'</div>';
 h+='<h2>Herramientas</h2>'+toolGrid();
 h+='<p class="disc">'+esc(J.corte)+' Es material formativo, no reemplaza asesoría legal ni técnica. '+esc(J.coletilla)+'</p>';
 return h;
}
function toolGrid(){return '<div class="grid">'+window.TOOLS.map(function(t){return '<a class="card" href="#/t/'+t.id+'"><span class="ic">'+t.icon+'</span><b>'+esc(t.name)+'</b><small>'+esc(t.desc)+'</small></a>'}).join('')+'</div>'}

function area(id){
 var a=J.areas[id-1];if(!a)return nf();
 return '<p class="crumb"><a href="#/">Inicio</a> › Área '+a.id+'</p><h1>'+a.icon+' '+esc(a.t)+'</h1><p class="mut">'+esc(a.d)+'</p><ul class="l">'+a.l.map(function(t,i){var k=lid(a.id,i+1);
  return '<li class="'+(done[k]?'done':'')+'"><a href="#/l/'+k+'"><span class="n">'+k+'</span><span>'+esc(t)+'</span>'+(done[k]?'<span class="chk">✓</span>':'')+'</a></li>'}).join('')+'</ul>';
}
function nf(){return '<h1>No encontrado</h1><a class="btn" href="#/">Inicio</a>'}

function lesson(id){
 var f=find(id);if(!f||!f.t)return nf();var L=J.lessons[id];
 var h='<p class="crumb"><a href="#/">Inicio</a> › <a href="#/area/'+f.a.id+'">Área '+f.a.id+'</a> › '+id+'</p><h1>'+esc(f.t)+'</h1>';
 if(!L){return h+'<div class="box">Esta lección aún no tiene contenido cargado.</div>'}
 h+='<div class="box ok">'+esc(L.resumen)+'</div>';
 if(L.ideas)h+='<h2>Ideas clave</h2>'+list(L.ideas,'ul');
 if(L.pasos)h+='<h2>Cómo aplicarlo</h2>'+list(L.pasos,'ol');
 if(L.errores)h+='<h2>Errores comunes</h2><div class="box err">'+list(L.errores,'ul')+'</div>';
 if(L.ejemplo)h+='<h2>Ejemplo</h2><div class="box">'+esc(L.ejemplo)+'</div>';
 if(L.practica)h+='<h2>Practica</h2><div class="box ok">'+esc(L.practica)+'</div>';
 if(L.quiz&&L.quiz.length)h+='<h2>Comprueba lo aprendido</h2><div id="quiz"></div>';
 h+='<p class="disc">'+esc(J.coletilla)+' No es asesoría legal.</p><div class="row"><button class="btn" id="mk">'+(done[id]?'✓ Completada (quitar)':'Marcar como completada')+'</button>'+nav(id)+'</div>';
 return h;
}
function nav(id){var p=id.split('.').map(Number),a=J.areas[p[0]-1],h='';
 var prev=p[1]>1?lid(p[0],p[1]-1):(p[0]>1?lid(p[0]-1,J.areas[p[0]-2].l.length):null);
 var next=p[1]<a.l.length?lid(p[0],p[1]+1):(p[0]<J.areas.length?lid(p[0]+1,1):null);
 if(prev)h+='<a class="btn alt sm" href="#/l/'+prev+'">← Anterior</a>';if(next)h+='<a class="btn alt sm" href="#/l/'+next+'">Siguiente →</a>';return h}

function bindLesson(id){
 var b=document.getElementById('mk');if(b)b.onclick=function(){if(done[id])delete done[id];else done[id]=1;store.set('done',done);render()};
 var L=J.lessons[id],box=document.getElementById('quiz');if(!L||!box)return;
 var ans={},shown=false;
 function draw(){box.innerHTML=L.quiz.map(function(q,qi){return '<div class="card" style="margin-bottom:10px"><b>'+(qi+1)+'. '+esc(q.q)+'</b>'+q.o.map(function(o,oi){
  var c='opt'+(ans[qi]===oi?' sel':'');if(shown){if(oi===q.ok)c+=' right';else if(ans[qi]===oi)c+=' wrong'}
  return '<div class="'+c+'" data-q="'+qi+'" data-o="'+oi+'" role="button" tabindex="0">'+String.fromCharCode(65+oi)+'. '+esc(o)+'</div>'}).join('')+(shown?'<p class="mut">'+esc(q.why||'')+'</p>':'')+'</div>'}).join('')+
  (shown?'<p class="tot">'+score()+' / '+L.quiz.length+'</p>':'<button class="btn" id="chk">Comprobar</button>');
  Array.prototype.forEach.call(box.querySelectorAll('.opt'),function(el){var f=function(){if(shown)return;ans[+el.dataset.q]=+el.dataset.o;draw()};el.onclick=f;el.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  var c=document.getElementById('chk');if(c)c.onclick=function(){shown=true;scores[id]=score();store.set('quiz',scores);draw()}}
 function score(){var s=0;L.quiz.forEach(function(q,i){if(ans[i]===q.ok)s++});return s}
 draw();
}

function progreso(){
 var h='<h1>Mi progreso</h1><p class="tot">'+doneCount()+' / '+total()+'</p>';
 h+='<table><tr><th>Área</th><th>Avance</th><th>Quiz</th></tr>'+J.areas.map(function(a){var d=0,s=0,m=0;a.l.forEach(function(_,i){var k=lid(a.id,i+1);if(done[k])d++;if(scores[k]!=null){s+=scores[k];m++}});
  return '<tr><td><a href="#/area/'+a.id+'">'+a.id+'. '+esc(a.t)+'</a></td><td>'+d+'/'+a.l.length+'</td><td>'+(m?s+' pts / '+m+' lec.':'—')+'</td></tr>'}).join('')+'</table>';
 h+='<p><button class="btn alt" id="rst">Reiniciar progreso</button></p>';return h}

function tools(){return '<h1>Herramientas</h1>'+toolGrid()}
function tool(id){var t=window.TOOLS.filter(function(x){return x.id===id})[0];if(!t)return nf();
 return '<p class="crumb"><a href="#/tools">Herramientas</a> › '+esc(t.name)+'</p><h1>'+t.icon+' '+esc(t.name)+'</h1><p class="mut">'+esc(t.desc)+'</p><div id="tool"></div><p class="disc">'+esc(J.coletilla)+' Los resultados son orientativos y no garantizan ninguna decisión. No es asesoría legal.</p>'}

function render(){
 var r=(location.hash||'#/').slice(2).split('/'),h,after;
 if(r[0]===''||r[0]==null)h=home();
 else if(r[0]==='area')h=area(+r[1]);
 else if(r[0]==='l'){h=lesson(r[1]);after=function(){bindLesson(r[1])}}
 else if(r[0]==='tools')h=tools();
 else if(r[0]==='t'){h=tool(r[1]);after=function(){var t=window.TOOLS.filter(function(x){return x.id===r[1]})[0];if(t)t.run(document.getElementById('tool'))}}
 else if(r[0]==='progreso'){h=progreso();after=function(){document.getElementById('rst').onclick=function(){if(confirm('¿Borrar todo el progreso?')){done={};scores={};store.set('done',done);store.set('quiz',scores);render()}}}}
 else h=nf();
 $app.innerHTML=h;if(after)after();window.scrollTo(0,0);
}
document.getElementById('foot').textContent='JPRD PRO · '+J.corte+' Material formativo, no reemplaza asesoría legal.';
window.addEventListener('hashchange',render);render();
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
