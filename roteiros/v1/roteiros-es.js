/* Roteiros WAS · protótipo · tudo roda no navegador, sem servidor */
(function(){
'use strict';
const D = window.WASDATA;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = (n, d=0) => Number(n||0).toLocaleString('es-ES',{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtR = n => 'R$ ' + fmtN(Math.round(n||0));
const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const MESES_L = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIAS_S = ['dom','lun','mar','mié','jue','vie','sáb'];
const uid = () => Math.random().toString(36).slice(2,9);
const LAY = {}; D.layers.forEach(l => LAY[l.k] = l);
const REL = u => (u||'').replace('https://was-mirror.webflow.io','').replace('https://www.worldadventuresociety.org','');
D.pts.forEach(p => { if(p.g) p.g = REL(p.g); if(p.pf) p.pf[1] = REL(p.pf[1]); });
D.rotas.forEach(r => { r.link = REL(r.link); });
const BASE = (()=>{ const s=[...document.scripts].map(x=>x.src).find(u=>/\/roteiros(-en|-es)?\.js(\?|$)/.test(u)); return s? s.replace(/roteiros(-en|-es)?\.js.*$/,'') : ''; })();
const ABS = u => (!u || /^https?:/.test(u)) ? u : (BASE ? BASE+u : '');
D.pts.forEach(p => { if(p.ft) p.ft = ABS(p.ft); });
const PT = {}; D.pts.forEach((p,i) => { p.i = i; PT[p.l+'|'+(p.k||p.n)] = p; });
const PA = {}; D.pts.forEach(p => { if(p.pa0) PA[p.pa0]=p.pa; });
const paT = s => (s||'').split(/(,\s*| e |\/)/).map(x=>PA[x]||x).join('');
const refDe = r => r.l+'|'+(r.k||r.n);
const LOGO = 'https://cdn.prod.website-files.com/5c8fb586e1e6032286bcf1ef/5d1fe4f5946d402d7b64eafc_logo%20WAS%20WEBCLIP%20WEBFLOW.png';
const SITE = 'https://was-mirror.webflow.io';

/* ---------- ícones de traço (brancos, dentro do quadrado vermelho) ---------- */
const IC = {
  ideia:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  mapa:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  epoca:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  dias:'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2"/>',
  preparo:'<path d="M3 20l6-11 4 6 3-4 5 9z"/><circle cx="17" cy="5" r="2"/>',
  equip:'<path d="M8 7V5a4 4 0 0 1 8 0v2"/><rect x="5" y="7" width="14" height="14" rx="2"/><path d="M9 12h6M5 15h14"/>',
  docs:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  saude:'<path d="M12 21s-8-4.5-8-11V5l8-3 8 3v5c0 6.5-8 11-8 11z"/><path d="M12 8v6M9 11h6"/>',
  orc:'<rect x="2" y="6" width="20" height="13" rx="1"/><path d="M2 10h20M16 14.5h2"/><path d="M6 6l9-3 1 3"/>',
  equipe:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.3c3 .3 5.5 2.6 5.5 5.7"/>',
  imagens:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
  conduta:'<path d="M5 21c0-9 5-15 15-17-1 10-6 16-15 17z"/><path d="M5 21c3-5 6-8 10-11"/>',
  revisar:'<path d="M4 12l5 5L20 6"/>',
  inicio:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  rota:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
  pin:'<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  livro:'<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  lixo:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  cima:'<path d="M6 15l6-6 6 6"/>', baixo:'<path d="M6 9l6 6 6-6"/>',
  mais:'<path d="M12 5v14M5 12h14"/>', salvar:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7M8 21v-7h8v7"/>',
  compart:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  baixar:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>', imprimir:'<path d="M6 9V3h12v6M6 17H3V9h18v8h-3"/><path d="M6 14h12v7H6z"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  lista:'<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
  enviar:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>', alvo:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'
};
const svg = (k, cls='') => `<svg viewBox="0 0 24 24" class="${cls}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]||''}</svg>`;
const qd = (k, p) => `<div class="qd${p?' p':''}">${svg(k)}</div>`;

/* ---------- tipos de jornada ---------- */
const TIPOS = [
  ['expedicao','Expedición'],['aventura','Aventura'],['esportiva','Deportiva'],['contemplacao','Contemplación'],
  ['cultural','Cultural'],['fotografica','Fotográfica'],['cinema','Cinematográfica'],['ciencia','Ciencia y voluntariado'],
  ['passeio','Paseo de un día'],['familia','En familia']
];
const TIPO_N = Object.fromEntries(TIPOS);

/* ---------- modos de deslocamento ---------- */
const MODOS = {
  aviao:{n:'Avión',v:750,ov:4,co2:.15},
  carro:{n:'Auto',v:70,ov:0,co2:.17,veh:1,rf:1.25},
  x4:{n:'4x4',v:40,ov:0,co2:.27,veh:1,rf:1.3},
  onibus:{n:'Autobús',v:55,ov:1,co2:.03,rf:1.25},
  trem:{n:'Tren',v:80,ov:1,co2:.035,rf:1.2},
  barco:{n:'Barco',v:25,ov:1,co2:.12},
  navio:{n:'Barco de expedición',v:22,ov:0,co2:.5},
  pe:{n:'A pie',v:4,hd:6,co2:0,rf:1.2},
  bike:{n:'Bicicleta',v:14,hd:6,co2:0,rf:1.2},
  cavalo:{n:'A caballo',v:6,hd:6,co2:0,rf:1.2},
  caiaque:{n:'Kayak',v:5,hd:5,co2:0}
};

/* ---------- estado ---------- */
const KEY = 'was-roteiros-v1';
let DB = load();
let T = null;           // roteiro aberto
let passo = 'ideia';
let mapa = null, mini = null;
function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {rot:[]}; } catch(e){ return {rot:[]}; } }
let tSave = 0;
function save(){
  if(T){ T.alterado = Date.now(); const i = DB.rot.findIndex(r => r.id===T.id); if(i<0) DB.rot.unshift(T); else DB.rot[i]=T; }
  clearTimeout(tSave);
  tSave = setTimeout(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){}
    const s=$('#salvo'); if(s){ const d=new Date(); s.textContent='Guardado a las '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); } }, 300);
}
function novo(base={}){
  const hoje = new Date(); const ini = new Date(hoje.getFullYear(), hoje.getMonth()+3, 10);
  return Object.assign({
    id:uid(), nome:'Mi nueva ruta', tipos:['aventura'], intencao:'', quem:'dupla', pessoas:2, exp:'intermediario',
    inicio: ini.toISOString().slice(0,10), ritmo:'moderado', margem:1, aclim:true, drone:false,
    paradas:[], trechos:{}, notas:{}, ck:{}, extras:[], docs:{}, passaporte:'', contatos:[], seguro:{}, orc:{}, orcOk:false,
    equipe:[], imagens:{}, cine:{fmt:'h265', cams:1, horas:2}, auto:{}, compromisso:false, criado:Date.now()
  }, base);
}

/* ---------- geografia e cálculos ---------- */
const R2D = 180/Math.PI, D2R = Math.PI/180;
function km(a,b){ const dLat=(b.y-a.y)*D2R, dLon=(b.x-a.x)*D2R; const s=Math.sin(dLat/2)**2+Math.cos(a.y*D2R)*Math.cos(b.y*D2R)*Math.sin(dLon/2)**2; return 6371*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)); }
function modoPadrao(a,b,d){ if(a.l==='P'||b.l==='P'){ if(Math.abs(b.y)>60||Math.abs(a.y)>60) return d>1500?'aviao':'navio'; } if(d>700) return 'aviao'; if(b.l==='O'||a.l==='O') return 'x4'; return 'carro'; }
function trecho(i){
  const a=T.paradas[i-1], b=T.paradas[i]; const d=km(a,b);
  const m = T.trechos[b.id] || modoPadrao(a,b,d); const M=MODOS[m];
  const dist = d*(M.rf||1);
  let h, dias;
  if(M.hd){ h = dist/M.v; dias = Math.max(1, Math.ceil(h/M.hd)); }
  else { h = dist/M.v + M.ov; dias = h<=7 ? 0 : Math.ceil(h/12); }
  const co2 = M.veh ? dist*M.co2/Math.max(1,Math.min(T.pessoas,4)) : dist*M.co2;
  return {a,b,m,M,km:dist,h,dias,co2};
}
function altDe(p){ const r = p.ref?PT[p.ref]:null; return r ? (r.alt||r.altmax||0) : (p.alt||0); }
function pontoDe(p){ return p.ref ? PT[p.ref] : null; }
function nk(p){ const r=pontoDe(p); return r ? (r.k||r.n) : p.n; }
function paises(){
  const s=new Set();
  T.paradas.forEach(p=>{ const r=pontoDe(p); const pa=(r?(r.pa0||r.pa):p.pa)||''; pa.split(/,| e |\//).map(x=>x.trim()).filter(Boolean).forEach(x=>s.add(x)); });
  return [...s];
}
function addDias(iso,n){ const d=new Date(iso+'T12:00:00'); d.setDate(d.getDate()+n); return d; }
function fmtD(d){ return DIAS_S[d.getDay()]+', '+d.getDate()+' '+MESES[d.getMonth()]; }
function fmtDL(d){ return d.getDate()+' de '+MESES_L[d.getMonth()]+' de '+d.getFullYear(); }
function isoD(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

/* sol (fórmulas do SunCalc, de V. Agafonkin, domínio público na prática: BSD) */
const J1970=2440588, J2000=2451545, dayMs=864e5, e=D2R*23.4397, J0=0.0009;
const toJ=d=>d.valueOf()/dayMs-0.5+J1970, fromJ=j=>new Date((j+0.5-J1970)*dayMs), toDays=d=>toJ(d)-J2000;
function solar(date, lat, lng){
  const lw=D2R*-lng, phi=D2R*lat, d=toDays(date), n=Math.round(d-J0-lw/(2*Math.PI));
  const ds=J0+(0+lw)/(2*Math.PI)+n, M=D2R*(357.5291+0.98560028*ds);
  const C=D2R*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M)), L=M+C+D2R*102.9372+Math.PI;
  const dec=Math.asin(Math.sin(e)*Math.sin(L));
  const Jnoon=J2000+ds+0.0053*Math.sin(M)-0.0069*Math.sin(2*L);
  const tr=(w)=>{ const a=J0+(w+lw)/(2*Math.PI)+n; return J2000+a+0.0053*Math.sin(M)-0.0069*Math.sin(2*L); };
  const at=(h)=>{ const c=(Math.sin(h*D2R)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)); if(c<-1) return 'dia'; if(c>1) return 'noite'; const Js=tr(Math.acos(c)); return [fromJ(Jnoon-(Js-Jnoon)), fromJ(Js)]; };
  return {noon:fromJ(Jnoon), nascer:at(-0.833), dourada:at(6), civil:at(-6)};
}
function horaSolar(dt,lng){ if(!(dt instanceof Date)) return '—'; const t=new Date(dt.valueOf()+lng/15*3600e3); return String(t.getUTCHours()).padStart(2,'0')+':'+String(t.getUTCMinutes()).padStart(2,'0'); }
function luzDia(date,p){
  const s=solar(new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),12)-p.x/15*3600e3),p.y,p.x);
  if(s.nascer==='dia') return {polar:'dia',s}; if(s.nascer==='noite') return {polar:'noite',s};
  return {s, h:(s.nascer[1]-s.nascer[0])/3600e3};
}
function lua(date){ const ph=(((toJ(date)-2451550.1)/29.530588853)%1+1)%1; return {ph, il:(1-Math.cos(2*Math.PI*ph))/2}; }

/* ---------- plano dia a dia ---------- */
function plano(){
  const dias=[]; if(!T.paradas.length) return dias;
  let k=0; const push=(o)=>{ o.dt=addDias(T.inicio,k++); dias.push(o); };
  T.paradas.forEach((p,i)=>{
    if(i>0){
      const t=trecho(i);
      const ant=pontoDe(T.paradas[i-1]);
      if(ant && (ant.l==='ME'||(ant.l==='NF'&&ant.d>=3)) && t.m==='aviao') push({tipo:'marg',t:'Intervalo de superficie antes de volar',ds:'Al menos 18 a 24 horas sin volar después de varios días de buceo, para reducir el riesgo de enfermedad descompresiva.',id:'sv'+p.id});
      if(t.dias>0) for(let j=0;j<t.dias;j++) push({tipo:'via',t:'Traslado: '+t.a.n+' → '+t.b.n,ds:t.M.n+' · unos '+fmtN(t.km)+' km'+(t.dias>1?' · día '+(j+1)+' de '+t.dias:''),id:'v'+p.id+'-'+j});
    }
    const alt=altDe(p);
    const nd=Math.max(0,p.dias|0); let dentro=0;
    if(T.aclim && alt>=3000){ const need=Math.min(6,Math.ceil((alt-2800)/700)); dentro=Math.min(need,Math.floor(nd*.6)); const n=need-dentro; for(let j=0;j<n;j++) push({tipo:'acl',t:'Aclimatación para '+p.n,ds:'Dormir como máximo 300 a 500 m por encima de la noche anterior. Caminatas suaves, mucha agua, atención al dolor de cabeza y las náuseas.',id:'a'+p.id+'-'+j}); }
    const chegou = i>0 && trecho(i).dias===0 ? ' (llegada: '+MODOS[trecho(i).m].n.toLowerCase()+')' : '';
    for(let j=0;j<nd;j++) push({tipo:j<dentro?'acl':'loc',t:(nd>1?'Día '+(j+1)+' en ':'')+p.n+(j===0?chegou:'')+(j<dentro?' · subida gradual':''),ds:j===0?(pontoDe(p)?.f||''):(j<dentro?'Aclimatación dentro de la propia ruta de subida: ganar altura despacio.':''),id:'d'+p.id+'-'+j,p});
  });
  for(let j=0;j<(T.margem|0);j++) push({tipo:'marg',t:'Día de margen',ds:'Reserva para mal tiempo, vuelos retrasados o cansancio. Quien planea margen vuelve entero.',id:'m'+j});
  return dias;
}

/* ---------- dificuldade ---------- */
function difLabel(p){ const r=pontoDe(p); if(!r) return ''; const L=LAY[r.l]; return (L.dif&&L.dif[r.d])||['','Fácil','Moderado','Exigente','Muy exigente','Extremo'][r.d]; }
function nivel(){ let m=0; T.paradas.forEach(p=>{ const r=pontoDe(p); if(r) m=Math.max(m,r.d||1); }); return m; }
const NIVEL_N=['—','Leve','Moderado','Exigente','Muy exigente','Extremo'];

