/* Roteiros WAS · protótipo · tudo roda no navegador, sem servidor */
(function(){
'use strict';
const D = window.WASDATA;
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtN = (n, d=0) => Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtR = n => 'R$ ' + fmtN(Math.round(n||0));
const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const MESES_L = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const DIAS_S = ['dom','seg','ter','qua','qui','sex','sáb'];
const uid = () => Math.random().toString(36).slice(2,9);
const LAY = {}; D.layers.forEach(l => LAY[l.k] = l);
const REL = u => (u||'').replace('https://was-mirror.webflow.io','').replace('https://www.worldadventuresociety.org','');
D.pts.forEach(p => { if(p.g) p.g = REL(p.g); if(p.pf) p.pf[1] = REL(p.pf[1]); });
D.rotas.forEach(r => { r.link = REL(r.link); });
const PT = {}; D.pts.forEach((p,i) => { p.i = i; PT[p.l+'|'+p.n] = p; });
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
  ['expedicao','Expedição'],['aventura','Aventura'],['esportiva','Esportiva'],['contemplacao','Contemplação'],
  ['cultural','Cultural'],['fotografica','Fotográfica'],['cinema','Cinematográfica'],['ciencia','Ciência e voluntariado'],
  ['passeio','Passeio de um dia'],['familia','Em família']
];
const TIPO_N = Object.fromEntries(TIPOS);

/* ---------- modos de deslocamento ---------- */
const MODOS = {
  aviao:{n:'Avião',v:750,ov:4,co2:.15},
  carro:{n:'Carro',v:70,ov:0,co2:.17,veh:1,rf:1.25},
  x4:{n:'4x4',v:40,ov:0,co2:.27,veh:1,rf:1.3},
  onibus:{n:'Ônibus',v:55,ov:1,co2:.03,rf:1.25},
  trem:{n:'Trem',v:80,ov:1,co2:.035,rf:1.2},
  barco:{n:'Barco',v:25,ov:1,co2:.12},
  navio:{n:'Navio de expedição',v:22,ov:0,co2:.5},
  pe:{n:'A pé',v:4,hd:6,co2:0,rf:1.2},
  bike:{n:'Bicicleta',v:14,hd:6,co2:0,rf:1.2},
  cavalo:{n:'A cavalo',v:6,hd:6,co2:0,rf:1.2},
  caiaque:{n:'Caiaque',v:5,hd:5,co2:0}
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
    const s=$('#salvo'); if(s){ const d=new Date(); s.textContent='Salvo às '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); } }, 300);
}
function novo(base={}){
  const hoje = new Date(); const ini = new Date(hoje.getFullYear(), hoje.getMonth()+3, 10);
  return Object.assign({
    id:uid(), nome:'Meu novo roteiro', tipos:['aventura'], intencao:'', quem:'dupla', pessoas:2, exp:'intermediario',
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
function paises(){
  const s=new Set();
  T.paradas.forEach(p=>{ const r=pontoDe(p); const pa=(r?r.pa:p.pa)||''; pa.split(/,| e |\//).map(x=>x.trim()).filter(Boolean).forEach(x=>s.add(x)); });
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
      if(ant && (ant.l==='ME'||(ant.l==='NF'&&ant.d>=3)) && t.m==='aviao') push({tipo:'marg',t:'Intervalo de superfície antes de voar',ds:'Pelo menos 18 a 24 horas sem voar depois de vários dias de mergulho, para reduzir o risco de doença descompressiva.',id:'sv'+p.id});
      if(t.dias>0) for(let j=0;j<t.dias;j++) push({tipo:'via',t:'Deslocamento: '+t.a.n+' → '+t.b.n,ds:t.M.n+' · cerca de '+fmtN(t.km)+' km'+(t.dias>1?' · dia '+(j+1)+' de '+t.dias:''),id:'v'+p.id+'-'+j});
    }
    const alt=altDe(p);
    const nd=Math.max(0,p.dias|0); let dentro=0;
    if(T.aclim && alt>=3000){ const need=Math.min(6,Math.ceil((alt-2800)/700)); dentro=Math.min(need,Math.floor(nd*.6)); const n=need-dentro; for(let j=0;j<n;j++) push({tipo:'acl',t:'Aclimatação para '+p.n,ds:'Dormir no máximo 300 a 500 m acima da noite anterior. Caminhadas leves, muita água, atenção a dor de cabeça e náusea.',id:'a'+p.id+'-'+j}); }
    const chegou = i>0 && trecho(i).dias===0 ? ' (chegada '+MODOS[trecho(i).m].n.toLowerCase()+')' : '';
    for(let j=0;j<nd;j++) push({tipo:j<dentro?'acl':'loc',t:(nd>1?'Dia '+(j+1)+' em ':'')+p.n+(j===0?chegou:'')+(j<dentro?' · subida gradual':''),ds:j===0?(pontoDe(p)?.f||''):(j<dentro?'Aclimatação dentro do próprio roteiro de subida: ganhar altitude devagar.':''),id:'d'+p.id+'-'+j,p});
  });
  for(let j=0;j<(T.margem|0);j++) push({tipo:'marg',t:'Dia de margem',ds:'Reserva para mau tempo, voos atrasados ou cansaço. Quem planeja margem volta inteiro.',id:'m'+j});
  return dias;
}

/* ---------- dificuldade ---------- */
function difLabel(p){ const r=pontoDe(p); if(!r) return ''; const L=LAY[r.l]; return (L.dif&&L.dif[r.d])||['','Fácil','Moderado','Exigente','Muito exigente','Extremo'][r.d]; }
function nivel(){ let m=0; T.paradas.forEach(p=>{ const r=pontoDe(p); if(r) m=Math.max(m,r.d||1); }); return m; }
const NIVEL_N=['—','Leve','Moderado','Exigente','Muito exigente','Extremo'];

/* ---------- regras: habilidades ---------- */
function habilidades(){
  const out=[]; const add=(k,t,p)=>{ if(!out.find(o=>o.k===k)) out.push({k,t,p}); };
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(!r) return; const g=r.g2||[];
    if(r.l==='ME'){ if(r.d>=2) add('ow','Certificação de mergulho Open Water (ou equivalente)',r.n); if(r.d>=4) add('aow','Advanced, mergulho com corrente e boa experiência (sugestão: 50+ mergulhos registrados)',r.n); if(r.d>=5||g.includes('cav')) add('tec','Formação técnica ou de caverna/cenote com instrutor especializado',r.n); }
    if(r.l==='NF'&&r.d>=3) add('ow2','Certificação de mergulho compatível com a profundidade do naufrágio',r.n);
    if(r.l==='CU'){ if(r.d>=3) add('alp','Curso básico de alpinismo: crampons, piolet, autodetenção',r.n); if(r.d>=4) add('corda','Técnicas de corda, resgate em greta e experiência prévia em altitude',r.n); }
    if(r.l==='TK'&&r.d>=4) add('nav','Navegação com mapa, bússola e GPS; autonomia em trilha remota',r.n);
    if(r.l==='P'&&r.d>=3) add('polar','Treino de expedição polar: puxar trenó (pulka), barraca na neve, prevenção de congelamento',r.n);
    if(r.l==='O') add('off','Direção off-road: areia, lama, travessia de rio e resgate do veículo',r.n);
    if(r.l==='B2'&&r.d>=3) add('mec','Mecânica básica de bicicleta e treino com a bike carregada',r.n);
    if(r.l==='AT'){ if(g.includes('esc')) add('esc','Escalada: experiência no grau da via ou guia credenciado',r.n); if(g.includes('cany')) add('cany','Canionismo: rapel e técnicas de água, sempre com condutor credenciado',r.n); if(g.includes('raft')||g.includes('cai')) add('agua','Natação segura e briefing de segurança em corredeira',r.n); if(g.includes('ar')) add('ar','Voo livre ou salto: só com instrutor e escola homologada',r.n); }
    if(r.l==='X') add('trav','Treino específico da travessia (mar, rio, deserto ou natação de longa distância)',r.n);
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
  g('Essenciais',[['Mochila principal ou mala de expedição',1800],['Mochila de ataque (20–35 L)',700],['Lanterna de cabeça e pilhas',120],['Kit de primeiros socorros pessoal',400],['Garrafa e filtro ou pastilhas de água',350],['Protetor solar, labial e óculos escuros',250],['Power bank e cabos',350],['Bolsa estanque para documentos',80],['Canivete ou multiferramenta',120]],'Toda jornada');
  if(frio()) g('Frio e altitude',[['Sistema de 3 camadas (térmica, fleece, anorak impermeável)',1500],['Jaqueta de pluma',700],['Luvas finas e luvas grossas',300],['Gorro e balaclava',150],['Meias de lã merino (3 pares)',300],['Óculos de glaciar categoria 4',60],['Saco de dormir conforto -10 °C ou menos',1600]],'Há paradas frias ou acima de 2.500 m');
  if(tropical()) g('Calor e trópicos',[['Roupa leve com proteção UV',600],['Repelente (icaridina ou DEET)',150],['Mosquiteiro',350],['Sandália de trilha',500],['Capa de chuva leve',300]],'Há paradas tropicais');
  if(temL('TK','L','CU','VU')) g('Trilha e montanha',[['Bota de trekking amaciada',1400],['Bastões de caminhada',500],['Polainas',250],['Mapa offline e GPS no celular',0],['Apito e manta térmica',100]],'Trekkings, cumes ou vulcões');
  if(T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='CU'&&r.d>=3;})) g('Alpinismo',[['Crampons',900],['Piolet',500],['Cadeirinha, mosquetões e cordelete',700],['Capacete',350],['Bota dupla ou de alta montanha',2400]],'Cumes técnicos');
  if(temL('ME','NF')) g('Mergulho',[['Máscara, snorkel e nadadeiras',1500],['Computador de mergulho',250],['Roupa de neoprene adequada à temperatura',2500],['Boia de sinalização (salsicha) e apito',200],['Logbook e certificações',50]],'Paradas de mergulho');
  if(temL('BA','X')||temG('AT','cai')||temG('AT','raft')) g('Água e barco',[['Jaqueta impermeável e calça de chuva',700],['Remédio para enjoo',20],['Capa estanque para celular',60]],'Saídas de barco e travessias');
  if(temL('O')) g('Off-road',[['Kit de resgate: pranchas, cinta, pá',9000],['Compressor e kit de reparo de pneu',4000],['Combustível e água extras',0],['Comunicador satelital',120]],'Rotas off-road');
  if(temL('B2')) g('Bicicleta',[['Capacete',350],['Alforjes ou bikepacking',2200],['Câmaras, remendos e bomba',600],['Ferramenta multiuso de bike',200]],'Rotas de bike');
  if(temL('P')) g('Polar',[['Parka de expedição',1800],['Bota polar',2200],['Máscara facial e óculos de neve',250],['Garrafa térmica',450]],'Destinos polares');
  if(tem('fotografica')||tem('cinema')){
    const its=[['Corpo de câmera principal',750],['Corpo reserva',650],['Grande angular (14–24 mm)',650],['Zoom padrão (24–70 mm)',800],['Tripé leve de fibra de carbono',1500],['Filtros polarizador e ND',200],['Baterias extras (o frio derruba a carga)',300],['Cartões de memória (2× o previsto)',50],['Capa de chuva para câmera',150],['Kit de limpeza de sensor',100]];
    if(temL('FA','BA')) its.splice(4,0,['Teleobjetiva 100–400 ou 200–600 mm',2100]);
    if(temL('ME')) its.push(['Caixa estanque e iluminação submarina',3500]);
    g('Fotografia',its,'Roteiro fotográfico');
  }
  if(tem('cinema')) g('Filmagem',[['Microfone shotgun e lapelas sem fio',600],['Gravador de áudio',400],['Gimbal',1200],['Monitor externo',500],['SSDs para backup (regra 3-2-1)',300],['Notebook de ingestão',1800],['Protetor de vento (dead cat)',60]],'Roteiro cinematográfico');
  if(T.drone) g('Drone',[['Drone e 3 baterias',1300],['Controle e hélices reserva',300],['Filtros ND para drone',50],['Comprovantes de registro e autorização',0]],'Você marcou que vai levar drone');
  if(T.extras.length) g('Itens que você acrescentou',T.extras.map(x=>[x,0]),'Lista pessoal');
  return G;
}

/* ---------- regras: documentos e autorizações ---------- */
const AFR=['Uganda','Ruanda','Tanzânia','Quênia','Congo','RD Congo','República Democrática do Congo','Etiópia','Zâmbia','Zimbábue','Botsuana','Namíbia','Camarões','Madagascar','África do Sul','Marrocos','Egito'];
const SCHENGEN=['Itália','Espanha','França','Portugal','Suíça','Islândia','Noruega','Suécia','Finlândia','Grécia','Alemanha','Áustria','Croácia','Eslovênia','Polônia','Dinamarca','Holanda','Bélgica'];
function documentos(){
  const ps=paises(), ext=ps.filter(p=>!/Brasil/.test(p)), L=[];
  const nomes=T.paradas.map(p=>p.n).join(' | ');
  const d=(k,t,p,onde,por)=>L.push({k,t,p,onde,por});
  if(ext.length){ const vol=addDias(T.inicio,plano().length+180); d('pass','Passaporte válido','Muitos países exigem validade mínima de 6 meses depois da data de saída. Seu retorno previsto pede validade até pelo menos '+fmtDL(vol)+'.','Polícia Federal (agendamento on-line)','Destinos fora do Brasil');
    d('visto','Vistos e autorizações eletrônicas de entrada','Exigência para brasileiros em: '+ext.join(', ')+'. Conferir caso a caso, pois as regras mudam (vistos, eTA, ESTA, eVisa).','Portal consular do Itamaraty e sites oficiais de imigração','Destinos fora do Brasil'); }
  if(ps.some(p=>AFR.some(a=>p.includes(a)))||ps.includes('Brasil')) d('civp','Vacina de febre amarela e CIVP','O Certificado Internacional de Vacinação ou Profilaxia pode ser exigido na entrada de alguns países e é recomendado em várias regiões do Brasil.','Anvisa (emissão do CIVP) e posto de vacinação','Áreas de febre amarela');
  if(ext.some(p=>SCHENGEN.some(s=>p.includes(s)))) d('schengen','Seguro com cobertura Schengen','Para o espaço Schengen o seguro precisa cobrir ao menos 30 mil euros em despesas médicas.','Seguradora','Destino no espaço Schengen');
  if(T.paradas.some((p,i)=>i>0 && ['carro','x4'].includes(trecho(i).m)) && ext.length) d('pid','Permissão Internacional para Dirigir','Pedida no Detran do seu estado, junto com a CNH válida.','Detran','Trechos de carro fora do Brasil');
  if(T.drone){ if(ps.includes('Brasil')) d('droneBR','Drone no Brasil: SISANT, SARPAS e Anatel','Cadastro do drone na ANAC (SISANT), pedido de voo ao DECEA (SARPAS) e homologação na Anatel. Em parques federais, autorização do ICMBio.','ANAC, DECEA, Anatel, ICMBio','Você vai levar drone');
    if(ext.length) d('droneEXT','Drone no exterior','Cada país tem regra e registro próprios, e muitos parques nacionais proíbem voo sem licença (nos parques dos EUA é proibido).','Autoridade de aviação civil de cada país','Você vai levar drone'); }
  const esp=[
    [/Bwindi|Gorilas no Parque dos Vulcões/,'gor','Permissão para ver gorilas','Licenças diárias limitadas, vendidas com meses de antecedência. Visita de 1 hora com guia e regras sanitárias.','Uganda Wildlife Authority ou Rwanda Development Board'],
    [/Kilimanjaro/,'kili','Taxas do parque e guia obrigatório no Kilimanjaro','A subida só é permitida com guia e operadora licenciados, que recolhem as taxas do parque.','Operadora licenciada pela autoridade de parques da Tanzânia'],
    [/Aconcágua/,'acon','Permiso de ascenso do Aconcágua','Permissão paga, com valor por temporada, retirada em Mendoza antes da subida. Exige exame médico no parque.','Parque Provincial Aconcagua (Mendoza)'],
    [/Everest|Campo-base do Everest|Lhotse|Ama Dablam|Island Peak/,'nepal','Permissões de trekking e escalada no Nepal','Entrada no Parque Nacional Sagarmatha e licença local; cumes exigem permissão de escalada do governo.','Departamento de Turismo do Nepal, via agência registrada'],
    [/Trilha Inca/,'inca','Permissão da Trilha Inca','Vagas diárias limitadas, vendidas só por operadoras autorizadas, que esgotam meses antes.','Operadora autorizada pelo Ministério da Cultura do Peru'],
    [/Milford Track|Routeburn/,'doc','Reserva de Great Walk','Cabanas reservadas com antecedência; a temporada esgota rápido.','Department of Conservation da Nova Zelândia'],
    [/Svalbard/,'sval','Regras de Svalbard','Fora das áreas de visitação comuns é preciso avisar o governo local e ter seguro de busca e resgate. Ursos-polares exigem proteção e guia.','Governor of Svalbard (Sysselmesteren)'],
    [/Antártica|Antártida|Polo Sul|Ilha Elefante|Deception|Geórgia do Sul|Snow Hill|Comandante Ferraz/,'ant','Autorização para a Antártica','Toda atividade precisa de avaliação de impacto ambiental de um país signatário do Tratado Antártico. As operadoras da IAATO cuidam disso para os passageiros.','Operadora associada à IAATO'],
    [/Galápagos/,'gal','Ingresso em Galápagos','Taxa de ingresso no parque e cartão de controle de trânsito, comprados antes do embarque no continente.','Governo do Equador / Parque Nacional Galápagos'],
    [/Fernando de Noronha/,'fn','Taxas de Fernando de Noronha','Taxa de Preservação Ambiental por dia e ingresso do Parque Nacional Marinho.','Administração do distrito e ICMBio']
  ];
  esp.forEach(([re,k,t,p,o])=>{ if(re.test(nomes)) d(k,t,p,o,'Paradas: '+T.paradas.filter(x=>re.test(x.n)).map(x=>x.n).join(', ')); });
  if(temL('PQ')) d('parq','Ingressos e reservas dos parques','Parques mais disputados limitam vagas, camping e trilhas. Reserve o que tiver cota assim que as datas estiverem firmes.','Órgão gestor de cada parque','Parques no roteiro');
  if(tem('cultural')&&ps.includes('Brasil')) d('funai','Terras indígenas','Visitas a terras indígenas pedem consentimento da comunidade e autorização de ingresso da Funai. Imagens exigem acordo de uso com a comunidade.','Funai e a própria comunidade','Roteiro cultural no Brasil');
  if(tem('cinema')){ d('film','Autorizações de filmagem','Gravação para uso comercial em áreas protegidas costuma exigir licença e taxa. Em cidades, procure a film commission local.','ICMBio, órgãos de parques, film commissions','Roteiro cinematográfico');
    d('cessao','Cessão de imagem e de locação','Termo assinado por quem aparece de forma identificável e por donos de locações privadas.','Modelo com o seu advogado ou produtora','Roteiro cinematográfico');
    if(ext.length) d('ata','Carnê ATA para equipamento','Documento aduaneiro que permite entrar e sair com equipamento profissional sem pagar impostos de importação.','Confederação Nacional da Indústria (emissão no Brasil)','Equipamento profissional no exterior'); }
  if(temL('ME')||T.paradas.some(p=>{const r=pontoDe(p);return r&&r.l==='NF'&&r.d>=3;})) d('merg','Certificações e logbook de mergulho','Leve as carteirinhas (ou o app da certificadora) e o registro de mergulhos; operadoras pedem para liberar mergulhos avançados.','Sua certificadora (PADI, SSI, NAUI, CMAS)','Paradas de mergulho');
  if(T.quem==='familia') d('menor','Autorização de viagem para menores','Quando a criança viaja sem um dos pais, é preciso autorização com firma reconhecida ou registrada no passaporte.','Cartório ou Polícia Federal','Viagem em família');
  d('seguroDoc','Apólice de seguro viagem','Com coberturas compatíveis com as atividades (ver Saúde e segurança).','Seguradora','Toda jornada');
  return L;
}

/* ---------- orçamento (simulado) ---------- */
function regiao(p){ const r=pontoDe(p); const pa=(r?r.pa:p.pa)||''; const x=p.x,y=p.y;
  if((r&&r.l==='P')||y<-60||y>75) return 'POL'; if(/Brasil/.test(pa)) return 'BR';
  if(x>-82&&x<-34&&y<13) return 'SA'; if(y>13&&x<-50) return 'NA'; if(y>35&&x>-25&&x<45) return 'EU';
  if(x>-20&&x<52&&y>-36&&y<37) return 'AF'; if(x>110&&y<-10) return 'OC'; return 'AS'; }
const IDX={BR:420,SA:520,NA:1350,EU:1250,AF:1000,OC:1250,AS:560,POL:6500};
const IDX_N={BR:'Brasil',SA:'América do Sul',NA:'América do Norte e Central',EU:'Europa',AF:'África',OC:'Oceania',AS:'Ásia',POL:'Regiões polares'};
function orcamento(){
  const pl=plano(); const pes=Math.max(1,T.pessoas|0);
  let transp=0, hosp=0, alim=0, guia=0, taxas=0;
  T.paradas.forEach((p,i)=>{ if(i>0){ const t=trecho(i); const c={aviao:t.km*.75+500,carro:t.km*1.1/pes*1.2,x4:t.km*2.6/pes*1.5,onibus:t.km*.3,trem:t.km*.45,barco:t.km*1.5,navio:t.km*9,pe:0,bike:0,cavalo:t.dias*350,caiaque:t.dias*300}[t.m]||0; transp+=c; } });
  pl.forEach(d=>{ const p=d.p||T.paradas[0]; if(!p) return; const ix=IDX[regiao(p)]; hosp+=ix*.55; alim+=ix*.3; const r=pontoDe(p); if(r&&(r.d>=3||['FA','P','CU','ME','NF'].includes(r.l))&&d.p) guia+=900/pes; });
  const nm=T.paradas.map(p=>p.n).join('|');
  if(/Bwindi|Gorilas no Parque/.test(nm)) taxas+=4800; if(/Kilimanjaro/.test(nm)) taxas+=5500; if(/Aconcágua/.test(nm)) taxas+=4200; if(/Everest|Lhotse/.test(nm)) taxas+=60000; if(/Galápagos/.test(nm)) taxas+=1100;
  taxas+=T.paradas.filter(p=>pontoDe(p)&&pontoDe(p).l==='PQ').length*150;
  const seguro=pl.length*(nivel()>=4?85:35);
  const equip=equipamento().reduce((s,g)=>s+g.its.length,0)*35;
  const prod = tem('cinema') ? pl.length*600 : 0;
  const cats=[['transp','Transporte',transp],['hosp','Hospedagem',hosp],['alim','Alimentação',alim],['guia','Guias e operadoras',guia],['taxas','Taxas e permissões',taxas],['seguro','Seguro',seguro],['equip','Equipamento (compra e aluguel)',equip]];
  if(prod) cats.push(['prod','Produção de imagem',prod]);
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
  if(!T.paradas.length) A.push({n:'bad',t:'Nenhum lugar no roteiro',d:'Comece escolhendo pontos no mapa.',go:'mapa'});
  alertasMes().forEach(a=>A.push({n:'warn',t:a.p.n+' fora da melhor época',d:'Você chega em '+MESES_L[a.m-1]+'. A WAS indica: '+a.r.me.map(m=>MESES[m-1]).join(', ')+'.',go:'epoca'}));
  T.paradas.forEach((p,i)=>{ if(i>0){ const ant=pontoDe(T.paradas[i-1]); const t=trecho(i); if(ant&&ant.l==='ME'&&t.m==='aviao') A.push({n:'warn',t:'Mergulho seguido de voo',d:'O plano já inclui um dia sem voar depois de '+ant.n+'.',go:'dias'}); } });
  if(!T.aclim && T.paradas.some(p=>altDe(p)>=3000)) A.push({n:'bad',t:'Altitude sem aclimatação',d:'Há lugares acima de 3.000 m e a aclimatação está desligada.',go:'dias'});
  if(T.paradas.some(p=>!(p.dias>0) && pontoDe(p))) A.push({n:'warn',t:'Lugar com 0 dia',d:'Algum lugar do roteiro ainda não tem dias definidos.',go:'mapa'});
  if(T.drone && (temL('PQ')||temL('FA'))) A.push({n:'warn',t:'Drone em área protegida',d:'Parques e áreas de fauna quase sempre exigem autorização ou proíbem voo.',go:'docs'});
  if(nivel()>=4 && !T.seguro.evac) A.push({n:'bad',t:'Seguro sem evacuação',d:'Roteiro de nível '+NIVEL_N[nivel()].toLowerCase()+' pede cobertura de resgate e evacuação aeromédica.',go:'saude'});
  if(T.paradas.length && !T.contatos.length) A.push({n:'warn',t:'Sem contato de emergência',d:'Defina quem acompanha a viagem de casa.',go:'saude'});
  if(temL('BA','FA')&&!T.compromisso) A.push({n:'warn',t:'Conduta com a fauna',d:'Leia as regras de distância e aceite o compromisso de conduta.',go:'conduta'});
  return A;
}

/* ================= RENDER ================= */
let app = document.getElementById('wasrot');
if(!app){ app=document.createElement('div'); app.id='wasrot'; const ft=document.querySelector('footer.footer-section')||document.querySelector('footer'); if(ft&&ft.parentNode) ft.parentNode.insertBefore(app,ft); else document.body.appendChild(app); }
function topo(){
  if(!T) return '';
  return `<div class="topo"><div class="topo-in">
    <div class="marca"><span class="kick">Roteiros WAS</span><b>${esc(T.nome)}</b></div>
    <span class="selo" title="Recurso em teste. Parte dos dados é simulada.">Em teste</span>
    <div class="esp"></div>
    <span class="salvo" id="salvo">Salvo neste navegador</span>
    <button class="tbtn" data-act="home" aria-label="Meus roteiros">${svg('lista')}<span class="lbl">Meus roteiros</span></button>
  </div></div>`;
}
/* ---------- início ---------- */
const MODELOS = [
  {id:'java',nome:'Vulcões de Java e Lombok',tipos:['fotografica','aventura'],quem:'dupla',pessoas:2,mes:7,intencao:'Fotografar o nascer do sol no Bromo, o fogo azul do Ijen e a cratera do Rinjani, com tempo para esperar a luz certa.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['VU','Bromo',2],['VU','Ijen',2],['VU','Rinjani',4]],t:'Fotográfica · 3 vulcões ativos'},
  {id:'jub',nome:'Jubartes e recifes da Bahia',tipos:['contemplacao','fotografica','familia'],quem:'familia',pessoas:4,mes:8,intencao:'Ver as jubartes de perto em Abrolhos e as tartarugas do Projeto Tamar, num ritmo tranquilo com as crianças.',
    par:[['livre','Salvador',-38.5,-12.97,0,'Brasil'],['BA','Praia do Forte',2],['FA','Projeto Tamar na Praia do Forte',1],['BA','Arquipélago dos Abrolhos',3]],t:'Contemplação · temporada das baleias'},
  {id:'afr',nome:'Kilimanjaro e os gorilas',tipos:['expedicao','fotografica'],quem:'grupo',pessoas:4,mes:7,intencao:'Subir ao teto da África pela rota mais tranquila e terminar com uma hora diante dos gorilas-das-montanhas.',
    par:[['livre','São Paulo (GRU)',-46.47,-23.43,0,'Brasil'],['CU','Kilimanjaro',7],['FA','Grande Migração no Masai Mara',3],['FA','Gorilas-das-montanhas em Bwindi',2]],t:'Expedição · Sete Cumes e fauna'},
  {id:'sval',nome:'Nos passos de Amundsen: Ártico norueguês',tipos:['cinema','expedicao'],quem:'grupo',pessoas:3,mes:6,intencao:'Documentário curto sobre o gelo que recua, filmado sob o sol da meia-noite, de Tromsø a Svalbard.',
    par:[['livre','Oslo',10.75,59.91,1,'Noruega'],['BA','Fiordes de Tromsø',2],['P','Svalbard',6]],t:'Cinematográfica · sol da meia-noite'},
  {id:'cerrado',nome:'Brasil Central de 4x4',tipos:['aventura','cultural'],quem:'grupo',pessoas:4,mes:7,intencao:'Rodar o Cerrado na seca: fervedouros do Jalapão, cânions da Chapada dos Veadeiros e as cavernas de Terra Ronca.',
    par:[['livre','Brasília',-47.88,-15.79,0,'Brasil'],['PQ','Parque Nacional da Chapada dos Veadeiros',3],['AT','Terra Ronca',2],['O','Jalapão',4]],t:'Aventura · off-road e cavernas'},
  {id:'pat',nome:'Patagônia: Torres e Fitz Roy',tipos:['aventura','esportiva','fotografica'],quem:'dupla',pessoas:2,mes:2,intencao:'Fazer o W de Torres del Paine e caminhar até a Laguna de los Tres, de frente para o Fitz Roy.',
    par:[['livre','Punta Arenas',-70.91,-53.16,0,'Chile'],['TK','Circuito W de Torres del Paine',5],['PQ','Parque Nacional Los Glaciares',2],['CU','Monte Fitz Roy (Chaltén)',3]],t:'Trekking · Patagônia'}
];
function stopFrom(sp){
  if(sp[0]==='livre') return {id:uid(),ref:null,n:sp[1],x:sp[2],y:sp[3],dias:sp[4],pa:sp[5],livre:true};
  const r=PT[sp[0]+'|'+sp[1]]; if(!r) return null; return {id:uid(),ref:r.l+'|'+r.n,n:r.n,x:r.x,y:r.y,dias:sp[2]||2,l:r.l};
}
function criarModelo(m){
  const ano=new Date().getFullYear(); const hoje=new Date(); let y=ano; if(m.mes-1<=hoje.getMonth()) y++;
  const t=novo({nome:m.nome,tipos:m.tipos,quem:m.quem,pessoas:m.pessoas,intencao:m.intencao,inicio:y+'-'+String(m.mes).padStart(2,'0')+'-05',modelo:m.id});
  t.paradas=m.par.map(stopFrom).filter(Boolean);
  if(m.id==='sval') t.drone=true;
  return t;
}
function fotoModelo(m){ for(const sp of m.par){ const r=PT[sp[0]+'|'+sp[1]]; if(r&&r.ft) return r.ft; } return ''; }
const CORR={RM:'#5ec8ff',RT:'#ffcf6b',RA:'#ff8fb1',RH:'#e0a96d'};

function renderHome(){
  destruirMapas();
  const hero = PT['TK|Circuito W de Torres del Paine'] || D.pts.find(p=>p.ft);
  const meus = DB.rot.slice().sort((a,b)=>(b.alterado||0)-(a.alterado||0));
  app.innerHTML = topo() + `<main class="inicio">
    <section class="hero"><div class="fundo" style="background-image:url('${esc(hero.ft)}')"></div>
      <div class="hero-in"><div class="qd hero-qd">${svg('rota')}</div><div class="kick">Roteiros WAS</div><h1>Monte a sua jornada</h1>
      <p class="lead">Expedições, viagens de aventura, passeios de um dia e contemplações. Escolha lugares no Mapa da aventura, siga os passos de grandes exploradores e planeje tudo num só lugar: época e luz, dia a dia, preparo, equipamento, documentos, segurança, orçamento e plano de imagens.</p></div>
      <div class="cred">Foto: ${esc(hero.n)} · ${esc(hero.fa)} · ${esc(hero.fl)}</div></section>
    <div class="portas">
      <button class="porta" data-act="zero">${qd('mais',1)}<h3>Começar do zero</h3><p>Dê um nome, escolha o tipo de jornada e vá montando no mapa.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-mod">${qd('livro',1)}<h3>Partir de um modelo</h3><p>Seis roteiros prontos para adaptar, feitos com lugares do mapa da WAS.</p></button>
      <button class="porta" data-act="ir-sec" data-sec="sec-rot">${qd('rota',1)}<h3>Nos passos de um explorador</h3><p>Escolha uma rota histórica e a WAS sugere lugares visitáveis no caminho.</p></button>
      <button class="porta" data-act="zero-mapa">${qd('pin',1)}<h3>Começar pelo mapa</h3><p>${fmtN(D.pts.length)} lugares em ${D.layers.length} camadas: cumes, mergulho, vulcões, fauna e mais.</p></button>
    </div>
    ${meus.length?`<section class="bloco-sec"><div class="cab">${qd('lista',1)}<h2>Meus roteiros</h2></div><p class="intro">Ficam guardados só neste navegador, neste computador.</p>
      <div class="meus">${meus.map(r=>`<div class="meu"><div class="t"><b>${esc(r.nome)}</b><span>${r.paradas.length} lugares · ${(r.tipos||[]).map(t=>TIPO_N[t]).join(', ')}</span></div>
      <button class="btn peq" data-act="abrir" data-id="${r.id}">Abrir</button><button class="ico-btn" data-act="apagar" data-id="${r.id}" title="Apagar este roteiro" aria-label="Apagar">${svg('lixo')}</button></div>`).join('')}</div></section>`:''}
    <section class="bloco-sec" id="sec-mod"><div class="cab">${qd('livro',1)}<h2>Modelos para adaptar</h2></div>
      <p class="intro">Cada modelo já vem com lugares, dias, trajeto e época. Tudo pode ser mudado.</p>
      <div class="grade-mod">${MODELOS.map(m=>`<button class="mod" data-act="modelo" data-id="${m.id}"><div class="ft" style="background-image:url('${esc(fotoModelo(m))}')"></div><div class="cx"><span class="kick">${esc(m.t)}</span><h3>${esc(m.nome)}</h3><p>${esc(m.intencao)}</p><div class="tags">${m.tipos.map(t=>`<span class="tag">${TIPO_N[t]}</span>`).join('')}</div></div></button>`).join('')}</div></section>
    <section class="bloco-sec" id="sec-rot"><div class="cab">${qd('rota',1)}<h2>Nos passos de um explorador</h2></div>
      <p class="intro">As ${D.rotas.length} rotas do Mapa da aventura. Ao escolher uma, o construtor cria um roteiro com o início e o fim da rota e com os lugares do mapa que ficam perto do caminho.</p>
      <div class="lista-rotas">${D.rotas.map(r=>`<button class="rota-c" data-act="rota" data-id="${r.id}"><span><i class="pt" style="background:${CORR[r.c]}"></i>${esc(D.cats[r.c])} · ${esc(r.per)}</span><b>${esc(r.n)}</b><span>${esc(r.quem)}</span></button>`).join('')}</div></section>
    <div class="aviso-sim"><b>Recurso em teste.</b> Os lugares, fotos, melhores meses, dificuldades e rotas são os dados reais do Mapa da aventura da WAS. Nascer e pôr do sol, horas de luz e fases da lua são calculados de verdade. Custos, emissões, operadoras, regras de documentos e prazos são estimativas de exemplo, marcadas com <span class="sim">simulado</span>. Nada é enviado para servidor: os roteiros ficam guardados neste navegador.</div>
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
  const t=novo({nome:'Nos passos de: '+r.n,tipos:['expedicao','cultural'],intencao:'Refazer, do jeito possível hoje, trechos da rota "'+r.n+'" ('+r.quem+', '+r.per+').',rota:r.id,quem:'dupla',pessoas:2});
  t.paradas.push({id:uid(),ref:null,n:'Início da rota',x:ini.x,y:ini.y,dias:1,livre:true,pa:''});
  sel.forEach(p=>t.paradas.push({id:uid(),ref:p.l+'|'+p.n,n:p.n,x:p.x,y:p.y,dias:2,l:p.l}));
  t.paradas.push({id:uid(),ref:null,n:'Fim da rota',x:fim.x,y:fim.y,dias:1,livre:true,pa:''});
  return t;
}

/* ---------- construtor ---------- */
const PASSOS=[
  ['ideia','A ideia','ideia'],['mapa','Lugares e trajeto','mapa'],['epoca','Época, luz e clima','epoca'],['dias','Dia a dia','dias'],
  ['preparo','Dificuldade e preparo','preparo'],['equip','Equipamento','equip'],['docs','Documentos e licenças','docs'],['saude','Saúde e segurança','saude'],
  ['orc','Orçamento','orc'],['equipe','Equipe e guias','equipe'],['imagens','Plano de imagens','imagens'],['conduta','Impacto e conduta','conduta'],['revisar','Revisar e compartilhar','revisar']
];
function renderApp(){
  destruirMapas();
  const st=status();
  app.innerHTML = topo() + `<div class="app">
    <nav class="nav" aria-label="Etapas do planejamento"><div class="nome-r"><b>${esc(T.nome)}</b><span>${T.paradas.length} lugares · ${plano().length} dias</span></div>
      ${PASSOS.map((p,i)=>{ const opc = p[0]==='imagens' && !(tem('fotografica')||tem('cinema'));
        return `<button class="passo${passo===p[0]?' on':''}" data-act="passo" data-p="${p[0]}"><span class="n">${i+1}</span>${p[1]}${opc?'<span class="opc">opcional</span>':''}<span class="st ${st.S[p[0]]||''}"></span></button>`; }).join('')}
    </nav>
    <main class="main" id="main"></main><h1 class="sr">${esc(T.nome)}</h1>
    <aside class="lado" id="lado"></aside></div>`;
  renderPasso(); renderLado();
}
function cab(k){ const i=PASSOS.findIndex(p=>p[0]===k); const P=PASSOS[i];
  const txt={ideia:'O que você quer viver, com quem e em que ritmo. O tipo de jornada muda o que o construtor pede nas próximas etapas.',
    mapa:'Escolha lugares nas camadas do Mapa da aventura ou marque pontos livres. Defina quantos dias em cada um e como vai de um ao outro.',
    epoca:'A melhor época de cada lugar segundo a WAS, horas de luz, nascer e pôr do sol e as fases da lua nas datas da viagem.',
    dias:'O roteiro dia a dia, montado a partir dos lugares e trajetos, com aclimatação, intervalos de segurança e dias de margem.',
    preparo:'O nível do roteiro, as habilidades e certificações que ele pede e um plano de treino até a partida.',
    equip:'Lista montada a partir dos lugares, do clima, das atividades e do tipo de jornada. Marque o que já tem.',
    docs:'Passaporte, vistos, vacinas, permissões de parques, drone, terras indígenas e filmagem. Acompanhe a situação de cada um.',
    saude:'Vacinas e cuidados, seguro com as coberturas certas, contatos de emergência e plano de comunicação.',
    orc:'Estimativa por categoria, por pessoa e para o grupo. Ajuste cada valor quando tiver as cotações.',
    equipe:'Quem vai, quem faz o quê e quem pode guiar. Na WAS, guias e associados poderiam ser indicados aqui.',
    imagens:'Para roteiros fotográficos e de filmagem: luz em cada lugar, lista de cenas, drone, armazenamento e autorizações.',
    conduta:'Pegada de carbono dos trajetos, regras de conduta com a fauna e as comunidades e o compromisso de mínimo impacto.',
    revisar:'O dossiê do roteiro, pronto para imprimir, salvar em PDF, levar no GPS, pôr na agenda ou compartilhar.'}[k];
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
function refreshNav(){ const st=status(); $$('.passo').forEach(b=>{ const s=b.querySelector('.st'); if(s) s.className='st '+(st.S[b.dataset.p]||''); }); const n=$('.nome-r'); if(n) n.innerHTML=`<b>${esc(T.nome)}</b><span>${T.paradas.length} lugares · ${plano().length} dias</span>`; }

/* ---------- painel lateral ---------- */
function renderLado(){
  const el=$('#lado'); if(!el) return;
  const st=status(), pl=plano(), A=alertas(), o=orcamento();
  let kmT=0, co2=0; T.paradas.forEach((p,i)=>{ if(i>0){ const t=trecho(i); kmT+=t.km; co2+=t.co2; } });
  const fim=pl.length?pl[pl.length-1].dt:null; const C=2*Math.PI*34;
  el.innerHTML = `<div class="lado-in"><div>
    <div class="anel"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" stroke="#1f2731" stroke-width="8" fill="none"/><circle cx="42" cy="42" r="34" stroke="${st.pct>=80?'#4cc38a':'#b90000'}" stroke-width="8" fill="none" stroke-dasharray="${C*st.pct/100} ${C}" transform="rotate(-90 42 42)"/><text x="42" y="48" text-anchor="middle" fill="#fff" font-family="Montserrat" font-weight="700" font-size="19">${st.pct}%</text></svg>
      <div><b>Prontidão do roteiro</b><span>${st.pct<40?'Começando a tomar forma':st.pct<80?'Bem encaminhado':'Quase pronto para partir'}</span></div></div>
    <div class="mini" id="mini"></div>
    <div class="nums">
      <div><b>${pl.length}</b><span>dias${fim?' · até '+fim.getDate()+' '+MESES[fim.getMonth()]:''}</span></div>
      <div><b>${fmtN(kmT)}</b><span>km de trajeto</span></div>
      <div><b>${NIVEL_N[nivel()]}</b><span>nível do roteiro</span></div>
      <div><b>${fmtR(o.total/o.pes)}</b><span>por pessoa <span class="sim" style="margin:0">simulado</span></span></div>
      <div><b>${st.eqF}/${st.eqT}</b><span>itens de equipamento</span></div>
      <div><b>${st.docF}/${st.docs.length}</b><span>documentos em ordem</span></div>
    </div></div><div>
    <h3>Atenção</h3><div class="alertas">${A.length?A.map(a=>`<div class="al ${a.n==='bad'?'bad':''}" data-act="passo" data-p="${a.go}" role="button" tabindex="0"><b>${esc(a.t)}</b>${esc(a.d)}</div>`).join(''):'<div class="al ok"><b>Tudo certo por enquanto</b>Nenhum alerta para este roteiro.</div>'}</div>
  </div></div>`;
  montarMini();
}
function montarMini(){
  if(mini){ mini.remove(); mini=null; }
  const el=$('#mini'); if(!el||!window.L||getComputedStyle(el).display==='none') return;
  mini=L.map(el,{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,tap:false,touchZoom:false});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',{subdomains:'abcd'}).addTo(mini);
  if(T.paradas.length){ const ll=T.paradas.map(p=>[p.y,p.x]); L.polyline(ll,{color:'#ff4a4a',weight:2,opacity:.9}).addTo(mini); ll.forEach(c=>L.circleMarker(c,{radius:4,color:'#fff',weight:1.5,fillColor:'#b90000',fillOpacity:1}).addTo(mini)); mini.fitBounds(L.latLngBounds(ll).pad(.35),{maxZoom:7}); }
  else mini.setView([10,-20],1);
}
function destruirMapas(){ if(mapa){mapa.remove();mapa=null;} if(mini){mini.remove();mini=null;} }

/* ---------- etapas ---------- */
const R={};
R.ideia=()=>`
  <div class="card"><div class="row">
    <label class="f">Nome do roteiro<input type="text" data-b="nome" value="${esc(T.nome)}" maxlength="90"></label>
    <label class="f">Data de partida<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label></div></div>
  <div class="card"><h3>Que tipo de jornada?</h3><p class="sec">Pode escolher mais de um. O primeiro escolhido é o tipo principal.</p>
    <div class="chips">${TIPOS.map(([k,n])=>{ const i=T.tipos.indexOf(k); return `<button class="chip${i>=0?' on':''}" data-act="tipo" data-k="${k}">${n}${i===0?'<span class="pr">principal</span>':''}</button>`; }).join('')}</div></div>
  <div class="card"><h3>Por que esta jornada?</h3><p class="sec">A intenção guia as escolhas difíceis. Exemplo: "ver a aurora com calma", "fazer meu primeiro cume acima de 5.000 m", "documentar a pesca artesanal".</p>
    <textarea data-b="intencao" placeholder="Escreva em uma ou duas frases">${esc(T.intencao)}</textarea></div>
  <div class="card"><h3>Quem vai</h3>
    <div class="chips" style="margin-bottom:14px">${[['solo','Sozinho'],['dupla','Em dupla'],['grupo','Em grupo'],['familia','Em família'],['equipe','Equipe de produção']].map(([k,n])=>`<button class="chip${T.quem===k?' on':''}" data-act="quem" data-k="${k}">${n}</button>`).join('')}</div>
    <div class="row c3">
      <label class="f">Pessoas<input type="number" min="1" max="40" data-b="pessoas" data-num value="${T.pessoas}"></label>
      <label class="f">Experiência do grupo<select data-b="exp">${[['iniciante','Iniciante'],['intermediario','Intermediária'],['experiente','Experiente'],['expert','Muito experiente']].map(([k,n])=>`<option value="${k}"${T.exp===k?' selected':''}>${n}</option>`).join('')}</select></label>
      <label class="f">Ritmo<select data-b="ritmo">${[['tranquilo','Tranquilo'],['moderado','Moderado'],['intenso','Intenso']].map(([k,n])=>`<option value="${k}"${T.ritmo===k?' selected':''}>${n}</option>`).join('')}</select></label>
    </div></div>
  ${T.rota?insp():''}`;
function insp(){ const r=D.rotas.find(x=>x.id===T.rota); if(!r) return '';
  return `<div class="card alt"><span class="kick">Inspiração</span><h3 style="margin:6px 0 8px">${esc(r.n)}</h3><p class="sec">${esc(r.quem)} · ${esc(r.per)}${r.dados?' · '+esc(r.dados):''}</p><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk||'Ler o perfil na WAS')}</a></p>`:''}</div>`; }

