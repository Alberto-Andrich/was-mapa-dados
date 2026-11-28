/* WAS "Sugestão para você" 1.0.9 (coluna "Sugestão para você" à direita, com título, em TODOS os painéis do menu) 1.0.8 (rostos inteiros: enquadramento por foto, retratos inteiros com fundo desfocado) (também põe "Neste dia na aventura", "Recordes e extremos" e "Perrengues da Aventura" em Mundo WAS > Assuntos do momento) (28/11/2026).
   Sem login e sem dado pessoal: guarda NO NAVEGADOR do visitante (localStorage "wasSug1")
   só os endereços das páginas de conteúdo que ele abriu e uma pontuação para as páginas
   que elas citam. A sugestão é a página mais citada pelo que ele leu e que ele ainda não abriu.
   Sem histórico, fica o card editorial do menu. Nada é enviado a servidor algum. */
(function(){
if(window.__wasSugestao)return;window.__wasSugestao=1;
var K='wasSug1',LG=(location.pathname.match(/^\/(en|es)(?=\/|$)/)||[])[1]||'pt',PF=LG==='pt'?'':'/'+LG;
var ND={pt:'Neste dia na aventura',en:'On this day in adventure',es:'Este día en la aventura'}[LG],RX={pt:'Recordes e extremos',en:'Records and extremes',es:'Récords y extremos'}[LG],PG={pt:'Perrengues da Aventura',en:'Adventure Mishaps',es:'Percances de la Aventura'}[LG],NOVO={pt:'novo',en:'new',es:'nuevo'}[LG];
var TX={pt:{h:'Sugestão para você',mundo:'Reportagem',explorers:'Explorador',destinations:'Destino',
 porque:'Ligada ao que você viu no site'},
 en:{h:'Suggested for you',mundo:'Story',explorers:'Explorer',destinations:'Destination',porque:'Linked to what you have seen on the site'},
 es:{h:'Sugerencia para ti',mundo:'Reportaje',explorers:'Explorador',destinations:'Destino',porque:'Relacionada con lo que viste en el sitio'}}[LG];
var FORA=/^\/mundo-was\/(mapa-da-aventura|territorios-de-aventura|grandes-exploradores.*|roteiros|rotas-e-caminhos|expedicoes|exploradores-e-aventureiros)$/;
function limpa(p){return (p||'').replace(/^\/(en|es)(?=\/|$)/,'').replace(/[?#].*$/,'').replace(/\/$/,'')}
function conteudo(p){return /^\/(mundo-was|explorers|destinations)\/[a-z0-9-]+$/.test(p)&&!FORA.test(p)}
function ler(){try{var d=JSON.parse(localStorage.getItem(K)||'{}');d.v=d.v||{};d.c=d.c||{};d.m=d.m||{};return d}catch(e){return null}}
function grava(d){try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}}
var D=ler()||{v:{},c:{},m:{}};
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
 grava(D);cache();
}
function corrigeND(){try{[].forEach.call(document.querySelectorAll('a[href]'),function(a){var h=a.getAttribute('href')||'';if(/^(\/(en|es))?\/on-this-day\/?(#.*)?$/.test(h)||/\/\/[^\/]+(\/(en|es))?\/on-this-day\/?$/.test(h))a.setAttribute('href',PF+'/#neste-dia')})}catch(e){}}
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
var FOCO={"6b06de88211da7da2f426e08":"50% 5%","6b06eb56a9aca99513b3aa1e":"i","6b06f207bc3fefa44328fa8e":"50% 0%","6b06f24b0419854805cba94d":"i","6b06f3ddb349a5d36c9a5432":"i","6b0700718505165058fcd6d3":"i","6b0701370419854805ced25c":"i","6b07061bfeac54df991b7479":"i","6b070b329ea8ac854b39bf94":"50% 0%","6b070f45f36c00408cdd1424":"i","6b070f465fcd909a51bd4e66":"i","6b070f46c10bfd21f33534bd":"50% 0%","6b070f46e5a0e1f822828eeb":"i","6b070f47dd974e98018cf8a9":"i","6b07400ee3211301b357f1fa":"50% 19%","6b07400f242bdbfedebabe64":"i","6b07400f3de981040a80a180":"i","6b07400fbd1bb8352b14130b":"50% 32%","6b0740108132dc1550384414":"i","6b07557952994017285bfacc":"i","6b0755798a8627405fd4dc8e":"50% 22%","6b07557ab0419839303371ce":"i","6b075b848bb90a66ca6aed68":"50% 37%","6b075b84a0c7def6f1d98dff":"50% 34%","6b075b84a0c7def6f1d98e1b":"50% 16%","6b0760651daea3c1c4b76305":"50% 42%","6b07606540ff2f354e3fc62b":"50% 10%","6b07606563c973e9608c9d2e":"i","6b076065c93853b1c832033b":"i","6b076066becec3531091f2f1":"i","6b0768b29ddc1c89f550db1a":"i","6b0768b3b74605dfcfe84f3e":"i","6b0768b48c74602226570d7a":"50% 0%","6b0768b4b74605dfcfe84ff9":"50% 0%","6b0768b5eab01c44b0099a58":"i","6b07718f9e0de59e14505a2d":"i","6b07718fa99327ecb4bbf706":"i","6b077191599953c622c39354":"i","6b0771919ece3225eae786bc":"i","6b0771929ece3225eae78745":"50% 45%","6b077a0729adae08e8b8d0f5":"i","6b077a079e28acb14f3cbd7e":"50% 47%","6b077a085bcb0b1f70deaa48":"i","6b077a08b4054a5d9d23c53c":"i","6b077a08cb690fa79e7975de":"i","6b077a09813ac108cd9d5c1e":"50% 54%","6b078392aeceecd92480b457":"i","6b0788030f330f2dd9553f66":"0% 0%","6b0788680a3b807f6c903f55":"50% 21%","6b07886824dcb7cb00fc0072":"i","6b07886824dcb7cb00fc0080":"i","6b0788685f2d87267a709b35":"50% 15%","6b078868d6cacb140a33fab8":"50% 16%","6b0788691dc0a1d193c43eaf":"i","6b07886a3fd725c4f304400c":"50% 7%","6b078f015aa453847bd5e561":"34% 100%","6b079127c66e37ea23dbce68":"50% 0%","6b079128c387e756c84e5309":"50% 16%","6b079128cb5864e967c72e98":"50% 8%","6b07932dc387e756c84ecb35":"50% 55%","6b079684d7c08580f6abd525":"50% 34%","6b079684eadc3e66eef8b923":"i","6b079684eadc3e66eef8b931":"50% 78%","6b079c7104cd2283c7448c95":"i","6b079c713c0d6d373b92fe3f":"i","6b079c71cf7290105a3bc248":"50% 39%","6b080dd53d92510e01657f4e":"50% 0%","6b080dd65b43c707d2fc86bb":"i","6b080dd6caa7ca67520a5695":"50% 49%","6b08122913473cef8c1afe43":"50% 14%","6b081229168a87bd5edc5998":"50% 28%","6b08122949261a095122d30d":"i","6b08122949261a095122d31b":"i","6b08179d995cb711db797c72":"i","6b081eb4062c95cfb2c30cdd":"i","6b081eb45d4b717496a1d607":"50% 18%","6b081eb49e65b4d1cf75e9bb":"50% 3%","6b081eb49e65b4d1cf75e9ca":"i","6b081eb4a358840d1064c071":"i","6b0829fa6d80c3cffa7d8c05":"i","6b0829fa95a64f25142a5f01":"i","6b0829faa98b78480c703ea2":"i","6b0829faa98b78480c703eb9":"50% 2%","6b0829faf97d7c37ccb43a19":"50% 91%","6b083164062c95cfb2c7db9e":"50% 19%","6b08316407056029e2207340":"50% 19%","6b083164581df619a485c74c":"50% 19%","6b08316495a64f25142ad1a1":"i","6b084c692cd6d29e21853275":"i","6b070e5a6c98c3bde217b83c":"50% 3%","6b084cb47db53dc404f8c924":"50% 100%","6b085f6323e36cca515b567e":"50% 0%","6b087006678e625134066556":"61% 50%","6b08603ad39302317afa89da":"i","6b08603b21c244bed2ffcd3a":"50% 7%","6b087e672788e174a5ad0500":"i","6b08817484a414f4f7ba18c1":"i","6b0887b9f85a4db90102e8c6":"i","6b088b2a65297c06c7907fcc":"i","6b088e1590b7bb21407e8d8f":"i","6b0890c5c18c098a20e3ac85":"i","6b0894344b22035b55a25a06":"i","6b08980690b7bb2140809648":"i","6b089ad8cfa4387be007174a":"i","6b089e1ce8e8ba7f05bc2fdb":"50% 28%","6b08a1ed9fd4d136dfdf9ad9":"i","6b08a65039e3c98bee193991":"i","6b08a996b5af08e0b7530690":"i","6b08ac2e946755de047f3f7d":"50% 18%","6b08add626e07a36aa4b888c":"50% 29%","6b08af1e1a5cb0a1d95e27f4":"i","6b08b25ec0d5e4be2726a638":"i","6b08b4744c4662bd5518c72c":"i","6b08b7a1dc075e92ac7fe16d":"50% 26%","6b08bafe4c4662bd5519f3cf":"i","6b08bdc37ed5d091bc8a4a61":"50% 29%","6b08c0da135c4b20a931edf0":"50% 4%","6b08c35448e9f74ebd028dd8":"50% 15%","6b08c55a860cb5a9c0b03027":"i","6b08c8fcf4ae9e05e22ba5e7":"50% 11%","6b08cc5dac1aa97766eed712":"i","6b08cfcc35e0849656cff57a":"50% 11%","6b08d386ca776430ef716a02":"i","6b08d5d7757ca4dfa5004bd8":"i","6b08dfb8f8515d17f740a843":"50% 19%","6b08e211113d87102446e37a":"50% 1%","6b08e359d71a5d5d722ca05c":"i","6b0959ba50adc576edb4ac48":"73% 30%","6b09665f42377f636e57878e":"0% 50%","6b099aef9839dd8cfa935dad":"50% 32%","6b099fb7dad2ade9df080056":"50% 65%","6b09a5e9ac885ed43e729ae2":"50% 29%","6b09963be638428c4c885c2a":"50% 10%","6b09a5e968dc6be1cf6e4811":"50% 0%","6b09963c138cd4cfb7628130":"i","6b09963dd6a6128e58fd182f":"i","6b09963c6a9f926efd369685":"i","6b09963bbe039f2772251d82":"i","6b09963dd6a6128e58fd184b":"i","6b09963ee638428c4c885cb9":"i","6b09963de5c44090cc7197f5":"i","6b09bf6453db5895f04f9126":"i","6b09bf640fa2a10fa7f3be9d":"i","6b09c9dab51717d63d8e47d5":"50% 100%","6b0a198fc9436c3d37b7d4bd":"44% 0%"};
function foco(ph,u){
 ph.classList.remove('wn-ph-int');ph.style.backgroundPosition='';ph.style.removeProperty('--wsimg');
 var ids=(decodeURIComponent(u).split('/').pop().match(/[0-9a-f]{24}(?=_)/g))||[],v=null;
 for(var i=ids.length-1;i>=0&&v===null;i--)if(FOCO[ids[i]])v=FOCO[ids[i]];
 function inteira(){ph.style.setProperty('--wsimg','url("'+u.replace(/"/g,'%22')+'")');ph.classList.add('wn-ph-int')}
 if(v==='i')return inteira();
 if(v){ph.style.backgroundPosition=v;return}
 var im=new Image();im.onload=function(){if(im.naturalHeight>im.naturalWidth*0.83)inteira()};im.src=u;
}
var feito=false,pedido=false;
function preenche(card,s){
 card.setAttribute('href',PF+s.p);
 var ph=card.querySelector('.wn-ph,.wn-ano');if(ph){if(ph.classList.contains('wn-ano')){ph.className='wn-ph';ph.textContent=''}ph.removeAttribute('data-bg');ph.style.backgroundImage='url("'+s.o.i.replace(/"/g,'%22')+'")';foco(ph,s.o.i)}
 var k=card.querySelector('.wn-k');if(k)k.textContent=tipo(s.p);
 var st=card.querySelector('strong');if(st)st.textContent=s.o.t;
 var pp=card.querySelector('p');if(pp)pp.textContent=s.o.d||TX.porque;
 card.setAttribute('data-sugestao','pessoal');
}
function monta(root){
 if(root.querySelector('.wn-sug'))return;
 var card=root.querySelector('#wn-p-foto .wn-mi>.wn-card');
 root.querySelectorAll('.wn-mega .wn-mi').forEach(function(mi){var c=mi.querySelector(':scope>.wn-card');if(!c)return;var col=document.createElement('div');col.className='wn-col wn-sug';col.innerHTML='<h4>'+esc(TX.h)+'</h4>';mi.insertBefore(col,c);col.appendChild(c)});
 var nt=root.querySelector('.wn-dr .wn-nt');
 if(nt&&card){var b=document.createElement('div');b.className='wn-sug wn-sug-dr';b.innerHTML='<p class="wn-nt">'+esc(TX.h)+'</p>';var c2=card.cloneNode(true);
  var ph=c2.querySelector('[data-bg]');if(ph){ph.style.backgroundImage='url("'+ph.getAttribute('data-bg')+'")';ph.removeAttribute('data-bg')}
  b.appendChild(c2);nt.parentNode.insertBefore(b,nt)}
 var st=document.createElement('style');st.textContent='.wn-mi>.wn-sug{grid-column:-2/-1}.wn-sug .wn-card{display:flex}.wn-sug h4{margin-bottom:12px}.wn-sug-dr{margin-bottom:22px}.wn-sug-dr .wn-card{max-width:620px;flex-direction:row;align-items:stretch}.wn-sug-dr .wn-card .wn-ph,.wn-sug-dr .wn-card .wn-ano{flex:0 0 38%;width:38%;aspect-ratio:auto;min-height:118px;border-top:0;border-left:4px solid var(--v)}.wn-sug-dr .wn-card .wn-ano{font-size:32px}.wn-sug-dr .wn-card .wn-tx{padding:12px 14px}.wn-sug-dr .wn-card strong{font-size:15px;margin:6px 0 4px}.wn-sug-dr .wn-card p{font-size:13px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.wn-ph.wn-ph-int{position:relative;overflow:hidden;background-image:none!important;background-color:#0b0f17}.wn-ph-int::before,.wn-ph-int::after{content:"";position:absolute;inset:0;background-image:var(--wsimg);background-repeat:no-repeat;background-position:center}.wn-ph-int::before{inset:-24px;background-size:cover;filter:blur(16px) brightness(.5)}.wn-ph-int::after{background-size:contain}';document.head.appendChild(st);
}
var RAIZ=null;
function cache(){if(!RAIZ)return;var cs=candidatos();if(!cs.length)return;var c=D.m[cs[0]];if(c&&c[LG]&&Date.now()-c.ts<7*864e5)aplica(RAIZ)}
function aplica(root){
 if(feito||pedido||!candidatos().length)return;pedido=true;
 escolhe().then(function(s){feito=true;root.querySelectorAll('.wn-sug .wn-card').forEach(function(c){preenche(c,s)})}).catch(function(){pedido=false});
}
function nesteDia(root){
 if(root.querySelector('a[data-nd-menu]'))return;
 function poe(ref,url,nome,attr){var cur=aqui===url;var a=document.createElement('a');a.href=PF+url;a.setAttribute(attr,'1');if(cur)a.setAttribute('aria-current','page');a.innerHTML='<span>'+esc(nome)+'</span><span class="wn-new">'+esc(NOVO)+'</span>';
  var li=ref.closest('li');if(li&&li.parentNode){var n=document.createElement('li');n.appendChild(a);li.parentNode.insertBefore(n,li.nextSibling)}else ref.parentNode.insertBefore(a,ref.nextSibling);return a}
 var radar=root.querySelectorAll('a[href$="/radar"]');
 radar.forEach(function(r){var nd=poe(r,'/#neste-dia',ND,'data-nd-menu');var rx=poe(nd,'/records',RX,'data-rx-menu');poe(rx,'/mishaps',PG,'data-pg-menu')});
 if(aqui==='/records'||/^\/mishaps(\/|$)/.test(aqui)){var b=root.querySelector('.wn-i[data-p="foto"]');if(b)b.classList.add('wn-cur')}
}
function liga(root){
 try{nesteDia(root)}catch(e){}
 monta(root);
 RAIZ=root;cache();
 var go=function(){aplica(root)};
 var bar=root.querySelector('.wn-bar');if(bar){bar.addEventListener('pointerenter',go,{once:true});bar.addEventListener('touchstart',go,{once:true,passive:true})}
 var ham=root.querySelector('#wn-ham');if(ham)ham.addEventListener('click',go,{once:true});
 var fb=root.querySelector('.wn-i[data-p="foto"]');if(fb)fb.addEventListener('focus',go,{once:true});
}
function inicia(){
 corrigeND();
 var r0=function(){setTimeout(registra,1500)};if(document.readyState==='complete')r0();else window.addEventListener('load',r0);
 var n=0;(function espera(){var r=document.querySelector('.wn');if(r)return liga(r);if(++n<50)setTimeout(espera,200)})();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
