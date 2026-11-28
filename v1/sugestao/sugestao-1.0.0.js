/* WAS "Sugestão para você" 1.0.0 (28/11/2026).
   Sem login e sem dado pessoal: guarda NO NAVEGADOR do visitante (localStorage "wasSug1")
   só os endereços das páginas de conteúdo que ele abriu e uma pontuação para as páginas
   que elas citam. A sugestão é a página mais citada pelo que ele leu e que ele ainda não abriu.
   Sem histórico, fica o card editorial do menu. Nada é enviado a servidor algum. */
(function(){
if(window.__wasSugestao)return;window.__wasSugestao=1;
var K='wasSug1',LG=(location.pathname.match(/^\/(en|es)(?=\/|$)/)||[])[1]||'pt',PF=LG==='pt'?'':'/'+LG;
var TX={pt:{h:'Sugestão para você',mundo:'Reportagem',explorers:'Explorador',destinations:'Destino',
 porque:'Ligada ao que você viu no site'},
 en:{h:'Suggested for you',mundo:'Story',explorers:'Explorer',destinations:'Destination',porque:'Linked to what you have seen on the site'},
 es:{h:'Sugerencia para ti',mundo:'Reportaje',explorers:'Explorador',destinations:'Destino',porque:'Relacionada con lo que viste en el sitio'}}[LG];
var FORA=/^\/mundo-was\/(mapa-da-aventura|territorios-de-aventura|grandes-exploradores.*|roteiros|rotas-e-caminhos|expedicoes|exploradores-e-aventureiros)$/;
function limpa(p){return (p||'').replace(/^\/(en|es)(?=\/|$)/,'').replace(/[?#].*$/,'').replace(/\/$/,'')}
function conteudo(p){return /^\/(mundo-was|explorers|destinations)\/[a-z0-9-]+$/.test(p)&&!FORA.test(p)}
function ler(){try{var d=JSON.parse(localStorage.getItem(K)||'{}');d.v=d.v||{};d.c=d.c||{};d.m=d.m||{};return d}catch(e){return null}}
function grava(d){try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}}
var D=ler();if(!D)return;
var aqui=limpa(location.pathname);
function registra(){
 if(!conteudo(aqui))return;
 var novo=!D.v[aqui];D.v[aqui]=Date.now();
 if(novo){
  Object.keys(D.c).forEach(function(k){D.c[k]*=0.9;if(D.c[k]<0.01)delete D.c[k]});
  var vis={};document.querySelectorAll('a[href]').forEach(function(a){
   if(a.closest('.wn,footer,nav,[class*="FOOTER"],[class*="footer"],[class*="MENU"]'))return;
   if(a.hostname!==location.hostname)return;var p=limpa(a.pathname);if(p===aqui||!conteudo(p))return;vis[p]=1});
  var ls=Object.keys(vis),w=ls.length?1/Math.sqrt(ls.length):0;
  ls.forEach(function(p){D.c[p]=(D.c[p]||0)+w});
  var ks=Object.keys(D.c).sort(function(a,b){return D.c[b]-D.c[a]});ks.slice(300).forEach(function(k){delete D.c[k]});
  var vs=Object.keys(D.v).sort(function(a,b){return D.v[b]-D.v[a]});vs.slice(500).forEach(function(k){delete D.v[k]});
 }
 grava(D);
}
function candidatos(){return Object.keys(D.c).filter(function(p){return !D.v[p]&&p!==aqui&&!(D.m[p]&&D.m[p].x)}).sort(function(a,b){return D.c[b]-D.c[a]})}
function meta(p){
 var c=D.m[p];if(c&&c[LG]&&Date.now()-c.ts<7*864e5)return Promise.resolve(c[LG]);
 return fetch(PF+p,{credentials:'omit'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(h){
  var doc=new DOMParser().parseFromString(h,'text/html');
  function m(s){var e=doc.querySelector(s);return e?(e.getAttribute('content')||'').trim():''}
  var t=(m('meta[property="og:title"]')||(doc.title||'')).split(/\s+[|·–—]\s+/)[0].trim();
  var h1=doc.querySelector('h1');if(h1&&h1.textContent.trim().length>2&&h1.textContent.trim().length<90)t=h1.textContent.trim();
  var ds=m('meta[property="og:description"]')||m('meta[name="description"]');
  var im=m('meta[property="og:image"]');
  if(!im){var ii=doc.querySelector('main img[src],img[src*="website-files"]');if(ii)im=ii.getAttribute('src')}
  if(!t||!im)throw 0;
  if(ds.length>120)ds=ds.slice(0,117).replace(/\s+\S*$/,'')+'…';
  var o={t:t,d:ds,i:im};D.m[p]=D.m[p]||{};D.m[p][LG]=o;D.m[p].ts=Date.now();grava(D);return o;
 }).catch(function(){D.m[p]={x:1,ts:Date.now()};grava(D);throw 0});
}
function escolhe(){var cs=candidatos().slice(0,4);var i=0;
 function tenta(){if(i>=cs.length)return Promise.reject(0);var p=cs[i++];return meta(p).then(function(o){return {p:p,o:o}},tenta)}
 return tenta()}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function tipo(p){return /^\/explorers\//.test(p)?TX.explorers:/^\/destinations\//.test(p)?TX.destinations:TX.mundo}
var feito=false,pedido=false;
function preenche(card,s){
 card.setAttribute('href',PF+s.p);
 var ph=card.querySelector('.wn-ph,.wn-ano');if(ph){if(ph.classList.contains('wn-ano')){ph.className='wn-ph';ph.textContent=''}ph.removeAttribute('data-bg');ph.style.backgroundImage='url("'+s.o.i.replace(/"/g,'%22')+'")'}
 var k=card.querySelector('.wn-k');if(k)k.textContent=tipo(s.p);
 var st=card.querySelector('strong');if(st)st.textContent=s.o.t;
 var pp=card.querySelector('p');if(pp)pp.textContent=s.o.d||TX.porque;
 card.setAttribute('data-sugestao','pessoal');
}
function monta(root){
 if(root.querySelector('.wn-sug'))return;
 var mi=root.querySelector('#wn-p-foto .wn-mi'),card=mi&&mi.querySelector(':scope>.wn-card');
 if(card){var col=document.createElement('div');col.className='wn-col wn-sug';col.innerHTML='<h4>'+esc(TX.h)+'</h4>';mi.insertBefore(col,card);col.appendChild(card)}
 var nt=root.querySelector('.wn-dr .wn-nt');
 if(nt&&card){var b=document.createElement('div');b.className='wn-sug wn-sug-dr';b.innerHTML='<p class="wn-nt">'+esc(TX.h)+'</p>';var c2=card.cloneNode(true);
  var ph=c2.querySelector('[data-bg]');if(ph){ph.style.backgroundImage='url("'+ph.getAttribute('data-bg')+'")';ph.removeAttribute('data-bg')}
  b.appendChild(c2);nt.parentNode.insertBefore(b,nt)}
 var st=document.createElement('style');st.textContent='.wn-sug .wn-card{display:flex}.wn-sug h4{margin-bottom:12px}.wn-sug-dr{margin-bottom:22px}.wn-sug-dr .wn-card{max-width:520px}';document.head.appendChild(st);
}
function aplica(root){
 if(feito||pedido)return;pedido=true;
 escolhe().then(function(s){feito=true;root.querySelectorAll('.wn-sug .wn-card').forEach(function(c){preenche(c,s)})}).catch(function(){});
}
function liga(root){
 monta(root);
 var cs=candidatos();if(!cs.length)return;
 var c=D.m[cs[0]];if(c&&c[LG]&&Date.now()-c.ts<7*864e5){aplica(root);return}
 var go=function(){aplica(root)};
 var bar=root.querySelector('.wn-bar');if(bar){bar.addEventListener('pointerenter',go,{once:true});bar.addEventListener('touchstart',go,{once:true,passive:true})}
 var ham=root.querySelector('#wn-ham');if(ham)ham.addEventListener('click',go,{once:true});
 var fb=root.querySelector('.wn-i[data-p="foto"]');if(fb)fb.addEventListener('focus',go,{once:true});
}
function inicia(){
 var r0=function(){setTimeout(registra,1500)};if(document.readyState==='complete')r0();else window.addEventListener('load',r0);
 var n=0;(function espera(){var r=document.querySelector('.wn');if(r)return liga(r);if(++n<50)setTimeout(espera,200)})();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