R.mapa=()=>{
  const lay=T.camadas||D.layers.map(l=>l.k);
  return `<div class="mapa-wrap">
    <div class="mapa-barra"><div class="busca"><input type="search" id="busca" placeholder="Buscar lugar, país ou atividade (ex.: baleia, Nepal, cânion)" autocomplete="off"><div class="res-busca" id="res" hidden></div></div>
      <button class="btn peq sec2" data-act="livre">${svg('pin')}Marcar ponto livre</button></div>
    <div class="camadas">${D.layers.map(l=>`<button class="chip cam ${lay.includes(l.k)?'on':'off'}" data-act="camada" data-k="${l.k}"><span class="bol" style="background:${l.cor}"></span>${esc(l.nome)} <span class="cap">${l.n}</span></button>`).join('')}
      <button class="chip cam ${T.verRotas?'on':'off'}" data-act="verRotas"><span class="bol" style="background:#ffcf6b"></span>Rotas históricas <span class="cap">${D.rotas.length}</span></button></div>
    <div id="mapa"></div><div class="mapa-modo" id="modo">Clique no mapa para marcar um ponto livre · <a href="#" data-act="livre-x">cancelar</a></div>
  </div>
  <div class="paradas" id="paradas">${paradasHTML()}</div>`;
};
function paradasHTML(){
  if(!T.paradas.length) return `<div class="vazio">Nenhum lugar ainda. Clique num ponto do mapa e use “Adicionar ao roteiro”, ou busque pelo nome.</div>`;
  return `<h3 style="margin:22px 0 12px">Seu trajeto</h3>` + T.paradas.map((p,i)=>{ const r=pontoDe(p);
    let tr=''; if(i>0){ const t=trecho(i); const ant=pontoDe(T.paradas[i-1]);
      tr=`<div class="trecho"><select data-act="modo" data-id="${p.id}" aria-label="Como ir">${Object.entries(MODOS).map(([k,M])=>`<option value="${k}"${t.m===k?' selected':''}>${M.n}</option>`).join('')}</select>
      <span class="info">${fmtN(t.km)} km · ${t.M.hd? t.dias+' dia'+(t.dias>1?'s':'')+' de '+t.M.n.toLowerCase() : (t.h<1?'menos de 1 h':'cerca de '+fmtN(t.h)+' h')+(t.dias?' · '+t.dias+' dia'+(t.dias>1?'s':'')+' de viagem':'')}</span>
      ${ant&&ant.l==='ME'&&t.m==='aviao'?'<span class="alerta">Intervalo pós-mergulho incluído</span>':''}</div>`; }
    return tr+`<div class="parada"><div class="num${p.livre?' livre':''}">${i+1}</div>${r&&r.ft?`<div class="ft" style="background-image:url('${esc(r.ft)}')"></div>`:''}
      <div class="inf"><b>${esc(p.n)}</b><span class="loc">${r?esc(LAY[r.l].nome)+' · '+esc(r.pa)+(r.alt?' · '+fmtN(r.alt)+' m':'')+' · '+esc(difLabel(p)):'Ponto livre'+(p.pa?' · '+esc(p.pa):'')}</span>
      ${r&&r.g?`<div><a href="${esc(r.g)}" target="_blank" rel="noopener" class="cap">Guia do destino na WAS ↗</a></div>`:''}</div>
      <div class="ctl"><label class="dias" title="Dias neste lugar"><input type="number" min="0" max="60" value="${p.dias|0}" data-act="dias" data-id="${p.id}" aria-label="Dias em ${esc(p.n)}"></label><span class="cap">dias</span>
      <button class="ico-btn" data-act="sobe" data-id="${p.id}" aria-label="Subir"${i===0?' disabled':''}>${svg('cima')}</button><button class="ico-btn" data-act="desce" data-id="${p.id}" aria-label="Descer"${i===T.paradas.length-1?' disabled':''}>${svg('baixo')}</button>
      <button class="ico-btn" data-act="tira" data-id="${p.id}" aria-label="Tirar do roteiro">${svg('lixo')}</button></div></div>`; }).join('');
}
let modoLivre=false, grpL={}, linhaT=null, pinos=null, rotasL=null;
function montarMapa(){
  if(!window.L){ $('#mapa').innerHTML='<div class="vazio" style="margin:20px">O mapa precisa de internet para carregar.</div>'; return; }
  mapa=L.map('mapa',{worldCopyJump:true,minZoom:2,zoomSnap:.5}).setView([5,-20],2);
  const esc1=L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:19,attribution:'© OpenStreetMap · © CARTO'});
  const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:18,attribution:'Imagens © Esri'});
  esc1.addTo(mapa); L.control.layers({'Mapa escuro':esc1,'Satélite':sat},null,{position:'topright'}).addTo(mapa);
  L.control.scale({imperial:false}).addTo(mapa);
  grpL={}; D.layers.forEach(l=>grpL[l.k]=L.layerGroup());
  D.pts.forEach(p=>{ const L0=LAY[p.l]; const m=L.circleMarker([p.y,p.x],{radius:p.l==='PQ'?6:5,color:'#000',weight:1,fillColor:L0.cor,fillOpacity:.95});
    m.bindPopup(()=>popHTML(p),{maxWidth:320,minWidth:280,autoPanPadding:[30,30]}); m.on('mouseover',()=>m.setRadius(8)); m.on('mouseout',()=>m.setRadius(p.l==='PQ'?6:5)); m.addTo(grpL[p.l]); });
  const lay=T.camadas||D.layers.map(l=>l.k); lay.forEach(k=>grpL[k]&&grpL[k].addTo(mapa));
  rotasL=L.layerGroup(); D.rotas.forEach(r=>{ const ll=desenrola(r.pts); L.polyline(ll,{color:CORR[r.c],weight:1.6,opacity:.75,dashArray:r.c==='RA'?'5 6':null}).bindPopup(`<div class="pop"><div class="cx"><span class="kick">${esc(D.cats[r.c])} · ${esc(r.per)}</span><h4>${esc(r.n)}</h4><div class="loc">${esc(r.quem)}</div><p>${esc(r.t)}</p>${r.link?`<p><a href="${esc(r.link)}" target="_blank" rel="noopener">${esc(r.lk)} ↗</a></p>`:''}</div></div>`,{maxWidth:320}).addTo(rotasL); });
  if(T.verRotas) rotasL.addTo(mapa);
  pinos=L.layerGroup().addTo(mapa); desenharTrajeto(true);
  mapa.on('click',ev=>{ if(!modoLivre) return; const n='Ponto livre '+(T.paradas.filter(p=>p.livre).length+1);
    T.paradas.push({id:uid(),ref:null,n,x:+ev.latlng.lng.toFixed(4),y:+ev.latlng.lat.toFixed(4),dias:1,livre:true,pa:''}); modoLivre=false; $('#modo').classList.remove('on'); mudou(true);
    toast('Ponto livre adicionado. Renomeie em “Seu trajeto”.'); setTimeout(()=>renomearUltimo(),50); });
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
function popHTML(p){ const L0=LAY[p.l]; const naRota=T.paradas.some(s=>s.ref===p.l+'|'+p.n);
  return `<div class="pop">${p.ft?`<div class="ft" style="background-image:url('${esc(p.ft)}')"></div>`:''}<div class="cx">
    <span class="kick" style="color:${L0.cor}">${esc(L0.nome)}</span><h4>${esc(p.n)}</h4><div class="loc">${esc([p.r,p.pa].filter(Boolean).join(' · '))}${p.alt?' · '+fmtN(p.alt)+' m':''}</div>
    <div class="tags" style="margin-top:8px"><span class="tag">${esc((L0.dif&&L0.dif[p.d])||NIVEL_N[p.d])}</span>${p.dias?`<span class="tag">${esc(p.dias)}</span>`:''}${p.km?`<span class="tag">${esc(p.km)} km</span>`:''}${p.me&&p.me.length?`<span class="tag">Melhor: ${p.me.map(m=>MESES[m-1]).join(', ')}</span>`:''}</div>
    ${p.es&&p.es.length?`<p><b>Espécies:</b> ${esc(p.es.join(', '))}</p>`:''}
    <p>${esc(p.f)}</p>
    ${p.pf?`<p class="cap">Explorador: <a href="${esc(p.pf[1])}" target="_blank" rel="noopener">${esc(p.pf[0])} ↗</a></p>`:''}
    ${p.g?`<p class="cap"><a href="${esc(p.g)}" target="_blank" rel="noopener">Guia completo na WAS ↗</a></p>`:''}
    <div class="btns">${naRota?'<span class="tag r">Já está no roteiro</span>':`<button class="btn peq" data-act="add" data-i="${p.i}">${svg('mais')}Adicionar ao roteiro</button>`}</div>
    ${p.ft?`<div class="cr">Foto: ${esc(p.fa)} · ${esc(p.fl)}</div>`:''}</div></div>`; }

