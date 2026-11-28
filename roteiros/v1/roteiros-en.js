/* Roteiros WAS · protótipo · tudo roda no navegador, sem servidor */
(function(){
'use strict';
const D = window.WASDATA;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = (n, d=0) => Number(n||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtR = n => 'R$ ' + fmtN(Math.round(n||0));
const MESES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MESES_L = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DIAS_S = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
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
  ['expedicao','Expedition'],['aventura','Adventure'],['esportiva','Sport'],['contemplacao','Contemplation'],
  ['cultural','Cultural'],['fotografica','Photography'],['cinema','Filmmaking'],['ciencia','Science and volunteering'],
  ['passeio','Day trip'],['familia','Family']
];
const TIPO_N = Object.fromEntries(TIPOS);

/* ---------- modos de deslocamento ---------- */
const MODOS = {
  aviao:{n:'Plane',v:750,ov:4,co2:.15},
  carro:{n:'Car',v:70,ov:0,co2:.17,veh:1,rf:1.25},
  x4:{n:'4x4',v:40,ov:0,co2:.27,veh:1,rf:1.3},
  onibus:{n:'Bus',v:55,ov:1,co2:.03,rf:1.25},
  trem:{n:'Train',v:80,ov:1,co2:.035,rf:1.2},
  barco:{n:'Boat',v:25,ov:1,co2:.12},
  navio:{n:'Expedition ship',v:22,ov:0,co2:.5},
  pe:{n:'On foot',v:4,hd:6,co2:0,rf:1.2},
  bike:{n:'Bicycle',v:14,hd:6,co2:0,rf:1.2},
  cavalo:{n:'On horseback',v:6,hd:6,co2:0,rf:1.2},
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
    const s=$('#salvo'); if(s){ const d=new Date(); s.textContent='Saved at '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); } }, 300);
}
function novo(base={}){
  const hoje = new Date(); const ini = new Date(hoje.getFullYear(), hoje.getMonth()+3, 10);
  return Object.assign({
    id:uid(), nome:'My new journey', tipos:['aventura'], intencao:'', quem:'dupla', pessoas:2, exp:'intermediario',
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
function fmtD(d){ return DIAS_S[d.getDay()]+', '+MESES[d.getMonth()]+' '+d.getDate(); }
function fmtDL(d){ return MESES_L[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear(); }
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
      if(ant && (ant.l==='ME'||(ant.l==='NF'&&ant.d>=3)) && t.m==='aviao') push({tipo:'marg',t:'Surface interval before flying',ds:'At least 18 to 24 hours without flying after several days of diving, to reduce the risk of decompression sickness.',id:'sv'+p.id});
      if(t.dias>0) for(let j=0;j<t.dias;j++) push({tipo:'via',t:'Travel: '+t.a.n+' → '+t.b.n,ds:t.M.n+' · about '+fmtN(t.km)+' km'+(t.dias>1?' · day '+(j+1)+' of '+t.dias:''),id:'v'+p.id+'-'+j});
    }
    const alt=altDe(p);
    const nd=Math.max(0,p.dias|0); let dentro=0;
    if(T.aclim && alt>=3000){ const need=Math.min(6,Math.ceil((alt-2800)/700)); dentro=Math.min(need,Math.floor(nd*.6)); const n=need-dentro; for(let j=0;j<n;j++) push({tipo:'acl',t:'Acclimatization for '+p.n,ds:'Sleep no more than 300 to 500 m above the previous night. Light walks, plenty of water, watch for headache and nausea.',id:'a'+p.id+'-'+j}); }
    const chegou = i>0 && trecho(i).dias===0 ? ' (arrival: '+MODOS[trecho(i).m].n.toLowerCase()+')' : '';
    for(let j=0;j<nd;j++) push({tipo:j<dentro?'acl':'loc',t:(nd>1?'Day '+(j+1)+' in ':'')+p.n+(j===0?chegou:'')+(j<dentro?' · gradual ascent':''),ds:j===0?(pontoDe(p)?.f||''):(j<dentro?'Acclimatization built into the ascent itself: gain altitude slowly.':''),id:'d'+p.id+'-'+j,p});
  });
  for(let j=0;j<(T.margem|0);j++) push({tipo:'marg',t:'Buffer day',ds:'Reserved for bad weather, delayed flights or fatigue. Those who plan a buffer come back in one piece.',id:'m'+j});
  return dias;
}

/* ---------- dificuldade ---------- */
function difLabel(p){ const r=pontoDe(p); if(!r) return ''; const L=LAY[r.l]; return (L.dif&&L.dif[r.d])||['','Easy','Moderate','Demanding','Very demanding','Extreme'][r.d]; }
function nivel(){ let m=0; T.paradas.forEach(p=>{ const r=pontoDe(p); if(r) m=Math.max(m,r.d||1); }); return m; }
const NIVEL_N=['—','Light','Moderate','Demanding','Very demanding','Extreme'];

/* ---------- regras: habilidades ---------- */
function habilidades(){
  const out=[]; const add=(k,t,p)=>{ if(!out.find(o=>o.k===k)) out.push({k,t,p}); };
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(!r) return; const g=r.g2||[];
    if(r.l==='ME'){ if(r.d>=2) add('ow','Open Water diving certification (or equivalent)',r.n); if(r.d>=4) add('aow','Advanced, drift diving and solid experience (suggested: 50+ logged dives)',r.n); if(r.d>=5||g.includes('cav')) add('tec','Technical or cave/cenote training with a specialized instructor',r.n); }
    if(r.l==='NF'&&r.d>=3) add('ow2','Diving certification suited to the depth of the wreck',r.n);
    if(r.l==='CU'){ if(r.d>=3) add('alp','Basic mountaineering course: crampons, ice axe, self-arrest',r.n); if(r.d>=4) add('corda','Rope techniques, crevasse rescue and previous high-altitude experience',r.n); }
    if(r.l==='TK'&&r.d>=4) add('nav','Navigation with map, compass and GPS; self-sufficiency on remote trails',r.n);
    if(r.l==='P'&&r.d>=3) add('polar','Polar expedition training: hauling a sled (pulk), camping on snow, frostbite prevention',r.n);
    if(r.l==='O') add('off','Off-road driving: sand, mud, river crossings and vehicle recovery',r.n);
    if(r.l==='B2'&&r.d>=3) add('mec','Basic bike mechanics and training with a loaded bike',r.n);
    if(r.l==='AT'){ if(g.includes('esc')) add('esc','Climbing: experience at the route grade or a certified guide',r.n); if(g.includes('cany')) add('cany','Canyoning: rappelling and water techniques, always with a certified guide',r.n); if(g.includes('raft')||g.includes('cai')) add('agua','Confident swimming and a whitewater safety briefing',r.n); if(g.includes('ar')) add('ar','Free flight or jumping: only with an instructor and an accredited school',r.n); }
    if(r.l==='X') add('trav','Training specific to the crossing (sea, river, desert or long-distance swimming)',r.n);
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
  g('Essentials',[['Main backpack or expedition duffel',1800],['Daypack (20–35 L)',700],['Headlamp and batteries',120],['Personal first-aid kit',400],['Bottle and water filter or tablets',350],['Sunscreen, lip balm and sunglasses',250],['Power bank and cables',350],['Dry bag for documents',80],['Pocketknife or multitool',120]],'Every journey');
  if(frio()) g('Cold and altitude',[['3-layer system (base layer, fleece, waterproof shell)',1500],['Down jacket',700],['Liner gloves and heavy gloves',300],['Beanie and balaclava',150],['Merino wool socks (3 pairs)',300],['Category 4 glacier glasses',60],['Sleeping bag, comfort -10 °C or lower',1600]],'Cold stops or stops above 2,500 m');
  if(tropical()) g('Heat and tropics',[['Light clothing with UV protection',600],['Insect repellent (icaridin or DEET)',150],['Mosquito net',350],['Hiking sandals',500],['Light rain poncho',300]],'Tropical stops');
  if(temL('TK','L','CU','VU')) g('Trail and mountain',[['Broken-in trekking boots',1400],['Trekking poles',500],['Gaiters',250],['Offline map and GPS on your phone',0],['Whistle and emergency blanket',100]],'Treks, summits or volcanoes');
  if(T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='CU'&&r.d>=3;})) g('Mountaineering',[['Crampons',900],['Ice axe',500],['Harness, carabiners and cord',700],['Helmet',350],['Double or high-altitude boots',2400]],'Technical summits');
  if(temL('ME','NF')) g('Diving',[['Mask, snorkel and fins',1500],['Dive computer',250],['Wetsuit suited to the water temperature',2500],['Surface marker buoy and whistle',200],['Logbook and certifications',50]],'Diving stops');
  if(temL('BA','X')||temG('AT','cai')||temG('AT','raft')) g('Water and boat',[['Waterproof jacket and rain pants',700],['Seasickness medicine',20],['Waterproof phone case',60]],'Boat trips and crossings');
  if(temL('O')) g('Off-road',[['Recovery kit: boards, strap, shovel',9000],['Compressor and tire repair kit',4000],['Extra fuel and water',0],['Satellite messenger',120]],'Off-road routes');
  if(temL('B2')) g('Bicycle',[['Helmet',350],['Panniers or bikepacking bags',2200],['Inner tubes, patches and pump',600],['Bike multitool',200]],'Bike routes');
  if(temL('P')) g('Polar',[['Expedition parka',1800],['Polar boots',2200],['Face mask and snow goggles',250],['Insulated bottle',450]],'Polar destinations');
  if(tem('fotografica')||tem('cinema')){
    const its=[['Main camera body',750],['Backup body',650],['Wide angle (14–24 mm)',650],['Standard zoom (24–70 mm)',800],['Light carbon-fiber tripod',1500],['Polarizer and ND filters',200],['Extra batteries (cold drains them)',300],['Memory cards (2× what you expect)',50],['Camera rain cover',150],['Sensor cleaning kit',100]];
    if(temL('FA','BA')) its.splice(4,0,['Telephoto 100–400 or 200–600 mm',2100]);
    if(temL('ME')) its.push(['Underwater housing and lighting',3500]);
    g('Photography',its,'Photography journey');
  }
  if(tem('cinema')) g('Filming',[['Shotgun mic and wireless lavaliers',600],['Audio recorder',400],['Gimbal',1200],['External monitor',500],['Backup SSDs (3-2-1 rule)',300],['Laptop for offloading',1800],['Windshield (dead cat)',60]],'Filmmaking journey');
  if(T.drone) g('Drone',[['Drone and 3 batteries',1300],['Controller and spare propellers',300],['ND filters for the drone',50],['Proof of registration and authorization',0]],'You said you are taking a drone');
  if(T.extras.length) g('Items you added',T.extras.map(x=>[x,0]),'Personal list');
  return G;
}