/* ---------- regras: habilidades ---------- */
function habilidades(){
  const out=[]; const add=(k,t,p)=>{ if(!out.find(o=>o.k===k)) out.push({k,t,p}); };
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(!r) return; const g=r.g2||[];
    if(r.l==='ME'){ if(r.d>=2) add('ow','Certificación de buceo Open Water (o equivalente)',r.n); if(r.d>=4) add('aow','Advanced, buceo con corriente y buena experiencia (sugerencia: más de 50 inmersiones registradas)',r.n); if(r.d>=5||g.includes('cav')) add('tec','Formación técnica o de cueva/cenote con instructor especializado',r.n); }
    if(r.l==='NF'&&r.d>=3) add('ow2','Certificación de buceo acorde a la profundidad del naufragio',r.n);
    if(r.l==='CU'){ if(r.d>=3) add('alp','Curso básico de alpinismo: crampones, piolet, autodetención',r.n); if(r.d>=4) add('corda','Técnicas de cuerda, rescate en grieta y experiencia previa en altura',r.n); }
    if(r.l==='TK'&&r.d>=4) add('nav','Navegación con mapa, brújula y GPS; autonomía en senderos remotos',r.n);
    if(r.l==='P'&&r.d>=3) add('polar','Entrenamiento de expedición polar: arrastrar trineo (pulka), carpa en la nieve, prevención de congelamiento',r.n);
    if(r.l==='O') add('off','Conducción off-road: arena, barro, cruce de ríos y rescate del vehículo',r.n);
    if(r.l==='B2'&&r.d>=3) add('mec','Mecánica básica de bicicleta y entrenamiento con la bici cargada',r.n);
    if(r.l==='AT'){ if(g.includes('esc')) add('esc','Escalada: experiencia en el grado de la vía o guía acreditado',r.n); if(g.includes('cany')) add('cany','Barranquismo: rápel y técnicas de agua, siempre con guía acreditado',r.n); if(g.includes('raft')||g.includes('cai')) add('agua','Natación segura y charla de seguridad en rápidos',r.n); if(g.includes('ar')) add('ar','Vuelo libre o salto: solo con instructor y escuela homologada',r.n); }
    if(r.l==='X') add('trav','Entrenamiento específico de la travesía (mar, río, desierto o natación de larga distancia)',r.n);
  });
  return out;
}

/* ---------- regras: equipamento ---------- */
function frio(){ return T.paradas.some(p=>{ const r=pontoDe(p); return Math.abs(p.y)>55 || altDe(p)>=2500 || (r&&r.l==='P'); }); }
function tropical(){ return T.paradas.some(p=>Math.abs(p.y)<23.5 && altDe(p)<2000); }
function temL(...ls){ return T.paradas.some(p=>{ const r=pontoDe(p); return r && ls.includes(r.l); }); }
function temG(l,g){ return T.paradas.some(p=>{ const r=pontoDe(p); return r && r.l===l && (r.g2||[]).includes(g); }); }
function tem(t){ return T.tipos.includes(t); }
function equipamento(){
  const G=[];
  const g=(t,its,por)=>G.push({t,por,its:its.map(x=>Array.isArray(x)?{n:x[0],w:x[1]}:{n:x,w:0})});
  g('Esenciales',[['Mochila principal o bolso de expedición',1800],['Mochila de ataque (20–35 L)',700],['Linterna frontal y pilas',120],['Botiquín personal de primeros auxilios',400],['Botella y filtro o pastillas para el agua',350],['Protector solar, labial y gafas de sol',250],['Batería externa y cables',350],['Bolsa estanca para documentos',80],['Navaja o multiherramienta',120]],'Toda jornada');
  if(frio()) g('Frío y altura',[['Sistema de 3 capas (térmica, polar, chaqueta impermeable)',1500],['Chaqueta de plumas',700],['Guantes finos y guantes gruesos',300],['Gorro y pasamontañas',150],['Calcetines de lana merino (3 pares)',300],['Gafas de glaciar categoría 4',60],['Saco de dormir confort -10 °C o menos',1600]],'Hay paradas frías o por encima de 2.500 m');
  if(tropical()) g('Calor y trópicos',[['Ropa ligera con protección UV',600],['Repelente (icaridina o DEET)',150],['Mosquitero',350],['Sandalias de trekking',500],['Capa de lluvia ligera',300]],'Hay paradas tropicales');
  if(temL('TK','L','CU','VU')) g('Sendero y montaña',[['Botas de trekking ya domadas',1400],['Bastones de caminata',500],['Polainas',250],['Mapa sin conexión y GPS en el celular',0],['Silbato y manta térmica',100]],'Trekkings, cumbres o volcanes');
  if(T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='CU'&&r.d>=3;})) g('Alpinismo',[['Crampones',900],['Piolet',500],['Arnés, mosquetones y cordino',700],['Casco',350],['Bota doble o de alta montaña',2400]],'Cumbres técnicas');
  if(temL('ME','NF')) g('Buceo',[['Máscara, snorkel y aletas',1500],['Computadora de buceo',250],['Traje de neopreno adecuado a la temperatura',2500],['Boya de señalización y silbato',200],['Bitácora y certificaciones',50]],'Paradas de buceo');
  if(temL('BA','X')||temG('AT','cai')||temG('AT','raft')) g('Agua y barco',[['Chaqueta impermeable y pantalón de lluvia',700],['Remedio para el mareo',20],['Funda estanca para el celular',60]],'Salidas en barco y travesías');
  if(temL('O')) g('Off-road',[['Kit de rescate: planchas, eslinga, pala',9000],['Compresor y kit de reparación de neumáticos',4000],['Combustible y agua extra',0],['Comunicador satelital',120]],'Rutas off-road');
  if(temL('B2')) g('Bicicleta',[['Casco',350],['Alforjas o bikepacking',2200],['Cámaras, parches e inflador',600],['Herramienta multiuso de bici',200]],'Rutas en bici');
  if(temL('P')) g('Polar',[['Parka de expedición',1800],['Botas polares',2200],['Máscara facial y antiparras de nieve',250],['Termo',450]],'Destinos polares');
  if(tem('fotografica')||tem('cinema')){
    const its=[['Cuerpo de cámara principal',750],['Cuerpo de reserva',650],['Gran angular (14–24 mm)',650],['Zoom estándar (24–70 mm)',800],['Trípode ligero de fibra de carbono',1500],['Filtros polarizador y ND',200],['Baterías extra (el frío baja la carga)',300],['Tarjetas de memoria (2× lo previsto)',50],['Funda de lluvia para la cámara',150],['Kit de limpieza del sensor',100]];
    if(temL('FA','BA')) its.splice(4,0,['Teleobjetivo 100–400 o 200–600 mm',2100]);
    if(temL('ME')) its.push(['Carcasa estanca e iluminación submarina',3500]);
    g('Fotografía',its,'Ruta fotográfica');
  }
  if(tem('cinema')) g('Filmación',[['Micrófono shotgun y corbateros inalámbricos',600],['Grabadora de audio',400],['Gimbal',1200],['Monitor externo',500],['SSD de respaldo (regla 3-2-1)',300],['Notebook para descargar',1800],['Protector de viento (dead cat)',60]],'Ruta cinematográfica');
  if(T.drone) g('Dron',[['Dron y 3 baterías',1300],['Control y hélices de repuesto',300],['Filtros ND para dron',50],['Comprobantes de registro y autorización',0]],'Marcaste que llevarás dron');
  if(T.extras.length) g('Ítems que agregaste',T.extras.map(x=>[x,0]),'Lista personal');
  return G;
}

/* ---------- regras: documentos e autorizações ---------- */
const AFR=['Uganda','Ruanda','Tanzânia','Quênia','Congo','RD Congo','República Democrática do Congo','Etiópia','Zâmbia','Zimbábue','Botsuana','Namíbia','Camarões','Madagascar','África do Sul','Marrocos','Egito'];
const SCHENGEN=['Itália','Espanha','França','Portugal','Suíça','Islândia','Noruega','Suécia','Finlândia','Grécia','Alemanha','Áustria','Croácia','Eslovênia','Polônia','Dinamarca','Holanda','Bélgica'];
function documentos(){
  const ps=paises(), ext=ps.filter(p=>!/Brasil/.test(p)), L=[];
  const nomes=T.paradas.map(nk).join(' | ');
  const d=(k,t,p,onde,por)=>L.push({k,t,p,onde,por});
  if(ext.length){ const vol=addDias(T.inicio,plano().length+180); d('pass','Pasaporte vigente','Muchos países exigen una vigencia mínima de 6 meses después de la fecha de salida. Tu regreso previsto pide vigencia hasta por lo menos el '+fmtDL(vol)+'.','Oficina de pasaportes de tu país (para brasileños: Polícia Federal, turno en línea)','Destinos fuera de Brasil');
    d('visto','Visas y autorizaciones electrónicas de entrada','Revisa las reglas para tu nacionalidad en: '+ext.map(paT).join(', ')+'. Conviene revisar caso por caso, porque las reglas cambian (visas, eTA, ESTA, eVisa).','Cancillería de tu país y sitios oficiales de inmigración','Destinos fuera de Brasil'); }
  if(ps.some(p=>AFR.some(a=>p.includes(a)))||ps.includes('Brasil')) d('civp','Vacuna de fiebre amarilla y certificado internacional','El Certificado Internacional de Vacunación o Profilaxis puede exigirse para entrar en algunos países y se recomienda en varias regiones de Brasil.','Autoridad sanitaria de tu país (en Brasil, Anvisa) y centro de vacunación','Zonas de fiebre amarilla');
  if(ext.some(p=>SCHENGEN.some(s=>p.includes(s)))) d('schengen','Seguro con cobertura Schengen','Para el espacio Schengen el seguro debe cubrir al menos 30.000 euros en gastos médicos.','Aseguradora','Destino en el espacio Schengen');
  if(T.paradas.some((p,i)=>i>0 && ['carro','x4'].includes(trecho(i).m)) && ext.length) d('pid','Permiso Internacional de Conducir','Se pide en la autoridad de tránsito de tu país (en Brasil, el Detran del estado), junto con la licencia vigente.','Autoridad de tránsito','Tramos en auto fuera de Brasil');
  if(T.drone){ if(ps.includes('Brasil')) d('droneBR','Dron en Brasil: SISANT, SARPAS y Anatel','Registro del dron en la ANAC (SISANT), pedido de vuelo al DECEA (SARPAS) y homologación en Anatel. En parques federales, autorización del ICMBio.','ANAC, DECEA, Anatel, ICMBio','Llevarás dron');
    if(ext.length) d('droneEXT','Dron en el exterior','Cada país tiene sus propias reglas y registro, y muchos parques nacionales prohíben volar sin licencia (en los parques de EE. UU. está prohibido).','Autoridad de aviación civil de cada país','Llevarás dron'); }
  const esp=[
    [/Bwindi|Gorilas no Parque dos Vulcões/,'gor','Permiso para ver gorilas','Permisos diarios limitados, vendidos con meses de anticipación. Visita de 1 hora con guía y reglas sanitarias.','Uganda Wildlife Authority o Rwanda Development Board'],
    [/Kilimanjaro/,'kili','Tasas del parque y guía obligatorio en el Kilimanjaro','La subida solo se permite con guía y operador autorizados, que cobran las tasas del parque.','Operador autorizado por la autoridad de parques de Tanzania'],
    [/Aconcágua/,'acon','Permiso de ascenso al Aconcagua','Permiso pago, con valor por temporada, que se retira en Mendoza antes de la subida. Exige control médico en el parque.','Parque Provincial Aconcagua (Mendoza)'],
    [/Everest|Campo-base do Everest|Lhotse|Ama Dablam|Island Peak/,'nepal','Permisos de trekking y escalada en Nepal','Entrada al Parque Nacional Sagarmatha y permiso local; las cumbres exigen permiso de escalada del gobierno.','Departamento de Turismo de Nepal, a través de una agencia registrada'],
    [/Trilha Inca/,'inca','Permiso del Camino Inca','Cupos diarios limitados, vendidos solo por operadores autorizados, que se agotan meses antes.','Operador autorizado por el Ministerio de Cultura del Perú'],
    [/Milford Track|Routeburn/,'doc','Reserva de Great Walk','Refugios reservados con anticipación; la temporada se agota rápido.','Department of Conservation de Nueva Zelanda'],
    [/Svalbard/,'sval','Reglas de Svalbard','Fuera de las áreas habituales de visita hay que avisar al gobierno local y tener seguro de búsqueda y rescate. Los osos polares exigen protección y guía.','Governor of Svalbard (Sysselmesteren)'],
    [/Antártica|Antártida|Polo Sul|Ilha Elefante|Deception|Geórgia do Sul|Snow Hill|Comandante Ferraz/,'ant','Autorización para la Antártida','Toda actividad necesita una evaluación de impacto ambiental de un país firmante del Tratado Antártico. Los operadores de IAATO se encargan de esto para los pasajeros.','Operador miembro de IAATO'],
    [/Galápagos/,'gal','Ingreso a Galápagos','Tasa de ingreso al parque y tarjeta de control de tránsito, compradas antes de embarcar en el continente.','Gobierno del Ecuador / Parque Nacional Galápagos'],
    [/Fernando de Noronha/,'fn','Tasas de Fernando de Noronha','Tasa de Preservación Ambiental por día e ingreso al Parque Nacional Marino.','Administración del distrito e ICMBio']
  ];
  esp.forEach(([re,k,t,p,o])=>{ if(re.test(nomes)) d(k,t,p,o,'Paradas: '+T.paradas.filter(x=>re.test(nk(x))).map(x=>x.n).join(', ')); });
  if(temL('PQ')) d('parq','Entradas y reservas de los parques','Los parques más concurridos limitan cupos, camping y senderos. Reserva lo que tenga cupo apenas las fechas estén firmes.','Organismo gestor de cada parque','Parques en la ruta');
  if(tem('cultural')&&ps.includes('Brasil')) d('funai','Tierras indígenas','Las visitas a tierras indígenas requieren el consentimiento de la comunidad y una autorización de ingreso de la Funai. Las imágenes exigen un acuerdo de uso con la comunidad.','Funai y la propia comunidad','Ruta cultural en Brasil');
  if(tem('cinema')){ d('film','Permisos de filmación','Grabar para uso comercial en áreas protegidas suele exigir licencia y tasa. En las ciudades, busca la film commission local.','Organismos de parques, film commissions (en Brasil, ICMBio)','Ruta cinematográfica');
    d('cessao','Cesión de imagen y de locación','Autorización firmada por quien aparece de forma identificable y por los dueños de locaciones privadas.','Modelo de tu abogado o productora','Ruta cinematográfica');
    if(ext.length) d('ata','Cuaderno ATA para el equipo','Documento aduanero que permite entrar y salir con equipo profesional sin pagar impuestos de importación.','Cámara de comercio de tu país (en Brasil, la CNI)','Equipo profesional en el exterior'); }
  if(temL('ME')||T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='NF'&&r.d>=3;})) d('merg','Certificaciones y bitácora de buceo','Lleva las credenciales (o la app de la certificadora) y el registro de inmersiones; los operadores las piden para habilitar inmersiones avanzadas.','Tu certificadora (PADI, SSI, NAUI, CMAS)','Paradas de buceo');
  if(T.quem==='familia') d('menor','Autorización de viaje para menores','Cuando el niño viaja sin uno de los padres, se necesita una autorización con firma certificada o registrada en el pasaporte.','Escribanía o notaría, u oficina de pasaportes','Viaje en familia');
  d('seguroDoc','Póliza de seguro de viaje','Con coberturas acordes a las actividades (ver Salud y seguridad).','Aseguradora','Toda jornada');
  return L;
}

