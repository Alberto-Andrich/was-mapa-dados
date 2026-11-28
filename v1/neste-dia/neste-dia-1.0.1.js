/* Neste dia na aventura (WAS), v1.0.1, 28/11/2026 (monta a própria marcação dentro de [data-neste-dia]). Bloco da home e página /on-this-day.
   Dados: neste-dia-dados.json na mesma pasta do jsDelivr (mesmo commit). Fonte: /mnt/project-files/neste-dia/ */
(function(){
if(window.__wasNesteDia)return;window.__wasNesteDia=1;
var SRC=(document.currentScript&&document.currentScript.src)||'';
if(!/neste-dia/.test(SRC)){var ss=document.querySelectorAll('script[src*="neste-dia-"]');if(ss.length)SRC=ss[ss.length-1].src;}
var DADOS=SRC?SRC.replace(/[^\/]*$/,'neste-dia-dados.json'):'';
var p=location.pathname,L=/^\/en(\/|$)/.test(p)?1:/^\/es(\/|$)/.test(p)?2:0,PRE=['','/en','/es'][L];
var PAG='/on-this-day';
var T={
kick:['Neste dia na aventura','On this day in adventure','Este día en la aventura'],
tamb:['Também neste dia','Also on this day','También en este día'],
todos:['Ver todos os dias','See every day','Ver todos los días'],
sorte:['Outro dia ao acaso','A random day','Otro día al azar'],
ant:['Dia anterior','Previous day','Día anterior'],
prox:['Próximo dia','Next day','Día siguiente'],
hoje:['Hoje','Today','Hoy'],
mes:['Mês','Month','Mes'],dia:['Dia','Day','Día'],
cal:['O ano inteiro','The whole year','El año entero'],
calsub:['Escolha uma data para ver o que aconteceu.','Pick a date to see what happened.','Elige una fecha para ver qué pasó.'],
foto:['Foto','Photo','Foto'],
fatos:[['fato','fatos'],['event','events'],['hecho','hechos']],
erro:['Não foi possível carregar os dados agora.','The data could not be loaded right now.','No se pudieron cargar los datos ahora.'],
hojeE:['hoje','today','hoy'],
perfil:['Perfil','Profile','Perfil'],destino:['Destino','Destination','Destino'],rep:['Reportagem','Feature','Reportaje'],
ano:['Em','In','En']
};
var K={nasc:['Nascimento','Birth','Nacimiento'],morte:['Morte','Death','Muerte'],exped:['Expedição','Expedition','Expedición'],cume:['Cume','Summit','Cumbre'],descob:['Descoberta','Discovery','Descubrimiento'],parque:['Área protegida','Protected area','Área protegida'],vulcao:['Vulcão','Volcano','Volcán'],voo:['Aviação','Aviation','Aviación'],espaco:['Espaço','Space','Espacio'],naufragio:['Naufrágio','Shipwreck','Naufragio'],marco:['Marco','Milestone','Hito'],natureza:['Natureza','Nature','Naturaleza']};
var MES=[['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],['January','February','March','April','May','June','July','August','September','October','November','December'],['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']];
var MESC=[['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']];
var NDIAS=[31,29,31,30,31,30,31,31,30,31,30,31];
function t(k){return T[k][L]}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function pad(n){return(n<10?'0':'')+n}
function chave(m,d){return pad(m)+'-'+pad(d)}
function dataTxt(k){var m=+k.slice(0,2),d=+k.slice(3);return L==1?MES[1][m-1]+' '+d:d+' de '+MES[L][m-1]}
function hojeK(){var n=new Date();return chave(n.getMonth()+1,n.getDate())}
function mover(k,delta){var m=+k.slice(0,2),d=+k.slice(3)+delta;if(d<1){m=m==1?12:m-1;d=NDIAS[m-1]}else if(d>NDIAS[m-1]){m=m==12?1:m+1;d=1}return chave(m,d)}
function valida(k){if(!/^\d\d-\d\d$/.test(k||''))return null;var m=+k.slice(0,2),d=+k.slice(3);return m>=1&&m<=12&&d>=1&&d<=NDIAS[m-1]?k:null}
function anoTxt(y){return y<0?(-y)+(L==1?' BC':' a.C.'):String(y)}
function img(f,w){return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(f)+'?width='+w}
var LIC={'Public domain':['Domínio público','Public domain','Dominio público'],'No restrictions':['Sem restrições conhecidas','No known restrictions','Sin restricciones conocidas']};
function lic(c){return LIC[c]?LIC[c][L]:c}
function tipoLink(u){return /^\/explorers\//.test(u)?t('perfil'):/^\/destinations\//.test(u)?t('destino'):t('rep')}

var css=".ndd{--nl:#262d37;--nm:#9aa3ad;--nt:#e6e6e6;--nw:#fff;--nr:#b90000;--nb:#11161d;--nk:#64aaff;background:var(--ndd-bg,#0b0f14);padding:clamp(48px,5vw,80px) 0;color:var(--nt)}"
+".ndd[data-fundo=transparente]{--ndd-bg:transparent}"
+".ndd-wrap{max-width:1440px;width:calc(100% - 8vw);margin:0 auto}"
+".ndd-kick{display:flex;align-items:center;gap:10px;font:600 14px/1.2 Montserrat,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin:0}"
+".ndd-kick::before{content:'';display:block;flex:0 0 12px;width:12px;height:12px;background:var(--nr)}"
+".ndd-h2{margin:10px 0 0;font:700 clamp(26px,2.6vw,42px)/1.15 Montserrat,sans-serif;color:var(--nw);text-transform:none}"
+".ndd-h2 small{display:inline-block;margin-left:12px;font:400 14px/1 Lato,sans-serif;color:var(--nm);letter-spacing:.06em;text-transform:uppercase;vertical-align:6px}"
+".ndd-out{margin-top:clamp(26px,3vw,40px)}"
+".ndd-card{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(24px,3.5vw,56px);align-items:center;animation:nddIn .35s ease}"
+".ndd-card+.ndd-card{margin-top:clamp(32px,4vw,56px);padding-top:clamp(32px,4vw,56px);border-top:1px solid var(--nl)}"
+"@keyframes nddIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.ndd-card{animation:none}}"
+".ndd-fig{margin:0}"
+".ndd-ph{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;background:var(--nb)}"
+".ndd-ph .bg{position:absolute;inset:-24px;background-size:cover;background-position:center;filter:blur(22px) brightness(.4);transform:scale(1.1)}"
+".ndd-ph img{position:relative;display:block;width:100%;height:100%;object-fit:contain}"
+".ndd-ph.sem{display:flex;align-items:center;justify-content:center}"
+".ndd-ph.sem svg{width:72px;height:72px;stroke:#3a434e}"
+".ndd-cr{display:block;margin-top:8px;font:400 11px/1.4 Lato,sans-serif;color:#7d8793}"
+".ndd-cr a{color:inherit;text-decoration:underline;text-decoration-color:#3a434e}"
+".ndd-ano{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin:0}"
+".ndd-ano b{font:700 clamp(44px,5vw,84px)/1 Montserrat,sans-serif;color:var(--nw);letter-spacing:-.01em}"
+".ndd-tipo{font:600 12px/1.2 Montserrat,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--nm)}"
+".ndd-txt{margin:16px 0 0;max-width:820px;font:300 clamp(19px,1.5vw,24px)/1.5 Lato,sans-serif;color:var(--nt)}"
+".ndd-links{display:flex;flex-wrap:wrap;gap:8px 22px;margin:18px 0 0;padding:0;list-style:none;font:400 15px/1.4 Lato,sans-serif;color:var(--nm)}"
+".ndd-links a{color:var(--nk);text-decoration:none;border-bottom:1px solid rgba(100,170,255,.35)}.ndd-links a:hover{border-bottom-color:var(--nk)}"
+".ndd-tamb{margin-top:clamp(32px,4vw,52px)}"
+".ndd-tamb h3{margin:0 0 4px;font:700 15px/1.2 Montserrat,sans-serif;letter-spacing:.04em;color:var(--nw)}"
+".ndd-tamb ul{list-style:none;margin:0;padding:0;border-bottom:1px solid var(--nl)}"
+".ndd-tamb button{display:grid;grid-template-columns:72px minmax(0,1fr);gap:16px;width:100%;padding:14px 0;border:0;border-top:1px solid var(--nl);background:none;color:var(--nt);text-align:left;cursor:pointer;font:400 16px/1.45 Lato,sans-serif}"
+".ndd-tamb button:hover{background:var(--nb)}.ndd-tamb button b{font:700 18px/1.3 Montserrat,sans-serif;color:var(--nw)}"
+".ndd-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:clamp(36px,4vw,56px)}"
+".ndd-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;background:var(--nr);color:#fff;font:600 15px/1 Montserrat,sans-serif;text-decoration:none;border:0;border-radius:2px;cursor:pointer}"
+".ndd-btn.sec{background:transparent;border:1px solid #fff}"
+".ndd-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;margin-top:clamp(22px,2.5vw,32px)}"
+".ndd-seta{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid #3a434e;background:none;color:#fff;cursor:pointer;border-radius:2px}"
+".ndd-seta svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}"
+".ndd-sel{height:44px;padding:0 36px 0 14px;border:1px solid #3a434e;border-radius:2px;background:#11161d url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%239aa3ad' stroke-width='1.6'/%3E%3C/svg%3E\") no-repeat right 12px center;color:#fff;font:600 15px/1 Montserrat,sans-serif;-webkit-appearance:none;appearance:none;cursor:pointer}"
+".ndd-seta:focus-visible,.ndd-sel:focus-visible,.ndd-btn:focus-visible,.ndd-links a:focus-visible,.ndd-tamb button:focus-visible,.ndd-cal a:focus-visible{outline:2px solid #fff;outline-offset:3px}"
+".ndd-calw{margin-top:clamp(56px,6vw,96px);padding-top:clamp(40px,4vw,64px);border-top:1px solid var(--nl)}"
+".ndd-calw h3{margin:0;font:700 clamp(22px,2vw,30px)/1.2 Montserrat,sans-serif;color:var(--nw)}.ndd-calw p{margin:8px 0 0;color:var(--nm);font:400 16px/1.5 Lato,sans-serif}"
+".ndd-cal{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(20px,2.4vw,36px);margin-top:28px}"
+".ndd-m h4{margin:0 0 10px;font:600 13px/1 Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--nm)}"
+".ndd-m div{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}"
+".ndd-cal a{display:flex;align-items:center;justify-content:center;aspect-ratio:1;min-height:30px;background:var(--nb);color:#c9d0d7;font:400 13px/1 Lato,sans-serif;text-decoration:none;border-radius:2px}"
+".ndd-cal a:hover{background:#1c2430;color:#fff}.ndd-cal a.hj{box-shadow:inset 0 0 0 1px #fff}.ndd-cal a[aria-current]{background:var(--nr);color:#fff}"
+".ndd-erro{color:var(--nm);font:400 16px/1.5 Lato,sans-serif;text-align:center}"
+"@media (max-width:1200px){.ndd-cal{grid-template-columns:repeat(3,minmax(0,1fr))}}"
+"@media (max-width:991px){.ndd-card{grid-template-columns:1fr}.ndd-cal{grid-template-columns:repeat(2,minmax(0,1fr))}}"
+"@media (max-width:479px){.ndd-cal{grid-template-columns:1fr}.ndd-tamb button{grid-template-columns:56px minmax(0,1fr);gap:12px;font-size:15px}.ndd-h2 small{display:block;margin:8px 0 0}}"
+"@media (min-width:2000px){.ndd-txt{font-size:26px}}";
var st=document.createElement('style');st.id='was-neste-dia-css';st.textContent=css;document.head.appendChild(st);

var ICO='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
var SETA=['<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'];

function cartao(f,w){
  var ph=f.p?'<span class="ndd-ph"><span class="bg" style="background-image:url(\''+img(f.p.f,320)+'\')"></span><img loading="lazy" decoding="async" src="'+img(f.p.f,w)+'" alt="'+esc(f.t[L].slice(0,140))+'"></span>'
    +'<span class="ndd-cr">'+t('foto')+': '+(f.p.a?esc(f.p.a)+', ':'')+'<a href="https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(f.p.f)+'" target="_blank" rel="noopener">'+esc(lic(f.p.c))+', Wikimedia Commons</a></span>'
    :'<span class="ndd-ph sem">'+ICO+'</span>';
  var li=f.l.map(function(l){return '<li>'+tipoLink(l.u)+': <a href="'+PRE+l.u+'">'+esc(l.n[L])+'</a></li>'}).join('');
  return '<article class="ndd-card"><figure class="ndd-fig">'+ph+'</figure><div><p class="ndd-ano"><b>'+anoTxt(f.y)+'</b><span class="ndd-tipo">'+esc((K[f.k]||K.marco)[L])+'</span></p><p class="ndd-txt">'+esc(f.t[L])+'</p>'+(li?'<ul class="ndd-links">'+li+'</ul>':'')+'</div></article>';
}

function porDia(D){var m={};D.forEach(function(f){(m[f.d]=m[f.d]||[]).push(f)});return m}

function home(el,M){
  var out=el.querySelector('.ndd-out'),h2=el.querySelector('.ndd-h2');
  var k=hojeK(),lista=M[k]||[],idx=0;
  // destaque do dia: alterna entre os fatos do dia, um por ano
  if(lista.length>1)idx=new Date().getFullYear()%lista.length;
  function render(i){
    idx=i;var f=lista[idx];
    h2.innerHTML=esc(dataTxt(k))+'<small>'+t('hojeE')+'</small>';
    var outros=lista.filter(function(x,j){return j!==idx});
    out.innerHTML=cartao(f,900)+(outros.length?'<div class="ndd-tamb"><h3>'+t('tamb')+'</h3><ul>'+outros.map(function(o){return '<li><button type="button" data-i="'+lista.indexOf(o)+'"><b>'+anoTxt(o.y)+'</b><span>'+esc(o.t[L])+'</span></button></li>'}).join('')+'</ul></div>':'');
  }
  out.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)render(+b.getAttribute('data-i'))});
  if(!lista.length){out.innerHTML='<p class="ndd-erro">'+t('erro')+'</p>';return}
  render(idx);
  var bt=el.querySelector('.ndd-btns');
  if(bt&&!bt.children.length)bt.innerHTML='<a class="ndd-btn" href="'+PRE+PAG+'#'+k+'">'+t('todos')+'</a>';
}

function pagina(el,M){
  var out=el.querySelector('.ndd-out'),h2=el.querySelector('.ndd-h2'),nav=el.querySelector('.ndd-nav'),hk=hojeK(),atual=null;
  var selM='<select class="ndd-sel" aria-label="'+t('mes')+'" data-s="m">'+MES[L].map(function(n,i){return '<option value="'+(i+1)+'">'+n.charAt(0).toUpperCase()+n.slice(1)+'</option>'}).join('')+'</select>';
  nav.innerHTML='<button type="button" class="ndd-seta" data-a="-1" aria-label="'+t('ant')+'">'+SETA[0]+'</button><select class="ndd-sel" aria-label="'+t('dia')+'" data-s="d"></select>'+selM+'<button type="button" class="ndd-seta" data-a="1" aria-label="'+t('prox')+'">'+SETA[1]+'</button><button type="button" class="ndd-btn sec" data-a="h">'+t('hoje')+'</button><button type="button" class="ndd-btn sec" data-a="r">'+t('sorte')+'</button>';
  var sd=nav.querySelector('[data-s=d]'),sm=nav.querySelector('[data-s=m]');
  var cal=el.querySelector('.ndd-cal');
  if(cal){cal.innerHTML=MES[L].map(function(n,i){var s='';for(var d=1;d<=NDIAS[i];d++){var kk=chave(i+1,d);s+='<a href="#'+kk+'" data-k="'+kk+'"'+(kk==hk?' class="hj"':'')+' aria-label="'+esc(dataTxt(kk))+'">'+d+'</a>'}return '<div class="ndd-m"><h4>'+n+'</h4><div>'+s+'</div></div>'}).join('');
    var ct=el.querySelector('.ndd-calw h3'),cp=el.querySelector('.ndd-calw p');if(ct)ct.textContent=t('cal');if(cp)cp.textContent=t('calsub');}
  function ir(k,rolar){
    k=valida(k)||hk;atual=k;var m=+k.slice(0,2),d=+k.slice(3),lista=M[k]||[];
    var s='';for(var i=1;i<=NDIAS[m-1];i++)s+='<option value="'+i+'">'+i+'</option>';sd.innerHTML=s;sd.value=d;sm.value=m;
    var n=lista.length;h2.innerHTML=esc(dataTxt(k))+'<small>'+(k==hk?t('hojeE')+' · ':'')+n+' '+T.fatos[L][n==1?0:1]+'</small>';
    out.innerHTML=lista.length?lista.map(function(f){return cartao(f,1000)}).join(''):'<p class="ndd-erro">'+t('erro')+'</p>';
    if(cal){var c=cal.querySelector('[aria-current]');if(c)c.removeAttribute('aria-current');var a=cal.querySelector('[data-k="'+k+'"]');if(a)a.setAttribute('aria-current','date')}
    if(location.hash.slice(1)!==k)history.replaceState(null,'','#'+k);
    if(rolar)el.scrollIntoView({behavior:'smooth',block:'start'});
  }
  nav.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.getAttribute('data-a');
    if(a=='h')ir(hk);else if(a=='r'){var ks=Object.keys(M);ir(ks[Math.floor(Math.random()*ks.length)])}else ir(mover(atual,+a))});
  sd.addEventListener('change',function(){ir(chave(+sm.value,+sd.value))});
  sm.addEventListener('change',function(){var m=+sm.value;ir(chave(m,Math.min(+sd.value,NDIAS[m-1])))});
  if(cal)cal.addEventListener('click',function(e){var a=e.target.closest('a[data-k]');if(!a)return;e.preventDefault();ir(a.getAttribute('data-k'),true)});
  window.addEventListener('hashchange',function(){var k=valida(location.hash.slice(1));if(k&&k!==atual)ir(k)});
  ir(location.hash.slice(1));
}