/* ---------- regras: documentos e autorizações ---------- */
const AFR=['Uganda','Ruanda','Tanzânia','Quênia','Congo','RD Congo','República Democrática do Congo','Etiópia','Zâmbia','Zimbábue','Botsuana','Namíbia','Camarões','Madagascar','África do Sul','Marrocos','Egito'];
const SCHENGEN=['Itália','Espanha','França','Portugal','Suíça','Islândia','Noruega','Suécia','Finlândia','Grécia','Alemanha','Áustria','Croácia','Eslovênia','Polônia','Dinamarca','Holanda','Bélgica'];
function documentos(){
  const ps=paises(), ext=ps.filter(p=>!/Brasil/.test(p)), L=[];
  const nomes=T.paradas.map(nk).join(' | ');
  const d=(k,t,p,onde,por)=>L.push({k,t,p,onde,por});
  if(ext.length){ const vol=addDias(T.inicio,plano().length+180); d('pass','Valid passport','Many countries require at least 6 months of validity after your departure date. Your planned return calls for validity until at least '+fmtDL(vol)+'.','Passport office of your country (for Brazilians: Polícia Federal, online booking)','Destinations outside Brazil');
    d('visto','Visas and electronic travel authorizations','Check the rules for your nationality in: '+ext.map(paT).join(', ')+'. Check each case, because the rules change (visas, eTA, ESTA, eVisa).','Your foreign ministry and official immigration websites','Destinations outside Brazil'); }
  if(ps.some(p=>AFR.some(a=>p.includes(a)))||ps.includes('Brasil')) d('civp','Yellow fever vaccine and international certificate','The International Certificate of Vaccination or Prophylaxis may be required to enter some countries and is recommended for several regions of Brazil.','Health authority of your country (in Brazil, Anvisa) and a vaccination center','Yellow fever areas');
  if(ext.some(p=>SCHENGEN.some(s=>p.includes(s)))) d('schengen','Insurance with Schengen coverage','For the Schengen area, insurance must cover at least 30,000 euros in medical expenses.','Insurance company','Destination in the Schengen area');
  if(T.paradas.some((p,i)=>i>0 && ['carro','x4'].includes(trecho(i).m)) && ext.length) d('pid','International Driving Permit','Issued by the driving licence authority of your country (in Brazil, the state Detran), together with a valid licence.','Driving licence authority','Car legs outside Brazil');
  if(T.drone){ if(ps.includes('Brasil')) d('droneBR','Drone in Brazil: SISANT, SARPAS and Anatel','Drone registration with ANAC (SISANT), flight request to DECEA (SARPAS) and Anatel certification. In federal parks, authorization from ICMBio.','ANAC, DECEA, Anatel, ICMBio','You are taking a drone');
    if(ext.length) d('droneEXT','Drone abroad','Each country has its own rules and registration, and many national parks ban flying without a permit (it is prohibited in US national parks).','Civil aviation authority of each country','You are taking a drone'); }
  const esp=[
    [/Bwindi|Gorilas no Parque dos Vulcões/,'gor','Gorilla trekking permit','Limited daily permits, sold months in advance. A 1-hour visit with a guide and health rules.','Uganda Wildlife Authority or Rwanda Development Board'],
    [/Kilimanjaro/,'kili','Park fees and mandatory guide on Kilimanjaro','The climb is only allowed with a licensed guide and operator, who collect the park fees.','Operator licensed by the Tanzanian parks authority'],
    [/Aconcágua/,'acon','Aconcagua climbing permit','A paid permit, priced by season, picked up in Mendoza before the climb. A medical check is required in the park.','Parque Provincial Aconcagua (Mendoza)'],
    [/Everest|Campo-base do Everest|Lhotse|Ama Dablam|Island Peak/,'nepal','Trekking and climbing permits in Nepal','Entry to Sagarmatha National Park and a local permit; summits require a government climbing permit.','Nepal Department of Tourism, through a registered agency'],
    [/Trilha Inca/,'inca','Inca Trail permit','Limited daily places, sold only by authorized operators, which sell out months ahead.','Operator authorized by the Peruvian Ministry of Culture'],
    [/Milford Track|Routeburn/,'doc','Great Walk booking','Huts booked in advance; the season sells out fast.','New Zealand Department of Conservation'],
    [/Svalbard/,'sval','Svalbard rules','Outside the usual visitor areas you must notify the local government and have search-and-rescue insurance. Polar bears call for protection and a guide.','Governor of Svalbard (Sysselmesteren)'],
    [/Antártica|Antártida|Polo Sul|Ilha Elefante|Deception|Geórgia do Sul|Snow Hill|Comandante Ferraz/,'ant','Antarctica authorization','Every activity needs an environmental impact assessment from a country that signed the Antarctic Treaty. IAATO operators handle this for their passengers.','IAATO member operator'],
    [/Galápagos/,'gal','Galápagos entry','Park entry fee and transit control card, bought before boarding on the mainland.','Government of Ecuador / Galápagos National Park'],
    [/Fernando de Noronha/,'fn','Fernando de Noronha fees','Daily Environmental Preservation Fee and Marine National Park entry.','District administration and ICMBio']
  ];
  esp.forEach(([re,k,t,p,o])=>{ if(re.test(nomes)) d(k,t,p,o,'Stops: '+T.paradas.filter(x=>re.test(nk(x))).map(x=>x.n).join(', ')); });
  if(temL('PQ')) d('parq','Park tickets and bookings','The busiest parks limit places, camping and trails. Book anything with a quota as soon as your dates are firm.','Managing body of each park','Parks on the journey');
  if(tem('cultural')&&ps.includes('Brasil')) d('funai','Indigenous lands','Visits to Indigenous lands require the community’s consent and an entry authorization from Funai. Images require a usage agreement with the community.','Funai and the community itself','Cultural journey in Brazil');
  if(tem('cinema')){ d('film','Filming permits','Filming for commercial use in protected areas usually requires a permit and a fee. In cities, contact the local film commission.','Park authorities, film commissions (in Brazil, ICMBio)','Filmmaking journey');
    d('cessao','Image and location releases','A release signed by anyone who appears identifiably and by owners of private locations.','Template from your lawyer or production company','Filmmaking journey');
    if(ext.length) d('ata','ATA Carnet for equipment','A customs document that lets you bring professional equipment in and out without paying import duties.','Chamber of commerce of your country (in Brazil, the CNI)','Professional equipment abroad'); }
  if(temL('ME')||T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='NF'&&r.d>=3;})) d('merg','Diving certifications and logbook','Bring your cards (or the agency app) and your dive log; operators ask for them before advanced dives.','Your certifying agency (PADI, SSI, NAUI, CMAS)','Diving stops');
  if(T.quem==='familia') d('menor','Travel authorization for minors','When a child travels without one of the parents, a notarized authorization (or one recorded in the passport) is required.','Notary or passport office','Family trip');
  d('seguroDoc','Travel insurance policy','With coverage suited to the activities (see Health and safety).','Insurance company','Every journey');
  return L;
}

/* ---------- orçamento (simulado) ---------- */
function regiao(p){ const r=pontoDe(p); const pa=(r?(r.pa0||r.pa):p.pa)||''; const x=p.x,y=p.y;
  if((r&&r.l==='P')||y<-60||y>75) return 'POL'; if(/Brasil/.test(pa)) return 'BR';
  if(x>-82&&x<-34&&y<13) return 'SA'; if(y>13&&x<-50) return 'NA'; if(y>35&&x>-25&&x<45) return 'EU';
  if(x>-20&&x<52&&y>-36&&y<37) return 'AF'; if(x>110&&y<-10) return 'OC'; return 'AS'; }
const IDX={BR:420,SA:520,NA:1350,EU:1250,AF:1000,OC:1250,AS:560,POL:6500};
const IDX_N={BR:'Brazil',SA:'South America',NA:'North and Central America',EU:'Europe',AF:'Africa',OC:'Oceania',AS:'Asia',POL:'Polar regions'};
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
  const cats=[['transp','Transport',transp],['hosp','Lodging',hosp],['alim','Food',alim],['guia','Guides and operators',guia],['taxas','Fees and permits',taxas],['seguro','Insurance',seguro],['equip','Equipment (purchase and rental)',equip]];
  if(prod) cats.push(['prod','Image production',prod]);
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
  if(!T.paradas.length) A.push({n:'bad',t:'No places on the journey',d:'Start by choosing points on the map.',go:'mapa'});
  alertasMes().forEach(a=>A.push({n:'warn',t:a.p.n+' outside the best season',d:'You arrive in '+MESES_L[a.m-1]+'. WAS recommends: '+a.r.me.map(m=>MESES[m-1]).join(', ')+'.',go:'epoca'}));
  T.paradas.forEach((p,i)=>{ if(i>0){ const ant=pontoDe(T.paradas[i-1]); const t=trecho(i); if(ant&&ant.l==='ME'&&t.m==='aviao') A.push({n:'warn',t:'Diving followed by a flight',d:'The plan already includes a no-fly day after '+ant.n+'.',go:'dias'}); } });
  if(!T.aclim && T.paradas.some(p=>altDe(p)>=3000)) A.push({n:'bad',t:'Altitude without acclimatization',d:'There are places above 3,000 m and acclimatization is turned off.',go:'dias'});
  if(T.paradas.some(p=>!(p.dias>0) && pontoDe(p))) A.push({n:'warn',t:'Place with 0 days',d:'A place on the journey still has no days set.',go:'mapa'});
  if(T.drone && (temL('PQ')||temL('FA'))) A.push({n:'warn',t:'Drone in a protected area',d:'Parks and wildlife areas almost always require authorization or ban flying.',go:'docs'});
  if(nivel()>=4 && !T.seguro.evac) A.push({n:'bad',t:'Insurance without evacuation',d:'A journey rated '+NIVEL_N[nivel()].toLowerCase()+' calls for rescue and medical air evacuation coverage.',go:'saude'});
  if(T.paradas.length && !T.contatos.length) A.push({n:'warn',t:'No emergency contact',d:'Choose who will follow the trip from home.',go:'saude'});
  if(temL('BA','FA')&&!T.compromisso) A.push({n:'warn',t:'Wildlife conduct',d:'Read the distance rules and accept the conduct pledge.',go:'conduta'});
  return A;
}