/* ---------- orçamento (simulado) ---------- */
function regiao(p){ const r=pontoDe(p); const pa=(r?(r.pa0||r.pa):p.pa)||''; const x=p.x,y=p.y;
  if((r&&r.l==='P')||y<-60||y>75) return 'POL'; if(/Brasil/.test(pa)) return 'BR';
  if(x>-82&&x<-34&&y<13) return 'SA'; if(y>13&&x<-50) return 'NA'; if(y>35&&x>-25&&x<45) return 'EU';
  if(x>-20&&x<52&&y>-36&&y<37) return 'AF'; if(x>110&&y<-10) return 'OC'; return 'AS'; }
const IDX={BR:420,SA:520,NA:1350,EU:1250,AF:1000,OC:1250,AS:560,POL:6500};
const IDX_N={BR:'Brasil',SA:'América del Sur',NA:'América del Norte y Central',EU:'Europa',AF:'África',OC:'Oceanía',AS:'Asia',POL:'Regiones polares'};
function orcamento(){
  const pl=plano(); const pes=Math.max(1,T.pessoas|0);
  let transp=0, hosp=0, alim=0, guia=0, taxas=0;
  T.paradas.forEach((p,i)=>{ if(i>0){ const t=trecho(i); const c={aviao:t.km*.75+500,carro:t.km*1.1/pes*1.2,x4:t.km*2.6/pes*1.5,onibus:t.km*.3,trem:t.km*.45,barco:t.km*1.5,navio:t.km*9,pe:0,bike:0,cavalo:t.dias*350,caiaque:t.dias*300}[t.m]||0; transp+=c; } });
  pl.forEach(d=>{ const p=d.p||T.paradas[0]; if(!p) return; const ix=IDX[regiao(p)]; hosp+=ix*.55; alim+=ix*.3; const r=pontoDe(p); if(r&&(r.d>=3||['FA','P','CU','ME','NF'].includes(r.l))&&d.p) guia+=900/pes; });
  const nm=T.paradas.map(nk).join('|');
  if(/Bwindi|Gorilas no Parque/.test(nm)) taxas+=4800; if(/Kilimanjaro/.test(nm)) taxas+=5500; if(/Aconcágua/.test(nm)) taxas+=4200; if(/Everest|Lhotse/.test(nm)) taxas+=60000; if(/Galápagos/.test(nm)) taxas+=1100;
  taxas+=T.paradas.filter(p=>pontoDe(p)&&pontoDe(p).l==='PQ').length*150;
  const seguro=pl.length*(nivel()>=4?85:35);
  const equip=equipamento().reduce((s,g)=>s+g.its.length,0)*35;
  const prod = tem('cinema') ? pl.length*600 : 0;
  const cats=[['transp','Transporte',transp],['hosp','Alojamiento',hosp],['alim','Comida',alim],['guia','Guías y operadores',guia],['taxas','Tasas y permisos',taxas],['seguro','Seguro',seguro],['equip','Equipo (compra y alquiler)',equip]];
  if(prod) cats.push(['prod','Producción de imagen',prod]);
  cats.forEach(c=>{ if(T.orc[c[0]]!=null&&T.orc[c[0]]!=='') c[2]=+T.orc[c[0]]; });
  const sub=cats.reduce((s,c)=>s+c[2],0); const cont=sub*.15;
  return {cats, sub, cont, total:sub+cont, pes};
}

/* ---------- prontidão ---------- */
function status(){
  const pl=plano(), ck=T.ck;
  const eq=equipamento(); let eqT=0,eqF=0; eq.forEach(g=>g.its.forEach(it=>{eqT++; if(ck['eq:'+it.n]) eqF++;}));
  const docs=documentos(); const docF=docs.filter(d=>T.docs[d.k]==='ok').length;
  const hab=habilidades(); const habF=hab.filter(h=>ck['hb:'+h.k]).length;
  const S={
    ideia: T.nome && T.tipos.length && T.inicio ? 'ok' : 'meio',
    mapa: T.paradas.length>=2 ? 'ok' : T.paradas.length ? 'meio':'',
    epoca: !T.paradas.length? '' : alertasMes().length? 'meio':'ok',
    dias: pl.length ? 'ok':'',
    preparo: !hab.length && ck['auto:ok'] ? 'ok' : hab.length && habF===hab.length ? 'ok' : (habF||ck['auto:ok'])?'meio':'',
    equip: eqF===eqT&&eqT ? 'ok' : eqF ? 'meio':'',
    docs: docs.length&&docF===docs.length ? 'ok' : docF?'meio':'',
    saude: T.contatos.length && Object.values(T.seguro).some(Boolean) ? 'ok' : (T.contatos.length||Object.values(T.seguro).some(Boolean))?'meio':'',
    orc: T.orcOk?'ok':'',
    equipe: T.equipe.length||T.quem==='solo'?'ok':'',
    imagens: Object.values(T.imagens).some(a=>a&&a.length)?'ok':'',
    conduta: T.compromisso?'ok':'',
    revisar: ''
  };
  const peso={ideia:1,mapa:2,epoca:1,dias:1,preparo:1,equip:1.5,docs:2,saude:2,orc:1,equipe:.5,conduta:.5};
  if(tem('fotografica')||tem('cinema')) peso.imagens=1;
  let tot=0, f=0; Object.entries(peso).forEach(([k,w])=>{ tot+=w; if(S[k]==='ok') f+=w; else if(S[k]==='meio') f+=w*.4; });
  return {S, pct:Math.round(f/tot*100), eqT, eqF, docs, docF};
}
function alertasMes(){
  const out=[]; const pl=plano();
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(!r||!r.me||!r.me.length) return; const d=pl.find(x=>x.p===p); if(!d) return; const m=d.dt.getMonth()+1; if(!r.me.includes(m)) out.push({p,r,m}); });
  return out;
}
function alertas(){
  const A=[]; if(!T) return A;
  if(!T.paradas.length) A.push({n:'bad',t:'Ningún lugar en la ruta',d:'Empieza eligiendo puntos en el mapa.',go:'mapa'});
  alertasMes().forEach(a=>A.push({n:'warn',t:a.p.n+' fuera de la mejor época',d:'Llegas en '+MESES_L[a.m-1]+'. La WAS indica: '+a.r.me.map(m=>MESES[m-1]).join(', ')+'.',go:'epoca'}));
  T.paradas.forEach((p,i)=>{ if(i>0){ const ant=pontoDe(T.paradas[i-1]); const t=trecho(i); if(ant&&ant.l==='ME'&&t.m==='aviao') A.push({n:'warn',t:'Buceo seguido de vuelo',d:'El plan ya incluye un día sin volar después de '+ant.n+'.',go:'dias'}); } });
  if(!T.aclim && T.paradas.some(p=>altDe(p)>=3000)) A.push({n:'bad',t:'Altura sin aclimatación',d:'Hay lugares por encima de 3.000 m y la aclimatación está desactivada.',go:'dias'});
  if(T.paradas.some(p=>!(p.dias>0) && pontoDe(p))) A.push({n:'warn',t:'Lugar con 0 días',d:'Algún lugar de la ruta todavía no tiene días definidos.',go:'mapa'});
  if(T.drone && (temL('PQ')||temL('FA'))) A.push({n:'warn',t:'Dron en área protegida',d:'Los parques y áreas de fauna casi siempre exigen autorización o prohíben volar.',go:'docs'});
  if(nivel()>=4 && !T.seguro.evac) A.push({n:'bad',t:'Seguro sin evacuación',d:'Una ruta de nivel '+NIVEL_N[nivel()].toLowerCase()+' pide cobertura de rescate y evacuación aeromédica.',go:'saude'});
  if(T.paradas.length && !T.contatos.length) A.push({n:'warn',t:'Sin contacto de emergencia',d:'Define quién sigue el viaje desde casa.',go:'saude'});
  if(temL('BA','FA')&&!T.compromisso) A.push({n:'warn',t:'Conducta con la fauna',d:'Lee las reglas de distancia y acepta el compromiso de conducta.',go:'conduta'});
  return A;
}

