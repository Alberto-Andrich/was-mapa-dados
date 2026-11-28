/* Neste dia na aventura (WAS), v1.1.2, 28/11/2026 (rola até a seção quando o endereço traz #id; faixa com data-posicao; data-titulo, data-hash=nao; página: um calendário de mês com setas; home: setas até 7 dias; além disso abre o calendário) (monta a própria marcação dentro de [data-neste-dia]). Bloco da home e página /on-this-day.
   Dados: neste-dia-dados.json na mesma pasta do jsDelivr (mesmo commit). Fonte: /mnt/project-files/neste-dia/ */
(function(){
if(window.__wasNesteDia)return;window.__wasNesteDia=1;
var SRC=(document.currentScript&&document.currentScript.src)||'';
if(!/neste-dia/.test(SRC)){var ss=document.querySelectorAll('script[src*="neste-dia-"]');if(ss.length)SRC=ss[ss.length-1].src;}
var DADOS=(window.WAS_ND_DADOS||[]).slice();if(SRC&&!/^blob:/.test(SRC))DADOS.push(SRC.replace(/[^\/]*$/,'neste-dia-dados.json'));
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
mesAnt:['Mês anterior','Previous month','Mes anterior'],mesProx:['Próximo mês','Next month','Mes siguiente'],fatoAnt:['Fato anterior','Previous event','Hecho anterior'],fatosDia:['Fatos deste dia','Events on this day','Hechos de este día'],fatoProx:['Próximo fato','Next event','Hecho siguiente'],fatoDe:[['Fato','de'],['Event','of'],['Hecho','de']],
maisCal:['Ver mais dias no calendário','See more days in the calendar','Ver más días en el calendario'],
dicaCal:['Para ir além de uma semana, a seta abre o calendário.','To go beyond a week, the arrow opens the calendar.','Para ir más allá de una semana, la flecha abre el calendario.'],
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
+".ndd-cr a{font:inherit;color:inherit;text-decoration:underline;text-decoration-color:#3a434e}"
+".ndd-ano{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin:0}"
+".ndd-ano b{font:700 clamp(44px,5vw,84px)/1 Montserrat,sans-serif;color:var(--nw);letter-spacing:-.01em}"
+".ndd-tipo{font:600 12px/1.2 Montserrat,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--nm)}"
+".ndd-txt{margin:16px 0 0;max-width:820px;font:300 clamp(19px,1.5vw,24px)/1.5 Lato,sans-serif;color:var(--nt)}"
+".ndd-links{display:flex;flex-wrap:wrap;gap:8px 22px;margin:18px 0 0;padding:0;list-style:none;font:400 15px/1.4 Lato,sans-serif;color:var(--nm)}"
+".ndd-links a{font:inherit;color:var(--nk);text-decoration:none;border-bottom:1px solid rgba(100,170,255,.35)}.ndd-links a:hover{border-bottom-color:var(--nk)}"
+".ndd-tamb{margin-top:clamp(32px,4vw,52px)}"
+".ndd-tamb h3{margin:0 0 4px;font:700 15px/1.2 Montserrat,sans-serif;letter-spacing:.04em;color:var(--nw)}"
+".ndd-tamb ul{list-style:none;margin:0;padding:0;border-bottom:1px solid var(--nl)}"
+".ndd-tamb button{display:grid;grid-template-columns:72px minmax(0,1fr);gap:16px;width:100%;padding:14px 0;border:0;border-top:1px solid var(--nl);background:none;color:var(--nt);text-align:left;cursor:pointer;font:400 16px/1.45 Lato,sans-serif}"
+".ndd-tamb button:hover{background:var(--nb)}.ndd-tamb button b{font:700 18px/1.3 Montserrat,sans-serif;color:var(--nw)}"
+".ndd-nav-home{justify-content:center;margin:18px 0 clamp(20px,2.4vw,30px)}.ndd-nav-home .ndd-btn{min-height:44px}.ndd-dica{flex-basis:100%;text-align:center;margin:2px 0 0;font:400 14px/1.4 Lato,sans-serif;color:var(--nm)}.ndd [hidden]{display:none!important}"
+".ndd-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:clamp(36px,4vw,56px)}"
+".ndd-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;background:var(--nr);color:#fff;font:600 15px/1 Montserrat,sans-serif;text-decoration:none;border:0;border-radius:2px;cursor:pointer}"
+".ndd-btn.sec{background:transparent;border:1px solid #fff}"
+".ndd-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;margin-top:clamp(22px,2.5vw,32px)}"
+".ndd-tb{display:flex;gap:12px;justify-content:safe center;overflow-x:auto;margin-top:clamp(20px,2.5vw,32px);padding:4px 2px 8px;scrollbar-width:thin}.ndd-tb button{flex:0 0 auto;width:112px;background:none;border:0;padding:0;color:#c9d1d9;cursor:pointer;text-align:center}.ndd-tbi{display:flex;align-items:center;justify-content:center;width:112px;height:72px;overflow:hidden;border:2px solid #3a434e;border-radius:2px;background:#11161c}.ndd-tbi img{width:100%;height:100%;object-fit:cover;opacity:.7;transition:opacity .2s}.ndd-tbi svg{width:32px;height:32px}.ndd-tb button b{display:block;margin-top:6px;font-size:14px;letter-spacing:.04em}.ndd-tb button:hover img,.ndd-tb button[aria-current] img{opacity:1}.ndd-tb button[aria-current] .ndd-tbi{border-color:var(--nr)}.ndd-tb button[aria-current] b{color:#fff}@media(max-width:479px){.ndd-tb button,.ndd-tbi{width:88px}.ndd-tbi{height:60px}}.ndd-fx{display:flex;align-items:center;justify-content:center;gap:16px;margin:0 0 clamp(20px,2.5vw,32px)}.ndd-fxn{font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#c9d1d9;min-width:9em;text-align:center}.ndd-fxn b{color:#fff;font-size:18px}.ndd-seta{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid #3a434e;background:none;color:#fff;cursor:pointer;border-radius:2px}"
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
+".ndd{scroll-margin-top:70px}.ndd-kick-pg{margin-bottom:clamp(20px,2.4vw,32px)}"
+".ndd-pg{display:grid;grid-template-columns:minmax(280px,340px) minmax(0,1fr);gap:clamp(32px,4vw,72px);align-items:start}"
+".ndd-mes{position:sticky;top:96px;background:var(--nb);padding:20px 18px 22px;border-top:4px solid var(--nr)}"
+".ndd-mh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:14px}.ndd-mh h3{margin:0;font:700 20px/1.2 Montserrat,sans-serif;color:var(--nw);text-align:center;flex:1}"
+".ndd-grade{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}"
+".ndd-grade a{display:flex;align-items:center;justify-content:center;aspect-ratio:1;min-height:36px;background:#0b0f14;color:#c9d0d7;font:400 15px/1 Lato,sans-serif;text-decoration:none;border-radius:2px}"
+".ndd-grade a:hover{background:#1c2430;color:#fff}.ndd-grade a.hj{box-shadow:inset 0 0 0 1px #fff}.ndd-grade a[aria-current]{background:var(--nr);color:#fff;font-weight:700}"
+".ndd-grade a:focus-visible{outline:2px solid #fff;outline-offset:2px}"
+".ndd-mb{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:18px}.ndd-mb .ndd-btn{padding:0 16px;font-size:14px}"
+".ndd-topo{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;scroll-margin-top:90px}.ndd-topo .ndd-h2{margin:0}.ndd-dias{display:flex;gap:10px}"
+".ndd-pg .ndd-out{margin-top:clamp(20px,2.4vw,32px)}"
+"@media (max-width:991px){.ndd-pg{grid-template-columns:1fr}.ndd-mes{position:static;max-width:480px;width:100%;margin:0 auto}}"
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
  var out=el.querySelector('.ndd-out'),h2=el.querySelector('.ndd-h2'),hk=hojeK(),k=hk,off=0,MAX=7,lista=[],idx=0;
  var nav=document.createElement('div');nav.className='ndd-nav ndd-nav-home';h2.parentNode.insertBefore(nav,out);
  nav.innerHTML='<button type="button" class="ndd-seta" data-a="-1">'+SETA[0]+'</button><button type="button" class="ndd-btn sec" data-a="h">'+t('hoje')+'</button><button type="button" class="ndd-seta" data-a="1">'+SETA[1]+'</button><p class="ndd-dica" hidden></p>';
  var bA=nav.querySelector('[data-a="-1"]'),bP=nav.querySelector('[data-a="1"]'),bH=nav.querySelector('[data-a=h]'),dica=nav.querySelector('.ndd-dica');
  var bt=el.querySelector('.ndd-btns');
  function render(i){
    idx=i;var f=lista[idx];
    var outros=lista.filter(function(x,j){return j!==idx});
    out.innerHTML=cartao(f,900)+(outros.length?'<div class="ndd-tamb"><h3>'+t('tamb')+'</h3><ul>'+outros.map(function(o){return '<li><button type="button" data-i="'+lista.indexOf(o)+'"><b>'+anoTxt(o.y)+'</b><span>'+esc(o.t[L])+'</span></button></li>'}).join('')+'</ul></div>':'');
  }
  function dia(novoOff){
    off=novoOff;k=hk;var n=Math.abs(off);for(var c=0;c<n;c++)k=mover(k,off<0?-1:1);
    lista=M[k]||[];idx=lista.length>1?(off===0?new Date().getFullYear()%lista.length:0):0;
    h2.innerHTML=esc(dataTxt(k))+(off===0?'<small>'+t('hojeE')+'</small>':'');
    bH.hidden=off===0;
    bA.setAttribute('aria-label',off<=-MAX?t('maisCal'):t('ant'));bP.setAttribute('aria-label',off>=MAX?t('maisCal'):t('prox'));
    bA.title=bA.getAttribute('aria-label');bP.title=bP.getAttribute('aria-label');
    if(Math.abs(off)>=MAX){dica.hidden=false;dica.textContent=t('dicaCal')}else dica.hidden=true;
    if(bt)bt.innerHTML='<a class="ndd-btn" href="'+PRE+PAG+'#'+k+'">'+t('todos')+'</a>';
    if(!lista.length){out.innerHTML='<p class="ndd-erro">'+t('erro')+'</p>';return}
    render(idx);
  }
  out.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)render(+b.getAttribute('data-i'))});
  nav.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;var a=b.getAttribute('data-a');
    if(a=='h'){dia(0);return}
    var d=+a,n=off+d;
    if(Math.abs(n)>MAX){location.href=PRE+PAG+'#'+mover(k,d);return}
    dia(n);});
  dia(0);
}

