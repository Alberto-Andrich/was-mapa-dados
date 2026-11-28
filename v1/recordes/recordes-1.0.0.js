/* Recordes e extremos (WAS), v1.0.0, 28/11/2026. Página /records e faixa da HOME (rodízio).
   Monta tudo dentro de [data-recordes="pagina"] ou [data-recordes="home"].
   Dados: recordes-dados.json na mesma pasta. Fontes do trabalho: /mnt/project-files/recordes/ */
(function(){
if(window.__wasRecordes)return;window.__wasRecordes=1;
var SRC=(document.currentScript&&document.currentScript.src)||'';
if(!/recordes-/.test(SRC)){var ss=document.querySelectorAll('script[src*="recordes-"]');if(ss.length)SRC=ss[ss.length-1].src;}
var BASE=SRC?SRC.replace(/[^\/]*$/,''):'https://was-mapa-dados.albertoandrich.workers.dev/v1/recordes/';
var DADOS=[BASE+'recordes-dados.json','https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@main/v1/recordes/recordes-dados.json'];
var p=location.pathname,L=/^\/en(\/|$)/.test(p)?1:/^\/es(\/|$)/.test(p)?2:0,PRE=['','/en','/es'][L];
var PAG='/records';
var T={
kick:['Recordes e extremos','Records and extremes','Récords y extremos'],
h2home:['O mais alto, o mais fundo, o mais frio','The highest, the deepest, the coldest','Lo más alto, lo más profundo, lo más frío'],
leadhome:['Os extremos do planeta e os primeiros a chegar lá, com o lugar, a reportagem ou o explorador de cada recorde.','The planet’s extremes and the first people to reach them, each linked to its place, feature or explorer.','Los extremos del planeta y los primeros en llegar, cada uno con su lugar, reportaje o explorador.'],
todos:['Ver todos os recordes','See all records','Ver todos los récords'],
outros:['Outros recordes','More records','Otros récords'],
tudo:['Todos','All','Todos'],
sorte:['Um recorde ao acaso','A random record','Un récord al azar'],
foto:['Foto','Photo','Foto'],
fonte:['Fonte','Source','Fuente'],
comp:['Compartilhar','Share','Compartir'],
copiado:['Link copiado','Link copied','Enlace copiado'],
rec:[['recorde','recordes'],['record','records'],['récord','récords']],
erro:['Não foi possível carregar os recordes agora.','The records could not be loaded right now.','No se pudieron cargar los récords ahora.'],
guia:['Guia','Guide','Guía'],perfil:['Perfil','Profile','Perfil'],rep:['Reportagem','Feature','Reportaje'],expl:['Exploradores','Explorers','Exploradores'],mapa:['Mapa','Map','Mapa'],
nav:['Categorias de recordes','Record categories','Categorías de récords']
};
var ICON={
montanhas:'<path d="M2 20 9 8l4 6 3-4 6 10Z"/>',
vulcoes:'<path d="M3 20 9 11h6l6 9Z"/><path d="M10.5 7c0-2 2-2 2-4M14 7c0-1.5 1.5-2 1.5-3.5"/>',
cavernas:'<path d="M3 20v-7a9 9 0 0 1 18 0v7"/><path d="M8.5 20v-4.5a3.5 3.5 0 0 1 7 0V20"/>',
polos:'<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9.5 3.5 2.5 2 2.5-2M9.5 20.5l2.5-2 2.5 2"/>',
aguas:'<path d="M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 4-2 6 0M2 13c2.5-2 4.5-2 7 0s4.5 2 7 0 4-2 6 0M2 18c2.5-2 4.5-2 7 0s4.5 2 7 0 4-2 6 0"/>',
terras:'<path d="M12 3 5 14h14Z"/><path d="M12 14v7M8 21h8"/>',
fauna:'<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 12c-3 0-5.5 3.5-5.5 6 0 1.5 1.3 2.5 3 2l2.5-.8 2.5.8c1.7.5 3-.5 3-2 0-2.5-2.5-6-5.5-6Z"/>',
pioneiros:'<path d="M5 21V3"/><path d="M5 4h13l-3 4 3 4H5"/>',
ceu:'<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7Z"/>',
obras:'<path d="M3 21V9h3v2.5h3V9h3v2.5h3V9h3v12Z"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/>'
};
function ic(c){return '<svg class="rx-ic" viewBox="0 0 24 24" aria-hidden="true">'+(ICON[c]||'')+'</svg>'}
function t(k){return T[k][L]}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function img(f,w){return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(f)+'?width='+w}
function filePage(f){return 'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(f)}
var LIC={'Public domain':['Domínio público','Public domain','Dominio público']};
function lic(c){return LIC[c]?LIC[c][L]:c}
function tipo(u){return /^\/explorers\//.test(u)?t('perfil'):/^\/destinations\//.test(u)?t('guia'):/mapa-da-aventura/.test(u)?t('mapa'):/grandes-exploradores/.test(u)?t('expl'):t('rep')}
function href(u){return PRE+u}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),x=a[i];a[i]=a[j];a[j]=x}return a}

var css=".rx{--rl:#262d37;--rm:#9aa3ad;--rt:#e6e6e6;--rw:#fff;--rr:#b90000;--rb:#11161d;--rk:#64aaff;color:var(--rt)}"
+".rx *{box-sizing:border-box}"
+".rx-wrap{max-width:1440px;width:calc(100% - 8vw);margin:0 auto}"
+".rx-ic{width:20px;height:20px;flex:0 0 20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}"
/* navegação por categoria */
+".rx-nav{position:sticky;top:var(--rx-top,64px);z-index:5;background:rgba(0,0,0,.86);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--rl)}"
+".rx-nav .rx-wrap{display:flex;gap:8px;overflow-x:auto;padding:12px 0;scrollbar-width:none}"
+".rx-nav .rx-wrap::-webkit-scrollbar{display:none}"
+"@media (min-width:1200px){.rx-nav .rx-wrap{flex-wrap:wrap;justify-content:center;overflow:visible}}"
+".rx-chip{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;min-height:44px;padding:0 16px;border:1px solid var(--rl);border-radius:22px;background:transparent;color:var(--rt);font:600 14px/1 Montserrat,system-ui,sans-serif;text-decoration:none;white-space:nowrap;cursor:pointer;transition:background .2s,border-color .2s}"
+".rx-chip small{font:400 12px/1 Lato,sans-serif;color:var(--rm)}"
+".rx-chip:hover,.rx-chip.on{border-color:var(--rr);background:var(--rr);color:#fff}.rx-chip:hover small,.rx-chip.on small{color:#fff}"
+".rx-top{padding:clamp(28px,3vw,44px) 0 0;display:flex;justify-content:center}"
+".rx-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:12px 22px;border:0;border-radius:5px;background:var(--rr);color:#fff;font:600 15px/1.2 Montserrat,system-ui,sans-serif;text-decoration:none;cursor:pointer}"
+".rx-btn:hover{background:#d10000;color:#fff}"
+".rx-btn.sec{background:transparent;border:1px solid var(--rl)}.rx-btn.sec:hover{border-color:#fff}"
/* seções */
+".rx-sec{padding:clamp(48px,5vw,80px) 0;scroll-margin-top:calc(var(--rx-top,64px) + 70px)}"
+".rx-sec:nth-of-type(odd){background:#000}.rx-sec:nth-of-type(even){background:#0b0f14}"
+".rx-h2{display:flex;align-items:center;gap:14px;margin:0 0 clamp(24px,3vw,40px);font:600 clamp(28px,2.4vw,36px)/1.15 Montserrat,sans-serif;color:var(--rw)}"
+".rx-h2 .rx-ic{width:30px;height:30px;flex-basis:30px;color:#fff}"
+".rx-h2 .q{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;flex:0 0 48px;background:var(--rr)}"
+".rx-h2 small{font:400 15px/1 Lato,sans-serif;color:var(--rm);margin-left:4px}"
+".rx-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(20px,2vw,32px)}"
+"@media (max-width:991px){.rx-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}"
+"@media (max-width:640px){.rx-grid{grid-template-columns:1fr}}"
/* card */
+".rx-card{display:flex;flex-direction:column;background:var(--rb);scroll-margin-top:calc(var(--rx-top,64px) + 80px);transition:box-shadow .3s}"
+".rx-card.alvo{box-shadow:0 0 0 2px var(--rr)}"
+".rx-ph{position:relative;display:block;aspect-ratio:3/2;overflow:hidden;background:#05070a;border-top:4px solid var(--rr)}"
+".rx-ph .bg{position:absolute;inset:-24px;background-size:cover;background-position:center;filter:blur(20px) brightness(.38);transform:scale(1.1)}"
+".rx-ph img{position:relative;display:block;width:100%;height:100%;object-fit:cover;transition:transform .6s ease}"
+".rx-ph.r img{object-fit:contain}"
+".rx-ph:hover img{transform:scale(1.03)}.rx-ph.r:hover img{transform:none}"
+".rx-cred{margin:0;padding:8px 18px 0;font:400 12px/1.45 Lato,sans-serif;color:var(--rm)}"
+".rx-cred a{color:var(--rm);text-decoration:underline;text-decoration-color:rgba(154,163,173,.4)}"
+".rx-body{display:flex;flex-direction:column;flex:1;padding:14px 18px 20px}"
+".rx-kick{display:flex;align-items:center;gap:8px;margin:0;font:700 12px/1.2 Montserrat,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--rm)}"
+".rx-kick .rx-ic{width:16px;height:16px;flex-basis:16px}"
+".rx-v{margin:12px 0 0;font:700 clamp(28px,2.4vw,38px)/1.05 Montserrat,sans-serif;color:#fff;letter-spacing:-.01em}"
+".rx-t{margin:8px 0 0;font:600 clamp(18px,1.4vw,21px)/1.3 Montserrat,sans-serif;color:var(--rw);text-transform:none}"
+".rx-n{margin:4px 0 0;font:400 15px/1.4 Lato,sans-serif;color:var(--rm)}"
+".rx-x{margin:12px 0 0;font:400 16px/1.6 Lato,sans-serif;color:var(--rt)}"
+".rx-l{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}"
+".rx-l li{font:400 15px/1.45 Lato,sans-serif;color:var(--rm)}"
+".rx-l a{color:var(--rk);text-decoration:underline;text-decoration-color:rgba(100,170,255,.55);text-underline-offset:2px}"
+".rx-l a:hover{color:#fff;text-decoration-color:#fff}"
+".rx-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:auto;padding-top:16px}"
+".rx-fonte{font:400 13px/1.4 Lato,sans-serif;color:var(--rm);text-decoration:underline;text-decoration-color:rgba(154,163,173,.4)}"
+".rx-share{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 4px;border:0;background:none;color:var(--rm);font:600 13px/1 Montserrat,sans-serif;cursor:pointer}"
+".rx-share:hover{color:#fff}.rx-share svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}"
+".rx-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;padding:12px 18px;background:#11161d;border:1px solid var(--rl);color:#fff;font:600 14px/1 Montserrat,sans-serif;border-radius:5px;opacity:0;transition:opacity .3s;pointer-events:none}"
+".rx-toast.on{opacity:1}"
/* home */
+".rx-home{padding:0}"
+".rx-hk{display:flex;align-items:center;gap:10px;margin:0;font:600 14px/1.2 Montserrat,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#fff}"
+".rx-hk::before{content:'';display:block;flex:0 0 12px;width:12px;height:12px;background:var(--rr)}"
+".rx-hh2{margin:10px 0 0;font:700 clamp(28px,2.8vw,44px)/1.12 Montserrat,sans-serif;color:#fff;text-transform:none}"
+".rx-hlead{margin:12px 0 0;max-width:820px;font:300 clamp(17px,1.3vw,20px)/1.55 Lato,sans-serif;color:var(--rt)}"
+".rx-home .rx-grid{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:clamp(24px,3vw,40px)}"
+".rx-home .rx-x{display:none}"
+"@media (max-width:1199px){.rx-home .rx-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}"
+"@media (max-width:479px){.rx-home .rx-grid{grid-template-columns:1fr}.rx-home .rx-card:nth-child(n+3){display:none}}"
+".rx-hbtns{display:flex;flex-wrap:wrap;gap:12px;margin-top:clamp(24px,3vw,36px)}"
+".rx-err{padding:40px 0;color:var(--rm);font:400 16px Lato,sans-serif;text-align:center}"
+"@media (prefers-reduced-motion:reduce){.rx-ph img,.rx-card{transition:none}}";

function estilo(){if(document.getElementById('rx-css'))return;var s=document.createElement('style');s.id='rx-css';s.textContent=css;document.head.appendChild(s)}

var SHARE='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>';
function card(r,cats){
  var i=r.img||{},alt=(i.cap?i.cap[L]:r.n[L]);
  var cr=t('foto')+': '+(i.cap?esc(i.cap[L])+'. ':'')+(i.a?esc(i.a)+', ':'')+esc(lic(i.lic))+', <a href="'+filePage(i.f)+'" target="_blank" rel="noopener">Wikimedia Commons</a>';
  var lk=r.l.map(function(x){return '<li>'+tipo(x.u)+': <a href="'+href(x.u)+'">'+esc(x.n[L])+'</a></li>'}).join('');
  var u0=r.l.length?href(r.l[0].u):'#';
  return '<article class="rx-card" id="rec-'+r.id+'">'
   +'<a class="rx-ph'+(i.r?' r':'')+'" href="'+u0+'" tabindex="-1" aria-hidden="true">'+(i.r?'<span class="bg" style="background-image:url(\''+img(i.f,200)+'\')"></span>':'')+'<img src="'+img(i.f,800)+'" alt="'+esc(alt)+'" loading="lazy" decoding="async"></a>'
   +'<p class="rx-cred">'+cr+'</p>'
   +'<div class="rx-body"><p class="rx-kick">'+ic(r.c)+esc(cats[r.c])+'</p>'
   +'<div class="rx-v">'+esc(r.v[L])+'</div><h3 class="rx-t">'+esc(r.t[L])+'</h3><p class="rx-n">'+esc(r.n[L])+'</p>'
   +'<p class="rx-x">'+esc(r.x[L])+'</p><ul class="rx-l">'+lk+'</ul>'
   +'<div class="rx-foot"><a class="rx-fonte" href="'+esc(r.src)+'" target="_blank" rel="noopener">'+t('fonte')+'</a>'
   +'<button type="button" class="rx-share" data-id="'+r.id+'">'+SHARE+t('comp')+'</button></div></div></article>';
}
function toast(msg){var e=document.querySelector('.rx-toast');if(!e){e=document.createElement('div');e.className='rx-toast';e.setAttribute('role','status');document.body.appendChild(e)}e.textContent=msg;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},2200)}
function compartilhar(r){
  var url=location.origin+PRE+PAG+'#rec-'+r.id,tit=r.t[L]+': '+r.n[L];
  if(navigator.share){navigator.share({title:tit,text:r.v[L]+' · '+tit,url:url}).catch(function(){});return}
  try{navigator.clipboard.writeText(url).then(function(){toast(t('copiado'))},function(){prompt('',url)})}catch(e){prompt('',url)}
}
function topo(){var m=0;[].forEach.call(document.querySelectorAll('body *'),function(e){if(e.closest&&e.closest('.rx'))return;var cs=getComputedStyle(e);if(cs.position!=='fixed'&&cs.position!=='sticky')return;if(cs.display==='none'||cs.visibility==='hidden')return;var b=e.getBoundingClientRect();if(b.top<=2&&b.bottom>0&&b.bottom<200&&b.width>40&&b.height<200)m=Math.max(m,b.bottom)});document.documentElement.style.setProperty('--rx-top',Math.round(m||64)+'px')}