/* ================= RENDER ================= */
let app = document.getElementById('wasrot');
if(!app){ app=document.createElement('div'); app.id='wasrot'; const ft=document.querySelector('footer.footer-section')||document.querySelector('footer'); if(ft&&ft.parentNode) ft.parentNode.insertBefore(app,ft); else document.body.appendChild(app); }
function topo(){
  if(!T) return '';
  return `<div class="topo"><div class="topo-in">
    <div class="marca"><span class="kick">Rutas WAS</span><b>${esc(T.nome)}</b></div>
    <span class="selo" title="Función en prueba. Parte de los datos es simulada.">En prueba</span>
    <div class="esp"></div>
    <span class="salvo" id="salvo">Guardado en este navegador</span>
    <button class="tbtn" data-act="home" aria-label="Mis rutas">${svg('lista')}<span class="lbl">Mis rutas</span></button>
  </div></div>`;
}
/* ---------- início ---------- */
const MODELOS = [
  {id:'java',nome:'Volcanes de Java y Lombok',tipos:['fotografica','aventura'],quem:'dupla',pessoas:2,mes:7,intencao:'Fotografiar el amanecer en el Bromo, el fuego azul del Ijen y el cráter del Rinjani, con tiempo para esperar la luz justa.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['VU','Bromo',2],['VU','Ijen',2],['VU','Rinjani',4]],t:'Fotográfica · 3 volcanes activos'},
  {id:'jub',nome:'Jorobadas y arrecifes de Bahía',tipos:['contemplacao','fotografica','familia'],quem:'familia',pessoas:4,mes:8,intencao:'Ver de cerca las ballenas jorobadas en Abrolhos y las tortugas del Projeto Tamar, a un ritmo tranquilo con los niños.',
    par:[['livre','Salvador',-38.5,-12.97,0,'Brasil'],['BA','Praia do Forte',2],['FA','Projeto Tamar na Praia do Forte',1],['BA','Arquipélago dos Abrolhos',3]],t:'Contemplación · temporada de ballenas'},
  {id:'afr',nome:'El Kilimanjaro y los gorilas',tipos:['expedicao','fotografica'],quem:'grupo',pessoas:4,mes:7,intencao:'Subir al techo de África por la ruta más tranquila y terminar con una hora frente a los gorilas de montaña.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['CU','Kilimanjaro',7],['FA','Grande Migração no Masai Mara',3],['FA','Gorilas-das-montanhas em Bwindi',2]],t:'Expedición · Siete Cumbres y fauna'},
  {id:'sval',nome:'Tras los pasos de Amundsen: el Ártico noruego',tipos:['cinema','expedicao'],quem:'grupo',pessoas:3,mes:6,intencao:'Documental corto sobre el hielo que retrocede, filmado bajo el sol de medianoche, de Tromsø a Svalbard.',
    par:[['livre','Oslo',10.75,59.91,1,'Noruega'],['BA','Fiordes de Tromsø',2],['P','Svalbard',6]],t:'Cinematográfica · sol de medianoche'},
  {id:'cerrado',nome:'Brasil Central en 4x4',tipos:['aventura','cultural'],quem:'grupo',pessoas:4,mes:7,intencao:'Recorrer el Cerrado en la estación seca: los manantiales del Jalapão, los cañones de la Chapada dos Veadeiros y las cuevas de Terra Ronca.',
    par:[['livre','Brasília',-47.88,-15.79,0,'Brasil'],['PQ','Parque Nacional da Chapada dos Veadeiros',3],['AT','Terra Ronca',2],['O','Jalapão',4]],t:'Aventura · off-road y cuevas',
    ft:'fotos/brasil-central-saltos-rio-preto.jpg',fa:'Marcelo Camargo/Agência Brasil',fl:'CC BY 3.0 BR',fn:'Saltos do Rio Preto, Chapada dos Veadeiros'},
  {id:'pat',nome:'Patagonia: Torres y Fitz Roy',tipos:['aventura','esportiva','fotografica'],quem:'dupla',pessoas:2,mes:2,intencao:'Hacer la W de Torres del Paine y caminar hasta la Laguna de los Tres, frente al Fitz Roy.',
    par:[['livre','Punta Arenas',-70.91,-53.16,0,'Chile'],['TK','Circuito W de Torres del Paine',5],['PQ','Parque Nacional Los Glaciares',2],['CU','Monte Fitz Roy (Chaltén)',3]],t:'Trekking · Patagonia'}
];
function stopFrom(sp){
  if(sp[0]==='livre') return {id:uid(),ref:null,n:sp[1],x:sp[2],y:sp[3],dias:sp[4],pa:sp[5],livre:true};
  const r=PT[sp[0]+'|'+sp[1]]; if(!r) return null; return {id:uid(),ref:refDe(r),n:r.n,x:r.x,y:r.y,dias:sp[2]||2,l:r.l};
}
function criarModelo(m){
  const ano=new Date().getFullYear(); const hoje=new Date(); let y=ano; if(m.mes-1<=hoje.getMonth()) y++;
  const t=novo({nome:m.nome,tipos:m.tipos,quem:m.quem,pessoas:m.pessoas,intencao:m.intencao,inicio:y+'-'+String(m.mes).padStart(2,'0')+'-05',modelo:m.id});
  t.paradas=m.par.map(stopFrom).filter(Boolean);
  if(m.id==='sval') t.drone=true;
  return t;
}
function fotoModelo(m){ if(m.ft) return {ft:ABS(m.ft),fa:m.fa,fl:m.fl}; for(const sp of m.par){ const r=PT[sp[0]+'|'+sp[1]]; if(r&&r.ft) return r; } return {ft:'',fa:'',fl:''}; }
const CORR={RM:'#5ec8ff',RT:'#ffcf6b',RA:'#ff8fb1',RH:'#e0a96d'};

function renderHome(){
  destruirMapas();
  const hero = PT['TK|Circuito W de Torres del Paine'] || D.pts.find(p=>p.ft);
  const meus = DB.rot.slice().sort((a,b)=>(b.alterado||0)-(a.alterado||0));
  app.innerHTML = topo() + `<main class="inicio">
    <section class="hero"><div class="fundo" style="background-image:url('${esc(hero.ft)}')"></div>
      <div class="hero-in"><div class="qd hero-qd">${svg('rota')}</div><div class="kick">Rutas WAS</div><h1>Arma tu ruta</h1>
      <p class="lead">Expediciones, viajes de aventura, paseos de un día y viajes contemplativos. Elige lugares en el Mapa de la aventura, sigue los pasos de grandes exploradores y planifica todo en un solo lugar: época y luz, día a día, preparación, equipo, documentos, seguridad, presupuesto y plan de imágenes.</p></div>
      <div class="cred">Foto: ${esc(hero.n)} · ${esc(hero.fa)} · ${esc(hero.fl)}</div></section>
    <div class="portas">
      <button class="porta" data-act="zero">${qd('mais',1)}<h3>Empezar de cero</h3><p>Ponle un nombre, elige el tipo de jornada y ve armándola en el mapa.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-mod">${qd('livro',1)}<h3>Partir de un modelo</h3><p>Seis rutas listas para adaptar, hechas con lugares del mapa de la WAS.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-rot">${qd('rota',1)}<h3>Tras los pasos de un explorador</h3><p>Elige una ruta histórica y la WAS sugiere lugares para visitar en el camino.</p></button>
      <button class="porta" data-act="zero-mapa">${qd('pin',1)}<h3>Empezar por el mapa</h3><p>${fmtN(D.pts.length)} lugares en ${D.layers.length} capas: cumbres, buceo, volcanes, fauna y más.</p></button>
    </div>
    ${meus.length?`<section class="bloco-sec"><div class="cab">${qd('lista',1)}<h2>Mis rutas</h2></div><p class="intro">Se guardan solo en este navegador, en esta computadora.</p>
      <div class="meus">${meus.map(r=>`<div class="meu"><div class="t"><b>${esc(r.nome)}</b><span>${r.paradas.length} lugares · ${(r.tipos||[]).map(t=>TIPO_N[t]).join(', ')}</span></div>
      <button class="btn peq" data-act="abrir" data-id="${r.id}">Abrir</button><button class="ico-btn" data-act="apagar" data-id="${r.id}" title="Borrar esta ruta" aria-label="Borrar">${svg('lixo')}</button></div>`).join('')}</div></section>`:''}
    <section class="bloco-sec" id="sec-mod"><div class="cab">${qd('livro',1)}<h2>Modelos para adaptar</h2></div>
      <p class="intro">Cada modelo ya trae lugares, días, trayecto y época. Todo se puede cambiar.</p>
      <div class="grade-mod">${MODELOS.map(m=>{ const f=fotoModelo(m); return `<button class="mod" data-act="modelo" data-id="${m.id}"><div class="ft" style="background-image:url('${esc(f.ft)}')"></div><div class="cx"><span class="kick">${esc(m.t)}</span><h3>${esc(m.nome)}</h3><p>${esc(m.intencao)}</p><div class="tags">${m.tipos.map(t=>`<span class="tag">${TIPO_N[t]}</span>`).join('')}</div>${f.ft&&f.fa?`<span class="cr">Foto: ${esc(f.fa)} · ${esc(f.fl)}</span>`:''}</div></button>`; }).join('')}</div></section>
    <section class="bloco-sec" id="sec-rot"><div class="cab">${qd('rota',1)}<h2>Tras los pasos de un explorador</h2></div>
      <p class="intro">Las ${D.rotas.length} rutas del Mapa de la aventura. Al elegir una, el planificador crea una ruta con el inicio y el final del recorrido y con los lugares del mapa que quedan cerca del camino.</p>
      <div class="lista-rotas">${D.rotas.map(r=>`<button class="rota-c" data-act="rota" data-id="${r.id}"><span><i class="pt" style="background:${CORR[r.c]}"></i>${esc(D.cats[r.c])} · ${esc(r.per)}</span><b>${esc(r.n)}</b><span>${esc(r.quem)}</span></button>`).join('')}</div></section>
    <div class="aviso-sim"><b>Función en prueba.</b> Los lugares, fotos, mejores meses, dificultades y rutas son los datos reales del Mapa de la aventura de la WAS. El amanecer y el atardecer, las horas de luz y las fases de la luna se calculan de verdad. Costos, emisiones, operadores, reglas de documentos y plazos son estimaciones de ejemplo, marcadas como <span class="sim">simulado</span>. Nada se envía a un servidor: las rutas se guardan en este navegador.</div>
  </main>`;
  window.scrollTo(0,0);
}

function criarDeRota(id){
  const r=D.rotas.find(x=>x.id===id); const pts=r.pts;
  const ini={x:pts[0][0],y:pts[0][1]}, fim={x:pts[pts.length-1][0],y:pts[pts.length-1][1]};
  const perto=[];
  D.pts.forEach(p=>{ let best=1e9, bi=0; pts.forEach((q,i)=>{ const d=km(p,{x:q[0],y:q[1]}); if(d<best){best=d;bi=i;} }); if(best<220) perto.push({p,bi,best}); });
  perto.sort((a,b)=>a.bi-b.bi||a.best-b.best);
  const sel=[]; const usados=new Set(); perto.forEach(o=>{ if(sel.length<7 && !usados.has(o.p.n)){ usados.add(o.p.n); sel.push(o.p);} });
  const t=novo({nome:'Tras los pasos de: '+r.n,tipos:['expedicao','cultural'],intencao:'Recorrer de nuevo, como hoy sea posible, tramos de la ruta "'+r.n+'" ('+r.quem+', '+r.per+').',rota:r.id,quem:'dupla',pessoas:2});
  t.paradas.push({id:uid(),ref:null,n:'Inicio de la ruta',x:ini.x,y:ini.y,dias:1,livre:true,pa:''});
  sel.forEach(p=>t.paradas.push({id:uid(),ref:refDe(p),n:p.n,x:p.x,y:p.y,dias:2,l:p.l}));
  t.paradas.push({id:uid(),ref:null,n:'Fin de la ruta',x:fim.x,y:fim.y,dias:1,livre:true,pa:''});
  return t;
}

/* ---------- construtor ---------- */
const PASSOS=[
  ['ideia','La idea','ideia'],['mapa','Lugares y trayecto','mapa'],['epoca','Época, luz y clima','epoca'],['dias','Día a día','dias'],
  ['preparo','Dificultad y preparación','preparo'],['equip','Equipo','equip'],['docs','Documentos y permisos','docs'],['saude','Salud y seguridad','saude'],
  ['orc','Presupuesto','orc'],['equipe','Equipo humano y guías','equipe'],['imagens','Plan de imágenes','imagens'],['conduta','Impacto y conducta','conduta'],['revisar','Revisar y compartir','revisar']
];
function renderApp(){
  destruirMapas();
  const st=status();
  app.innerHTML = topo() + `<div class="app">
    <nav class="nav" aria-label="Etapas de la planificación"><div class="nome-r"><b>${esc(T.nome)}</b><span>${T.paradas.length} lugares · ${plano().length} días</span></div>
      ${PASSOS.map((p,i)=>{ const opc = p[0]==='imagens' && !(tem('fotografica')||tem('cinema'));
        return `<button class="passo${passo===p[0]?' on':''}" data-act="passo" data-p="${p[0]}"><span class="n">${i+1}</span>${p[1]}${opc?'<span class="opc">opcional</span>':''}<span class="st ${st.S[p[0]]||''}"></span></button>`; }).join('')}
    </nav>
    <main class="main" id="main"></main><h1 class="sr">${esc(T.nome)}</h1>
    <aside class="lado" id="lado"></aside></div>`;
  renderPasso(); renderLado();
}
function cab(k){ const i=PASSOS.findIndex(p=>p[0]===k); const P=PASSOS[i];
  const txt={ideia:'Qué quieres vivir, con quién y a qué ritmo. El tipo de jornada cambia lo que el planificador pide en las próximas etapas.',
    mapa:'Elige lugares en las capas del Mapa de la aventura o marca puntos libres. Define cuántos días en cada uno y cómo vas de uno a otro.',
    epoca:'La mejor época de cada lugar según la WAS, horas de luz, amanecer y atardecer y las fases de la luna en las fechas del viaje.',
    dias:'La ruta día a día, armada a partir de los lugares y trayectos, con aclimatación, intervalos de seguridad y días de margen.',
    preparo:'El nivel de la ruta, las habilidades y certificaciones que pide y un plan de entrenamiento hasta la partida.',
    equip:'Lista armada a partir de los lugares, el clima, las actividades y el tipo de jornada. Marca lo que ya tienes.',
    docs:'Pasaporte, visas, vacunas, permisos de parques, dron, tierras indígenas y filmación. Sigue el estado de cada uno.',
    saude:'Vacunas y cuidados, seguro con las coberturas correctas, contactos de emergencia y plan de comunicación.',
    orc:'Estimación por categoría, por persona y para el grupo. Ajusta cada valor cuando tengas las cotizaciones.',
    equipe:'Quién va, quién hace qué y quién puede guiar. En la WAS, guías y asociados podrían recomendarse aquí.',
    imagens:'Para rutas fotográficas y de filmación: luz en cada lugar, lista de escenas, dron, almacenamiento y autorizaciones.',
    conduta:'Huella de carbono de los trayectos, reglas de conducta con la fauna y las comunidades y el compromiso de mínimo impacto.',
    revisar:'El dosier de la ruta, listo para imprimir, guardar en PDF, llevar en el GPS, poner en la agenda o compartir.'}[k];
  return `<div class="cab-passo">${qd(P[2])}<div class="tx"><div class="kick">Etapa ${i+1} de ${PASSOS.length}</div><h2>${P[1]}</h2><p>${txt}</p></div></div>`;
}
function navPasso(k){ const i=PASSOS.findIndex(p=>p[0]===k); const a=PASSOS[i-1], b=PASSOS[i+1];
  return `<div class="navpasso">${a?`<button class="btn sec2" data-act="passo" data-p="${a[0]}">← ${a[1]}</button>`:''}${b?`<button class="btn" data-act="passo" data-p="${b[0]}">${b[1]} →</button>`:''}</div>`; }

function renderPasso(){
  if(mapa){ mapa.remove(); mapa=null; }
  const m=$('#main'); const f=R[passo]; m.innerHTML = cab(passo) + f() + navPasso(passo);
  if(passo==='mapa') montarMapa();
  $$('.passo').forEach(b=>b.classList.toggle('on',b.dataset.p===passo));
}
function refreshNav(){ const st=status(); $$('.passo').forEach(b=>{ const s=b.querySelector('.st'); if(s) s.className='st '+(st.S[b.dataset.p]||''); }); const n=$('.nome-r'); if(n) n.innerHTML=`<b>${esc(T.nome)}</b><span>${T.paradas.length} lugares · ${plano().length} días</span>`; }

/* ---------- painel lateral ---------- */
function renderLado(){
  const el=$('#lado'); if(!el) return;
  const st=status(), pl=plano(), A=alertas(), o=orcamento();
  let kmT=0, co2=0; T.paradas.forEach((p,i)=>{ if(i>0){ const t=trecho(i); kmT+=t.km; co2+=t.co2; } });
  const fim=pl.length?pl[pl.length-1].dt:null; const C=2*Math.PI*34;
  el.innerHTML = `<div class="lado-in"><div>
    <div class="anel"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" stroke="#1f2731" stroke-width="8" fill="none"/><circle cx="42" cy="42" r="34" stroke="${st.pct>=80?'#4cc38a':'#b90000'}" stroke-width="8" fill="none" stroke-dasharray="${C*st.pct/100} ${C}" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="700" font-size="19">${st.pct}%</text></svg>
      <div><b>Preparación de la ruta</b><span>${st.pct<40?'Empezando a tomar forma':st.pct<80?'Bien encaminada':'Casi lista para partir'}</span></div></div>
    <div class="mini" id="mini"></div>
    <div class="nums">
      <div><b>${pl.length}</b><span>días${fim?' · hasta el '+fim.getDate()+' '+MESES[fim.getMonth()]:''}</span></div>
      <div><b>${fmtN(kmT)}</b><span>km de trayecto</span></div>
      <div><b>${NIVEL_N[nivel()]}</b><span>nivel de la ruta</span></div>
      <div><b>${fmtR(o.total/o.pes)}</b><span>por persona <span class="sim" style="margin:0">simulado</span></span></div>
      <div><b>${st.eqF}/${st.eqT}</b><span>ítems de equipo</span></div>
      <div><b>${st.docF}/${st.docs.length}</b><span>documentos en regla</span></div>
    </div></div><div>
    <h3>Atención</h3><div class="alertas">${A.length?A.map(a=>`<div class="al ${a.n==='bad'?'bad':''}" data-act="passo" data-p="${a.go}" role="button" tabindex="0"><b>${esc(a.t)}</b>${esc(a.d)}</div>`).join(''):'<div class="al ok"><b>Todo bien por ahora</b>Ninguna alerta para esta ruta.</div>'}</div>
  </div></div>`;
  montarMini();
}
function montarMini(){
  if(mini){ mini.remove(); mini=null; }
  const el=$('#mini'); if(!el||!window.L||getComputedStyle(el).display==='none') return;
  mini=L.map(el,{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,tap:false,touchZoom:false});
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{className:'base-sat'}).addTo(mini);
  if(T.paradas.length){ const ll=T.paradas.map(p=>[p.y,p.x]); L.polyline(ll,{color:'#ff4a4a',weight:2,opacity:.9}).addTo(mini); ll.forEach(c=>L.circleMarker(c,{radius:4,color:'#fff',weight:1.5,fillColor:'#b90000',fillOpacity:1}).addTo(mini)); mini.fitBounds(L.latLngBounds(ll).pad(.35),{maxZoom:7}); }
  else mini.setView([10,-20],1);
}
function destruirMapas(){ if(mapa){mapa.remove();mapa=null;} if(mini){mini.remove();mini=null;} }

/* ---------- etapas ---------- */
const R={};
R.ideia=()=>`
  <div class="card"><div class="row">
    <label class="f">Nombre de la ruta<input type="text" data-b="nome" value="${esc(T.nome)}" maxlength="90"></label>
    <label class="f">Fecha de partida<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label></div></div>
  <div class="card"><h3>¿Qué tipo de jornada?</h3><p class="sec">Puedes elegir más de uno. El primero que elijas es el tipo principal.</p>
    <div class="chips">${TIPOS.map(([k,n])=>{ const i=T.tipos.indexOf(k); return `<button class="chip${i>=0?' on':''}" data-act="tipo" data-k="${k}">${n}${i===0?'<span class="pr">principal</span>':''}</button>`; }).join('')}</div></div>
  <div class="card"><h3>¿Por qué esta jornada?</h3><p class="sec">La intención guía las decisiones difíciles. Por ejemplo: "ver la aurora con calma", "hacer mi primera cumbre por encima de 5.000 m", "documentar la pesca artesanal".</p>
    <textarea data-b="intencao" placeholder="Escríbela en una o dos frases">${esc(T.intencao)}</textarea></div>
  <div class="card"><h3>Quién va</h3>
    <div class="chips" style="margin-bottom:14px">${[['solo','Solo'],['dupla','En pareja'],['grupo','En grupo'],['familia','En familia'],['equipe','Equipo de producción']].map(([k,n])=>`<button class="chip${T.quem===k?' on':''}" data-act="quem" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="row c3">
      <label class="f">Personas<input type="number" min="1" max="40" data-b="pessoas" data-num value="${T.pessoas}"></label>
      <label class="f">Experiencia del grupo<select data-b="exp">${[['iniciante','Principiante'],['intermediario','Intermedia'],['experiente','Con experiencia'],['expert','Mucha experiencia']].map(([k,n])=>`<option value="${k}"${T.exp===k?' selected':''}>${n}</option>`).join('')}</select></label>
      <label class="f">Ritmo<select data-b="ritmo">${[['tranquilo','Tranquilo'],['moderado','Moderado'],['intenso','Intenso']].map(([k,n])=>`<option value="${k}"${T.ritmo===k?' selected':''}>${n}</option>`).join('')}</select></label>
    </div></div>
  ${T.rota?insp():''}`;
function insp(){ const r=D.rotas.find(x=>x.id===T.rota); if(!r) return '';
  return `<div class="card alt"><span class="kick">Inspiración</span><h3 style="margin:6px 0 8px">${esc(r.n)}</h3><p class="sec">${esc(r.quem)} · ${esc(r.per)}${r.dados?' · '+esc(r.dados):''}</p><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk||'Leer el perfil en la WAS')}</a></p>`:''}</div>`; }