function pagina(el,M){
  var out=el.querySelector('.ndd-out'),h2=el.querySelector('.ndd-h2'),hk=hojeK(),atual=null,mesV=+hk.slice(0,2);
  var topo=el.querySelector('.ndd-topo'),mes=el.querySelector('.ndd-mes');
  topo.insertAdjacentHTML('beforeend','<div class="ndd-dias"><button type="button" class="ndd-seta" data-a="-1" aria-label="'+t('ant')+'" title="'+t('ant')+'">'+SETA[0]+'</button><button type="button" class="ndd-seta" data-a="1" aria-label="'+t('prox')+'" title="'+t('prox')+'">'+SETA[1]+'</button></div>');
  mes.innerHTML='<div class="ndd-mh"><button type="button" class="ndd-seta" data-m="-1" aria-label="'+t('mesAnt')+'" title="'+t('mesAnt')+'">'+SETA[0]+'</button><h3 aria-live="polite"></h3><button type="button" class="ndd-seta" data-m="1" aria-label="'+t('mesProx')+'" title="'+t('mesProx')+'">'+SETA[1]+'</button></div><div class="ndd-grade"></div><div class="ndd-mb"><button type="button" class="ndd-btn sec" data-a="h">'+t('hoje')+'</button><button type="button" class="ndd-btn sec" data-a="r">'+t('sorte')+'</button></div>';
  var grade=mes.querySelector('.ndd-grade'),mt=mes.querySelector('h3');
  function desenha(){
    mt.textContent=MES[L][mesV-1].charAt(0).toUpperCase()+MES[L][mesV-1].slice(1);
    var s='';for(var d=1;d<=NDIAS[mesV-1];d++){var kk=chave(mesV,d);s+='<a href="#'+kk+'" data-k="'+kk+'"'+(kk==hk?' class="hj"':'')+(kk==atual?' aria-current="date"':'')+' aria-label="'+esc(dataTxt(kk))+'">'+d+'</a>'}
    grade.innerHTML=s;
  }
  var fl=[],fi=0;
  function mostra(){var n=fl.length;if(!n){out.innerHTML='<p class="ndd-erro">'+t('erro')+'</p>';return}
    var pg=n>1?'<div class="ndd-fx" role="group" aria-label="'+t('fatoDe')[0]+'"><button type="button" class="ndd-seta" data-f="-1" aria-label="'+t('fatoAnt')+'" title="'+t('fatoAnt')+'">'+SETA[0]+'</button><span class="ndd-fxn">'+t('fatoDe')[0]+' <b>'+(fi+1)+'</b> '+t('fatoDe')[1]+' '+n+'</span><button type="button" class="ndd-seta" data-f="1" aria-label="'+t('fatoProx')+'" title="'+t('fatoProx')+'">'+SETA[1]+'</button></div>':'';
    var tb=n>1?'<div class="ndd-tb" role="group" aria-label="'+esc(t('fatosDia'))+'">'+fl.map(function(f,j){return '<button type="button" data-fi="'+j+'"'+(j==fi?' aria-current="true"':'')+' aria-label="'+esc(anoTxt(f.y)+': '+f.t[L].slice(0,90))+'"><span class="ndd-tbi">'+(f.p?'<img loading="lazy" decoding="async" src="'+img(f.p.f,240)+'" alt="">':ICO)+'</span><b>'+anoTxt(f.y)+'</b></button>'}).join('')+'</div>':'';
    out.innerHTML=pg+cartao(fl[fi],1000)+tb;}
  function ir(k,rolar){
    k=valida(k)||hk;atual=k;mesV=+k.slice(0,2);var lista=M[k]||[],n=lista.length;
    h2.innerHTML=esc(dataTxt(k))+'<small>'+(k==hk?t('hojeE')+' · ':'')+n+' '+T.fatos[L][n==1?0:1]+'</small>';
    fl=lista;fi=0;mostra();
    desenha();
    if(rolar!==undefined&&el.getAttribute('data-hash')!=='nao'&&location.hash.slice(1)!==k)history.replaceState(null,'','#'+k);
    if(rolar===true&&mes.getBoundingClientRect().bottom<=topo.getBoundingClientRect().top+1)topo.scrollIntoView({behavior:'smooth',block:'start'});
  }
  el.addEventListener('click',function(e){
    var a=e.target.closest('a[data-k]');if(a){e.preventDefault();ir(a.getAttribute('data-k'),true);return}
    var tj=e.target.closest('[data-fi]');if(tj){fi=+tj.getAttribute('data-fi');mostra();return}
    var fb=e.target.closest('[data-f]');if(fb){fi=(fi+fl.length+(+fb.getAttribute('data-f')))%fl.length;mostra();return}
    var m=e.target.closest('[data-m]');if(m){mesV=(mesV+11+(+m.getAttribute('data-m')))%12+1;desenha();return}
    var b=e.target.closest('[data-a]');if(!b)return;var x=b.getAttribute('data-a');
    if(x=='h')ir(hk,true);else if(x=='r'){var ks=Object.keys(M);ir(ks[Math.floor(Math.random()*ks.length)],true)}else ir(mover(atual,+x),false);
  });
  window.addEventListener('hashchange',function(){var k=valida(location.hash.slice(1));if(k&&k!==atual)ir(k,false)});
  ir(location.hash.slice(1));
}