R.epoca=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const datas=pl.map(d=>d.dt);
  const luas=[]; let last=null; datas.forEach(dt=>{ const l=lua(new Date(dt.valueOf())); const tipo=l.il<.06?'Lua nova':l.il>.94?'Lua cheia':null; if(tipo&&tipo!==last){ luas.push([dt,tipo,l.il]); } last=tipo; });
  return `<p class="sec" style="max-width:820px">Melhores meses: dados do Mapa da aventura. Luz e lua: cálculo astronômico real <span class="real">real</span>. Horários em hora solar local aproximada, que pode diferir do fuso oficial em até cerca de 1 hora. Temperatura e chuva entrariam aqui no produto final, a partir de normais climatológicas.</p>
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p)||pl.find(x=>x.id&&x.id.includes(p.id)); const dt=d?d.dt:addDias(T.inicio,0); const m=dt.getMonth()+1;
    const lz=luzDia(dt,p); let solH='';
    if(lz.polar) solH=`<div class="sol"><div><b>${lz.polar==='dia'?'Sol da meia-noite':'Noite polar'}</b><span>${lz.polar==='dia'?'o sol não se põe nesta data':'o sol não nasce nesta data'}</span></div></div>`;
    else { const s=lz.s; const g=Array.isArray(s.dourada)?s.dourada:null; const c=Array.isArray(s.civil)?s.civil:null;
      const h0=x=>{ const t=new Date(x.valueOf()+p.x/15*3600e3); return t.getUTCHours()+t.getUTCMinutes()/60; };
      solH=`<div class="sol"><div><b>${horaSolar(s.nascer[0],p.x)}</b><span>nascer do sol</span></div><div><b>${horaSolar(s.nascer[1],p.x)}</b><span>pôr do sol</span></div><div><b>${fmtN(lz.h,1)} h</b><span>de luz</span></div><div><b>${g?horaSolar(g[1],p.x):'—'}</b><span>início da hora dourada da tarde</span></div></div>
      <div class="barra-luz" title="Noite, crepúsculo e dia ao longo das 24 horas">${c?`<i style="left:${h0(c[0])/24*100}%;width:${(h0(s.nascer[0])-h0(c[0]))/24*100}%;background:#3c5a8a"></i>`:''}<i style="left:${h0(s.nascer[0])/24*100}%;width:${(h0(s.nascer[1])-h0(s.nascer[0]))/24*100}%;background:#c9a24a"></i>${c?`<i style="left:${h0(s.nascer[1])/24*100}%;width:${(h0(c[1])-h0(s.nascer[1]))/24*100}%;background:#3c5a8a"></i>`:''}</div>
      <div class="leg" style="margin-top:6px"><span>0 h</span><span style="margin-left:auto">24 h</span></div>`; }
    const ok=!r||!r.me||!r.me.length||r.me.includes(m);
    return `<div class="card"><div style="display:flex;gap:12px;align-items:baseline;flex-wrap:wrap"><h3 style="margin:0">${esc(p.n)}</h3><span class="sec">chegada ${fmtD(dt)} · latitude ${fmtN(Math.abs(p.y),1)}° ${p.y>=0?'N':'S'}</span></div>
      ${r&&r.me&&r.me.length?`<div class="meses">${MESES.map((n,i)=>`<span class="${r.me.includes(i+1)?'b':''}${i+1===m?' v'+(ok?'':' ruim'):''}">${n}</span>`).join('')}</div>
      <div class="leg"><span><i style="background:#1f5a3c"></i>melhor época segundo a WAS</span><span><i style="outline:2px solid #fff;outline-offset:-2px"></i>mês da sua visita</span></div>
      ${ok?'<p class="st-ok" style="margin:8px 0 0;font-size:15px">Você chega na melhor época.</p>':`<p class="st-warn" style="margin:8px 0 0;font-size:15px">Você chega fora da melhor época. Vale mudar a data ou a ordem dos lugares.</p>`}`:'<p class="cap">Sem indicação de melhor época para este ponto.</p>'}
      ${solH}</div>`; }).join('')}
  <div class="card"><h3>Lua durante a viagem <span class="real">real</span></h3><p class="sec">Lua nova é a melhor janela para céu estrelado e Via Láctea. Lua cheia ilumina paisagens noturnas e pode atrapalhar a observação de estrelas.</p>
    <div class="lua">${luas.length?luas.map(([dt,t,il])=>`<span class="${t==='Lua nova'?'boa':''}">${t} · ${fmtD(dt)}</span>`).join(''):'<span>Nenhuma lua nova ou cheia nas datas da viagem.</span>'}</div></div>`;
};
function vazioMapa(){ return `<div class="vazio">Escolha pelo menos um lugar na etapa “Lugares e trajeto”.<div class="btns"><button class="btn" data-act="passo" data-p="mapa">Ir para o mapa</button></div></div>`; }