function iniciar(){
  var els=document.querySelectorAll('[data-neste-dia]');if(!els.length)return;
  els.forEach(function(el){
    el.classList.add('ndd');
    if(!el.querySelector('.ndd-out'))el.innerHTML=el.getAttribute('data-neste-dia')=='pagina'
      ?'<div class="ndd-wrap"><h2 class="ndd-h2"></h2><div class="ndd-nav"></div><div class="ndd-out" aria-live="polite"></div><div class="ndd-calw"><h3></h3><p></p><div class="ndd-cal"></div></div></div>'
      :'<div class="ndd-wrap"><p class="ndd-kick"></p><h2 class="ndd-h2"></h2><div class="ndd-out" aria-live="polite"></div><div class="ndd-btns"></div></div>';
    var k=el.querySelector('.ndd-kick');if(k)k.textContent=t('kick')});
  if(!DADOS){els.forEach(function(el){el.querySelector('.ndd-out').innerHTML='<p class="ndd-erro">'+t('erro')+'</p>'});return}
  fetch(DADOS).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
    var M=porDia(j.fatos);
    els.forEach(function(el){(el.getAttribute('data-neste-dia')=='pagina'?pagina:home)(el,M)});
  }).catch(function(){els.forEach(function(el){var o=el.querySelector('.ndd-out');if(o)o.innerHTML='<p class="ndd-erro">'+t('erro')+'</p>'})});
}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
