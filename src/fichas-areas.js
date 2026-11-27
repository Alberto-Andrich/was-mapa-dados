/* WAS · Fichas básicas das áreas protegidas do Mapa da aventura (v1, 27/11/2026)
   Gancho: abrirArea(f) chama window.__wasFichaArea(f.properties, corpoEl, coords).
   Dados: <BASE>fichas/indice.json  ({"CA-AB":[q,...],...})  e  <BASE>fichas/CA-AB.json ({"q":{...}}).
   Cada lugar: pv (províncias), km, cr (criação), fim (extinção), iucn, site, wp, f (fotos [arquivo,autor,licença]), t {pt,en,es:{r,h,ff,at[]}}
   ou, nas fichas automáticas, t {pt,en,es:'parágrafo'} com ta=1 (e fn='c' quando há dados do CPCAD). v2, 27/11/2026 */
(function(){
  if(window.__wasFichaArea) return;
  const BASE=()=>window.__wasFichasBase||(typeof GHB!=='undefined'?GHB:'https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@main/v1/');
  const L=()=>{const l=((window.__wasI18n||{}).L||document.documentElement.lang||'pt').slice(0,2);return l==='en'||l==='es'?l:'pt'};
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const T={
    pt:{area:'Área',cria:'Criação',fim:'Extinção',iucn:'Categoria IUCN',hist:'História',ff:'Fauna e flora',at:'Atrativos',mais:'Saiba mais',site:'Site oficial',wp:'Wikipédia',foto:'Foto',ant:'Foto anterior',prox:'Próxima foto',de:'de',
        basica:'Ficha básica com dados do Wikidata. A WAS ainda vai escrever a história, a fauna e a flora e os atrativos deste lugar.',
        fonte:'Dados: Wikidata. Texto da WAS a partir da Wikipédia e de fontes oficiais.',fonteB:'Dados: Wikidata (CC0).',fonteC:'Dados: Wikidata (CC0) e cadastro oficial de áreas protegidas do Canadá (CPCAD, Licença de Governo Aberto do Canadá). Texto da WAS a partir desses dados.',fonteCW:'Dados: Wikidata (CC0). Texto da WAS a partir desses dados.',fonteP:'Dados: Wikidata (CC0) e base oficial de áreas protegidas dos EUA (PAD-US, USGS, domínio público). Texto da WAS a partir desses dados.',carregando:'Carregando a ficha…'},
    en:{area:'Area',cria:'Established',fim:'Abolished',iucn:'IUCN category',hist:'History',ff:'Wildlife and plants',at:'Highlights',mais:'Learn more',site:'Official website',wp:'Wikipedia',foto:'Photo',ant:'Previous photo',prox:'Next photo',de:'of',
        basica:'Basic profile with data from Wikidata. WAS has not yet written the history, wildlife and highlights of this place.',
        fonte:'Data: Wikidata. WAS text based on Wikipedia and official sources.',fonteB:'Data: Wikidata (CC0).',fonteC:'Data: Wikidata (CC0) and the Canadian Protected and Conserved Areas Database (CPCAD, Open Government Licence – Canada). WAS text based on these data.',fonteCW:'Data: Wikidata (CC0). WAS text based on these data.',fonteP:'Data: Wikidata (CC0) and the Protected Areas Database of the United States (PAD-US, USGS, public domain). WAS text based on these data.',carregando:'Loading…'},
    es:{area:'Superficie',cria:'Creación',fim:'Extinción',iucn:'Categoría UICN',hist:'Historia',ff:'Fauna y flora',at:'Atractivos',mais:'Más información',site:'Sitio oficial',wp:'Wikipedia',foto:'Foto',ant:'Foto anterior',prox:'Foto siguiente',de:'de',
        basica:'Ficha básica con datos de Wikidata. La WAS todavía va a escribir la historia, la fauna y la flora y los atractivos de este lugar.',
        fonte:'Datos: Wikidata. Texto de la WAS a partir de Wikipedia y de fuentes oficiales.',fonteB:'Datos: Wikidata (CC0).',fonteC:'Datos: Wikidata (CC0) y registro oficial de áreas protegidas de Canadá (CPCAD, Licencia de Gobierno Abierto de Canadá). Texto de la WAS a partir de estos datos.',fonteCW:'Datos: Wikidata (CC0). Texto de la WAS a partir de estos datos.',fonteP:'Datos: Wikidata (CC0) y base oficial de áreas protegidas de EE. UU. (PAD-US, USGS, dominio público). Texto de la WAS a partir de estos datos.',carregando:'Cargando…'}};
  const PV={AB:['Alberta','Alberta','Alberta'],BC:['Colúmbia Britânica','British Columbia','Columbia Británica'],MB:['Manitoba','Manitoba','Manitoba'],NB:['Nova Brunswick','New Brunswick','Nuevo Brunswick'],
    NL:['Terra Nova e Labrador','Newfoundland and Labrador','Terranova y Labrador'],NS:['Nova Escócia','Nova Scotia','Nueva Escocia'],NT:['Territórios do Noroeste','Northwest Territories','Territorios del Noroeste'],
    NU:['Nunavut','Nunavut','Nunavut'],ON:['Ontário','Ontario','Ontario'],PE:['Ilha do Príncipe Eduardo','Prince Edward Island','Isla del Príncipe Eduardo'],QC:['Quebec','Quebec','Quebec'],
    SK:['Saskatchewan','Saskatchewan','Saskatchewan'],YT:['Yukon','Yukon','Yukón']};
  const IUCN={Ia:['Ia · reserva natural estrita','Ia · strict nature reserve','Ia · reserva natural estricta'],Ib:['Ib · área silvestre','Ib · wilderness area','Ib · área silvestre'],
    II:['II · parque nacional','II · national park','II · parque nacional'],III:['III · monumento natural','III · natural monument','III · monumento natural'],
    IV:['IV · manejo de habitats e espécies','IV · habitat/species management','IV · gestión de hábitats y especies'],V:['V · paisagem protegida','V · protected landscape','V · paisaje protegido'],
    VI:['VI · uso sustentável','VI · sustainable use','VI · uso sostenible']};
  // estados e territórios dos EUA (chave US-XX)
  Object.assign(PV,{"US-AL":["Alabama","Alabama","Alabama"],"US-AK":["Alasca","Alaska","Alaska"],"US-AZ":["Arizona","Arizona","Arizona"],"US-AR":["Arkansas","Arkansas","Arkansas"],"US-CA":["Califórnia","California","California"],"US-CO":["Colorado","Colorado","Colorado"],"US-CT":["Connecticut","Connecticut","Connecticut"],"US-DE":["Delaware","Delaware","Delaware"],"US-DC":["Distrito de Colúmbia","District of Columbia","Distrito de Columbia"],"US-FL":["Flórida","Florida","Florida"],"US-GA":["Geórgia","Georgia","Georgia"],"US-HI":["Havaí","Hawaii","Hawái"],"US-ID":["Idaho","Idaho","Idaho"],"US-IL":["Illinois","Illinois","Illinois"],"US-IN":["Indiana","Indiana","Indiana"],"US-IA":["Iowa","Iowa","Iowa"],"US-KS":["Kansas","Kansas","Kansas"],"US-KY":["Kentucky","Kentucky","Kentucky"],"US-LA":["Luisiana","Louisiana","Luisiana"],"US-ME":["Maine","Maine","Maine"],"US-MD":["Maryland","Maryland","Maryland"],"US-MA":["Massachusetts","Massachusetts","Massachusetts"],"US-MI":["Michigan","Michigan","Míchigan"],"US-MN":["Minnesota","Minnesota","Minnesota"],"US-MS":["Mississippi","Mississippi","Misisipi"],"US-MO":["Missouri","Missouri","Misuri"],"US-MT":["Montana","Montana","Montana"],"US-NE":["Nebraska","Nebraska","Nebraska"],"US-NV":["Nevada","Nevada","Nevada"],"US-NH":["Nova Hampshire","New Hampshire","Nuevo Hampshire"],"US-NJ":["Nova Jersey","New Jersey","Nueva Jersey"],"US-NM":["Novo México","New Mexico","Nuevo México"],"US-NY":["Nova York","New York","Nueva York"],"US-NC":["Carolina do Norte","North Carolina","Carolina del Norte"],"US-ND":["Dakota do Norte","North Dakota","Dakota del Norte"],"US-OH":["Ohio","Ohio","Ohio"],"US-OK":["Oklahoma","Oklahoma","Oklahoma"],"US-OR":["Oregon","Oregon","Oregón"],"US-PA":["Pensilvânia","Pennsylvania","Pensilvania"],"US-RI":["Rhode Island","Rhode Island","Rhode Island"],"US-SC":["Carolina do Sul","South Carolina","Carolina del Sur"],"US-SD":["Dakota do Sul","South Dakota","Dakota del Sur"],"US-TN":["Tennessee","Tennessee","Tennessee"],"US-TX":["Texas","Texas","Texas"],"US-UT":["Utah","Utah","Utah"],"US-VT":["Vermont","Vermont","Vermont"],"US-VA":["Virgínia","Virginia","Virginia"],"US-WA":["Washington","Washington","Washington"],"US-WV":["Virgínia Ocidental","West Virginia","Virginia Occidental"],"US-WI":["Wisconsin","Wisconsin","Wisconsin"],"US-WY":["Wyoming","Wyoming","Wyoming"],"US-PR":["Porto Rico","Puerto Rico","Puerto Rico"],"US-VI":["Ilhas Virgens Americanas","U.S. Virgin Islands","Islas Vírgenes de los Estados Unidos"],"US-GU":["Guam","Guam","Guam"],"US-AS":["Samoa Americana","American Samoa","Samoa Americana"],"US-MP":["Ilhas Marianas do Norte","Northern Mariana Islands","Islas Marianas del Norte"]});
  const LI={pt:0,en:1,es:2};
  const MESES={pt:['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],en:['January','February','March','April','May','June','July','August','September','October','November','December'],es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']};
  function data(s,l){if(!s)return '';const m=String(s).match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/);if(!m)return esc(s);
    // datas "1º de janeiro" do Wikidata costumam ser só o ano
    if(!m[2]||(m[2]==='01'&&(!m[3]||m[3]==='01')))return m[1];
    const mes=MESES[l][+m[2]-1];if(!m[3]||m[3]==='00')return l==='en'?mes+' '+m[1]:mes+' de '+m[1];
    return l==='en'?mes+' '+(+m[3])+', '+m[1]:(+m[3]===1&&l==='pt'?'1º':+m[3])+' de '+mes+' de '+m[1]}
  const nf=l=>new Intl.NumberFormat(l==='en'?'en-US':l==='es'?'es-ES':'pt-BR',{maximumFractionDigits:1});
  function km(v,l){if(!(+v>0))return '';const n=+v;return nf(l).format(n>=100?Math.round(n):n)+' km²'}
  // ---- carga sob demanda ----
  let IDX=null;const ARQ={};
  function indice(){if(!IDX)IDX=fetch(BASE()+'fichas/indice.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{const m={};for(const k in j)for(const q of j[k])m[q]=k;return m}).catch(e=>{IDX=null;throw e});return IDX}
  function arquivo(k){if(!ARQ[k])ARQ[k]=fetch(BASE()+'fichas/'+k+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).catch(e=>{delete ARQ[k];throw e});return ARQ[k]}
  // ---- fotos (Wikimedia Commons, tamanho reduzido) ----
  const fp=(f,w)=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(f)+'?width='+w;
  const pagina=f=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(f.replace(/ /g,'_'));
  function carrossel(fs,nome,l){const X=T[l];
    return '<figure class="fc-car" aria-roledescription="carrossel"><div class="fc-vp" tabindex="0">'+
      fs.map((f,i)=>'<img src="'+fp(f[0],960)+'" srcset="'+fp(f[0],500)+' 500w, '+fp(f[0],960)+' 960w, '+fp(f[0],1280)+' 1280w" sizes="(max-width:699px) 100vw, 680px" alt="'+esc(nome)+(fs.length>1?' · '+X.foto+' '+(i+1)+' '+X.de+' '+fs.length:'')+'"'+(i?' loading="lazy"':'')+' decoding="async" draggable="false">').join('')+
      '</div><figcaption>'+(fs.length>1?'<span class="fc-nav"><button type="button" class="fc-b" data-d="-1" aria-label="'+X.ant+'">‹</button><span class="fc-n" aria-live="polite">1 / '+fs.length+'</span><button type="button" class="fc-b" data-d="1" aria-label="'+X.prox+'">›</button></span>':'')+
      '<span class="fc-cr"></span></figcaption></figure>'}
  function credito(f,l){const a=f[1]||({pt:'Autor não identificado',en:'Unknown author',es:'Autor desconocido'}[l]);
    return T[l].foto+': '+esc(a)+' · '+esc(f[2]||'')+' · <a href="'+pagina(f[0])+'" target="_blank" rel="noopener">Wikimedia Commons</a>'}
  function ligar(fig,fs,l){const vp=fig.querySelector('.fc-vp'),n=fig.querySelector('.fc-n'),cr=fig.querySelector('.fc-cr');let i=0;
    const mostra=k=>{i=k;if(n)n.textContent=(k+1)+' / '+fs.length;cr.innerHTML=credito(fs[k],l)};mostra(0);
    const ir=k=>{k=(k+fs.length)%fs.length;vp.scrollTo({left:k*vp.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});mostra(k)};
    fig.querySelectorAll('.fc-b').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();ir(i+(+b.dataset.d))}));
    let t=0;vp.addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>{const k=Math.round(vp.scrollLeft/Math.max(1,vp.clientWidth));if(k!==i&&k>=0&&k<fs.length)mostra(k)},80)},{passive:true});
    vp.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();ir(i+(e.key==='ArrowRight'?1:-1))}});
    vp.querySelectorAll('img').forEach(im=>im.addEventListener('error',()=>{im.remove()},{once:true}))}
  // ---- ficha ----
  function montar(p,c,d,l){const X=T[l],li=LI[l];let t=d.t&&(d.t[l]||d.t.pt);if(typeof t==='string')t={r:t};
    const meta=c.querySelector('.meta');if(meta){const pais=meta.textContent.split(' · ')[0];const pv=(d.pv||[]).map(k=>PV[k]?PV[k][li]:'').filter(Boolean).join(' / ');meta.textContent=(pv?pv+', ':'')+pais}
    const fatos=[];const a=km(d.km||p.km,l);if(a)fatos.push([X.area,a]);if(d.cr)fatos.push([X.cria,data(d.cr,l)]);if(d.fim)fatos.push([X.fim,data(d.fim,l)]);if(d.iucn&&IUCN[d.iucn])fatos.push([X.iucn,IUCN[d.iucn][li]]);
    let h=fatos.length?'<dl class="fc-fatos">'+fatos.map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('')+'</dl>':'';
    if(t){if(t.r)h+='<p class="fc-r">'+esc(t.r)+'</p>';if(t.h)h+='<h3>'+X.hist+'</h3><p>'+esc(t.h)+'</p>';if(t.ff)h+='<h3>'+X.ff+'</h3><p>'+esc(t.ff)+'</p>';
      if(t.at&&t.at.length)h+='<h3>'+X.at+'</h3><ul class="fc-at">'+t.at.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'}
    else h+='<p class="fc-basica">'+X.basica+'</p>';
    const wpw=(l==='pt'&&p.w&&/^pt:/.test(p.w))?p.w:(d.wp||p.w||'');const wl=wpw?'https://'+wpw.slice(0,wpw.indexOf(':'))+'.wikipedia.org/wiki/'+encodeURIComponent(wpw.slice(wpw.indexOf(':')+1)):'';
    const lk=[];if(d.site)lk.push('<a href="'+esc(d.site)+'" target="_blank" rel="noopener">'+X.site+'</a>');if(wl)lk.push('<a href="'+esc(wl)+'" target="_blank" rel="noopener">'+X.wp+'</a>');
    if(lk.length)h+='<p class="fc-links">'+X.mais+': '+lk.join(' · ')+'</p>';
    h+='<p class="fc-fonte">'+(d.ta?(d.fn==='c'?X.fonteC:d.fn==='p'?X.fonteP:X.fonteCW):t?X.fonte:X.fonteB)+'</p>';
    const box=document.createElement('div');box.className='fc-corpo';box.innerHTML=h;
    const aviso=[...c.children].find(e=>e.tagName==='P'&&!e.classList.contains('chapeu')&&!e.classList.contains('meta'));
    if(aviso)aviso.replaceWith(box);else{const ac=c.querySelector('.acoes');ac?c.insertBefore(box,ac):c.appendChild(box)}
    const fs=(d.f||[]).filter(f=>f&&f[0]);
    if(fs.length){c.classList.remove('sem-foto');c.insertAdjacentHTML('beforebegin',carrossel(fs,p.n,l));const fig=c.previousElementSibling;ligar(fig,fs,l);
      const fi=document.getElementById('ficha');if(fi)fi.classList.remove('curta')}}
  window.__wasFichaArea=function(p,c){if(!p||!c||!p.q)return;const l=L(),q=+p.q;c.dataset.fq=q;
    const aviso=[...c.children].find(e=>e.tagName==='P'&&!e.classList.contains('chapeu')&&!e.classList.contains('meta'));
    indice().then(m=>{const k=m[q];if(!k)return null;if(aviso&&c.dataset.fq==q)aviso.classList.add('fc-espera');return arquivo(k)}).then(j=>{
      if(!j||!c.isConnected||c.dataset.fq!=q)return;const d=j[q];if(d)montar(p,c,d,l)}).catch(()=>{}).finally(()=>{if(aviso)aviso.classList.remove('fc-espera')})};
  // ---- estilo ----
  const st=document.createElement('style');st.textContent=
   '.wasmapa .fc-car{margin:0;background:#05080c;container-type:inline-size;width:100%}'+
   '.wasmapa .fc-car .fc-vp{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;width:100%;height:46vh;height:min(66.667cqw,46vh);outline-offset:-3px}'+
   '.wasmapa .fc-car .fc-vp::-webkit-scrollbar{display:none}'+
   '.wasmapa .fc-car .fc-vp img{flex:0 0 100%;width:100%;height:100%;max-height:none!important;object-fit:cover;object-position:center;scroll-snap-align:start;display:block;user-select:none}'+
   '.wasmapa .fc-car figcaption{display:flex;align-items:center;flex-wrap:wrap;gap:4px 12px;padding:6px 16px 0;font-size:11.5px;line-height:1.4;color:#9aa3ad}'+
   '.wasmapa .fc-car .fc-nav{display:inline-flex;align-items:center;gap:2px;flex:none}'+
   '.wasmapa .fc-car .fc-b{width:44px;height:36px;border:1px solid rgba(255,255,255,.18);border-radius:5px;background:#121a24;color:#fff;font:600 20px/1 Montserrat,system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0 0 2px}'+
   '.wasmapa .fc-car .fc-b:hover,.wasmapa .fc-car .fc-b:focus-visible{background:#b90000;border-color:#b90000}'+
   '.wasmapa .fc-car .fc-n{min-width:46px;text-align:center;color:#d7dde3;font-variant-numeric:tabular-nums}'+
   '.wasmapa .fc-car .fc-cr{flex:1 1 220px;min-width:0}'+
   '.wasmapa .fc-car a,.wasmapa .fc-corpo a{color:#64aaff;font-size:inherit;text-decoration:underline;text-decoration-color:rgba(100,170,255,.45);text-underline-offset:2px}'+
   '.wasmapa .fc-corpo{display:flex;flex-direction:column;gap:10px}'+
   '.wasmapa .fc-corpo h3{margin:6px 0 0}.wasmapa .fc-corpo p{margin:0}'+
   '.wasmapa .fc-fatos{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(96px,30%),1fr));gap:6px;margin:0}'+
   '.wasmapa .fc-fatos div{background:rgba(255,255,255,.05);border-radius:5px;padding:8px 9px;min-width:0}'+
   '.wasmapa .fc-fatos dt{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#9aa3ad;margin:0 0 2px}'+
   '.wasmapa .fc-fatos dd{margin:0;font-weight:600;color:#fff;font-size:14px;line-height:1.3;overflow-wrap:anywhere;hyphens:auto}'+
   '.wasmapa .fc-at{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}.wasmapa .ficha .fc-at li{font-size:14.5px;line-height:1.45}'+
   '.wasmapa .fc-basica{color:#c6ced6}.wasmapa .fc-links{font-size:13.5px}.wasmapa .fc-fonte{font-size:11.5px;color:#8a949e}'+
   '.wasmapa .fc-espera{opacity:.55;transition:opacity .2s}';
  document.head.appendChild(st);
})();