R.dias=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano();
  return `<div class="card"><div class="row c3">
    <label class="f">Data de partida<input type="date" data-b="inicio" value="${esc(T.inicio)}"></label>
    <label class="f">Dias de margem no fim<input type="number" min="0" max="10" data-b="margem" data-num value="${T.margem}"></label>
    <label class="f">Aclimatação automática<select data-b="aclim" data-bool><option value="1"${T.aclim?' selected':''}>Ligada (acima de 3.000 m)</option><option value="0"${!T.aclim?' selected':''}>Desligada</option></select></label></div>
    <p class="ajuda">O plano se refaz sozinho quando você muda lugares, dias ou trajetos. As anotações de cada dia ficam guardadas.</p></div>
  <div class="card"><div class="leg" style="margin-bottom:14px"><span><i style="border:2px solid var(--red);border-radius:50%"></i>no lugar</span><span><i style="border:2px solid #64aaff;border-radius:50%"></i>deslocamento</span><span><i style="border:2px solid var(--warn);border-radius:50%"></i>aclimatação</span><span><i style="border:2px solid #6e7884;border-radius:50%"></i>margem e segurança</span></div>
  <div class="tl">${pl.map((d,i)=>`<div class="d ${d.tipo}"><div class="dt">Dia ${i+1} · ${fmtD(d.dt)}</div><div class="tt">${esc(d.t)}</div>${d.ds?`<div class="ds">${esc(d.ds)}</div>`:''}
    <input type="text" placeholder="Anotação do dia: hospedagem, horário, contato…" value="${esc(T.notas[d.id]||'')}" data-act="nota" data-id="${d.id}"></div>`).join('')}</div></div>`;
};