function iniciar(){
  var els=document.querySelectorAll('[data-neste-dia]');if(!els.length)return;
  els.forEach(function(el){
    // posição fixa entre as capas da home: a faixa com data-posicao=N vira o N-ésimo filho (depois do rodízio)
    var fx=el.closest('[data-posicao]');if(fx&&fx.parentNode){var n=+fx.getAttribute('data-posicao'),ref=fx.parentNode.children[n-1];if(ref&&ref!==fx)fx.parentNode.insertBefore(fx,ref)}
    el.classList.add('ndd');var f=el.getAttribute('data-fundo');if(f&&/^#[0-9a-fA-F]{3,8}$/.test(f))el.style.setProperty('--ndd-bg',f);
    if(!el.querySelector('.ndd-out'))el.innerHTML=el.getAttribute('data-neste-dia')=='pagina'
      ?(el.hasAttribute('data-titulo')?'<div class="ndd-wrap"><p class="ndd-kick ndd-kick-pg"></p></div>':'')+'<div class="ndd-wrap ndd-pg"><aside class="ndd-mes"></aside><div class="ndd-col"><div class="ndd-topo"><h2 class="ndd-h2"></h2></div><div class="ndd-out" aria-live="polite"></div></div></div>'
      :'<div class="ndd-wrap"><p class="ndd-kick"></p><h2 class="ndd-h2"></h2><div class="ndd-out" aria-live="polite"></div><div class="ndd-btns"></div></div>';
    var k=el.querySelector('.ndd-kick');if(k)k.textContent=t('kick')});
  if(!DADOS.length){els.forEach(function(el){el.querySelector('.ndd-out').innerHTML='<p class="ndd-erro">'+t('erro')+'</p>'});return}
  function busca(i){return fetch(DADOS[i]).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(e){if(i+1<DADOS.length)return busca(i+1);throw e})}
  busca(0).then(function(j){
    var M=porDia(j.fatos);
    els.forEach(function(el){(el.getAttribute('data-neste-dia')=='pagina'?pagina:home)(el,M)});
    els.forEach(function(el){if(el.id&&location.hash==='#'+el.id)setTimeout(function(){el.scrollIntoView({block:'start'})},60)});
  }).catch(function(){els.forEach(function(el){var o=el.querySelector('.ndd-out');if(o)o.innerHTML='<p class="ndd-erro">'+t('erro')+'</p>'})});
}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