function pagina(el,d){
  var cats={},cnt={};d.cats.forEach(function(c){cats[c.id]=c.n[L];cnt[c.id]=0});d.r.forEach(function(r){cnt[r.c]++});
  var byId={};d.r.forEach(function(r){byId[r.id]=r});
  var h='<nav class="rx-nav" aria-label="'+t('nav')+'"><div class="rx-wrap">'
   +d.cats.filter(function(c){return cnt[c.id]}).map(function(c){return '<a class="rx-chip" href="#'+c.id+'">'+ic(c.id)+esc(cats[c.id])+' <small>'+cnt[c.id]+'</small></a>'}).join('')
   +'</div></nav><div class="rx-wrap rx-top"><button type="button" class="rx-btn" data-acaso>'+t('sorte')+'</button></div>';
  d.cats.forEach(function(c){
    var rs=d.r.filter(function(r){return r.c===c.id});if(!rs.length)return;
    h+='<section class="rx-sec" id="'+c.id+'"><div class="rx-wrap"><h2 class="rx-h2"><span class="q">'+ic(c.id)+'</span>'+esc(cats[c.id])+'<small>'+rs.length+' '+t('rec')[rs.length>1?1:0]+'</small></h2><div class="rx-grid">'+rs.map(function(r){return card(r,cats)}).join('')+'</div></div></section>';
  });
  el.innerHTML=h;
  el.addEventListener('click',function(e){
    var b=e.target.closest('.rx-share');if(b){compartilhar(byId[b.getAttribute('data-id')]);return}
    if(e.target.closest('[data-acaso]')){var r=d.r[Math.floor(Math.random()*d.r.length)];irPara('rec-'+r.id,true);return}
  });
  var chips=[].slice.call(el.querySelectorAll('.rx-chip'));
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){chips.forEach(function(c){var on=c.getAttribute('href')==='#'+x.target.id;c.classList.toggle('on',on);if(on&&c.scrollIntoView&&c.parentNode.scrollWidth>c.parentNode.clientWidth){c.parentNode.scrollLeft=c.offsetLeft-20}})}})},{rootMargin:'-40% 0px -55% 0px'});[].forEach.call(el.querySelectorAll('.rx-sec'),function(s){io.observe(s)})}
  function irPara(id,hash){var a=document.getElementById(id);if(!a)return;[].forEach.call(el.querySelectorAll('.rx-card.alvo'),function(c){c.classList.remove('alvo')});if(a.classList.contains('rx-card'))a.classList.add('alvo');a.scrollIntoView({behavior:'smooth',block:'start'});if(hash&&history.replaceState)history.replaceState(null,'','#'+id)}
  if(location.hash){var id=decodeURIComponent(location.hash.slice(1));setTimeout(function(){irPara(id)},300)}
  window.addEventListener('hashchange',function(){irPara(decodeURIComponent(location.hash.slice(1)))});
}
function home(el,d){
  var cats={};d.cats.forEach(function(c){cats[c.id]=c.n[L]});
  function escolhe(){var usadas={},out=[];shuffle(d.r).forEach(function(r){if(out.length<4&&!usadas[r.c]){usadas[r.c]=1;out.push(r)}});return out}
  var byId={};d.r.forEach(function(r){byId[r.id]=r});
  function desenha(){el.querySelector('.rx-grid').innerHTML=escolhe().map(function(r){return card(r,cats)}).join('')}
  el.innerHTML='<div class="rx-wrap"><p class="rx-hk">'+t('kick')+'</p><h2 class="rx-hh2">'+t('h2home')+'</h2><p class="rx-hlead">'+t('leadhome')+'</p><div class="rx-grid"></div>'
   +'<div class="rx-hbtns"><a class="rx-btn" href="'+PRE+PAG+'">'+t('todos')+'</a><button type="button" class="rx-btn sec" data-outros>'+t('outros')+'</button></div></div>';
  desenha();
  el.addEventListener('click',function(e){var b=e.target.closest('.rx-share');if(b){compartilhar(byId[b.getAttribute('data-id')]);return}if(e.target.closest('[data-outros]'))desenha()});
}
function carregar(i,cb){if(i>=DADOS.length){cb(null);return}fetch(DADOS[i]).then(function(r){if(!r.ok)throw 0;return r.json()}).then(cb).catch(function(){carregar(i+1,cb)})}
function iniciar(){
  var els=document.querySelectorAll('[data-recordes]');if(!els.length)return;estilo();topo();
  carregar(0,function(d){
    [].forEach.call(els,function(el){
      el.classList.add('rx');if(el.getAttribute('data-recordes')==='home')el.classList.add('rx-home');
      if(!d){el.innerHTML='<p class="rx-err">'+t('erro')+'</p>';return}
      if(el.getAttribute('data-recordes')==='home')home(el,d);else pagina(el,d);
    });
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
window.addEventListener('resize',function(){clearTimeout(window.__rxT);window.__rxT=setTimeout(topo,200)});
})();