R.preparo=()=>{
  if(!T.paradas.length) return vazioMapa();
  const nv=nivel(), hab=habilidades(); const sem={1:2,2:4,3:8,4:12,5:20}[nv]||2;
  const hoje=new Date(); const ini=new Date(T.inicio+'T12:00:00'); const falta=Math.round((ini-hoje)/(7*864e5));
  const fases=[['Base aeróbica','Caminhada, corrida leve, bike ou natação, 3 a 4 vezes por semana, aumentando o volume aos poucos.'],['Força e resistência','Pernas, core e costas. Subidas com mochila carregada e treinos longos no fim de semana.'],['Específico','Simular a jornada: desníveis, peso real da mochila, frio, água ou altitude, conforme o roteiro.'],['Polimento','Reduzir o volume na última semana, dormir bem e revisar o equipamento.']];
  return `<div class="card"><h3>Nível do roteiro: ${NIVEL_N[nv]}</h3><p class="sec">O nível é o do lugar mais exigente, segundo as escalas de dificuldade de cada camada do Mapa da aventura.</p>
    <div class="tab-wrap"><table class="tab"><thead><tr><th>Lugar</th><th>Camada</th><th>Dificuldade</th></tr></thead><tbody>${T.paradas.filter(pontoDe).map(p=>{ const r=pontoDe(p); return `<tr><td>${esc(p.n)}</td><td>${esc(LAY[r.l].nome)}</td><td>${'●'.repeat(r.d)}<span style="color:#333">${'●'.repeat(5-r.d)}</span> ${esc(difLabel(p))}</td></tr>`; }).join('')}</tbody></table></div></div>
  <div class="card"><h3>Habilidades e certificações</h3>${hab.length?`<div class="ck">${hab.map(h=>ckItem('hb:'+h.k,h.t,'Por causa de: '+h.p)).join('')}</div>`:'<p class="sec">Nenhuma habilidade técnica exigida pelos lugares escolhidos.</p>'}</div>
  <div class="card"><h3>Plano de treino sugerido: ${sem} semanas</h3>
    <p class="sec">${falta>0?`Faltam cerca de ${falta} semanas para a partida. `+(falta<sem?'<span class="st-warn">O tempo é curto para o nível do roteiro. Considere adiar ou escolher lugares mais leves.</span>':'Dá tempo de se preparar com calma.'):'Escolha uma data de partida no futuro.'}</p>
    <div class="tl" style="margin-top:14px">${fases.map((f,i)=>`<div class="d"><div class="dt">Semanas ${Math.round(sem*i/4)+1} a ${Math.round(sem*(i+1)/4)}</div><div class="tt">${f[0]}</div><div class="ds">${f[1]}</div></div>`).join('')}</div></div>
  <div class="card"><h3>Autoavaliação</h3><div class="ck">${[['auto:sau','Fiz check-up médico e, se o roteiro passa de 3.000 m ou envolve mergulho, falei com um médico sobre isso'],['auto:car','Consigo caminhar 6 horas com mochila sem me esgotar'],['auto:nad','Sei nadar com segurança'],['auto:alt','Já estive acima de 3.000 m e sei como meu corpo reage'],['auto:ok','Li as exigências de cada lugar e acho que o grupo está à altura']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};
function ckItem(k,t,por,w){ const on=!!T.ck[k]; return `<label class="${on?'feito':''}"><input type="checkbox" data-act="ck" data-k="${esc(k)}"${on?' checked':''}><span class="tx">${esc(t)}${por?`<span class="por">${esc(por)}</span>`:''}</span>${w?`<span class="w">${w}</span>`:''}</label>`; }

R.equip=()=>{
  const G=equipamento(); let pt=0, pf=0; G.forEach(g=>g.its.forEach(i=>{ pt+=i.w; if(T.ck['eq:'+i.n]) pf+=i.w; }));
  return `<div class="card alt"><div class="row"><label class="f">Vai levar drone?<select data-b="drone" data-bool><option value="0"${!T.drone?' selected':''}>Não</option><option value="1"${T.drone?' selected':''}>Sim</option></select></label>
    <div><span class="kick">Peso estimado da lista</span><div style="font-family:var(--fT);font-size:26px;color:#fff;font-weight:700">${fmtN(pt/1000,1)} kg <span class="sim">simulado</span></div><span class="cap">sem roupas do dia a dia nem itens de grupo</span></div></div></div>
  ${G.map(g=>`<div class="card grupo-ck"><h4>${esc(g.t)}<small>${esc(g.por)}</small></h4><div class="ck">${g.its.map(i=>ckItem('eq:'+i.n,i.n,'',i.w?fmtN(i.w)+' g':'')).join('')}</div></div>`).join('')}
  <div class="card"><h3>Acrescentar item</h3><div class="add-item"><input type="text" id="novoItem" placeholder="Ex.: binóculo 10x42"><button class="btn peq" data-act="addItem">${svg('mais')}Acrescentar</button></div></div>`;
};

R.docs=()=>{
  if(!T.paradas.length) return vazioMapa();
  const L0=documentos();
  return `<p class="sec" style="max-width:820px">Orientação geral montada pelos países, lugares e tipo de jornada. Regras e valores mudam: confirme sempre na fonte oficial indicada. <span class="sim">regras simplificadas</span></p>
  <div class="card">${L0.map(d=>{ const s=T.docs[d.k]||'fazer'; return `<div class="doc"><div><b>${esc(d.t)}</b><p>${esc(d.p)}</p><div class="onde">Onde: ${esc(d.onde)}</div><div class="por">${esc(d.por)}</div></div>
    <select data-act="doc" data-k="${d.k}" class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':''}" aria-label="Situação">${[['fazer','A fazer'],['pedido','Pedido, aguardando'],['ok','Em ordem'],['na','Não se aplica']].map(([k,n])=>`<option value="${k}"${s===k?' selected':''}>${n}</option>`).join('')}</select></div>`; }).join('')}</div>`;
};

R.saude=()=>{
  const nv=nivel(); const alt=Math.max(0,...T.paradas.map(altDe));
  const cob=[['med','Despesas médicas e hospitalares'],['evac','Resgate e evacuação aeromédica'+(nv>=4?' (essencial neste roteiro)':'')],['alt','Atividades em altitude'+(alt?' até '+fmtN(alt)+' m':'')],['merg','Mergulho autônomo (seguro específico, como o DAN)'],['radical','Esportes de aventura'],['canc','Cancelamento e interrupção'],['bag','Bagagem e equipamento']];
  const rel=['med','evac']; if(alt>=2500) rel.push('alt'); if(temL('ME','NF')) rel.push('merg'); if(nv>=3||temL('AT','X')) rel.push('radical');
  return `<div class="card"><h3>Seguro: coberturas que o roteiro pede</h3><div class="ck">${cob.filter(c=>rel.includes(c[0])||['canc','bag'].includes(c[0])).map(([k,n])=>`<label class="${T.seguro[k]?'feito':''}"><input type="checkbox" data-act="seg" data-k="${k}"${T.seguro[k]?' checked':''}><span class="tx">${esc(n)}${rel.includes(k)?'<span class="por">Recomendado para este roteiro</span>':''}</span></label>`).join('')}</div></div>
  <div class="card"><h3>Saúde</h3><div class="ck">${[
    ['sa:con','Consulta de medicina do viajante (4 a 8 semanas antes)'],
    ...(alt>=3000?[['sa:alt','Plano para mal de altitude: sinais de alerta, descida imediata, medicação conversada com o médico']]:[]),
    ...(tropical()?[['sa:trop','Proteção contra mosquitos e informação sobre malária e dengue na região']]:[]),
    ...(frio()?[['sa:frio','Prevenção de hipotermia e congelamento (camadas, mãos e pés secos)']]:[]),
    ...(temL('ME','NF')?[['sa:dci','Câmara hiperbárica mais próxima anotada e intervalo antes de voar respeitado']]:[]),
    ['sa:kit','Kit de primeiros socorros do grupo e alguém com curso de primeiros socorros em área remota'],
    ['sa:rem','Remédios de uso contínuo em dobro, na bagagem de mão']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>
  <div class="card"><h3>Contatos de emergência</h3><p class="sec">Quem fica em casa acompanhando a viagem, e quem deve ser avisado se algo der errado.</p>
    ${T.contatos.map((c,i)=>`<div class="pessoa"><label class="f">Nome<input type="text" value="${esc(c.n)}" data-act="ct" data-i="${i}" data-f="n"></label><label class="f">Telefone<input type="text" value="${esc(c.tel)}" data-act="ct" data-i="${i}" data-f="tel"></label><label class="f">Relação<input type="text" value="${esc(c.rel)}" data-act="ct" data-i="${i}" data-f="rel"></label><button class="ico-btn" data-act="ctx" data-i="${i}" aria-label="Remover">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="ct+">${svg('mais')}Acrescentar contato</button></div></div>
  <div class="card"><h3>Comunicação e plano de retorno</h3><div class="row">
    <label class="f">Como vão se comunicar em área sem sinal<select data-b="com">${['Celular com chip local','Comunicador satelital (mensagens e SOS)','Telefone via satélite','Rádio da operadora'].map(o=>`<option${T.com===o?' selected':''}>${o}</option>`).join('')}</select></label>
    <label class="f">Se não houver notícia em…<select data-b="checkin">${['12 horas','24 horas','48 horas'].map(o=>`<option${T.checkin===o?' selected':''}>${o}</option>`).join('')}</select></label></div>
    <p class="ajuda">O contato de emergência recebe o roteiro dia a dia e aciona o seguro, a operadora e o consulado se o grupo passar desse prazo sem dar notícia.</p></div>`;
};

R.orc=()=>{
  if(!T.paradas.length) return vazioMapa();
  const o=orcamento(); const max=Math.max(...o.cats.map(c=>c[2]),1);
  return `<p class="sec" style="max-width:820px">Estimativa de exemplo, calculada pela região de cada lugar, pelos dias, trajetos e atividades. Troque qualquer valor pela sua cotação. <span class="sim">simulado</span></p>
  <div class="card"><div class="barras">${o.cats.map(c=>`<div class="b"><span>${c[1]}</span><i style="width:${Math.max(2,c[2]/max*100)}%"></i><span>${fmtR(c[2])}</span></div>`).join('')}<div class="b"><span>Reserva de 15%</span><i style="width:${o.cont/max*100}%;background:#3c4654"></i><span>${fmtR(o.cont)}</span></div></div>
    <div class="total"><span class="sec">Total para ${o.pes} pessoa${o.pes>1?'s':''}</span><b>${fmtR(o.total)}</b><span class="sec">${fmtR(o.total/o.pes)} por pessoa</span></div></div>
  <div class="card"><h3>Ajustar valores</h3><div class="row c3">${o.cats.map(c=>`<label class="f">${c[1]}<input type="number" min="0" step="50" data-act="orc" data-k="${c[0]}" value="${T.orc[c[0]]!=null&&T.orc[c[0]]!==''?T.orc[c[0]]:''}" placeholder="${Math.round(c[2])}"></label>`).join('')}</div>
    <div class="ck" style="margin-top:12px">${`<label class="${T.orcOk?'feito':''}"><input type="checkbox" data-act="orcOk"${T.orcOk?' checked':''}><span class="tx">Revisei o orçamento com cotações reais</span></label>`}</div></div>
  <div class="card alt"><h3>Custo por região</h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Lugar</th><th>Região</th><th class="n">Diária de referência</th></tr></thead><tbody>${T.paradas.map(p=>`<tr><td>${esc(p.n)}</td><td>${IDX_N[regiao(p)]}</td><td class="n">${fmtR(IDX[regiao(p)]*.85)}</td></tr>`).join('')}</tbody></table></div></div>`;
};

R.equipe=()=>{
  const papeis=['Líder da expedição','Navegação','Primeiros socorros','Fotografia','Câmera e direção','Som','Logística','Cozinha','Participante'];
  const parc=[];
  T.paradas.filter(pontoDe).slice(0,6).forEach(p=>{ const r=pontoDe(p); const tipo={CU:'Guia de montanha certificado',ME:'Centro de mergulho',TK:'Guia de trekking',FA:'Guia naturalista',BA:'Operadora de observação de baleias',P:'Operadora polar (IAATO)',VU:'Guia vulcanológico',AT:'Escola e condutores credenciados',O:'Locadora 4x4 com apoio',PQ:'Condutor do parque',NF:'Centro de mergulho em naufrágios'}[r.l]||'Operadora local';
    parc.push({n:tipo, l:p.n}); });
  return `<div class="card"><h3>Quem vai</h3>${T.equipe.map((m,i)=>`<div class="pessoa"><label class="f">Nome<input type="text" value="${esc(m.n)}" data-act="eq" data-i="${i}" data-f="n"></label><label class="f">Papel<select data-act="eq" data-i="${i}" data-f="papel">${papeis.map(p=>`<option${m.papel===p?' selected':''}>${p}</option>`).join('')}</select></label><label class="f">Contato<input type="text" value="${esc(m.c)}" data-act="eq" data-i="${i}" data-f="c"></label><button class="ico-btn" data-act="eqx" data-i="${i}" aria-label="Remover">${svg('lixo')}</button></div>`).join('')}
    <div class="btns"><button class="btn peq sec2" data-act="eq+">${svg('mais')}Acrescentar pessoa</button></div></div>
  ${parc.length?`<div class="card"><h3>Guias e operadoras sugeridos <span class="sim">exemplo</span></h3><p class="sec">No produto final, esta lista viria de uma rede curada pela WAS: operadoras avaliadas, guias credenciados e associados que já estiveram em cada lugar.</p>
    <div class="parc">${parc.map(x=>`<div><b>${esc(x.n)}</b><span>${esc(x.l)}</span><span class="cap">Avaliação, credenciais e contato apareceriam aqui</span></div>`).join('')}</div></div>`:''}
  <div class="perg"><b>Pergunta para a WAS:</b> a indicação de guias e operadoras seria aberta a todos ou um benefício de apoiadores? Operadoras parceiras poderiam ter selo WAS de boas práticas.</div>`;
};

R.imagens=()=>{
  if(!T.paradas.length) return vazioMapa();
  const pl=plano(); const fmt={h265:['4K H.265 (100 Mb/s)',.75],prores:['4K ProRes 422 HQ',5.3],raw:['Fotos RAW (por 100 fotos)',5],h264:['HD H.264 (50 Mb/s)',.37]};
  const diasF=pl.filter(d=>d.p).length; const c=T.cine; const gbDia=(fmt[c.fmt]||fmt.h265)[1]*60*(c.horas||0)*(c.cams||1); const tot=gbDia*diasF;
  const sug={VU:['Lava ou fumarola na hora azul','Silhueta da cratera com estrelas'],BA:['Salto da baleia com teleobjetiva','Cauda na luz lateral da manhã'],FA:['Retrato com olhar na altura dos olhos do animal','Comportamento: alimentação, filhotes, interação'],CU:['Montanha na primeira luz (alpenglow)','Escala humana: cordada na aresta'],TK:['Trilha serpenteando com pessoa pequena no quadro','Acampamento iluminado à noite'],ME:['Silhueta contra a superfície','Macro em recife'],P:['Gelo com sol baixo','Navio ou barraca para dar escala'],NF:['Proa do navio com mergulhador para escala'],PQ:['Paisagem assinatura do parque na hora dourada'],AT:['Ação em velocidade alta e ângulo baixo'],O:['Veículo levantando poeira contra o sol'],L:['Marco da trilha'],X:['Horizonte vazio e o barco ou nadador'],B2:['Estrada vista do alto com o ciclista'],E2:['Lugar histórico com detalhe que conte a história']};
  return `${!(tem('fotografica')||tem('cinema'))?'<div class="perg">Esta etapa é opcional para o seu tipo de jornada. Ela aparece completa em roteiros fotográficos e cinematográficos.</div>':''}
  ${T.paradas.map(p=>{ const r=pontoDe(p); const d=pl.find(x=>x.p===p); const dt=d?d.dt:new Date(T.inicio+'T12:00:00'); const lz=luzDia(dt,p); const s=lz.s; const lst=T.imagens[p.id]||[];
    let luz=''; if(lz.polar) luz=lz.polar==='dia'?'Sol da meia-noite: luz baixa e dourada perto da meia-noite solar.':'Noite polar: luz azul do crepúsculo ao meio-dia e chance de aurora.';
    else { const g=Array.isArray(s.dourada)?s.dourada:null, c2=Array.isArray(s.civil)?s.civil:null; luz=`Hora azul da manhã ${c2?horaSolar(c2[0],p.x):'—'} a ${horaSolar(s.nascer[0],p.x)} · hora dourada até ${g?horaSolar(g[0],p.x):'—'} · dourada da tarde a partir de ${g?horaSolar(g[1],p.x):'—'} · pôr do sol ${horaSolar(s.nascer[1],p.x)}`; }
    const l=lua(dt);
    return `<div class="card"><h3>${esc(p.n)}</h3><p class="sec" style="margin-bottom:6px">${fmtD(dt)} · ${luz} <span class="real">real</span></p><p class="cap">Lua ${Math.round(l.il*100)}% iluminada${l.il<.25?' · noite boa para estrelas':''}</p>
      ${r&&sug[r.l]?`<div class="chips" style="margin:10px 0">${sug[r.l].map(x=>`<button class="chip cam" data-act="cena+" data-id="${p.id}" data-t="${esc(x)}">${svg('mais')}${esc(x)}</button>`).join('')}</div>`:''}
      <div class="ck">${lst.map((x,i)=>`<label class="${x.ok?'feito':''}"><input type="checkbox" data-act="cenaok" data-id="${p.id}" data-i="${i}"${x.ok?' checked':''}><span class="tx">${esc(x.t)}</span><button class="ico-btn" data-act="cenax" data-id="${p.id}" data-i="${i}" aria-label="Remover" style="margin-left:auto">${svg('lixo')}</button></label>`).join('')}</div>
      <div class="add-item"><input type="text" placeholder="Nova cena ou foto desejada" data-cena="${p.id}"><button class="btn peq" data-act="cena+" data-id="${p.id}">${svg('mais')}Acrescentar</button></div></div>`; }).join('')}
  <div class="card"><h3>Armazenamento e backup</h3><div class="row c3">
    <label class="f">Formato principal<select data-act="cine" data-f="fmt">${Object.entries(fmt).map(([k,v])=>`<option value="${k}"${c.fmt===k?' selected':''}>${v[0]}</option>`).join('')}</select></label>
    <label class="f">Câmeras gravando<input type="number" min="1" max="10" value="${c.cams}" data-act="cine" data-f="cams"></label>
    <label class="f">${c.fmt==='raw'?'Centenas de fotos por dia':'Horas gravadas por dia'}<input type="number" min="0" max="24" step=".5" value="${c.horas}" data-act="cine" data-f="horas"></label></div>
    <div class="total"><span class="sec">${diasF} dias de captação · ${fmtN(gbDia)} GB por dia</span><b>${fmtN(tot/1000,1)} TB</b><span class="sec">${fmtN(tot*3/1000,1)} TB com backup 3-2-1 (três cópias)</span></div></div>
  <div class="card"><h3>Autorizações de imagem</h3><div class="ck">${[['im:ces','Termos de cessão de imagem para pessoas identificáveis'],['im:com','Acordo com comunidades tradicionais e indígenas antes de fotografar ou filmar'],['im:loc','Autorização de locações e de áreas protegidas'],['im:dr','Drone registrado e voo autorizado em cada local']].map(([k,t])=>ckItem(k,t)).join('')}</div></div>`;
};

R.conduta=()=>{
  if(!T.paradas.length) return vazioMapa();
  let tot=0; const linhas=T.paradas.slice(1).map((p,i)=>{ const t=trecho(i+1); tot+=t.co2; return `<tr><td>${esc(t.a.n)} → ${esc(t.b.n)}</td><td>${t.M.n}</td><td class="n">${fmtN(t.km)} km</td><td class="n">${fmtN(t.co2)} kg</td></tr>`; }).join('');
  const regras=[];
  if(temL('BA')) regras.push(['Baleias','Respeite a distância mínima da lei local. No Brasil, embarcações devem ficar a pelo menos 100 m das baleias (Portaria Ibama 117/1996), com motor em neutro perto delas.']);
  if(temL('FA')) regras.push(['Fauna','Não alimente, não chame e não cerque animais. Com primatas, use máscara e mantenha distância: eles pegam nossas doenças.']);
  if(temL('ME','NF')) regras.push(['Recifes e naufrágios','Controle de flutuação, nada de tocar em coral, protetor solar seguro para recifes e nada retirado de naufrágios.']);
  if(temL('P')) regras.push(['Polos','Siga as diretrizes da IAATO: 5 m dos pinguins, botas lavadas entre desembarques, nenhum resíduo em terra.']);
  if(temL('CU','TK','L','VU')) regras.push(['Montanha e trilha','Leve de volta todo o lixo, inclusive o orgânico e o papel higiênico. Fique na trilha e use banheiros secos onde houver.']);
  if(tem('cultural')) regras.push(['Comunidades','Peça licença antes de fotografar pessoas, contrate guias e serviços locais e respeite os lugares sagrados.']);
  return `<div class="card"><h3>Pegada de carbono dos trajetos <span class="sim">fatores aproximados</span></h3><div class="tab-wrap"><table class="tab"><thead><tr><th>Trecho</th><th>Como</th><th class="n">Distância</th><th class="n">CO₂ por pessoa</th></tr></thead><tbody>${linhas||'<tr><td colspan="4">Sem trajetos ainda.</td></tr>'}</tbody></table></div>
    <div class="total"><span class="sec">Total por pessoa</span><b>${fmtN(tot/1000,2)} t CO₂</b><span class="sec">${fmtN(tot/1000*T.pessoas,2)} t para o grupo</span></div>
    <p class="ajuda">Para reduzir: menos voos curtos, trem ou ônibus quando der, mais dias em cada lugar. Para compensar, a WAS poderia indicar projetos de restauração ligados aos lugares do mapa.</p></div>
  ${regras.length?`<div class="card"><h3>Conduta nos lugares do seu roteiro</h3>${regras.map(r=>`<div class="doc" style="grid-template-columns:1fr"><div><b>${r[0]}</b><p>${r[1]}</p></div></div>`).join('')}</div>`:''}
  <div class="card"><h3>Princípios de mínimo impacto</h3><div class="tl">${['Planeje e se prepare','Ande e acampe em superfícies resistentes','Leve seu lixo de volta','Deixe o que encontrar','Minimize o impacto de fogueiras','Respeite a vida selvagem','Seja cortês com outros visitantes'].map((t,i)=>`<div class="d"><div class="tt" style="font-size:16px">${i+1}. ${t}</div></div>`).join('')}</div>
    <p class="cap">Baseado nos sete princípios do Leave No Trace.</p>
    <div class="ck">${`<label class="${T.compromisso?'feito':''}"><input type="checkbox" data-act="comp"${T.compromisso?' checked':''}><span class="tx">Assumo o compromisso de conduta WAS para esta jornada</span></label>`}</div></div>`;
};

R.revisar=()=>{
  const pl=plano(), o=orcamento(), st=status();
  return `<div class="exp no-print">
    <button data-act="print">${qd('imprimir',1)}<div><b>Imprimir ou salvar em PDF</b><span>Dossiê completo do roteiro</span></div></button>
    <button data-act="gpx">${qd('pin',1)}<div><b>Baixar GPX</b><span>Lugares e trajeto para GPS e apps de mapa</span></div></button>
    <button data-act="ics">${qd('cal',1)}<div><b>Baixar calendário</b><span>Dia a dia na sua agenda (.ics)</span></div></button>
    <button data-act="link">${qd('compart',1)}<div><b>Copiar link do roteiro</b><span>Quem abrir recebe uma cópia</span></div></button>
    <button data-act="json">${qd('baixar',1)}<div><b>Baixar arquivo do roteiro</b><span>Para guardar ou importar depois</span></div></button>
    <button data-act="enviar">${qd('enviar',1)}<div><b>Enviar à WAS <span class="apoio">apoiador</span></b><span>Pedir revisão de um especialista (simulado)</span></div></button>
  </div>
  <div class="dossie">
    <div class="card"><span class="kick">${T.tipos.map(t=>TIPO_N[t]).join(' · ')}</span><h2 style="margin:6px 0 10px">${esc(T.nome)}</h2>${T.intencao?`<p class="lead">${esc(T.intencao)}</p>`:''}
      <div class="tab-wrap"><table class="tab"><tbody>
      <tr><td>Datas</td><td>${pl.length?fmtDL(pl[0].dt)+' a '+fmtDL(pl[pl.length-1].dt)+' · '+pl.length+' dias':'—'}</td></tr>
      <tr><td>Grupo</td><td>${T.pessoas} pessoa${T.pessoas>1?'s':''} · ${({solo:'sozinho',dupla:'em dupla',grupo:'em grupo',familia:'em família',equipe:'equipe de produção'})[T.quem]} · ritmo ${T.ritmo}</td></tr>
      <tr><td>Nível</td><td>${NIVEL_N[nivel()]}</td></tr>
      <tr><td>Lugares</td><td>${T.paradas.map((p,i)=>(i+1)+'. '+esc(p.n)).join(' · ')||'—'}</td></tr>
      <tr><td>Orçamento</td><td>${fmtR(o.total)} (${fmtR(o.total/o.pes)} por pessoa) <span class="sim">simulado</span></td></tr>
      <tr><td>Prontidão</td><td>${st.pct}% · ${st.docF} de ${st.docs.length} documentos em ordem · ${st.eqF} de ${st.eqT} itens de equipamento</td></tr>
      <tr><td>Emergência</td><td>${T.contatos.map(c=>esc(c.n)+' '+esc(c.tel)).join(' · ')||'<span class="st-warn">não definido</span>'}${T.com?' · '+esc(T.com):''}</td></tr>
      </tbody></table></div></div>
    <div class="card"><h3>Dia a dia</h3><div class="tab-wrap"><table class="tab"><tbody>${pl.map((d,i)=>`<tr><td style="white-space:nowrap">Dia ${i+1}<br><span class="cap">${fmtD(d.dt)}</span></td><td><b style="color:inherit">${esc(d.t)}</b>${T.notas[d.id]?'<br><span class="cap">'+esc(T.notas[d.id])+'</span>':''}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><h3>Documentos e licenças</h3><div class="tab-wrap"><table class="tab"><tbody>${documentos().map(d=>{const s=T.docs[d.k]||'fazer';return `<tr><td>${esc(d.t)}</td><td class="${s==='ok'?'st-ok':s==='pedido'?'st-warn':'st-bad'}">${({fazer:'A fazer',pedido:'Aguardando',ok:'Em ordem',na:'Não se aplica'})[s]}</td></tr>`;}).join('')}</tbody></table></div></div>
    ${inspirar()}
  </div>
  <div class="card alt no-print"><h3>Recursos para apoiadores <span class="sim">proposta</span></h3><p class="sec">Ideias para ligar o construtor ao modelo de apoiadores da WAS. Nada disso funciona ainda.</p>
    <div class="ck">${['Revisão do roteiro por um especialista ou associado da WAS','Dossiê em PDF com a marca da WAS e mapas em alta resolução','Mapas offline e alertas de época e clima por e-mail','Publicar o relato da expedição no site da WAS, com fotos e trajeto, e virar associado pela atuação'].map(t=>`<label><input type="checkbox" disabled><span class="tx">${t}</span></label>`).join('')}</div></div>`;
};
function inspirar(){
  const set=new Map();
  T.paradas.forEach(p=>{ const r=pontoDe(p); if(r&&r.pf) set.set(r.pf[1],{t:r.pf[0],s:'Explorador ligado a '+r.n,u:r.pf[1]}); if(r&&r.g) set.set(r.g,{t:'Guia: '+r.n,s:'Página completa do destino na WAS',u:r.g}); });
  D.rotas.forEach(r=>{ if(!r.link) return; if(T.paradas.some(p=>r.pts.some(q=>km(p,{x:q[0],y:q[1]})<150))) set.set(r.link,{t:r.n,s:r.quem+' · '+r.per,u:r.link}); });
  if(!set.size) return '';
  return `<div class="card no-print"><h3>Para se inspirar na WAS</h3><p class="sec">Exploradores, rotas históricas e guias de destino que passam pelos lugares do seu roteiro.</p><div class="insp">${[...set.values()].slice(0,9).map(x=>`<a class="c" href="${esc(x.u)}" target="_blank" rel="noopener"><b>${esc(x.t)} ↗</b><span>${esc(x.s)}</span></a>`).join('')}</div></div>`;
}

/* ---------- exportações ---------- */
function baixar(nome,txt,tipo){ const b=new Blob([txt],{type:tipo}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=nome; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }
const slugf=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'roteiro';
const xesc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function gpx(){ const w=T.paradas.map((p,i)=>`  <wpt lat="${p.y}" lon="${p.x}"><name>${i+1}. ${xesc(p.n)}</name></wpt>`).join('\n');
  const r=T.paradas.map(p=>`    <rtept lat="${p.y}" lon="${p.x}"><name>${xesc(p.n)}</name></rtept>`).join('\n');
  baixar(slugf(T.nome)+'.gpx',`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Roteiros WAS (protótipo)" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${xesc(T.nome)}</name></metadata>\n${w}\n  <rte><name>${xesc(T.nome)}</name>\n${r}\n  </rte>\n</gpx>\n`,'application/gpx+xml'); }
function ics(){ const pl=plano(); const f=d=>isoD(d).replace(/-/g,''); const e=s=>String(s).replace(/[,;\\]/g,m=>'\\'+m).replace(/\n/g,'\\n');
  const ev=pl.map((d,i)=>{ const n=new Date(d.dt); n.setDate(n.getDate()+1); return `BEGIN:VEVENT\r\nUID:${T.id}-${i}@roteiros.was\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z\r\nDTSTART;VALUE=DATE:${f(d.dt)}\r\nDTEND;VALUE=DATE:${f(n)}\r\nSUMMARY:${e('Dia '+(i+1)+': '+d.t)}\r\nDESCRIPTION:${e((d.ds||'')+(T.notas[d.id]?'\n'+T.notas[d.id]:''))}\r\nEND:VEVENT`; }).join('\r\n');
  baixar(slugf(T.nome)+'.ics',`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//WAS//Roteiros prototipo//PT\r\nCALSCALE:GREGORIAN\r\n${ev}\r\nEND:VCALENDAR\r\n`,'text/calendar'); }
function linkCompart(){ const s=btoa(unescape(encodeURIComponent(JSON.stringify(T)))); const u=location.href.split('#')[0]+'#r='+s;
  const ok=()=>toast('Link copiado. Quem abrir recebe uma cópia deste roteiro.');
  if(navigator.clipboard&&window.isSecureContext) navigator.clipboard.writeText(u).then(ok,()=>{prompt0(u);}); else prompt0(u); }
function prompt0(u){ const t=document.createElement('textarea'); t.value=u; document.body.appendChild(t); t.select(); try{document.execCommand('copy'); toast('Link copiado.');}catch(e){toast('Não foi possível copiar.');} t.remove(); }
function toast(m){ let t=$('#toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; app.appendChild(t);} t.textContent=m; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),3200); }

/* ---------- eventos ---------- */
function mudou(paradas){ save(); refreshNav(); renderLado();
  if(paradas&&passo==='mapa'){ $('#paradas').innerHTML=paradasHTML(); desenharTrajeto(false); } }
function abrir(t,p){ T=t; passo=p||'ideia'; save(); renderApp(); window.scrollTo(0,0); }
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-act]'); if(!b) return; const a=b.dataset.act;
  if(['ck','seg','cenaok','orcOk','comp'].includes(a)) return; // tratados em change
  if(b.tagName==='A'&&b.getAttribute('href')==='#') ev.preventDefault();
  switch(a){
    case 'home': T=null; renderHome(); break;
    case 'zero': abrir(novo()); break;
    case 'zero-mapa': abrir(novo({nome:'Roteiro a partir do mapa'}),'mapa'); break;
    case 'ir-sec': document.getElementById(b.dataset.sec).scrollIntoView({behavior:'smooth'}); break;
    case 'modelo': abrir(criarModelo(MODELOS.find(m=>m.id===b.dataset.id)),'mapa'); toast('Modelo copiado para os seus roteiros. Mude o que quiser.'); break;
    case 'rota': abrir(criarDeRota(b.dataset.id),'mapa'); T.verRotas=true; renderPasso(); toast('Roteiro criado com os lugares do mapa perto da rota.'); break;
    case 'abrir': abrir(DB.rot.find(r=>r.id===b.dataset.id)); break;
    case 'apagar': { const r=DB.rot.find(x=>x.id===b.dataset.id); if(b.dataset.conf!=='1'){ b.dataset.conf='1'; b.style.borderColor='#ff6b5e'; b.title='Clique de novo para apagar “'+(r?r.nome:'')+'”'; toast('Clique de novo na lixeira para apagar “'+(r?r.nome:'')+'”.'); setTimeout(()=>{b.dataset.conf='';b.style.borderColor='';},4000); break; }
      DB.rot=DB.rot.filter(x=>x.id!==b.dataset.id); try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){} renderHome(); toast('Roteiro apagado.'); break; }
    case 'passo': passo=b.dataset.p; renderPasso(); { const y=app.getBoundingClientRect().top+window.scrollY-70; window.scrollTo({top:Math.max(0,y)}); } break;
    case 'tipo': { const k=b.dataset.k, i=T.tipos.indexOf(k); if(i>=0){ if(T.tipos.length>1) T.tipos.splice(i,1); } else T.tipos.push(k); save(); renderPasso(); refreshNav(); renderLado(); renderNavOpc(); break; }
    case 'quem': T.quem=b.dataset.k; if(T.quem==='solo') T.pessoas=1; if(T.quem==='dupla') T.pessoas=2; save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'camada': { const k=b.dataset.k; let lay=T.camadas||D.layers.map(l=>l.k); if(lay.includes(k)){ lay=lay.filter(x=>x!==k); mapa&&mapa.removeLayer(grpL[k]); b.classList.replace('on','off'); } else { lay.push(k); mapa&&grpL[k].addTo(mapa); b.classList.replace('off','on'); } T.camadas=lay; save(); break; }
    case 'verRotas': T.verRotas=!T.verRotas; if(mapa){ T.verRotas?rotasL.addTo(mapa):mapa.removeLayer(rotasL); } b.classList.toggle('on',T.verRotas); b.classList.toggle('off',!T.verRotas); save(); break;
    case 'livre': modoLivre=true; $('#modo').classList.add('on'); toast('Clique no mapa onde quer o ponto.'); break;
    case 'livre-x': modoLivre=false; $('#modo').classList.remove('on'); break;
    case 'add': { const p=D.pts[+b.dataset.i]; T.paradas.push({id:uid(),ref:p.l+'|'+p.n,n:p.n,x:p.x,y:p.y,dias:p.l==='CU'&&p.d>=4?10:(parseInt(p.dias)||2),l:p.l}); if(mapa) mapa.closePopup(); mudou(true); toast(p.n+' entrou no roteiro.'); break; }
    case 'res': { const p=D.pts[+b.dataset.i]; $('#res').hidden=true; $('#busca').value=''; const k=p.l; let lay=T.camadas||D.layers.map(l=>l.k); if(!lay.includes(k)){ lay.push(k); T.camadas=lay; grpL[k].addTo(mapa); const c=$(`.chip.cam[data-k="${k}"]`); c&&c.classList.replace('off','on'); }
      mapa.setView([p.y,p.x],6); grpL[k].eachLayer(m=>{ const ll=m.getLatLng(); if(ll.lat===p.y&&ll.lng===p.x) m.openPopup(); }); break; }
    case 'sobe': case 'desce': { const i=T.paradas.findIndex(p=>p.id===b.dataset.id); const j=a==='sobe'?i-1:i+1; if(j<0||j>=T.paradas.length) break; [T.paradas[i],T.paradas[j]]=[T.paradas[j],T.paradas[i]]; mudou(true); break; }
    case 'tira': T.paradas=T.paradas.filter(p=>p.id!==b.dataset.id); mudou(true); break;
    case 'addItem': { const i=$('#novoItem'); if(i.value.trim()){ T.extras.push(i.value.trim()); save(); renderPasso(); refreshNav(); renderLado(); } break; }
    case 'ct+': T.contatos.push({n:'',tel:'',rel:''}); save(); renderPasso(); break;
    case 'ctx': T.contatos.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); renderLado(); break;
    case 'eq+': T.equipe.push({n:'',papel:T.equipe.length?'Participante':'Líder da expedição',c:''}); save(); renderPasso(); refreshNav(); break;
    case 'eqx': T.equipe.splice(+b.dataset.i,1); save(); renderPasso(); refreshNav(); break;
    case 'cena+': { const id=b.dataset.id; let t=b.dataset.t; if(!t){ const i=$(`[data-cena="${id}"]`); t=i&&i.value.trim(); } if(!t) break; (T.imagens[id]=T.imagens[id]||[]).push({t,ok:false}); save(); renderPasso(); refreshNav(); renderLado(); break; }
    case 'cenax': T.imagens[b.dataset.id].splice(+b.dataset.i,1); save(); renderPasso(); break;
    case 'print': window.print(); break;
    case 'gpx': gpx(); break; case 'ics': ics(); break;
    case 'json': baixar(slugf(T.nome)+'.roteiro-was.json',JSON.stringify(T,null,2),'application/json'); break;
    case 'link': linkCompart(); break;
    case 'enviar': toast('Simulação: no produto final o roteiro iria para a curadoria da WAS.'); break;
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
  r.innerHTML=hits.length?hits.slice(0,12).map(([,p])=>`<button data-act="res" data-i="${p.i}"><span class="bol" style="background:${LAY[p.l].cor}"></span>${esc(p.n)}<small>${esc(LAY[p.l].nome)} · ${esc(p.pa)}</small></button>`).join(''):'<div style="padding:10px 12px;color:var(--sec)">Nada encontrado.</div>'; }
document.addEventListener('click',ev=>{ const r=$('#res'); if(r&&!r.hidden&&!ev.target.closest('.busca')) r.hidden=true; },true);
window.addEventListener('resize',()=>{ clearTimeout(window._rz); window._rz=setTimeout(()=>{ if(T) montarMini(); },250); });

/* ---------- partida ---------- */
const h=location.hash.match(/^#r=(.+)$/);
if(h){ try{ const t=JSON.parse(decodeURIComponent(escape(atob(h[1])))); t.id=uid(); t.nome=(t.nome||'Roteiro')+' (cópia)'; history.replaceState(null,'',location.pathname); abrir(t,'revisar'); toast('Roteiro recebido por link e guardado nos seus roteiros.'); }catch(e){ renderHome(); } }
else renderHome();
})();