R.mapa=()=>{
  const lay=T.camadas||D.layers.map(l=>l.k);
  return `<div class="mapa-wrap">
    <div class="mapa-barra"><div class="busca"><input type="search" id="busca" placeholder="Buscar lugar, país o actividad (ej.: ballena, Nepal, cañón)" autocomplete="off"><div class="res-busca" id="res" hidden></div></div>
      <button class="btn peq sec2" data-act="livre">${svg('pin')}Marcar punto libre</button></div>
    <div class="camadas">${D.layers.map(l=>`<button class="chip cam ${lay.includes(l.k)?'on':'off'}" data-act="camada" data-k="${l.k}"><span class="bol" style="background:${l.cor}"></span>${esc(l.nome)} <span class="cap">${l.n}</span></button>`).join('')}
      <button class="chip cam ${T.verRotas?'on':'off'}" data-act="verRotas"><span class="bol" style="background:#ffcf6b"></span>Rutas históricas <span class="cap">${D.rotas.length}</span></button></div>
    <div id="mapa"></div><div class="mapa-modo" id="modo">Haz clic en el mapa para marcar un punto libre · <a href="#" data-act="livre-x">cancelar</a></div>
  </div>
  <div class="paradas" id="paradas">${paradasHTML()}</div>`;
};
function paradasHTML(){
  if(!T.paradas.length) return `<div class="vazio">Todavía no hay lugares. Haz clic en un punto del mapa y usa “Agregar a la ruta”, o busca por el nombre.</div>`;
  return `<h3 style="margin:22px 0 12px">Tu trayecto</h3>` + T.paradas.map((p,i)=>{ const r=pontoDe(p);
    let tr=''; if(i>0){ const t=trecho(i); const ant=pontoDe(T.paradas[i-1]);
      tr=`<div class="trecho"><select data-act="modo" data-id="${p.id}" aria-label="Cómo ir">${Object.entries(MODOS).map(([k,M])=>`<option value="${k}"${t.m===k?' selected':''}>${M.n}</option>`).join('')}</select>
      <span class="info">${fmtN(t.km)} km · ${t.M.hd? t.dias+' día'+(t.dias>1?'s':'')+' · '+t.M.n.toLowerCase() : (t.h<1?'menos de 1 h':'unas '+fmtN(t.h)+' h')+(t.dias?' · '+t.dias+' día'+(t.dias>1?'s':'')+' de viaje':'')}</span>
      ${ant&&ant.l==='ME'&&t.m==='aviao'?'<span class="alerta">Intervalo posbuceo incluido</span>':''}</div>`; }
    return tr+`<div class="parada"><div class="num${p.livre?' livre':''}">${i+1}</div>${r&&r.ft?`<div class="ft" style="background-image:url('${esc(r.ft)}')"></div>`:''}
      <div class="inf"><b>${esc(p.n)}</b><span class="loc">${r?esc(LAY[r.l].nome)+' · '+esc(r.pa)+(r.alt?' · '+fmtN(r.alt)+' m':'')+' · '+esc(difLabel(p)):'Punto libre'+(p.pa?' · '+esc(paT(p.pa)):'')}</span>
      ${r&&r.g?`<div><a href="${esc(r.g)}" target="_blank" rel="noopener" class="cap">Guía del destino en la WAS ↗</a></div>`:''}</div>
      <div class="ctl"><label class="dias" title="Días en este lugar"><input type="number" min="0" max="60" value="${p.dias|0}" data-act="dias" data-id="${p.id}" aria-label="Días en ${esc(p.n)}"></label><span class="cap">días</span>
      <button class="ico-btn" data-act="sobe" data-id="${p.id}" aria-label="Subir"${i===0?' disabled':''}>${svg('cima')}</button><button class="ico-btn" data-act="desce" data-id="${p.id}" aria-label="Bajar"${i===T.paradas.length-1?' disabled':''}>${svg('baixo')}</button>
      <button class="ico-btn" data-act="tira" data-id="${p.id}" aria-label="Quitar de la ruta">${svg('lixo')}</button></div></div>`; }).join('');
}
let modoLivre=false, grpL={}, linhaT=null, pinos=null, rotasL=null;
function montarMapa(){
  if(!window.L){ $('#mapa').innerHTML='<div class="vazio" style="margin:20px">El mapa necesita internet para cargar.</div>'; return; }
  mapa=L.map('mapa',{worldCopyJump:true,minZoom:2,zoomSnap:.5}).setView([5,-20],2);
  const sat=L.layerGroup([L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,className:'base-sat',attribution:'Imágenes © Esri, Maxar, Earthstar Geographics'}),
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,opacity:.85})]);
  const ruas=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,className:'base-osm',attribution:'© colaboradores de OpenStreetMap'});
  sat.addTo(mapa); L.control.layers({'Satélite':sat,'Calles y senderos':ruas},null,{position:'topright'}).addTo(mapa);
  L.control.scale({imperial:false}).addTo(mapa);
  grpL={}; D.layers.forEach(l=>grpL[l.k]=L.layerGroup());
  D.pts.forEach(p=>{ const L0=LAY[p.l]; const m=L.circleMarker([p.y,p.x],{radius:p.l==='PQ'?6:5,color:'#000',weight:1,fillColor:L0.cor,fillOpacity:.95});
    m.bindPopup(()=>popHTML(p),{maxWidth:320,minWidth:280,autoPanPadding:[30,30]}); m.on('mouseover',()=>m.setRadius(8)); m.on('mouseout',()=>m.setRadius(p.l==='PQ'?6:5)); m.addTo(grpL[p.l]); });
  const lay=T.camadas||D.layers.map(l=>l.k); lay.forEach(k=>grpL[k]&&grpL[k].addTo(mapa));
  rotasL=L.layerGroup(); D.rotas.forEach(r=>{ const ll=desenrola(r.pts); L.polyline(ll,{color:CORR[r.c],weight:1.6,opacity:.75,dashArray:r.c==='RA'?'5 6':null}).bindPopup(`<div class="pop"><div class="cx"><span class="kick">${esc(D.cats[r.c])} · ${esc(r.per)}</span><h4>${esc(r.n)}</h4><div class="loc">${esc(r.quem)}</div><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk)} ↗</a></p>`:''}</div></div>`,{maxWidth:320}).addTo(rotasL); });
  if(T.verRotas) rotasL.addTo(mapa);
  pinos=L.layerGroup().addTo(mapa); desenharTrajeto(true);
  mapa.on('click',ev=>{ if(!modoLivre) return; const n='Punto libre '+(T.paradas.filter(p=>p.livre).length+1);
    T.paradas.push({id:uid(),ref:null,n,x:+ev.latlng.lng.toFixed(4),y:+ev.latlng.lat.toFixed(4),dias:1,livre:true,pa:''}); modoLivre=false; $('#modo').classList.remove('on'); mudou(true);
    toast('Punto libre agregado. Cámbiale el nombre en “Tu trayecto”.'); setTimeout(()=>renomearUltimo(),50); });
  mapa.on('popupopen',e=>{ const b=e.popup.getElement().querySelector('[data-act="add"]'); if(b) b.focus({preventScroll:true}); });
  setTimeout(()=>mapa&&mapa.invalidateSize(),60);
}
function desenrola(pts){ const out=[]; let off=0, prev=null; pts.forEach(([x,y])=>{ let X=x+off; if(prev!=null){ while(X-prev>180){off-=360;X-=360;} while(prev-X>180){off+=360;X+=360;} } out.push([y,X]); prev=X; }); return out; }
function renomearUltimo(){ const p=T.paradas[T.paradas.length-1]; const box=$$('.parada').pop(); if(!box) return; const b=box.querySelector('.inf b'); b.innerHTML=`<input type="text" value="${esc(p.n)}" data-act="renome" data-id="${p.id}" style="min-height:36px;padding:6px 10px">`; const i=b.querySelector('input'); i.focus(); i.select(); }
function desenharTrajeto(fit){
  if(!mapa||!pinos) return; pinos.clearLayers();
  const ll=[]; let prev=null;
  T.paradas.forEach((p,i)=>{ let X=p.x; if(prev!=null){ while(X-prev>180) X-=360; while(prev-X>180) X+=360; } prev=X; ll.push([p.y,X]);
    L.marker([p.y,X],{icon:L.divIcon({className:'',html:`<div class="pino${p.livre?' livre':''}">${i+1}</div>`,iconSize:[28,28],iconAnchor:[14,14]}),zIndexOffset:1000}).bindTooltip(esc(p.n),{direction:'top',offset:[0,-14]}).addTo(pinos); });
  if(ll.length>1){ for(let i=1;i<ll.length;i++){ const t=trecho(i); L.polyline([ll[i-1],ll[i]],{color:t.m==='aviao'?'#ff8f8f':'#ff3b3b',weight:t.m==='aviao'?2:3,opacity:.95,dashArray:t.m==='aviao'?'6 7':(t.M.hd?'2 6':null)}).addTo(pinos); } }
  if(fit&&ll.length) mapa.fitBounds(L.latLngBounds(ll).pad(.25),{maxZoom:7});
}
function popHTML(p){ const L0=LAY[p.l]; const naRota=T.paradas.some(s=>s.ref===refDe(p));
  return `<div class="pop">${p.ft?`<div class="ft" style="background-image:url('${esc(p.ft)}')"></div>`:''}<div class="cx">
    <span class="kick" style="color:${L0.cor}">${esc(L0.nome)}</span><h4>${esc(p.n)}</h4><div class="loc">${esc([p.r,p.pa].filter(Boolean).join(' · '))}${p.alt?' · '+fmtN(p.alt)+' m':''}</div>
    <div class="tags" style="margin-top:8px"><span class="tag">${esc((L0.dif&&L0.dif[p.d])||NIVEL_N[p.d])}</span>${p.dias?`<span class="tag">${esc(p.dias)}</span>`:''}${p.km?`<span class="tag">${esc(p.km)} km</span>`:''}${p.me&&p.me.length?`<span class="tag">Mejor: ${p.me.map(m=>MESES[m-1]).join(', ')}</span>`:''}</div>
    ${p.es&&p.es.length?`<p><b>Especies:</b> ${esc(p.es.join(', '))}</p>`:''}
    <p>${esc(p.f)}</p>
    ${p.pf?`<p class="cap">Explorador: <a href="${esc(p.pf[1])}" target="_blank" rel="noopener">${esc(p.pf[0])} ↗</a></p>`:''}
    ${p.g?`<p class="cap"><a href="${esc(p.g)}" target="_blank" rel="noopener">Guía completa en la WAS ↗</a></p>`:''}
    <div class="btns">${naRota?'<span class="tag r">Ya está en la ruta</span>':`<button class="btn peq" data-act="add" data-i="${p.i}">${svg('mais')}Agregar a la ruta</button>`}</div>
    ${p.ft?`<div class="cr">Foto: ${esc(p.fa)} · ${esc(p.fl)}</div>`:''}</div></div>`; }

R.epoca=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const datas=pl.map(d=>d.dt);
  const luas=[]; let last=null; datas.forEach(dt=>{ const l=lua(new Date(dt.valueOf())); const tipo=l.il<.06?'Luna nueva':l.il>.94?'Luna llena':null; if(tipo&&tipo!==last){ luas.push([dt,tipo,l.il]); } last=tipo; });
  return `<p class="sec" style="max-width:820px">Mejores meses: datos del Mapa de la aventura. Luz y luna: cálculo astronómico real <span class="real">real</span>. Horarios en hora solar local aproximada, que puede diferir del huso oficial en hasta cerca de 1 hora. La temperatura y la lluvia se sumarían aquí en el producto final, a partir de normales climatológicas.</p>
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p)||pl.find(x=>x.id&&x.id.includes(p.id)); const dt=d?d.dt:addDias(T.inicio,0); const m=dt.getMonth()+1;
    const lz=luzDia(dt,p); let solH='';
    if(lz.polar) solH=`<div class="sol"><div><b>${lz.polar==='dia'?'Sol de medianoche':'Noche polar'}</b><span>${lz.polar==='dia'?'el sol no se pone en esta fecha':'el sol no sale en esta fecha'}</span></div></div>`;
    else { const s=lz.s; const g=Array.isArray(s.dourada)?s.dourada:null; const c=Array.isArray(s.civil)?s.civil:null;
      const h0=x=>{ const t=new Date(x.valueOf()+p.x/15*3600e3); return t.getUTCHours()+t.getUTCMinutes()/60; };
      solH=`<div class="sol"><div><b>${horaSolar(s.nascer[0],p.x)}</b><span>amanecer</span></div><div><b>${horaSolar(s.nascer[1],p.x)}</b><span>atardecer</span></div><div><b>${fmtN(lz.h,1)} h</b><span>de luz</span></div><div><b>${g?horaSolar(g[1],p.x):'—'}</b><span>inicio de la hora dorada de la tarde</span></div></div>
      <div class="barra-luz" title="Noche, crepúsculo y día a lo largo de las 24 horas">${c?`<i style="left:${h0(c[0])/24*100}%;width:${(h0(s.nascer[0])-h0(c[0]))/24*100}%;background:#3c5a8a"></i>`:''}<i style="left:${h0(s.nascer[0])/24*100}%;width:${(h0(s.nascer[1])-h0(s.nascer[0]))/24*100}%;background:#c9a24a"></i>${c?`<i style="left:${h0(s.nascer[1])/24*100}%;width:${(h0(c[1])-h0(s.nascer[1]))/24*100}%;background:#3c5a8a"></i>`:''}</div>
      <div class="leg" style="margin-top:6px"><span>0 h</span><span style="margin-left:auto">24 h</span></div>`; }
    const ok=!r||!r.me||!r.me.length||r.me.includes(m);
    return `<div class="card"><div style="display:flex;gap:12px;align-items:baseline;flex-wrap:wrap"><h3 style="margin:0">${esc(p.n)}</h3><span class="sec">llegada ${fmtD(dt)} · latitud ${fmtN(Math.abs(p.y),1)}° ${p.y>=0?'N':'S'}</span></div>
      ${r&&r.me&&r.me.length?`<div class="meses">${MESES.map((n,i)=>`<span class="${r.me.includes(i+1)?'b':''}${i+1===m?' v'+(ok?'':' ruim'):''}">${n}</span>`).join('')}</div>
      <div class="leg"><span><i style="background:#1f5a3c"></i>mejor época según la WAS</span><span><i style="outline:2px solid #fff;outline-offset:-2px"></i>mes de tu visita</span></div>
      ${ok?'<p class="st-ok" style="margin:8px 0 0;font-size:15px">Llegas en la mejor época.</p>':`<p class="st-warn" style="margin:8px 0 0;font-size:15px">Llegas fuera de la mejor época. Conviene cambiar la fecha o el orden de los lugares.</p>`}`:'<p class="cap">Sin indicación de mejor época para este punto.</p>'}
      ${solH}</div>`; }).join('')}
  <div class="card"><h3>Luna durante el viaje <span class="real">real</span></h3><p class="sec">La luna nueva es la mejor ventana para cielos estrellados y la Vía Láctea. La luna llena ilumina los paisajes nocturnos y puede dificultar la observación de estrellas.</p>
    <div class="lua">${luas.length?luas.map(([dt,t,il])=>`<span class="${t==='Luna nueva'?'boa':''}">${t} · ${fmtD(dt)}</span>`).join(''):'<span>Ninguna luna nueva o llena en las fechas del viaje.</span>'}</div></div>`;
};
function vazioMapa(){ return `<div class="vazio">Elige al menos un lugar en la etapa “Lugares y trayecto”.<div class="btns"><button class="btn" data-act="passo" data-p="mapa">Ir al mapa</button></div></div>`; }

R.dias=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano();
  return `<div class="card"><div class="row c3">
    <label class="f">Fecha de partida<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label>
    <label class="f">Días de margen al final<input type="number" min="0" max="10" data-b="margem" data-num value="${T.margem}"></label>
    <label class="f">Aclimatación automática<select data-b="aclim" data-bool><option value="1"${T.aclim?' selected':''}>Activada (por encima de 3.000 m)</option><option value="0"${!T.aclim?' selected':''}>Desactivada</option></select></label></div>
    <p class="ajuda">El plan se rehace solo cuando cambias lugares, días o trayectos. Las notas de cada día quedan guardadas.</p></div>
  <div class="card"><div class="leg" style="margin-bottom:14px"><span><i style="border:2px solid var(--red);border-radius:50%"></i>en el lugar</span><span><i style="border:2px solid #64aaff;border-radius:50%"></i>traslado</span><span><i style="border:2px solid var(--warn);border-radius:50%"></i>aclimatación</span><span><i style="border:2px solid #6e7884;border-radius:50%"></i>margen y seguridad</span></div>
  <div class="tl">${pl.map((d,i)=>`<div class="d ${d.tipo}"><div class="dt">Día ${i+1} · ${fmtD(d.dt)}</div><div class="tt">${esc(d.t)}</div>${d.ds?`<div class="ds">${esc(d.ds)}</div>`:''}
    <input type="text" placeholder="Nota del día: alojamiento, horario, contacto…" value="${esc(T.notas[d.id]||'')}" data-act="nota" data-id="${d.id}"></div>`).join('')}</div></div>`;
};

R.preparo=()=>{
  if(!T.paradas.length) return vazioMapa();
  const nv=nivel(), hab=habilidades(); const sem={1:2,2:4,3:8,4:12,5:20}[nv]||2;
  const hoje=new Date(); const ini=new Date(T.inicio+'T12:00:00'); const falta=Math.round((ini-hoje)/(7*864e5));
  const fases=[['Base aeróbica','Caminata, carrera suave, bici o natación, 3 a 4 veces por semana, aumentando el volumen de a poco.'],['Fuerza y resistencia','Piernas, core y espalda. Subidas con la mochila cargada y entrenamientos largos el fin de semana.'],['Específico','Simular la jornada: desniveles, peso real de la mochila, frío, agua o altura, según la ruta.'],['Puesta a punto','Reducir el volumen en la última semana, dormir bien y revisar el equipo.']];
  return `<div class="card"><h3>Nivel de la ruta: ${NIVEL_N[nv]}</h3><p class="sec">El nivel es el del lugar más exigente, según las escalas de dificultad de cada capa del Mapa de la aventura.</p>
    <div class="tab-wrap"><table class="tab"><thead><tr><th>Lugar</th><th>Capa</th><th>Dificultad</th></tr></thead><tbody>${T.paradas.filter(pontoDe).map(p=>{ const r=pontoDe(p); return `<tr><td>${esc(p.n)}</td><td>${esc(LAY[r.l].nome)}</td><td>${'●'.repeat(r.d)}<span style="color:#333">${'●'.repeat(5-r.d)}</span> ${esc(difLabel(p))}</td></tr>`; }).join('')}</tbody></table></div></div>
  <div class="card"><h3>Habilidades y certificaciones</h3>${hab.length?`<div class="ck">${hab.map(h=>ckItem('hb:'+h.k,h.t,'Por: '+h.p)).join('')}</div>`:'<p class="sec">Ninguna habilidad técnica exigida por los lugares elegidos.</p>'}</div>
  <div class="card"><h3>Plan de entrenamiento sugerido: ${sem} semanas</h3>
    <p class="sec">${falta>0?`Faltan unas ${falta} semanas para la partida. `+(falta<sem?'<span class="st-warn">El tiempo es corto para el nivel de la ruta. Considera postergar o elegir lugares más suaves.</span>':'Hay tiempo para prepararse con calma.'):'Elige una fecha de partida en el futuro.'}</p>
    <div class="tl" style="margin-top:14px">${fases.map((f,i)=>`<div class="d"><div class="dt">Semanas ${Math.round(sem*i/4)+1} a ${Math.round(sem*(i+1)/4)}</div><div class="tt">${f[0]}</div><div class="ds">${f[1]}</div></div>`).join('')}</div></div>
  <div class="card"><h3>Autoevaluación</h3><div class="ck">${[['auto:sau','Me hice un chequeo médico y, si la ruta pasa de 3.000 m o incluye buceo, lo hablé con un médico'],['auto:car','Puedo caminar 6 horas con mochila sin agotarme'],['auto:nad','Sé nadar con seguridad'],['auto:alt','Ya estuve por encima de 3.000 m y sé cómo reacciona mi cuerpo'],['auto:ok','Leí las exigencias de cada lugar y creo que el grupo está a la altura']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};
function ckItem(k,t,por,w){ const on=!!T.ck[k]; return `<label class="${on?'feito':''}"><input type="checkbox" data-act="ck" data-k="${esc(k)}"${on?' checked':''}><span class="tx">${esc(t)}${por?`<span class="por">${esc(por)}</span>`:''}</span>${w?`<span class="w">${w}</span>`:''}</label>`; }

R.equip=()=>{
  const G=equipamento(); let pt=0, pf=0; G.forEach(g=>g.its.forEach(i=>{ pt+=i.w; if(T.ck['eq:'+i.n]) pf+=i.w; }));
  return `<div class="card alt"><div class="row"><label class="f">¿Llevarás dron?<select data-b="drone" data-bool><option value="0"${!T.drone?' selected':''}>No</option><option value="1"${T.drone?' selected':''}>Sí</option></select></label>
    <div><span class="kick">Peso estimado de la lista</span><div style="font-family:var(--fT);font-size:26px;color:#fff;font-weight:700">${fmtN(pt/1000,1)} kg <span class="sim">simulado</span></div><span class="cap">sin la ropa de todos los días ni los ítems del grupo</span></div></div></div>
  ${G.map(g=>`<div class="card grupo-ck"><h4>${esc(g.t)}<small>${esc(g.por)}</small></h4><div class="ck">${g.its.map(i=>ckItem('eq:'+i.n,i.n,'',i.w?fmtN(i.w)+' g':'')).join('')}</div></div>`).join('')}
  <div class="card"><h3>Agregar ítem</h3><div class="add-item"><input type="text" id="novoItem" placeholder="Ej.: binoculares 10x42"><button class="btn peq" data-act="addItem">${svg('mais')}Agregar</button></div></div>`;
};

R.docs=()=>{
  if(!T.paradas.length) return vazioMapa();
  const L0=documentos();
  return `<p class="sec" style="max-width:820px">Orientación general armada según los países, lugares y tipo de jornada. Las reglas y valores cambian: confirma siempre en la fuente oficial indicada. <span class="sim">reglas simplificadas</span></p>
  <div class="card">${L0.map(d=>{ const s=T.docs[d.k]||'fazer'; return `<div class="doc"><div><b>${esc(d.t)}</b><p>${esc(d.p)}</p><div class="onde">Dónde: ${esc(d.onde)}</div><div class="por">${esc(d.por)}</div></div>
    <select data-act="doc" data-k="${d.k}" class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':''}" aria-label="Estado">${[['fazer','Por hacer'],['pedido','Pedido, en espera'],['ok','En regla'],['na','No corresponde']].map(([k,n])=>`<option value="${k}"${s===k?' selected':''}>${n}</option>`).join('')}</select></div>`; }).join('')}</div>`;
};

R.saude=()=>{
  const nv=nivel(); const alt=Math.max(0,...T.paradas.map(altDe));
  const cob=[['med','Gastos médicos y hospitalarios'],['evac','Rescate y evacuación aeromédica'+(nv>=4?' (esencial en esta ruta)':'')],['alt','Actividades en altura'+(alt?' hasta '+fmtN(alt)+' m':'')],['merg','Buceo autónomo (seguro específico, como DAN)'],['radical','Deportes de aventura'],['canc','Cancelación e interrupción'],['bag','Equipaje y equipo']];
  const rel=['med','evac']; if(alt>=2500) rel.push('alt'); if(temL('ME','NF')) rel.push('merg'); if(nv>=3||temL('AT','X')) rel.push('radical');
  return `<div class="card"><h3>Seguro: coberturas que pide la ruta</h3><div class="ck">${cob.filter(c=>rel.includes(c[0])||['canc','bag'].includes(c[0])).map(([k,n])=>`<label class="${T.seguro[k]?'feito':''}"><input type="checkbox" data-act="seg" data-k="${k}"${T.seguro[k]?' checked':''}><span class="tx">${esc(n)}${rel.includes(k)?'<span class="por">Recomendado para esta ruta</span>':''}</span></label>`).join('')}</div></div>
  <div class="card"><h3>Salud</h3><div class="ck">${[
    ['sa:con','Consulta de medicina del viajero (4 a 8 semanas antes)'],
    ...(alt>=3000?[['sa:alt','Plan para el mal de altura: señales de alerta, descenso inmediato, medicación conversada con el médico']]:[]),
    ...(tropical()?[['sa:trop','Protección contra mosquitos e información sobre malaria y dengue en la región']]:[]),
    ...(frio()?[['sa:frio','Prevención de hipotermia y congelamiento (capas, manos y pies secos)']]:[]),
    ...(temL('ME','NF')?[['sa:dci','Cámara hiperbárica más cercana anotada e intervalo antes de volar respetado']]:[]),
    ['sa:kit','Botiquín del grupo y alguien con curso de primeros auxilios en zonas remotas'],
    ['sa:rem','Medicamentos de uso continuo por duplicado, en el equipaje de mano']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>
  <div class="card"><h3>Contactos de emergencia</h3><p class="sec">Quién se queda en casa siguiendo el viaje, y a quién hay que avisar si algo sale mal.</p>
    ${T.contatos.map((c,i)=>`<div class="pessoa"><label class="f">Nombre<input type="text" value="${esc(c.n)}" data-act="ct" data-i="${i}" data-f="n"></label><label class="f">Teléfono<input type="text" value="${esc(c.tel)}" data-act="ct" data-i="${i}" data-f="tel"></label><label class="f">Relación<input type="text" value="${esc(c.rel)}" data-act="ct" data-i="${i}" data-f="rel"></label><button class="ico-btn" data-act="ctx" data-i="${i}" aria-label="Quitar">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="ct+">${svg('mais')}Agregar contacto</button></div></div>
  <div class="card"><h3>Comunicación y plan de regreso</h3><div class="row">
    <label class="f">Cómo se comunicarán en zonas sin señal<select data-b="com">${['Celular con chip local','Comunicador satelital (mensajes y SOS)','Teléfono satelital','Radio del operador'].map(o=>`<option${T.com===o?' selected':''}>${o}</option>`).join('')}</select></label>
    <label class="f">Si no hay noticias en…<select data-b="checkin">${['12 horas','24 horas','48 horas'].map(o=>`<option${T.checkin===o?' selected':''}>${o}</option>`).join('')}</select></label></div>
    <p class="ajuda">El contacto de emergencia recibe la ruta día a día y avisa al seguro, al operador y al consulado si el grupo pasa ese plazo sin dar noticias.</p></div>`;
};

R.orc=()=>{
  if(!T.paradas.length) return vazioMapa();
  const o=orcamento(); const max=Math.max(...o.cats.map(c=>c[2]),1);
  return `<p class="sec" style="max-width:820px">Estimación de ejemplo, calculada según la región de cada lugar, los días, trayectos y actividades. Cambia cualquier valor por tu cotización. Valores en reales brasileños (R$). <span class="sim">simulado</span></p>
  <div class="card"><div class="barras">${o.cats.map(c=>`<div class="b"><span>${c[1]}</span><i style="width:${Math.max(2,c[2]/max*100)}%"></i><span>${fmtR(c[2])}</span></div>`).join('')}<div class="b"><span>Reserva del 15%</span><i style="width:${o.cont/max*100}%;background:#3c4654"></i><span>${fmtR(o.cont)}</span></div></div>
    <div class="total"><span class="sec">Total para ${o.pes} persona${o.pes>1?'s':''}</span><b>${fmtR(o.total)}</b><span class="sec">${fmtR(o.total/o.pes)} por persona</span></div></div>
  <div class="card"><h3>Ajustar valores</h3><div class="row c3">${o.cats.map(c=>`<label class="f">${c[1]}<input type="number" min="0" step="50" data-act="orc" data-k="${c[0]}" value="${T.orc[c[0]]!=null&&T.orc[c[0]]!==''?T.orc[c[0]]:''}" placeholder="${Math.round(c[2])}"></label>`).join('')}</div>
    <div class="ck" style="margin-top:12px">${`<label class="${T.orcOk?'feito':''}"><input type="checkbox" data-act="orcOk"${T.orcOk?' checked':''}><span class="tx">Revisé el presupuesto con cotizaciones reales</span></label>`}</div></div>
  <div class="card alt"><h3>Costo por región</h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Lugar</th><th>Región</th><th class="n">Costo diario de referencia</th></tr></thead><tbody>${T.paradas.map(p=>`<tr><td>${esc(p.n)}</td><td>${IDX_N[regiao(p)]}</td><td class="n">${fmtR(IDX[regiao(p)]*.85)}</td></tr>`).join('')}</tbody></table></div></div>`;
};

R.equipe=()=>{
  const papeis=['Líder de la expedición','Navegación','Primeros auxilios','Fotografía','Cámara y dirección','Sonido','Logística','Cocina','Participante'];
  const parc=[];
  T.paradas.filter(pontoDe).slice(0,6).forEach(p=>{ const r=pontoDe(p); const tipo={CU:'Guía de montaña certificado',ME:'Centro de buceo',TK:'Guía de trekking',FA:'Guía naturalista',BA:'Operador de avistaje de ballenas',P:'Operador polar (IAATO)',VU:'Guía vulcanológico',AT:'Escuela e instructores acreditados',O:'Alquiler de 4x4 con apoyo',PQ:'Guía del parque',NF:'Centro de buceo en naufragios'}[r.l]||'Operador local';
    parc.push({n:tipo, l:p.n}); });
  return `<div class="card"><h3>Quién va</h3>${T.equipe.map((m,i)=>`<div class="pessoa"><label class="f">Nombre<input type="text" value="${esc(m.n)}" data-act="eq" data-i="${i}" data-f="n"></label><label class="f">Rol<select data-act="eq" data-i="${i}" data-f="papel">${papeis.map(p=>`<option${m.papel===p?' selected':''}>${p}</option>`).join('')}</select></label><label class="f">Contacto<input type="text" value="${esc(m.c)}" data-act="eq" data-i="${i}" data-f="c"></label><button class="ico-btn" data-act="eqx" data-i="${i}" aria-label="Quitar">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="eq+">${svg('mais')}Agregar persona</button></div></div>
  ${parc.length?`<div class="card"><h3>Guías y operadores sugeridos <span class="sim">ejemplo</span></h3><p class="sec">En el producto final, esta lista vendría de una red curada por la WAS: operadores evaluados, guías acreditados y asociados que ya estuvieron en cada lugar.</p>
    <div class="parc">${parc.map(x=>`<div><b>${esc(x.n)}</b><span>${esc(x.l)}</span><span class="cap">Evaluación, credenciales y contacto aparecerían aquí</span></div>`).join('')}</div></div>`:''}
  <div class="perg"><b>Pregunta para la WAS:</b> ¿la recomendación de guías y operadores sería abierta a todos o un beneficio para los apoyadores? Los operadores aliados podrían tener un sello WAS de buenas prácticas.</div>`;
};

R.imagens=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const fmt={h265:['4K H.265 (100 Mb/s)',.75],prores:['4K ProRes 422 HQ',5.3],raw:['Fotos RAW (cada 100 fotos)',5],h264:['HD H.264 (50 Mb/s)',.37]};
  const diasF=pl.filter(d=>d.p).length; const c=T.cine; const gbDia=(fmt[c.fmt]||fmt.h265)[1]*60*(c.horas||0)*(c.cams||1); const tot=gbDia*diasF;
  const sug={VU:['Lava o fumarola en la hora azul','Silueta del cráter con estrellas'],BA:['Salto de la ballena con teleobjetivo','Cola con luz lateral de la mañana'],FA:['Retrato a la altura de los ojos del animal','Comportamiento: alimentación, crías, interacción'],CU:['Montaña con la primera luz (alpenglow)','Escala humana: cordada en la arista'],TK:['Sendero serpenteante con una persona pequeña en el cuadro','Campamento iluminado de noche'],ME:['Silueta contra la superficie','Macro en el arrecife'],P:['Hielo con sol bajo','Barco o carpa para dar escala'],NF:['Proa del barco con buzo para dar escala'],PQ:['El paisaje emblemático del parque en la hora dorada'],AT:['Acción a alta velocidad y ángulo bajo'],O:['Vehículo levantando polvo contra el sol'],L:['Hito del sendero'],X:['Horizonte vacío y el barco o nadador'],B2:['Camino visto desde arriba con el ciclista'],E2:['Lugar histórico con un detalle que cuente la historia']};
  return `${!(tem('fotografica')||tem('cinema'))?'<div class="perg">Esta etapa es opcional para tu tipo de jornada. Aparece completa en rutas fotográficas y cinematográficas.</div>':''}
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p); const dt=d?d.dt:new Date(T.inicio+'T12:00:00'); const lz=luzDia(dt,p); const s=lz.s; const lst=T.imagens[p.id]||[];
    let luz=''; if(lz.polar) luz=lz.polar==='dia'?'Sol de medianoche: luz baja y dorada cerca de la medianoche solar.':'Noche polar: luz azul del crepúsculo al mediodía y chance de aurora.';
    else { const g=Array.isArray(s.dourada)?s.dourada:null, c2=Array.isArray(s.civil)?s.civil:null; luz=`Hora azul de la mañana ${c2?horaSolar(c2[0],p.x):'—'} a ${horaSolar(s.nascer[0],p.x)} · hora dorada hasta ${g?horaSolar(g[0],p.x):'—'} · dorada de la tarde desde ${g?horaSolar(g[1],p.x):'—'} · atardecer ${horaSolar(s.nascer[1],p.x)}`; }
    const l=lua(dt);
    return `<div class="card"><h3>${esc(p.n)}</h3><p class="sec" style="margin-bottom:6px">${fmtD(dt)} · ${luz} <span class="real">real</span></p><p class="cap">Luna ${Math.round(l.il*100)}% iluminada${l.il<.25?' · buena noche para estrellas':''}</p>
      ${r&&sug[r.l]?`<div class="chips" style="margin:10px 0">${sug[r.l].map(x=>`<button class="chip cam" data-act="cena+" data-id="${p.id}" data-t="${esc(x)}">${svg('mais')}${esc(x)}</button>`).join('')}</div>`:''}
      <div class="ck">${lst.map((x,i)=>`<label class="${x.ok?'feito':''}"><input type="checkbox" data-act="cenaok" data-id="${p.id}" data-i="${i}"${x.ok?' checked':''}><span class="tx">${esc(x.t)}</span><button class="ico-btn" data-act="cenax" data-id="${p.id}" data-i="${i}" aria-label="Quitar" style="margin-left:auto">${svg('lixo')}</button></label>`).join('')}</div>
      <div class="add-item"><input type="text" placeholder="Nueva escena o foto deseada" data-cena="${p.id}"><button class="btn peq" data-act="cena+" data-id="${p.id}">${svg('mais')}Agregar</button></div></div>`; }).join('')}
  <div class="card"><h3>Almacenamiento y respaldo</h3><div class="row c3">
    <label class="f">Formato principal<select data-act="cine" data-f="fmt">${Object.entries(fmt).map(([k,v])=>`<option value="${k}"${c.fmt===k?' selected':''}>${v[0]}</option>`).join('')}</select></label>
    <label class="f">Cámaras grabando<input type="number" min="1" max="10" value="${c.cams}" data-act="cine" data-f="cams"></label>
    <label class="f">${c.fmt==='raw'?'Cientos de fotos por día':'Horas grabadas por día'}<input type="number" min="0" max="24" step=".5" value="${c.horas}" data-act="cine" data-f="horas"></label></div>
    <div class="total"><span class="sec">${diasF} días de captura · ${fmtN(gbDia)} GB por día</span><b>${fmtN(tot/1000,1)} TB</b><span class="sec">${fmtN(tot*3/1000,1)} TB con respaldo 3-2-1 (tres copias)</span></div></div>
  <div class="card"><h3>Autorizaciones de imagen</h3><div class="ck">${[['im:ces','Cesiones de imagen para personas identificables'],['im:com','Acuerdo con comunidades tradicionales e indígenas antes de fotografiar o filmar'],['im:loc','Autorización de locaciones y de áreas protegidas'],['im:dr','Dron registrado y vuelo autorizado en cada lugar']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};

R.conduta=()=>{
  if(!T.paradas.length) return vazioMapa();
  let tot=0; const linhas=T.paradas.slice(1).map((p,i)=>{ const t=trecho(i+1); tot+=t.co2; return `<tr><td>${esc(t.a.n)} → ${esc(t.b.n)}</td><td>${t.M.n}</td><td class="n">${fmtN(t.km)} km</td><td class="n">${fmtN(t.co2)} kg</td></tr>`; }).join('');
  const regras=[];
  if(temL('BA')) regras.push(['Ballenas','Respeta la distancia mínima de la ley local. En Brasil, las embarcaciones deben quedarse al menos a 100 m de las ballenas (Portaria Ibama 117/1996), con el motor en neutro cerca de ellas.']);
  if(temL('FA')) regras.push(['Fauna','No alimentes, no llames y no rodees a los animales. Con primates, usa barbijo y mantén la distancia: se contagian nuestras enfermedades.']);
  if(temL('ME','NF')) regras.push(['Arrecifes y naufragios','Control de flotabilidad, nada de tocar el coral, protector solar seguro para arrecifes y nada retirado de los naufragios.']);
  if(temL('P')) regras.push(['Polos','Sigue las pautas de IAATO: 5 m de los pingüinos, botas lavadas entre desembarcos, ningún residuo en tierra.']);
  if(temL('CU','TK','L','VU')) regras.push(['Montaña y sendero','Lleva de vuelta toda la basura, incluso la orgánica y el papel higiénico. Quédate en el sendero y usa baños secos donde haya.']);
  if(tem('cultural')) regras.push(['Comunidades','Pide permiso antes de fotografiar a las personas, contrata guías y servicios locales y respeta los lugares sagrados.']);
  return `<div class="card"><h3>Huella de carbono de los trayectos <span class="sim">factores aproximados</span></h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Tramo</th><th>Cómo</th><th class="n">Distancia</th><th class="n">CO₂ por persona</th></tr></thead><tbody>${linhas||'<tr><td colspan="4">Todavía no hay trayectos.</td></tr>'}</tbody></table></div>
    <div class="total"><span class="sec">Total por persona</span><b>${fmtN(tot/1000,2)} t CO₂</b><span class="sec">${fmtN(tot/1000*T.pessoas,2)} t para el grupo</span></div>
    <p class="ajuda">Para reducir: menos vuelos cortos, tren o autobús cuando se pueda, más días en cada lugar. Para compensar, la WAS podría indicar proyectos de restauración ligados a los lugares del mapa.</p></div>
  ${regras.length?`<div class="card"><h3>Conducta en los lugares de tu ruta</h3>${regras.map(r=>`<div class="doc" style="grid-template-columns:1fr"><div><b>${r[0]}</b><p>${r[1]}</p></div></div>`).join('')}</div>`:''}
  <div class="card"><h3>Principios de mínimo impacto</h3><div class="tl">${['Planifica y prepárate','Camina y acampa en superficies resistentes','Lleva tu basura de vuelta','Deja lo que encuentres','Minimiza el impacto de las fogatas','Respeta la vida silvestre','Sé considerado con otros visitantes'].map((t,i)=>`<div class="d"><div class="tt" style="font-size:16px">${i+1}. ${t}</div></div>`).join('')}</div>
    <p class="cap">Basado en los siete principios de Leave No Trace.</p>
    <div class="ck">${`<label class="${T.compromisso?'feito':''}"><input type="checkbox" data-act="comp"${T.compromisso?' checked':''}><span class="tx">Asumo el compromiso de conducta WAS para esta jornada</span></label>`}</div></div>`;
};

R.revisar=()=>{
  const pl=plano(), o=orcamento(), st=status();
  return `<div class="exp no-print">
    <button data-act="print">${qd('imprimir',1)}<div><b>Imprimir o guardar en PDF</b><span>Dosier completo de la ruta</span></div></button>
    <button data-act="gpx">${qd('pin',1)}<div><b>Descargar GPX</b><span>Lugares y trayecto para GPS y apps de mapas</span></div></button>
    <button data-act="ics">${qd('cal',1)}<div><b>Descargar calendario</b><span>Día a día en tu agenda (.ics)</span></div></button>
    <button data-act="link">${qd('compart',1)}<div><b>Copiar enlace de la ruta</b><span>Quien lo abra recibe una copia</span></div></button>
    <button data-act="json">${qd('baixar',1)}<div><b>Descargar archivo de la ruta</b><span>Para guardar o importar después</span></div></button>
    <button data-act="enviar">${qd('enviar',1)}<div><b>Enviar a la WAS <span class="apoio">apoyador</span></b><span>Pedir la revisión de un especialista (simulado)</span></div></button>
  </div>
  <div class="dossie">
    <div class="card"><span class="kick">${T.tipos.map(t=>TIPO_N[t]).join(' · ')}</span><h2 style="margin:6px 0 10px">${esc(T.nome)}</h2>${T.intencao?`<p class="lead">${esc(T.intencao)}</p>`:''}
      <div class="tab-wrap"><table class="tab"><tbody>
      <tr><td>Fechas</td><td>${pl.length?fmtDL(pl[0].dt)+' al '+fmtDL(pl[pl.length-1].dt)+' · '+pl.length+' días':'—'}</td></tr>
      <tr><td>Grupo</td><td>${T.pessoas} persona${T.pessoas>1?'s':''} · ${({solo:'solo',dupla:'en pareja',grupo:'en grupo',familia:'en familia',equipe:'equipo de producción'})[T.quem]} · ritmo ${({tranquilo:'tranquilo',moderado:'moderado',intenso:'intenso'})[T.ritmo]||T.ritmo}</td></tr>
      <tr><td>Nivel</td><td>${NIVEL_N[nivel()]}</td></tr>
      <tr><td>Lugares</td><td>${T.paradas.map((p,i)=>(i+1)+'. '+esc(p.n)).join(' · ')||'—'}</td></tr>
      <tr><td>Presupuesto</td><td>${fmtR(o.total)} (${fmtR(o.total/o.pes)} por persona) <span class="sim">simulado</span></td></tr>
      <tr><td>Preparación</td><td>${st.pct}% · ${st.docF} de ${st.docs.length} documentos en regla · ${st.eqF} de ${st.eqT} ítems de equipo</td></tr>
      <tr><td>Emergencia</td><td>${T.contatos.map(c=>esc(c.n)+' '+esc(c.tel)).join(' · ')||'<span class="st-warn">sin definir</span>'}${T.com?' · '+esc(T.com):''}</td></tr>
      </tbody></table></div></div>
    <div class="card"><h3>Día a día</h3><div class="tab-wrap"><table class="tab"><tbody>${pl.map((d,i)=>`<tr><td style="white-space:nowrap">Día ${i+1}<br><span class="cap">${fmtD(d.dt)}</span></td><td><b style="color:inherit">${esc(d.t)}</b>${T.notas[d.id]?'<br><span class="cap">'+esc(T.notas[d.id])+'</span>':''}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><h3>Documentos y permisos</h3><div class="tab-wrap"><table class="tab"><tbody>${documentos().map(d=>{const s=T.docs[d.k]||'fazer';return `<tr><td>${esc(d.t)}</td><td class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':'st-bad'}">${({fazer:'Por hacer',pedido:'En espera',ok:'En regla',na:'No corresponde'})[s]}</td></tr>`;}).join('')}</tbody></table></div></div>
    ${inspirar()}
  </div>
  <div class="card alt no-print"><h3>Recursos para apoyadores <span class="sim">propuesta</span></h3><p class="sec">Ideas para conectar el planificador con el modelo de apoyadores de la WAS. Nada de esto funciona todavía.</p>
    <div class="ck">${['Revisión de la ruta por un especialista o asociado de la WAS','Dosier en PDF con la marca de la WAS y mapas en alta resolución','Mapas sin conexión y alertas de época y clima por correo','Publicar el relato de la expedición en el sitio de la WAS, con fotos y trayecto, y volverse asociado por la actuación'].map(t=>`<label><input type="checkbox" disabled><span class="tx">${t}</span></label>`).join('')}</div></div>`;
};
function inspirar(){
  const set=new Map();
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(r&&r.pf) set.set(r.pf[1],{t:r.pf[0],s:'Explorador ligado a '+r.n,u:r.pf[1]}); if(r&&r.g) set.set(r.g,{t:'Guía: '+r.n,s:'Página completa del destino en la WAS',u:r.g}); });
  D.rotas.forEach(r=>{ if(!r.link) return; if(T.paradas.some(p=>r.pts.some(q=>km(p,{x:q[0],y:q[1]})<150))) set.set(r.link,{t:r.n,s:r.quem+' · '+r.per,u:r.link}); });
  if(!set.size) return '';
  return `<div class="card no-print"><h3>Para inspirarte en la WAS</h3><p class="sec">Exploradores, rutas históricas y guías de destino que pasan por los lugares de tu ruta.</p><div class="insp">${[...set.values()].slice(0,9).map(x=>`<a class="c" href="${esc(x.u)}" target="_blank" rel="noopener"><b>${esc(x.t)} ↗</b><span>${esc(x.s)}</span></a>`).join('')}</div></div>`;
}

/* ---------- exportações ---------- */
function baixar(nome,txt,tipo){ const b=new Blob([txt],{type:tipo}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=nome; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }
const slugf=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'roteiro';
const xesc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function gpx(){ const w=T.paradas.map((p,i)=>`  <wpt lat="${p.y}" lon="${p.x}"><name>${i+1}. ${xesc(p.n)}</name></wpt>`).join('\n');
  const r=T.paradas.map(p=>`    <rtept lat="${p.y}" lon="${p.x}"><name>${xesc(p.n)}</name></rtept>`).join('\n');
  baixar(slugf(T.nome)+'.gpx',`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Rutas WAS (prototipo)" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${xesc(T.nome)}</name></metadata>\n${w}\n  <rte><name>${xesc(T.nome)}</name>\n${r}\n  </rte>\n</gpx>\n`,'application/gpx+xml'); }
function ics(){ const pl=plano(); const f=d=>isoD(d).replace(/-/g,''); const e=s=>String(s).replace(/[,;\\]/g,m=>'\\'+m).replace(/\n/g,'\\n');
  const ev=pl.map((d,i)=>{ const n=new Date(d.dt); n.setDate(n.getDate()+1); return `BEGIN:VEVENT\r\nUID:${T.id}-${i}@roteiros.was\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z\r\nDTSTART;VALUE=DATE:${f(d.dt)}\r\nDTEND;VALUE=DATE:${f(n)}\r\nSUMMARY:${e('Día '+(i+1)+': '+d.t)}\r\nDESCRIPTION:${e((d.ds||'')+(T.notas[d.id]?'\n'+T.notas[d.id]:''))}\r\nEND:VEVENT`; }).join('\r\n');
  baixar(slugf(T.nome)+'.ics',`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WAS//Roteiros prototipo//PT\r\nCALSCALE:GREGORIAN\r\n${ev}\r\nEND:VCALENDAR\r\n`,'text/calendar'); }
function linkCompart(){ const s=btoa(unescape(encodeURIComponent(JSON.stringify(T)))); const u=location.href.split('#')[0]+'#r='+s;
  const ok=()=>toast('Enlace copiado. Quien lo abra recibe una copia de esta ruta.');
  if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(u).then(ok,()=>{prompt0(u);}); else prompt0(u); }
function prompt0(u){ const t=document.createElement('textarea'); t.value=u; document.body.appendChild(t); t.select(); try{document.execCommand('copy'); toast('Enlace copiado.');}catch(e){toast('No se pudo copiar.');} t.remove(); }
function toast(m){ let t=$('#toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; app.appendChild(t);} t.textContent=m; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),3200); }

/* ---------- eventos ---------- */
function mudou(paradas){ save(); refreshNav(); renderLado();
  if(paradas&&passo==='mapa'){ $('#paradas').innerHTML=paradasHTML(); desenharTrajeto(false); } }
function abrir(t,p){ T=t; (T.paradas||[]).forEach(s=>{ const r=pontoDe(s); if(r) s.n=r.n; }); passo=p||'ideia'; save(); renderApp(); window.scrollTo(0,0); }
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-act]'); if(!b) return; const a=b.dataset.act;
  if(['ck','seg','cenaok','orcOk','comp'].includes(a)) return; // tratados em change
  if(b.tagName==='A'&&b.getAttribute('href')==='#') ev.preventDefault();
  switch(a){
    case 'home': T=null; renderHome(); break;
    case 'zero': abrir(novo()); break;
    case 'zero-mapa': abrir(novo({nome:'Ruta desde el mapa'}),'mapa'); break;
    case 'ir-sec': document.getElementById(b.dataset.sec).scrollIntoView({behavior:'smooth'}); break;
    case 'modelo': abrir(criarModelo(MODELOS.find(m=>m.id===b.dataset.id)),'mapa'); toast('Modelo copiado a tus rutas. Cambia lo que quieras.'); break;
    case 'rota': abrir(criarDeRota(b.dataset.id),'mapa'); T.verRotas=true; renderPasso(); toast('Ruta creada con los lugares del mapa cerca del recorrido.'); break;
    case 'abrir': abrir(DB.rot.find(r=>r.id===b.dataset.id)); break;
    case 'apagar': { const r=DB.rot.find(x=>x.id===b.dataset.id); if(b.dataset.conf!=='1'){ b.dataset.conf='1'; b.style.borderColor='#ff6b5e'; b.title='Haz clic de nuevo para borrar “'+(r?r.nome:'')+'”'; toast('Haz clic de nuevo en la papelera para borrar “'+(r?r.nome:'')+'”.'); setTimeout(()=>{b.dataset.conf='';b.style.borderColor='';},4000); break; }
      DB.rot=DB.rot.filter(x=>x.id!==b.dataset.id); try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){} renderHome(); toast('Ruta borrada.'); break; }
    case 'passo': passo=b.dataset.p; renderPasso(); { const y=app.getBoundingClientRect().top+window.scrollY-70; window.scrollTo({top:Math.max(0,y)}); } break;
    case 'tipo': { const k=b.dataset.k, i=T.tipos.indexOf(k); if(i>=0){ if(T.tipos.length>1) T.tipos.splice(i,1); } else T.tipos.push(k); save(); renderPasso(); refreshNav(); renderLado(); renderNavOpc(); break; }
    case 'quem': T.quem=b.dataset.k; if(T.quem==='solo') T.pessoas=1; if(T.quem==='dupla') T.pessoas=2; save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'camada': { const k=b.dataset.k; let lay=T.camadas||D.layers.map(l=>l.k); if(lay.includes(k)){ lay=lay.filter(x=>x!==k); mapa&&mapa.removeLayer(grpL[k]); b.classList.replace('on','off'); } else { lay.push(k); mapa&&grpL[k].addTo(mapa); b.classList.replace('off','on'); } T.camadas=lay; save(); break; }
    case 'verRotas': T.verRotas=!T.verRotas; if(mapa){ T.verRotas?rotasL.addTo(mapa):mapa.removeLayer(rotasL); } b.classList.toggle('on',T.verRotas); b.classList.toggle('off',!T.verRotas); save(); break;
    case 'livre': modoLivre=true; $('#modo').classList.add('on'); toast('Haz clic en el mapa donde quieres el punto.'); break;
    case 'livre-x': modoLivre=false; $('#modo').classList.remove('on'); break;
    case 'add': { const p=D.pts[+b.dataset.i]; T.paradas.push({id:uid(),ref:refDe(p),n:p.n,x:p.x,y:p.y,dias:p.l==='CU'&&p.d>=4?10:(parseInt(p.dias)||2),l:p.l}); if(mapa) mapa.closePopup(); mudou(true); toast(p.n+' entró en la ruta.'); break; }
    case 'res': { const p=D.pts[+b.dataset.i]; $('#res').hidden=true; $('#busca').value=''; const k=p.l; let lay=T.camadas||D.layers.map(l=>l.k); if(!lay.includes(k)){ lay.push(k); T.camadas=lay; grpL[k].addTo(mapa); const c=$(`.chip.cam[data-k="${k}"]`); c&&c.classList.replace('off','on'); }
      mapa.setView([p.y,p.x],6); grpL[k].eachLayer(m=>{ const ll=m.getLatLng(); if(ll.lat===p.y&&ll.lng===p.x) m.openPopup(); }); break; }
    case 'sobe': case 'desce': { const i=T.paradas.findIndex(p=>p.id===b.dataset.id); const j=a==='sobe'?i-1:i+1; if(j<0||j>=T.paradas.length) break; [T.paradas[i],T.paradas[j]]=[T.paradas[j],T.paradas[i]]; mudou(true); break; }
    case 'tira': T.paradas=T.paradas.filter(p=>p.id!==b.dataset.id); mudou(true); break;
    case 'addItem': { const i=$('#novoItem'); if(i.value.trim()){ T.extras.push(i.value.trim()); save(); renderPasso(); refreshNav(); renderLado(); } break; }
    case 'ct+': T.contatos.push({n:'',tel:'',rel:''}); save(); renderPasso(); break;
    case 'ctx': T.contatos.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'eq+': T.equipe.push({n:'',papel:T.equipe.length?'Participante':'Líder de la expedición',c:''}); save(); renderPasso(); refreshNav(); break;
    case 'eqx': T.equipe.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); break;
    case 'cena+': { const id=b.dataset.id; let t=b.dataset.t; if(!t){ const i=$(`[data-cena="${id}"]`); t=i&&i.value.trim(); } if(!t) break; (T.imagens[id]=T.imagens[id]||[]).push({t,ok:false}); save(); renderPasso(); refreshNav(); renderLado(); break; }
    case 'cenax': T.imagens[b.dataset.id].splice(+b.dataset.i,1); save(); renderPasso(); break;
    case 'print': window.print(); break;
    case 'gpx': gpx(); break; case 'ics': ics(); break;
    case 'json': baixar(slugf(T.nome)+'.roteiro-was.json',JSON.stringify(T,null,2),'application/json'); break;
    case 'link': linkCompart(); break;
    case 'enviar': toast('Simulación: en el producto final, la ruta iría a la curaduría de la WAS.'); break;
  }
});
function renderNavOpc(){ $$('.passo').forEach(b=>{ if(b.dataset.p==='imagens'){ const o=b.querySelector('.opc'); const need=!(tem('fotografica')||tem('cinema')); if(need&&!o) b.querySelector('.st').insertAdjacentHTML('beforebegin','<span class="opc">opcional</span>'); if(!need&&o) o.remove(); } }); }
document.addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ const t=ev.target; if(t.id==='novoItem'){ ev.preventDefault(); $('[data-act="addItem"]').click(); } if(t.dataset&&t.dataset.cena){ ev.preventDefault(); $(`button[data-act="cena+"][data-id="${t.dataset.cena}"]:not([data-t])`).click(); } if(t.dataset&&t.dataset.act==='renome') t.blur(); if(t.classList.contains('al')) t.click(); } });
document.addEventListener('input',ev=>{
  const t=ev.target;
  if(t.dataset.b){ let v=t.value; if('num' in t.dataset) v=Math.max(0,+v||0); if('bool' in t.dataset) v=v==='1'; T[t.dataset.b]=v; save(); if(t.dataset.b!=='intencao'&&t.dataset.b!=='nome') { renderLado(); } refreshNav(); return; }
  const a=t.dataset.act;
  if(a==='nota'){ T.notas[t.dataset.id]=t.value; save(); }
  if(a==='ct'){ T.contatos[+t.dataset.i][t.dataset.f]=t.value; save(); }
  if(a==='eq'){ T.equipe[+t.dataset.i][t.dataset.f]=t.value; save(); }
  if(a==='orc'){ T.orc[t.dataset.k]=t.value; save(); }
  if(a==='renome'){ const p=T.paradas.find(x=>x.id===t.dataset.id); p.n=t.value||p.n; save(); }
  if(t.id==='busca') busca(t.value);
});
document.addEventListener('change',ev=>{
  const t=ev.target, a=t.dataset.act;
  if(t.dataset.b){ if(['inicio','margem','aclim','drone'].includes(t.dataset.b)&&passo!=='ideia') renderPasso(); refreshNav(); renderLado(); return; }
  if(a==='ck'){ T.ck[t.dataset.k]=t.checked; t.closest('label').classList.toggle('feito',t.checked); save(); refreshNav(); renderLado(); if(passo==='equip') renderPasso(); }
  if(a==='seg'){ T.seguro[t.dataset.k]=t.checked; t.closest('label').classList.toggle('feito',t.checked); save(); refreshNav(); renderLado(); }
  if(a==='cenaok'){ T.imagens[t.dataset.id][+t.dataset.i].ok=t.checked; t.closest('label').classList.toggle('feito',t.checked); save(); }
  if(a==='orcOk'){ T.orcOk=t.checked; save(); refreshNav(); renderLado(); }
  if(a==='comp'){ T.compromisso=t.checked; t.closest('label').classList.toggle('feito',t.checked); save(); refreshNav(); renderLado(); }
  if(a==='dias'){ const p=T.paradas.find(x=>x.id===t.dataset.id); p.dias=Math.max(0,+t.value||0); mudou(false); }
  if(a==='modo'){ T.trechos[t.dataset.id]=t.value; mudou(true); }
  if(a==='doc'){ T.docs[t.dataset.k]=t.value; t.className=t.value==='ok'?'st-ok':t.value==='pedido'?'st-warn':''; save(); refreshNav(); renderLado(); }
  if(a==='orc'){ renderPasso(); renderLado(); }
  if(a==='cine'){ T.cine[t.dataset.f]=t.dataset.f==='fmt'?t.value:Math.max(0,+t.value||0); save(); renderPasso(); }
  if(a==='renome'){ mudou(true); }
  if(['ct','eq'].includes(a)){ refreshNav(); renderLado(); }
});
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const IDXB=D.pts.map(p=>norm([p.n,p.pa,p.r,LAY[p.l].nome,(p.es||[]).join(' '),p.f].join(' ')));
function busca(q){ const r=$('#res'); q=norm(q.trim()); if(q.length<2){ r.hidden=true; return; }
  const ws=q.split(/\s+/); const hits=[]; D.pts.forEach((p,i)=>{ if(ws.every(w=>IDXB[i].includes(w))) hits.push([norm(p.n).includes(q)?0:1,p]); });
  hits.sort((a,b)=>a[0]-b[0]); r.hidden=false;
  r.innerHTML=hits.length?hits.slice(0,12).map(([,p])=>`<button data-act="res" data-i="${p.i}"><span class="bol" style="background:${LAY[p.l].cor}"></span>${esc(p.n)}<small>${esc(LAY[p.l].nome)} · ${esc(p.pa)}</small></button>`).join(''):'<div style="padding:10px 12px;color:var(--sec)">No se encontró nada.</div>'; }
document.addEventListener('click',ev=>{ const r=$('#res'); if(r&&!r.hidden&&!ev.target.closest('.busca')) r.hidden=true; },true);
window.addEventListener('resize',()=>{ clearTimeout(window._rz); window._rz=setTimeout(()=>{ if(T) montarMini(); },250); });

/* ---------- partida ---------- */
const h=location.hash.match(/^#r=(.+)$/);
if(h){ try{ const t=JSON.parse(decodeURIComponent(escape(atob(h[1])))); t.id=uid(); t.nome=(t.nome||'Ruta')+' (copia)'; history.replaceState(null,'',location.pathname); abrir(t,'revisar'); toast('Ruta recibida por enlace y guardada en tus rutas.'); }catch(e){ renderHome(); } }
else renderHome();
})();