/* ================= RENDER ================= */
let app = document.getElementById('wasrot');
if(!app){ app=document.createElement('div'); app.id='wasrot'; const ft=document.querySelector('footer.footer-section')||document.querySelector('footer'); if(ft&&ft.parentNode) ft.parentNode.insertBefore(app,ft); else document.body.appendChild(app); }
function topo(){
  if(!T) return '';
  return `<div class="topo"><div class="topo-in">
    <div class="marca"><span class="kick">WAS Journeys</span><b>${esc(T.nome)}</b></div>
    <span class="selo" title="Feature in testing. Part of the data is simulated.">In testing</span>
    <div class="esp"></div>
    <span class="salvo" id="salvo">Saved in this browser</span>
    <button class="tbtn" data-act="home" aria-label="My journeys">${svg('lista')}<span class="lbl">My journeys</span></button>
  </div></div>`;
}
/* ---------- início ---------- */
const MODELOS = [
  {id:'java',nome:'Volcanoes of Java and Lombok',tipos:['fotografica','aventura'],quem:'dupla',pessoas:2,mes:7,intencao:'Photograph sunrise at Bromo, the blue fire of Ijen and the crater of Rinjani, with time to wait for the right light.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['VU','Bromo',2],['VU','Ijen',2],['VU','Rinjani',4]],t:'Photography · 3 active volcanoes'},
  {id:'jub',nome:'Humpbacks and reefs of Bahia',tipos:['contemplacao','fotografica','familia'],quem:'familia',pessoas:4,mes:8,intencao:'See humpback whales up close in Abrolhos and the turtles of Projeto Tamar, at a relaxed pace with the kids.',
    par:[['livre','Salvador',-38.5,-12.97,0,'Brasil'],['BA','Praia do Forte',2],['FA','Projeto Tamar na Praia do Forte',1],['BA','Arquipélago dos Abrolhos',3]],t:'Contemplation · whale season'},
  {id:'afr',nome:'Kilimanjaro and the gorillas',tipos:['expedicao','fotografica'],quem:'grupo',pessoas:4,mes:7,intencao:'Climb to the roof of Africa by the gentlest route and finish with an hour facing mountain gorillas.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['CU','Kilimanjaro',7],['FA','Grande Migração no Masai Mara',3],['FA','Gorilas-das-montanhas em Bwindi',2]],t:'Expedition · Seven Summits and wildlife'},
  {id:'sval',nome:'In Amundsen’s footsteps: the Norwegian Arctic',tipos:['cinema','expedicao'],quem:'grupo',pessoas:3,mes:6,intencao:'A short documentary about retreating ice, filmed under the midnight sun, from Tromsø to Svalbard.',
    par:[['livre','Oslo',10.75,59.91,1,'Noruega'],['BA','Fiordes de Tromsø',2],['P','Svalbard',6]],t:'Filmmaking · midnight sun'},
  {id:'cerrado',nome:'Central Brazil by 4x4',tipos:['aventura','cultural'],quem:'grupo',pessoas:4,mes:7,intencao:'Drive the Cerrado in the dry season: the bubbling springs of Jalapão, the canyons of Chapada dos Veadeiros and the caves of Terra Ronca.',
    par:[['livre','Brasília',-47.88,-15.79,0,'Brasil'],['PQ','Parque Nacional da Chapada dos Veadeiros',3],['AT','Terra Ronca',2],['O','Jalapão',4]],t:'Adventure · off-road and caves',
    ft:'fotos/brasil-central-saltos-rio-preto.jpg',fa:'Marcelo Camargo/Agência Brasil',fl:'CC BY 3.0 BR',fn:'Saltos do Rio Preto, Chapada dos Veadeiros'},
  {id:'pat',nome:'Patagonia: Torres and Fitz Roy',tipos:['aventura','esportiva','fotografica'],quem:'dupla',pessoas:2,mes:2,intencao:'Hike the W in Torres del Paine and walk to Laguna de los Tres, facing Fitz Roy.',
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
      <div class="hero-in"><div class="qd hero-qd">${svg('rota')}</div><div class="kick">WAS Journeys</div><h1>Plan your journey</h1>
      <p class="lead">Expeditions, adventure trips, day trips and contemplative journeys. Choose places on the Adventure Map, follow in the footsteps of great explorers and plan everything in one place: season and light, day by day, training, gear, documents, safety, budget and image plan.</p></div>
      <div class="cred">Photo: ${esc(hero.n)} · ${esc(hero.fa)} · ${esc(hero.fl)}</div></section>
    <div class="portas">
      <button class="porta" data-act="zero">${qd('mais',1)}<h3>Start from scratch</h3><p>Give it a name, choose the type of journey and build it on the map.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-mod">${qd('livro',1)}<h3>Start from a template</h3><p>Six ready-made journeys to adapt, built with places from the WAS map.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-rot">${qd('rota',1)}<h3>In an explorer’s footsteps</h3><p>Choose a historic route and WAS suggests places you can visit along the way.</p></button>
      <button class="porta" data-act="zero-mapa">${qd('pin',1)}<h3>Start from the map</h3><p>${fmtN(D.pts.length)} places in ${D.layers.length} layers: summits, diving, volcanoes, wildlife and more.</p></button>
    </div>
    ${meus.length?`<section class="bloco-sec"><div class="cab">${qd('lista',1)}<h2>My journeys</h2></div><p class="intro">They are stored only in this browser, on this computer.</p>
      <div class="meus">${meus.map(r=>`<div class="meu"><div class="t"><b>${esc(r.nome)}</b><span>${r.paradas.length} places · ${(r.tipos||[]).map(t=>TIPO_N[t]).join(', ')}</span></div>
      <button class="btn peq" data-act="abrir" data-id="${r.id}">Open</button><button class="ico-btn" data-act="apagar" data-id="${r.id}" title="Delete this journey" aria-label="Delete">${svg('lixo')}</button></div>`).join('')}</div></section>`:''}
    <section class="bloco-sec" id="sec-mod"><div class="cab">${qd('livro',1)}<h2>Templates to adapt</h2></div>
      <p class="intro">Each template already comes with places, days, route and season. Everything can be changed.</p>
      <div class="grade-mod">${MODELOS.map(m=>{ const f=fotoModelo(m); return `<button class="mod" data-act="modelo" data-id="${m.id}"><div class="ft" style="background-image:url('${esc(f.ft)}')"></div><div class="cx"><span class="kick">${esc(m.t)}</span><h3>${esc(m.nome)}</h3><p>${esc(m.intencao)}</p><div class="tags">${m.tipos.map(t=>`<span class="tag">${TIPO_N[t]}</span>`).join('')}</div>${f.ft&&f.fa?`<span class="cr">Photo: ${esc(f.fa)} · ${esc(f.fl)}</span>`:''}</div></button>`; }).join('')}</div></section>
    <section class="bloco-sec" id="sec-rot"><div class="cab">${qd('rota',1)}<h2>In an explorer’s footsteps</h2></div>
      <p class="intro">The ${D.rotas.length} routes of the Adventure Map. When you pick one, the planner creates a journey with the start and end of the route and the map places that lie close to it.</p>
      <div class="lista-rotas">${D.rotas.map(r=>`<button class="rota-c" data-act="rota" data-id="${r.id}"><span><i class="pt" style="background:${CORR[r.c]}"></i>${esc(D.cats[r.c])} · ${esc(r.per)}</span><b>${esc(r.n)}</b><span>${esc(r.quem)}</span></button>`).join('')}</div></section>
    <div class="aviso-sim"><b>Feature in testing.</b> Places, photos, best months, difficulty levels and routes are the real data of the WAS Adventure Map. Sunrise and sunset, daylight hours and moon phases are actually calculated. Costs, emissions, operators, document rules and deadlines are sample estimates, marked <span class="sim">simulated</span>. Nothing is sent to a server: your journeys are stored in this browser.</div>
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
  const t=novo({nome:'In the footsteps of: '+r.n,tipos:['expedicao','cultural'],intencao:'Retrace, as far as possible today, parts of the route "'+r.n+'" ('+r.quem+', '+r.per+').',rota:r.id,quem:'dupla',pessoas:2});
  t.paradas.push({id:uid(),ref:null,n:'Route start',x:ini.x,y:ini.y,dias:1,livre:true,pa:''});
  sel.forEach(p=>t.paradas.push({id:uid(),ref:refDe(p),n:p.n,x:p.x,y:p.y,dias:2,l:p.l}));
  t.paradas.push({id:uid(),ref:null,n:'Route end',x:fim.x,y:fim.y,dias:1,livre:true,pa:''});
  return t;
}

/* ---------- construtor ---------- */
const PASSOS=[
  ['ideia','The idea','ideia'],['mapa','Places and route','mapa'],['epoca','Season, light and climate','epoca'],['dias','Day by day','dias'],
  ['preparo','Difficulty and training','preparo'],['equip','Gear','equip'],['docs','Documents and permits','docs'],['saude','Health and safety','saude'],
  ['orc','Budget','orc'],['equipe','Team and guides','equipe'],['imagens','Image plan','imagens'],['conduta','Impact and conduct','conduta'],['revisar','Review and share','revisar']
];
function renderApp(){
  destruirMapas();
  const st=status();
  app.innerHTML = topo() + `<div class="app">
    <nav class="nav" aria-label="Planning steps"><div class="nome-r"><b>${esc(T.nome)}</b><span>${T.paradas.length} places · ${plano().length} days</span></div>
      ${PASSOS.map((p,i)=>{ const opc = p[0]==='imagens' && !(tem('fotografica')||tem('cinema'));
        return `<button class="passo${passo===p[0]?' on':''}" data-act="passo" data-p="${p[0]}"><span class="n">${i+1}</span>${p[1]}${opc?'<span class="opc">optional</span>':''}<span class="st ${st.S[p[0]]||''}"></span></button>`; }).join('')}
    </nav>
    <main class="main" id="main"></main><h1 class="sr">${esc(T.nome)}</h1>
    <aside class="lado" id="lado"></aside></div>`;
  renderPasso(); renderLado();
}
function cab(k){ const i=PASSOS.findIndex(p=>p[0]===k); const P=PASSOS[i];
  const txt={ideia:'What you want to experience, with whom and at what pace. The type of journey changes what the planner asks for in the next steps.',
    mapa:'Choose places from the layers of the Adventure Map or mark your own points. Set how many days at each one and how you get from one to the next.',
    epoca:'The best season for each place according to WAS, daylight hours, sunrise and sunset, and the moon phases on your travel dates.',
    dias:'The day-by-day plan, built from your places and routes, with acclimatization, safety intervals and buffer days.',
    preparo:'The journey’s level, the skills and certifications it calls for and a training plan until departure.',
    equip:'A list built from the places, climate, activities and type of journey. Tick what you already have.',
    docs:'Passport, visas, vaccines, park permits, drone, Indigenous lands and filming. Track the status of each one.',
    saude:'Vaccines and precautions, insurance with the right coverage, emergency contacts and a communication plan.',
    orc:'Estimate by category, per person and for the group. Adjust each amount once you have quotes.',
    equipe:'Who is going, who does what and who can guide. At WAS, guides and members could be recommended here.',
    imagens:'For photography and filmmaking journeys: light at each place, shot list, drone, storage and permissions.',
    conduta:'Carbon footprint of the routes, rules of conduct with wildlife and communities, and the minimum-impact pledge.',
    revisar:'The journey dossier, ready to print, save as PDF, load on a GPS, add to your calendar or share.'}[k];
  return `<div class="cab-passo">${qd(P[2])}<div class="tx"><div class="kick">Step ${i+1} of ${PASSOS.length}</div><h2>${P[1]}</h2><p>${txt}</p></div></div>`;
}
function navPasso(k){ const i=PASSOS.findIndex(p=>p[0]===k); const a=PASSOS[i-1], b=PASSOS[i+1];
  return `<div class="navpasso">${a?`<button class="btn sec2" data-act="passo" data-p="${a[0]}">← ${a[1]}</button>`:''}${b?`<button class="btn" data-act="passo" data-p="${b[0]}">${b[1]} →</button>`:''}</div>`; }

function renderPasso(){
  if(mapa){ mapa.remove(); mapa=null; }
  const m=$('#main'); const f=R[passo]; m.innerHTML = cab(passo) + f() + navPasso(passo);
  if(passo==='mapa') montarMapa();
  $$('.passo').forEach(b=>b.classList.toggle('on',b.dataset.p===passo));
}
function refreshNav(){ const st=status(); $$('.passo').forEach(b=>{ const s=b.querySelector('.st'); if(s) s.className='st '+(st.S[b.dataset.p]||''); }); const n=$('.nome-r'); if(n) n.innerHTML=`<b>${esc(T.nome)}</b><span>${T.paradas.length} places · ${plano().length} days</span>`; }

/* ---------- painel lateral ---------- */
function renderLado(){
  const el=$('#lado'); if(!el) return;
  const st=status(), pl=plano(), A=alertas(), o=orcamento();
  let kmT=0, co2=0; T.paradas.forEach((p,i)=>{ if(i>0){ const t=trecho(i); kmT+=t.km; co2+=t.co2; } });
  const fim=pl.length?pl[pl.length-1].dt:null; const C=2*Math.PI*34;
  el.innerHTML = `<div class="lado-in"><div>
    <div class="anel"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" stroke="#1f2731" stroke-width="8" fill="none"/><circle cx="42" cy="42" r="34" stroke="${st.pct>=80?'#4cc38a':'#b90000'}" stroke-width="8" fill="none" stroke-dasharray="${C*st.pct/100} ${C}" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="700" font-size="19">${st.pct}%</text></svg>
      <div><b>Journey readiness</b><span>${st.pct<40?'Starting to take shape':st.pct<80?'Well on its way':'Almost ready to go'}</span></div></div>
    <div class="mini" id="mini"></div>
    <div class="nums">
      <div><b>${pl.length}</b><span>days${fim?' · until '+MESES[fim.getMonth()]+' '+fim.getDate():''}</span></div>
      <div><b>${fmtN(kmT)}</b><span>km of travel</span></div>
      <div><b>${NIVEL_N[nivel()]}</b><span>journey level</span></div>
      <div><b>${fmtR(o.total/o.pes)}</b><span>per person <span class="sim" style="margin:0">simulated</span></span></div>
      <div><b>${st.eqF}/${st.eqT}</b><span>gear items</span></div>
      <div><b>${st.docF}/${st.docs.length}</b><span>documents in order</span></div>
    </div></div><div>
    <h3>Heads up</h3><div class="alertas">${A.length?A.map(a=>`<div class="al ${a.n==='bad'?'bad':''}" data-act="passo" data-p="${a.go}" role="button" tabindex="0"><b>${esc(a.t)}</b>${esc(a.d)}</div>`).join(''):'<div class="al ok"><b>All good for now</b>No alerts for this journey.</div>'}</div>
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
    <label class="f">Journey name<input type="text" data-b="nome" value="${esc(T.nome)}" maxlength="90"></label>
    <label class="f">Departure date<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label></div></div>
  <div class="card"><h3>What type of journey?</h3><p class="sec">You can choose more than one. The first one you choose is the main type.</p>
    <div class="chips">${TIPOS.map(([k,n])=>{ const i=T.tipos.indexOf(k); return `<button class="chip${i>=0?' on':''}" data-act="tipo" data-k="${k}">${n}${i===0?'<span class="pr">main</span>':''}</button>`; }).join('')}</div></div>
  <div class="card"><h3>Why this journey?</h3><p class="sec">Your intention guides the hard choices. For example: "see the aurora without rushing", "reach my first summit above 5,000 m", "document artisanal fishing".</p>
    <textarea data-b="intencao" placeholder="Write it in one or two sentences">${esc(T.intencao)}</textarea></div>
  <div class="card"><h3>Who is going</h3>
    <div class="chips" style="margin-bottom:14px">${[['solo','Solo'],['dupla','As a pair'],['grupo','In a group'],['familia','As a family'],['equipe','Production crew']].map(([k,n])=>`<button class="chip${T.quem===k?' on':''}" data-act="quem" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="row c3">
      <label class="f">People<input type="number" min="1" max="40" data-b="pessoas" data-num value="${T.pessoas}"></label>
      <label class="f">Group experience<select data-b="exp">${[['iniciante','Beginner'],['intermediario','Intermediate'],['experiente','Experienced'],['expert','Very experienced']].map(([k,n])=>`<option value="${k}"${T.exp===k?' selected':''}>${n}</option>`).join('')}</select></label>
      <label class="f">Pace<select data-b="ritmo">${[['tranquilo','Relaxed'],['moderado','Moderate'],['intenso','Intense']].map(([k,n])=>`<option value="${k}"${T.ritmo===k?' selected':''}>${n}</option>`).join('')}</select></label>
    </div></div>
  ${T.rota?insp():''}`;
function insp(){ const r=D.rotas.find(x=>x.id===T.rota); if(!r) return '';
  return `<div class="card alt"><span class="kick">Inspiration</span><h3 style="margin:6px 0 8px">${esc(r.n)}</h3><p class="sec">${esc(r.quem)} · ${esc(r.per)}${r.dados?' · '+esc(r.dados):''}</p><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk||'Read the profile on WAS')}</a></p>`:''}</div>`; }

R.mapa=()=>{
  const lay=T.camadas||D.layers.map(l=>l.k);
  return `<div class="mapa-wrap">
    <div class="mapa-barra"><div class="busca"><input type="search" id="busca" placeholder="Search for a place, country or activity (e.g. whale, Nepal, canyon)" autocomplete="off"><div class="res-busca" id="res" hidden></div></div>
      <button class="btn peq sec2" data-act="livre">${svg('pin')}Mark a free point</button></div>
    <div class="camadas">${D.layers.map(l=>`<button class="chip cam ${lay.includes(l.k)?'on':'off'}" data-act="camada" data-k="${l.k}"><span class="bol" style="background:${l.cor}"></span>${esc(l.nome)} <span class="cap">${l.n}</span></button>`).join('')}
      <button class="chip cam ${T.verRotas?'on':'off'}" data-act="verRotas"><span class="bol" style="background:#ffcf6b"></span>Historic routes <span class="cap">${D.rotas.length}</span></button></div>
    <div id="mapa"></div><div class="mapa-modo" id="modo">Click on the map to mark a free point · <a href="#" data-act="livre-x">cancel</a></div>
  </div>
  <div class="paradas" id="paradas">${paradasHTML()}</div>`;
};
function paradasHTML(){
  if(!T.paradas.length) return `<div class="vazio">No places yet. Click a point on the map and use “Add to journey”, or search by name.</div>`;
  return `<h3 style="margin:22px 0 12px">Your route</h3>` + T.paradas.map((p,i)=>{ const r=pontoDe(p);
    let tr=''; if(i>0){ const t=trecho(i); const ant=pontoDe(T.paradas[i-1]);
      tr=`<div class="trecho"><select data-act="modo" data-id="${p.id}" aria-label="How to get there">${Object.entries(MODOS).map(([k,M])=>`<option value="${k}"${t.m===k?' selected':''}>${M.n}</option>`).join('')}</select>
      <span class="info">${fmtN(t.km)} km · ${t.M.hd? t.dias+' day'+(t.dias>1?'s':'')+' · '+t.M.n.toLowerCase() : (t.h<1?'less than 1 h':'about '+fmtN(t.h)+' h')+(t.dias?' · '+t.dias+' day'+(t.dias>1?'s':'')+' of travel':'')}</span>
      ${ant&&ant.l==='ME'&&t.m==='aviao'?'<span class="alerta">Post-dive interval included</span>':''}</div>`; }
    return tr+`<div class="parada"><div class="num${p.livre?' livre':''}">${i+1}</div>${r&&r.ft?`<div class="ft" style="background-image:url('${esc(r.ft)}')"></div>`:''}
      <div class="inf"><b>${esc(p.n)}</b><span class="loc">${r?esc(LAY[r.l].nome)+' · '+esc(r.pa)+(r.alt?' · '+fmtN(r.alt)+' m':'')+' · '+esc(difLabel(p)):'Free point'+(p.pa?' · '+esc(paT(p.pa)):'')}</span>
      ${r&&r.g?`<div><a href="${esc(r.g)}" target="_blank" rel="noopener" class="cap">WAS destination guide ↗</a></div>`:''}</div>
      <div class="ctl"><label class="dias" title="Days at this place"><input type="number" min="0" max="60" value="${p.dias|0}" data-act="dias" data-id="${p.id}" aria-label="Days at ${esc(p.n)}"></label><span class="cap">days</span>
      <button class="ico-btn" data-act="sobe" data-id="${p.id}" aria-label="Move up"${i===0?' disabled':''}>${svg('cima')}</button><button class="ico-btn" data-act="desce" data-id="${p.id}" aria-label="Move down"${i===T.paradas.length-1?' disabled':''}>${svg('baixo')}</button>
      <button class="ico-btn" data-act="tira" data-id="${p.id}" aria-label="Remove from journey">${svg('lixo')}</button></div></div>`; }).join('');
}
let modoLivre=false, grpL={}, linhaT=null, pinos=null, rotasL=null;
function montarMapa(){
  if(!window.L){ $('#mapa').innerHTML='<div class="vazio" style="margin:20px">The map needs an internet connection to load.</div>'; return; }
  mapa=L.map('mapa',{worldCopyJump:true,minZoom:2,zoomSnap:.5}).setView([5,-20],2);
  const sat=L.layerGroup([L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,className:'base-sat',attribution:'Imagery © Esri, Maxar, Earthstar Geographics'}),
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,opacity:.85})]);
  const ruas=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,className:'base-osm',attribution:'© OpenStreetMap contributors'});
  sat.addTo(mapa); L.control.layers({'Satellite':sat,'Streets and trails':ruas},null,{position:'topright'}).addTo(mapa);
  L.control.scale({imperial:false}).addTo(mapa);
  grpL={}; D.layers.forEach(l=>grpL[l.k]=L.layerGroup());
  D.pts.forEach(p=>{ const L0=LAY[p.l]; const m=L.circleMarker([p.y,p.x],{radius:p.l==='PQ'?6:5,color:'#000',weight:1,fillColor:L0.cor,fillOpacity:.95});
    m.bindPopup(()=>popHTML(p),{maxWidth:320,minWidth:280,autoPanPadding:[30,30]}); m.on('mouseover',()=>m.setRadius(8)); m.on('mouseout',()=>m.setRadius(p.l==='PQ'?6:5)); m.addTo(grpL[p.l]); });
  const lay=T.camadas||D.layers.map(l=>l.k); lay.forEach(k=>grpL[k]&&grpL[k].addTo(mapa));
  rotasL=L.layerGroup(); D.rotas.forEach(r=>{ const ll=desenrola(r.pts); L.polyline(ll,{color:CORR[r.c],weight:1.6,opacity:.75,dashArray:r.c==='RA'?'5 6':null}).bindPopup(`<div class="pop"><div class="cx"><span class="kick">${esc(D.cats[r.c])} · ${esc(r.per)}</span><h4>${esc(r.n)}</h4><div class="loc">${esc(r.quem)}</div><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk)} ↗</a></p>`:''}</div></div>`,{maxWidth:320}).addTo(rotasL); });
  if(T.verRotas) rotasL.addTo(mapa);
  pinos=L.layerGroup().addTo(mapa); desenharTrajeto(true);
  mapa.on('click',ev=>{ if(!modoLivre) return; const n='Free point '+(T.paradas.filter(p=>p.livre).length+1);
    T.paradas.push({id:uid(),ref:null,n,x:+ev.latlng.lng.toFixed(4),y:+ev.latlng.lat.toFixed(4),dias:1,livre:true,pa:''}); modoLivre=false; $('#modo').classList.remove('on'); mudou(true);
    toast('Free point added. Rename it under “Your route”.'); setTimeout(()=>renomearUltimo(),50); });
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
    <div class="tags" style="margin-top:8px"><span class="tag">${esc((L0.dif&&L0.dif[p.d])||NIVEL_N[p.d])}</span>${p.dias?`<span class="tag">${esc(p.dias)}</span>`:''}${p.km?`<span class="tag">${esc(p.km)} km</span>`:''}${p.me&&p.me.length?`<span class="tag">Best: ${p.me.map(m=>MESES[m-1]).join(', ')}</span>`:''}</div>
    ${p.es&&p.es.length?`<p><b>Species:</b> ${esc(p.es.join(', '))}</p>`:''}
    <p>${esc(p.f)}</p>
    ${p.pf?`<p class="cap">Explorer: <a href="${esc(p.pf[1])}" target="_blank" rel="noopener">${esc(p.pf[0])} ↗</a></p>`:''}
    ${p.g?`<p class="cap"><a href="${esc(p.g)}" target="_blank" rel="noopener">Full guide on WAS ↗</a></p>`:''}
    <div class="btns">${naRota?'<span class="tag r">Already on the journey</span>':`<button class="btn peq" data-act="add" data-i="${p.i}">${svg('mais')}Add to journey</button>`}</div>
    ${p.ft?`<div class="cr">Photo: ${esc(p.fa)} · ${esc(p.fl)}</div>`:''}</div></div>`; }

R.epoca=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const datas=pl.map(d=>d.dt);
  const luas=[]; let last=null; datas.forEach(dt=>{ const l=lua(new Date(dt.valueOf())); const tipo=l.il<.06?'New moon':l.il>.94?'Full moon':null; if(tipo&&tipo!==last){ luas.push([dt,tipo,l.il]); } last=tipo; });
  return `<p class="sec" style="max-width:820px">Best months: Adventure Map data. Light and moon: real astronomical calculation <span class="real">real</span>. Times are approximate local solar time, which may differ from the official time zone by up to about 1 hour. Temperature and rainfall would be added here in the final product, from climate normals.</p>
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p)||pl.find(x=>x.id&&x.id.includes(p.id)); const dt=d?d.dt:addDias(T.inicio,0); const m=dt.getMonth()+1;
    const lz=luzDia(dt,p); let solH='';
    if(lz.polar) solH=`<div class="sol"><div><b>${lz.polar==='dia'?'Midnight sun':'Polar night'}</b><span>${lz.polar==='dia'?'the sun does not set on this date':'the sun does not rise on this date'}</span></div></div>`;
    else { const s=lz.s; const g=Array.isArray(s.dourada)?s.dourada:null; const c=Array.isArray(s.civil)?s.civil:null;
      const h0=x=>{ const t=new Date(x.valueOf()+p.x/15*3600e3); return t.getUTCHours()+t.getUTCMinutes()/60; };
      solH=`<div class="sol"><div><b>${horaSolar(s.nascer[0],p.x)}</b><span>sunrise</span></div><div><b>${horaSolar(s.nascer[1],p.x)}</b><span>sunset</span></div><div><b>${fmtN(lz.h,1)} h</b><span>of daylight</span></div><div><b>${g?horaSolar(g[1],p.x):'—'}</b><span>start of the evening golden hour</span></div></div>
      <div class="barra-luz" title="Night, twilight and day across the 24 hours">${c?`<i style="left:${h0(c[0])/24*100}%;width:${(h0(s.nascer[0])-h0(c[0]))/24*100}%;background:#3c5a8a"></i>`:''}<i style="left:${h0(s.nascer[0])/24*100}%;width:${(h0(s.nascer[1])-h0(s.nascer[0]))/24*100}%;background:#c9a24a"></i>${c?`<i style="left:${h0(s.nascer[1])/24*100}%;width:${(h0(c[1])-h0(s.nascer[1]))/24*100}%;background:#3c5a8a"></i>`:''}</div>
      <div class="leg" style="margin-top:6px"><span>0 h</span><span style="margin-left:auto">24 h</span></div>`; }
    const ok=!r||!r.me||!r.me.length||r.me.includes(m);
    return `<div class="card"><div style="display:flex;gap:12px;align-items:baseline;flex-wrap:wrap"><h3 style="margin:0">${esc(p.n)}</h3><span class="sec">arrival ${fmtD(dt)} · latitude ${fmtN(Math.abs(p.y),1)}° ${p.y>=0?'N':'S'}</span></div>
      ${r&&r.me&&r.me.length?`<div class="meses">${MESES.map((n,i)=>`<span class="${r.me.includes(i+1)?'b':''}${i+1===m?' v'+(ok?'':' ruim'):''}">${n}</span>`).join('')}</div>
      <div class="leg"><span><i style="background:#1f5a3c"></i>best season according to WAS</span><span><i style="outline:2px solid #fff;outline-offset:-2px"></i>month of your visit</span></div>
      ${ok?'<p class="st-ok" style="margin:8px 0 0;font-size:15px">You arrive in the best season.</p>':`<p class="st-warn" style="margin:8px 0 0;font-size:15px">You arrive outside the best season. Consider changing the date or the order of the places.</p>`}`:'<p class="cap">No best-season information for this point.</p>'}
      ${solH}</div>`; }).join('')}
  <div class="card"><h3>Moon during the trip <span class="real">real</span></h3><p class="sec">A new moon is the best window for starry skies and the Milky Way. A full moon lights up night landscapes and can get in the way of stargazing.</p>
    <div class="lua">${luas.length?luas.map(([dt,t,il])=>`<span class="${t==='New moon'?'boa':''}">${t} · ${fmtD(dt)}</span>`).join(''):'<span>No new or full moon on your travel dates.</span>'}</div></div>`;
};
function vazioMapa(){ return `<div class="vazio">Choose at least one place in the “Places and route” step.<div class="btns"><button class="btn" data-act="passo" data-p="mapa">Go to the map</button></div></div>`; }

R.dias=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano();
  return `<div class="card"><div class="row c3">
    <label class="f">Departure date<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label>
    <label class="f">Buffer days at the end<input type="number" min="0" max="10" data-b="margem" data-num value="${T.margem}"></label>
    <label class="f">Automatic acclimatization<select data-b="aclim" data-bool><option value="1"${T.aclim?' selected':''}>On (above 3,000 m)</option><option value="0"${!T.aclim?' selected':''}>Off</option></select></label></div>
    <p class="ajuda">The plan rebuilds itself when you change places, days or routes. Your notes for each day are kept.</p></div>
  <div class="card"><div class="leg" style="margin-bottom:14px"><span><i style="border:2px solid var(--red);border-radius:50%"></i>at the place</span><span><i style="border:2px solid #64aaff;border-radius:50%"></i>travel</span><span><i style="border:2px solid var(--warn);border-radius:50%"></i>acclimatization</span><span><i style="border:2px solid #6e7884;border-radius:50%"></i>buffer and safety</span></div>
  <div class="tl">${pl.map((d,i)=>`<div class="d ${d.tipo}"><div class="dt">Day ${i+1} · ${fmtD(d.dt)}</div><div class="tt">${esc(d.t)}</div>${d.ds?`<div class="ds">${esc(d.ds)}</div>`:''}
    <input type="text" placeholder="Note for the day: lodging, times, contact…" value="${esc(T.notas[d.id]||'')}" data-act="nota" data-id="${d.id}"></div>`).join('')}</div></div>`;
};

R.preparo=()=>{
  if(!T.paradas.length) return vazioMapa();
  const nv=nivel(), hab=habilidades(); const sem={1:2,2:4,3:8,4:12,5:20}[nv]||2;
  const hoje=new Date(); const ini=new Date(T.inicio+'T12:00:00'); const falta=Math.round((ini-hoje)/(7*864e5));
  const fases=[['Aerobic base','Walking, easy running, cycling or swimming, 3 to 4 times a week, building volume gradually.'],['Strength and endurance','Legs, core and back. Climbs with a loaded pack and long sessions at the weekend.'],['Specific','Simulate the journey: elevation, the real weight of your pack, cold, water or altitude, depending on the journey.'],['Taper','Reduce volume in the last week, sleep well and check your gear.']];
  return `<div class="card"><h3>Journey level: ${NIVEL_N[nv]}</h3><p class="sec">The level is that of the most demanding place, according to the difficulty scales of each layer of the Adventure Map.</p>
    <div class="tab-wrap"><table class="tab"><thead><tr><th>Place</th><th>Layer</th><th>Difficulty</th></tr></thead><tbody>${T.paradas.filter(pontoDe).map(p=>{ const r=pontoDe(p); return `<tr><td>${esc(p.n)}</td><td>${esc(LAY[r.l].nome)}</td><td>${'●'.repeat(r.d)}<span style="color:#333">${'●'.repeat(5-r.d)}</span> ${esc(difLabel(p))}</td></tr>`; }).join('')}</tbody></table></div></div>
  <div class="card"><h3>Skills and certifications</h3>${hab.length?`<div class="ck">${hab.map(h=>ckItem('hb:'+h.k,h.t,'Because of: '+h.p)).join('')}</div>`:'<p class="sec">No technical skills required by the places you chose.</p>'}</div>
  <div class="card"><h3>Suggested training plan: ${sem} weeks</h3>
    <p class="sec">${falta>0?`About ${falta} weeks to go until departure. `+(falta<sem?'<span class="st-warn">Time is short for the journey’s level. Consider postponing or choosing easier places.</span>':'There is time to prepare calmly.'):'Choose a departure date in the future.'}</p>
    <div class="tl" style="margin-top:14px">${fases.map((f,i)=>`<div class="d"><div class="dt">Weeks ${Math.round(sem*i/4)+1} to ${Math.round(sem*(i+1)/4)}</div><div class="tt">${f[0]}</div><div class="ds">${f[1]}</div></div>`).join('')}</div></div>
  <div class="card"><h3>Self-assessment</h3><div class="ck">${[['auto:sau','I had a medical check-up and, if the journey goes above 3,000 m or involves diving, I talked to a doctor about it'],['auto:car','I can walk 6 hours with a pack without getting exhausted'],['auto:nad','I can swim safely'],['auto:alt','I have been above 3,000 m and know how my body reacts'],['auto:ok','I read the requirements of each place and I think the group is up to it']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};
function ckItem(k,t,por,w){ const on=!!T.ck[k]; return `<label class="${on?'feito':''}"><input type="checkbox" data-act="ck" data-k="${esc(k)}"${on?' checked':''}><span class="tx">${esc(t)}${por?`<span class="por">${esc(por)}</span>`:''}</span>${w?`<span class="w">${w}</span>`:''}</label>`; }

R.equip=()=>{
  const G=equipamento(); let pt=0, pf=0; G.forEach(g=>g.its.forEach(i=>{ pt+=i.w; if(T.ck['eq:'+i.n]) pf+=i.w; }));
  return `<div class="card alt"><div class="row"><label class="f">Taking a drone?<select data-b="drone" data-bool><option value="0"${!T.drone?' selected':''}>No</option><option value="1"${T.drone?' selected':''}>Yes</option></select></label>
    <div><span class="kick">Estimated weight of the list</span><div style="font-family:var(--fT);font-size:26px;color:#fff;font-weight:700">${fmtN(pt/1000,1)} kg <span class="sim">simulated</span></div><span class="cap">excluding everyday clothes and group items</span></div></div></div>
  ${G.map(g=>`<div class="card grupo-ck"><h4>${esc(g.t)}<small>${esc(g.por)}</small></h4><div class="ck">${g.its.map(i=>ckItem('eq:'+i.n,i.n,'',i.w?fmtN(i.w)+' g':'')).join('')}</div></div>`).join('')}
  <div class="card"><h3>Add an item</h3><div class="add-item"><input type="text" id="novoItem" placeholder="E.g. 10x42 binoculars"><button class="btn peq" data-act="addItem">${svg('mais')}Add</button></div></div>`;
};

R.docs=()=>{
  if(!T.paradas.length) return vazioMapa();
  const L0=documentos();
  return `<p class="sec" style="max-width:820px">General guidance based on the countries, places and type of journey. Rules and fees change: always confirm with the official source listed. <span class="sim">simplified rules</span></p>
  <div class="card">${L0.map(d=>{ const s=T.docs[d.k]||'fazer'; return `<div class="doc"><div><b>${esc(d.t)}</b><p>${esc(d.p)}</p><div class="onde">Where: ${esc(d.onde)}</div><div class="por">${esc(d.por)}</div></div>
    <select data-act="doc" data-k="${d.k}" class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':''}" aria-label="Status">${[['fazer','To do'],['pedido','Requested, waiting'],['ok','In order'],['na','Not applicable']].map(([k,n])=>`<option value="${k}"${s===k?' selected':''}>${n}</option>`).join('')}</select></div>`; }).join('')}</div>`;
};

R.saude=()=>{
  const nv=nivel(); const alt=Math.max(0,...T.paradas.map(altDe));
  const cob=[['med','Medical and hospital expenses'],['evac','Rescue and medical air evacuation'+(nv>=4?' (essential for this journey)':'')],['alt','High-altitude activities'+(alt?' up to '+fmtN(alt)+' m':'')],['merg','Scuba diving (specific insurance, such as DAN)'],['radical','Adventure sports'],['canc','Cancellation and interruption'],['bag','Baggage and equipment']];
  const rel=['med','evac']; if(alt>=2500) rel.push('alt'); if(temL('ME','NF')) rel.push('merg'); if(nv>=3||temL('AT','X')) rel.push('radical');
  return `<div class="card"><h3>Insurance: coverage the journey calls for</h3><div class="ck">${cob.filter(c=>rel.includes(c[0])||['canc','bag'].includes(c[0])).map(([k,n])=>`<label class="${T.seguro[k]?'feito':''}"><input type="checkbox" data-act="seg" data-k="${k}"${T.seguro[k]?' checked':''}><span class="tx">${esc(n)}${rel.includes(k)?'<span class="por">Recommended for this journey</span>':''}</span></label>`).join('')}</div></div>
  <div class="card"><h3>Health</h3><div class="ck">${[
    ['sa:con','Travel medicine consultation (4 to 8 weeks before)'],
    ...(alt>=3000?[['sa:alt','Altitude sickness plan: warning signs, immediate descent, medication discussed with a doctor']]:[]),
    ...(tropical()?[['sa:trop','Mosquito protection and information on malaria and dengue in the region']]:[]),
    ...(frio()?[['sa:frio','Preventing hypothermia and frostbite (layers, dry hands and feet)']]:[]),
    ...(temL('ME','NF')?[['sa:dci','Nearest hyperbaric chamber noted and pre-flight interval respected']]:[]),
    ['sa:kit','Group first-aid kit and someone trained in wilderness first aid'],
    ['sa:rem','Double supply of regular medication, in your carry-on']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>
  <div class="card"><h3>Emergency contacts</h3><p class="sec">Who stays at home following the trip, and who should be told if something goes wrong.</p>
    ${T.contatos.map((c,i)=>`<div class="pessoa"><label class="f">Name<input type="text" value="${esc(c.n)}" data-act="ct" data-i="${i}" data-f="n"></label><label class="f">Phone<input type="text" value="${esc(c.tel)}" data-act="ct" data-i="${i}" data-f="tel"></label><label class="f">Relationship<input type="text" value="${esc(c.rel)}" data-act="ct" data-i="${i}" data-f="rel"></label><button class="ico-btn" data-act="ctx" data-i="${i}" aria-label="Remove">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="ct+">${svg('mais')}Add contact</button></div></div>
  <div class="card"><h3>Communication and check-in plan</h3><div class="row">
    <label class="f">How you will communicate where there is no signal<select data-b="com">${['Phone with a local SIM','Satellite messenger (messages and SOS)','Satellite phone','Operator’s radio'].map(o=>`<option${T.com===o?' selected':''}>${o}</option>`).join('')}</select></label>
    <label class="f">If there is no news within…<select data-b="checkin">${['12 hours','24 hours','48 hours'].map(o=>`<option${T.checkin===o?' selected':''}>${o}</option>`).join('')}</select></label></div>
    <p class="ajuda">The emergency contact receives the day-by-day plan and alerts the insurer, the operator and the consulate if the group goes past this deadline without news.</p></div>`;
};

R.orc=()=>{
  if(!T.paradas.length) return vazioMapa();
  const o=orcamento(); const max=Math.max(...o.cats.map(c=>c[2]),1);
  return `<p class="sec" style="max-width:820px">A sample estimate, based on the region of each place, the days, routes and activities. Replace any amount with your own quote. Amounts in Brazilian reais (R$). <span class="sim">simulated</span></p>
  <div class="card"><div class="barras">${o.cats.map(c=>`<div class="b"><span>${c[1]}</span><i style="width:${Math.max(2,c[2]/max*100)}%"></i><span>${fmtR(c[2])}</span></div>`).join('')}<div class="b"><span>15% contingency</span><i style="width:${o.cont/max*100}%;background:#3c4654"></i><span>${fmtR(o.cont)}</span></div></div>
    <div class="total"><span class="sec">Total for ${o.pes} ${o.pes>1?'people':'person'}</span><b>${fmtR(o.total)}</b><span class="sec">${fmtR(o.total/o.pes)} per person</span></div></div>
  <div class="card"><h3>Adjust amounts</h3><div class="row c3">${o.cats.map(c=>`<label class="f">${c[1]}<input type="number" min="0" step="50" data-act="orc" data-k="${c[0]}" value="${T.orc[c[0]]!=null&&T.orc[c[0]]!==''?T.orc[c[0]]:''}" placeholder="${Math.round(c[2])}"></label>`).join('')}</div>
    <div class="ck" style="margin-top:12px">${`<label class="${T.orcOk?'feito':''}"><input type="checkbox" data-act="orcOk"${T.orcOk?' checked':''}><span class="tx">I reviewed the budget with real quotes</span></label>`}</div></div>
  <div class="card alt"><h3>Cost by region</h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Place</th><th>Region</th><th class="n">Reference daily cost</th></tr></thead><tbody>${T.paradas.map(p=>`<tr><td>${esc(p.n)}</td><td>${IDX_N[regiao(p)]}</td><td class="n">${fmtR(IDX[regiao(p)]*.85)}</td></tr>`).join('')}</tbody></table></div></div>`;
};

R.equipe=()=>{
  const papeis=['Expedition leader','Navigation','First aid','Photography','Camera and directing','Sound','Logistics','Cooking','Participant'];
  const parc=[];
  T.paradas.filter(pontoDe).slice(0,6).forEach(p=>{ const r=pontoDe(p); const tipo={CU:'Certified mountain guide',ME:'Dive center',TK:'Trekking guide',FA:'Naturalist guide',BA:'Whale-watching operator',P:'Polar operator (IAATO)',VU:'Volcano guide',AT:'School and certified instructors',O:'4x4 rental with support',PQ:'Park guide',NF:'Wreck diving center'}[r.l]||'Local operator';
    parc.push({n:tipo, l:p.n}); });
  return `<div class="card"><h3>Who is going</h3>${T.equipe.map((m,i)=>`<div class="pessoa"><label class="f">Name<input type="text" value="${esc(m.n)}" data-act="eq" data-i="${i}" data-f="n"></label><label class="f">Role<select data-act="eq" data-i="${i}" data-f="papel">${papeis.map(p=>`<option${m.papel===p?' selected':''}>${p}</option>`).join('')}</select></label><label class="f">Contact<input type="text" value="${esc(m.c)}" data-act="eq" data-i="${i}" data-f="c"></label><button class="ico-btn" data-act="eqx" data-i="${i}" aria-label="Remove">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="eq+">${svg('mais')}Add person</button></div></div>
  ${parc.length?`<div class="card"><h3>Suggested guides and operators <span class="sim">example</span></h3><p class="sec">In the final product, this list would come from a network curated by WAS: reviewed operators, certified guides and members who have been to each place.</p>
    <div class="parc">${parc.map(x=>`<div><b>${esc(x.n)}</b><span>${esc(x.l)}</span><span class="cap">Rating, credentials and contact would appear here</span></div>`).join('')}</div></div>`:''}
  <div class="perg"><b>Question for WAS:</b> would guide and operator recommendations be open to everyone or a supporter benefit? Partner operators could carry a WAS good-practice seal.</div>`;
};

R.imagens=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const fmt={h265:['4K H.265 (100 Mb/s)',.75],prores:['4K ProRes 422 HQ',5.3],raw:['RAW photos (per 100 photos)',5],h264:['HD H.264 (50 Mb/s)',.37]};
  const diasF=pl.filter(d=>d.p).length; const c=T.cine; const gbDia=(fmt[c.fmt]||fmt.h265)[1]*60*(c.horas||0)*(c.cams||1); const tot=gbDia*diasF;
  const sug={VU:['Lava or fumarole at blue hour','Crater silhouette with stars'],BA:['Whale breach with a telephoto','Tail fluke in side light in the morning'],FA:['Portrait at the animal’s eye level','Behavior: feeding, young, interaction'],CU:['Mountain in first light (alpenglow)','Human scale: rope team on the ridge'],TK:['Winding trail with a small figure in the frame','Camp lit up at night'],ME:['Silhouette against the surface','Reef macro'],P:['Ice with a low sun','Ship or tent for scale'],NF:['Ship’s bow with a diver for scale'],PQ:['The park’s signature landscape at golden hour'],AT:['Action at high speed and low angle'],O:['Vehicle raising dust against the sun'],L:['Trail landmark'],X:['Empty horizon and the boat or swimmer'],B2:['Road seen from above with the cyclist'],E2:['Historic place with a detail that tells the story']};
  return `${!(tem('fotografica')||tem('cinema'))?'<div class="perg">This step is optional for your type of journey. It appears in full for photography and filmmaking journeys.</div>':''}
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p); const dt=d?d.dt:new Date(T.inicio+'T12:00:00'); const lz=luzDia(dt,p); const s=lz.s; const lst=T.imagens[p.id]||[];
    let luz=''; if(lz.polar) luz=lz.polar==='dia'?'Midnight sun: low, golden light around solar midnight.':'Polar night: blue twilight light at midday and a chance of aurora.';
    else { const g=Array.isArray(s.dourada)?s.dourada:null, c2=Array.isArray(s.civil)?s.civil:null; luz=`Morning blue hour ${c2?horaSolar(c2[0],p.x):'—'} to ${horaSolar(s.nascer[0],p.x)} · golden hour until ${g?horaSolar(g[0],p.x):'—'} · evening golden hour from ${g?horaSolar(g[1],p.x):'—'} · sunset ${horaSolar(s.nascer[1],p.x)}`; }
    const l=lua(dt);
    return `<div class="card"><h3>${esc(p.n)}</h3><p class="sec" style="margin-bottom:6px">${fmtD(dt)} · ${luz} <span class="real">real</span></p><p class="cap">Moon ${Math.round(l.il*100)}% illuminated${l.il<.25?' · a good night for stars':''}</p>
      ${r&&sug[r.l]?`<div class="chips" style="margin:10px 0">${sug[r.l].map(x=>`<button class="chip cam" data-act="cena+" data-id="${p.id}" data-t="${esc(x)}">${svg('mais')}${esc(x)}</button>`).join('')}</div>`:''}
      <div class="ck">${lst.map((x,i)=>`<label class="${x.ok?'feito':''}"><input type="checkbox" data-act="cenaok" data-id="${p.id}" data-i="${i}"${x.ok?' checked':''}><span class="tx">${esc(x.t)}</span><button class="ico-btn" data-act="cenax" data-id="${p.id}" data-i="${i}" aria-label="Remove" style="margin-left:auto">${svg('lixo')}</button></label>`).join('')}</div>
      <div class="add-item"><input type="text" placeholder="New scene or shot you want" data-cena="${p.id}"><button class="btn peq" data-act="cena+" data-id="${p.id}">${svg('mais')}Add</button></div></div>`; }).join('')}
  <div class="card"><h3>Storage and backup</h3><div class="row c3">
    <label class="f">Main format<select data-act="cine" data-f="fmt">${Object.entries(fmt).map(([k,v])=>`<option value="${k}"${c.fmt===k?' selected':''}>${v[0]}</option>`).join('')}</select></label>
    <label class="f">Cameras recording<input type="number" min="1" max="10" value="${c.cams}" data-act="cine" data-f="cams"></label>
    <label class="f">${c.fmt==='raw'?'Hundreds of photos per day':'Hours recorded per day'}<input type="number" min="0" max="24" step=".5" value="${c.horas}" data-act="cine" data-f="horas"></label></div>
    <div class="total"><span class="sec">${diasF} shooting days · ${fmtN(gbDia)} GB per day</span><b>${fmtN(tot/1000,1)} TB</b><span class="sec">${fmtN(tot*3/1000,1)} TB with 3-2-1 backup (three copies)</span></div></div>
  <div class="card"><h3>Image permissions</h3><div class="ck">${[['im:ces','Image releases for identifiable people'],['im:com','Agreement with traditional and Indigenous communities before photographing or filming'],['im:loc','Location and protected-area permissions'],['im:dr','Drone registered and flights authorized at each location']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};

R.conduta=()=>{
  if(!T.paradas.length) return vazioMapa();
  let tot=0; const linhas=T.paradas.slice(1).map((p,i)=>{ const t=trecho(i+1); tot+=t.co2; return `<tr><td>${esc(t.a.n)} → ${esc(t.b.n)}</td><td>${t.M.n}</td><td class="n">${fmtN(t.km)} km</td><td class="n">${fmtN(t.co2)} kg</td></tr>`; }).join('');
  const regras=[];
  if(temL('BA')) regras.push(['Whales','Respect the minimum distance set by local law. In Brazil, boats must stay at least 100 m from whales (Ibama Ordinance 117/1996), with the engine in neutral near them.']);
  if(temL('FA')) regras.push(['Wildlife','Do not feed, call or surround animals. With primates, wear a mask and keep your distance: they catch our diseases.']);
  if(temL('ME','NF')) regras.push(['Reefs and wrecks','Buoyancy control, no touching coral, reef-safe sunscreen and nothing taken from wrecks.']);
  if(temL('P')) regras.push(['Polar regions','Follow IAATO guidelines: 5 m from penguins, boots washed between landings, no waste left ashore.']);
  if(temL('CU','TK','L','VU')) regras.push(['Mountain and trail','Pack out all waste, including food scraps and toilet paper. Stay on the trail and use dry toilets where available.']);
  if(tem('cultural')) regras.push(['Communities','Ask permission before photographing people, hire local guides and services, and respect sacred places.']);
  return `<div class="card"><h3>Carbon footprint of the routes <span class="sim">approximate factors</span></h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Leg</th><th>How</th><th class="n">Distance</th><th class="n">CO₂ per person</th></tr></thead><tbody>${linhas||'<tr><td colspan="4">No routes yet.</td></tr>'}</tbody></table></div>
    <div class="total"><span class="sec">Total per person</span><b>${fmtN(tot/1000,2)} t CO₂</b><span class="sec">${fmtN(tot/1000*T.pessoas,2)} t for the group</span></div>
    <p class="ajuda">To reduce it: fewer short flights, train or bus when possible, more days at each place. To offset it, WAS could recommend restoration projects linked to places on the map.</p></div>
  ${regras.length?`<div class="card"><h3>Conduct at the places on your journey</h3>${regras.map(r=>`<div class="doc" style="grid-template-columns:1fr"><div><b>${r[0]}</b><p>${r[1]}</p></div></div>`).join('')}</div>`:''}
  <div class="card"><h3>Minimum-impact principles</h3><div class="tl">${['Plan ahead and prepare','Travel and camp on durable surfaces','Dispose of waste properly','Leave what you find','Minimize campfire impacts','Respect wildlife','Be considerate of other visitors'].map((t,i)=>`<div class="d"><div class="tt" style="font-size:16px">${i+1}. ${t}</div></div>`).join('')}</div>
    <p class="cap">Based on the seven Leave No Trace principles.</p>
    <div class="ck">${`<label class="${T.compromisso?'feito':''}"><input type="checkbox" data-act="comp"${T.compromisso?' checked':''}><span class="tx">I take the WAS conduct pledge for this journey</span></label>`}</div></div>`;
};

R.revisar=()=>{
  const pl=plano(), o=orcamento(), st=status();
  return `<div class="exp no-print">
    <button data-act="print">${qd('imprimir',1)}<div><b>Print or save as PDF</b><span>Full journey dossier</span></div></button>
    <button data-act="gpx">${qd('pin',1)}<div><b>Download GPX</b><span>Places and route for GPS devices and map apps</span></div></button>
    <button data-act="ics">${qd('cal',1)}<div><b>Download calendar</b><span>Day by day in your calendar (.ics)</span></div></button>
    <button data-act="link">${qd('compart',1)}<div><b>Copy journey link</b><span>Whoever opens it gets a copy</span></div></button>
    <button data-act="json">${qd('baixar',1)}<div><b>Download journey file</b><span>To keep or import later</span></div></button>
    <button data-act="enviar">${qd('enviar',1)}<div><b>Send to WAS <span class="apoio">supporter</span></b><span>Ask an expert for a review (simulated)</span></div></button>
  </div>
  <div class="dossie">
    <div class="card"><span class="kick">${T.tipos.map(t=>TIPO_N[t]).join(' · ')}</span><h2 style="margin:6px 0 10px">${esc(T.nome)}</h2>${T.intencao?`<p class="lead">${esc(T.intencao)}</p>`:''}
      <div class="tab-wrap"><table class="tab"><tbody>
      <tr><td>Dates</td><td>${pl.length?fmtDL(pl[0].dt)+' to '+fmtDL(pl[pl.length-1].dt)+' · '+pl.length+' days':'—'}</td></tr>
      <tr><td>Group</td><td>${T.pessoas} ${T.pessoas>1?'people':'person'} · ${({solo:'solo',dupla:'as a pair',grupo:'in a group',familia:'as a family',equipe:'production crew'})[T.quem]} · ${({tranquilo:'relaxed',moderado:'moderate',intenso:'intense'})[T.ritmo]||T.ritmo} pace</td></tr>
      <tr><td>Level</td><td>${NIVEL_N[nivel()]}</td></tr>
      <tr><td>Places</td><td>${T.paradas.map((p,i)=>(i+1)+'. '+esc(p.n)).join(' · ')||'—'}</td></tr>
      <tr><td>Budget</td><td>${fmtR(o.total)} (${fmtR(o.total/o.pes)} per person) <span class="sim">simulated</span></td></tr>
      <tr><td>Readiness</td><td>${st.pct}% · ${st.docF} of ${st.docs.length} documents in order · ${st.eqF} of ${st.eqT} gear items</td></tr>
      <tr><td>Emergency</td><td>${T.contatos.map(c=>esc(c.n)+' '+esc(c.tel)).join(' · ')||'<span class="st-warn">not set</span>'}${T.com?' · '+esc(T.com):''}</td></tr>
      </tbody></table></div></div>
    <div class="card"><h3>Day by day</h3><div class="tab-wrap"><table class="tab"><tbody>${pl.map((d,i)=>`<tr><td style="white-space:nowrap">Day ${i+1}<br><span class="cap">${fmtD(d.dt)}</span></td><td><b style="color:inherit">${esc(d.t)}</b>${T.notas[d.id]?'<br><span class="cap">'+esc(T.notas[d.id])+'</span>':''}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><h3>Documents and permits</h3><div class="tab-wrap"><table class="tab"><tbody>${documentos().map(d=>{const s=T.docs[d.k]||'fazer';return `<tr><td>${esc(d.t)}</td><td class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':'st-bad'}">${({fazer:'To do',pedido:'Waiting',ok:'In order',na:'Not applicable'})[s]}</td></tr>`;}).join('')}</tbody></table></div></div>
    ${inspirar()}
  </div>
  <div class="card alt no-print"><h3>Supporter features <span class="sim">proposal</span></h3><p class="sec">Ideas to connect the planner to the WAS supporter model. None of this works yet.</p>
    <div class="ck">${['Journey review by a WAS expert or member','PDF dossier with WAS branding and high-resolution maps','Offline maps and season and weather alerts by email','Publish the expedition report on the WAS website, with photos and route, and become a member through your work'].map(t=>`<label><input type="checkbox" disabled><span class="tx">${t}</span></label>`).join('')}</div></div>`;
};
function inspirar(){
  const set=new Map();
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(r&&r.pf) set.set(r.pf[1],{t:r.pf[0],s:'Explorer linked to '+r.n,u:r.pf[1]}); if(r&&r.g) set.set(r.g,{t:'Guide: '+r.n,s:'Full destination page on WAS',u:r.g}); });
  D.rotas.forEach(r=>{ if(!r.link) return; if(T.paradas.some(p=>r.pts.some(q=>km(p,{x:q[0],y:q[1]})<150))) set.set(r.link,{t:r.n,s:r.quem+' · '+r.per,u:r.link}); });
  if(!set.size) return '';
  return `<div class="card no-print"><h3>Get inspired on WAS</h3><p class="sec">Explorers, historic routes and destination guides connected to the places on your journey.</p><div class="insp">${[...set.values()].slice(0,9).map(x=>`<a class="c" href="${esc(x.u)}" target="_blank" rel="noopener"><b>${esc(x.t)} ↗</b><span>${esc(x.s)}</span></a>`).join('')}</div></div>`;
}

/* ---------- exportações ---------- */
function baixar(nome,txt,tipo){ const b=new Blob([txt],{type:tipo}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=nome; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }
const slugf=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'roteiro';
const xesc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function gpx(){ const w=T.paradas.map((p,i)=>`  <wpt lat="${p.y}" lon="${p.x}"><name>${i+1}. ${xesc(p.n)}</name></wpt>`).join('\n');
  const r=T.paradas.map(p=>`    <rtept lat="${p.y}" lon="${p.x}"><name>${xesc(p.n)}</name></rtept>`).join('\n');
  baixar(slugf(T.nome)+'.gpx',`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="WAS Journeys (prototype)" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${xesc(T.nome)}</name></metadata>\n${w}\n  <rte><name>${xesc(T.nome)}</name>\n${r}\n  </rte>\n</gpx>\n`,'application/gpx+xml'); }
function ics(){ const pl=plano(); const f=d=>isoD(d).replace(/-/g,''); const e=s=>String(s).replace(/[,;\\]/g,m=>'\\'+m).replace(/\n/g,'\\n');
  const ev=pl.map((d,i)=>{ const n=new Date(d.dt); n.setDate(n.getDate()+1); return `BEGIN:VEVENT\r\nUID:${T.id}-${i}@roteiros.was\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z\r\nDTSTART;VALUE=DATE:${f(d.dt)}\r\nDTEND;VALUE=DATE:${f(n)}\r\nSUMMARY:${e('Day '+(i+1)+': '+d.t)}\r\nDESCRIPTION:${e((d.ds||'')+(T.notas[d.id]?'\n'+T.notas[d.id]:''))}\r\nEND:VEVENT`; }).join('\r\n');
  baixar(slugf(T.nome)+'.ics',`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WAS//Roteiros prototipo//PT\r\nCALSCALE:GREGORIAN\r\n${ev}\r\nEND:VCALENDAR\r\n`,'text/calendar'); }
function linkCompart(){ const s=btoa(unescape(encodeURIComponent(JSON.stringify(T)))); const u=location.href.split('#')[0]+'#r='+s;
  const ok=()=>toast('Link copied. Whoever opens it gets a copy of this journey.');
  if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(u).then(ok,()=>{prompt0(u);}); else prompt0(u); }
function prompt0(u){ const t=document.createElement('textarea'); t.value=u; document.body.appendChild(t); t.select(); try{document.execCommand('copy'); toast('Link copied.');}catch(e){toast('Could not copy.');} t.remove(); }
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
    case 'zero-mapa': abrir(novo({nome:'Journey from the map'}),'mapa'); break;
    case 'ir-sec': document.getElementById(b.dataset.sec).scrollIntoView({behavior:'smooth'}); break;
    case 'modelo': abrir(criarModelo(MODELOS.find(m=>m.id===b.dataset.id)),'mapa'); toast('Template copied to your journeys. Change whatever you like.'); break;
    case 'rota': abrir(criarDeRota(b.dataset.id),'mapa'); T.verRotas=true; renderPasso(); toast('Journey created with the map places near the route.'); break;
    case 'abrir': abrir(DB.rot.find(r=>r.id===b.dataset.id)); break;
    case 'apagar': { const r=DB.rot.find(x=>x.id===b.dataset.id); if(b.dataset.conf!=='1'){ b.dataset.conf='1'; b.style.borderColor='#ff6b5e'; b.title='Click again to delete “'+(r?r.nome:'')+'”'; toast('Click the bin again to delete “'+(r?r.nome:'')+'”.'); setTimeout(()=>{b.dataset.conf='';b.style.borderColor='';},4000); break; }
      DB.rot=DB.rot.filter(x=>x.id!==b.dataset.id); try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){} renderHome(); toast('Journey deleted.'); break; }
    case 'passo': passo=b.dataset.p; renderPasso(); { const y=app.getBoundingClientRect().top+window.scrollY-70; window.scrollTo({top:Math.max(0,y)}); } break;
    case 'tipo': { const k=b.dataset.k, i=T.tipos.indexOf(k); if(i>=0){ if(T.tipos.length>1) T.tipos.splice(i,1); } else T.tipos.push(k); save(); renderPasso(); refreshNav(); renderLado(); renderNavOpc(); break; }
    case 'quem': T.quem=b.dataset.k; if(T.quem==='solo') T.pessoas=1; if(T.quem==='dupla') T.pessoas=2; save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'camada': { const k=b.dataset.k; let lay=T.camadas||D.layers.map(l=>l.k); if(lay.includes(k)){ lay=lay.filter(x=>x!==k); mapa&&mapa.removeLayer(grpL[k]); b.classList.replace('on','off'); } else { lay.push(k); mapa&&grpL[k].addTo(mapa); b.classList.replace('off','on'); } T.camadas=lay; save(); break; }
    case 'verRotas': T.verRotas=!T.verRotas; if(mapa){ T.verRotas?rotasL.addTo(mapa):mapa.removeLayer(rotasL); } b.classList.toggle('on',T.verRotas); b.classList.toggle('off',!T.verRotas); save(); break;
    case 'livre': modoLivre=true; $('#modo').classList.add('on'); toast('Click on the map where you want the point.'); break;
    case 'livre-x': modoLivre=false; $('#modo').classList.remove('on'); break;
    case 'add': { const p=D.pts[+b.dataset.i]; T.paradas.push({id:uid(),ref:refDe(p),n:p.n,x:p.x,y:p.y,dias:p.l==='CU'&&p.d>=4?10:(parseInt(p.dias)||2),l:p.l}); if(mapa) mapa.closePopup(); mudou(true); toast(p.n+' added to the journey.'); break; }
    case 'res': { const p=D.pts[+b.dataset.i]; $('#res').hidden=true; $('#busca').value=''; const k=p.l; let lay=T.camadas||D.layers.map(l=>l.k); if(!lay.includes(k)){ lay.push(k); T.camadas=lay; grpL[k].addTo(mapa); const c=$(`.chip.cam[data-k="${k}"]`); c&&c.classList.replace('off','on'); }
      mapa.setView([p.y,p.x],6); grpL[k].eachLayer(m=>{ const ll=m.getLatLng(); if(ll.lat===p.y&&ll.lng===p.x) m.openPopup(); }); break; }
    case 'sobe': case 'desce': { const i=T.paradas.findIndex(p=>p.id===b.dataset.id); const j=a==='sobe'?i-1:i+1; if(j<0||j>=T.paradas.length) break; [T.paradas[i],T.paradas[j]]=[T.paradas[j],T.paradas[i]]; mudou(true); break; }
    case 'tira': T.paradas=T.paradas.filter(p=>p.id!==b.dataset.id); mudou(true); break;
    case 'addItem': { const i=$('#novoItem'); if(i.value.trim()){ T.extras.push(i.value.trim()); save(); renderPasso(); refreshNav(); renderLado(); } break; }
    case 'ct+': T.contatos.push({n:'',tel:'',rel:''}); save(); renderPasso(); break;
    case 'ctx': T.contatos.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'eq+': T.equipe.push({n:'',papel:T.equipe.length?'Participant':'Expedition leader',c:''}); save(); renderPasso(); refreshNav(); break;
    case 'eqx': T.equipe.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); break;
    case 'cena+': { const id=b.dataset.id; let t=b.dataset.t; if(!t){ const i=$(`[data-cena="${id}"]`); t=i&&i.value.trim(); } if(!t) break; (T.imagens[id]=T.imagens[id]||[]).push({t,ok:false}); save(); renderPasso(); refreshNav(); renderLado(); break; }
    case 'cenax': T.imagens[b.dataset.id].splice(+b.dataset.i,1); save(); renderPasso(); break;
    case 'print': window.print(); break;
    case 'gpx': gpx(); break; case 'ics': ics(); break;
    case 'json': baixar(slugf(T.nome)+'.roteiro-was.json',JSON.stringify(T,null,2),'application/json'); break;
    case 'link': linkCompart(); break;
    case 'enviar': toast('Simulation: in the final product, the journey would go to WAS curators.'); break;
  }
});
function renderNavOpc(){ $$('.passo').forEach(b=>{ if(b.dataset.p==='imagens'){ const o=b.querySelector('.opc'); const need=!(tem('fotografica')||tem('cinema')); if(need&&!o) b.querySelector('.st').insertAdjacentHTML('beforebegin','<span class="opc">optional</span>'); if(!need&&o) o.remove(); } }); }
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
  r.innerHTML=hits.length?hits.slice(0,12).map(([,p])=>`<button data-act="res" data-i="${p.i}"><span class="bol" style="background:${LAY[p.l].cor}"></span>${esc(p.n)}<small>${esc(LAY[p.l].nome)} · ${esc(p.pa)}</small></button>`).join(''):'<div style="padding:10px 12px;color:var(--sec)">Nothing found.</div>'; }
document.addEventListener('click',ev=>{ const r=$('#res'); if(r&&!r.hidden&&!ev.target.closest('.busca')) r.hidden=true; },true);
window.addEventListener('resize',()=>{ clearTimeout(window._rz); window._rz=setTimeout(()=>{ if(T) montarMini(); },250); });

/* ---------- partida ---------- */
const h=location.hash.match(/^#r=(.+)$/);
if(h){ try{ const t=JSON.parse(decodeURIComponent(escape(atob(h[1])))); t.id=uid(); t.nome=(t.nome||'Journey')+' (copy)'; history.replaceState(null,'',location.pathname); abrir(t,'revisar'); toast('Journey received by link and saved to your journeys.'); }catch(e){ renderHome(); } }
else renderHome();
})();
