/* Radar WAS: bloco da home e Memória em /radar (27/11/2026). Fonte: /mnt/project-files/home/radar-home/ */
(function(){if(document.getElementById('was-radar-home'))return;var st=document.createElement('style');st.id='was-radar-home';st.textContent="/* 27/11: Radar WAS na home (abaixo do mapa) e Mem\u00f3ria em /radar */\n.rdh{--rl:#262d37;--rm:#9aa3ad;--rt:#e6e6e6;--rw:#fff;--rr:#b90000;--rb:#11161d;--rp:#3ecf8e;--rn:#ff6b5e;background:#0b0f14;padding:clamp(48px,5vw,80px) 0;color:var(--rt)}\n.rdh-wrap{max-width:1440px;width:calc(100% - 8vw);margin:0 auto}\n.rdh-kick{font:400 12px/1.4 Lato,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--rm)}\n.rdh-h2{margin:10px 0 0;font:700 clamp(26px,2.6vw,42px)/1.15 Montserrat,sans-serif;color:var(--rw);text-transform:none}\n.rdh-lead{max-width:820px;margin:14px 0 0;font:300 clamp(17px,1.25vw,19px)/1.55 Lato,sans-serif;color:var(--rm)}\n.rdh-tabs{display:flex;gap:clamp(18px,2.2vw,34px);margin:clamp(26px,3vw,40px) 0 0;border-bottom:1px solid var(--rl);overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}\n.rdh-tabs::-webkit-scrollbar{display:none}\n.rdh-tab{flex:0 0 auto;-webkit-appearance:none;appearance:none;background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;padding:14px 0 13px;color:var(--rm);font:600 14px/1 Montserrat,sans-serif;cursor:pointer;white-space:nowrap}\n.rdh-tab sup{font:400 11px/1 Lato,sans-serif;margin-left:4px;color:#6b747e;vertical-align:4px}\n.rdh-tab:hover{color:var(--rt)}.rdh-tab[aria-selected=\"true\"]{color:var(--rw);border-bottom-color:var(--rw)}\n.rdh-tab:focus-visible,.rdh-a:focus-visible,.rdh-more:focus-visible{outline:2px solid #fff;outline-offset:3px}\n.rdh-cols{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,64px);margin-top:clamp(26px,3vw,40px);align-items:start}\n.rdh-colh{display:flex;align-items:center;gap:10px;padding-bottom:12px;font:700 15px/1.2 Montserrat,sans-serif;letter-spacing:.04em}\n.rdh-colh small{font:400 13px/1 Lato,sans-serif;color:var(--rm);letter-spacing:0}\n.rdh-pos .rdh-colh{color:var(--rp)}.rdh-neg .rdh-colh{color:var(--rn)}\n.rdh-list{list-style:none;margin:0;padding:0;border-bottom:1px solid var(--rl)}\n.rdh-li[hidden]{display:none}\n.rdh-a{display:grid;grid-template-columns:clamp(96px,8.5vw,140px) minmax(0,1fr);gap:16px;align-items:start;padding:16px 10px 16px 0;border-top:1px solid var(--rl);color:inherit;text-decoration:none;transition:background-color .2s}\n.rdh-a:hover{background:var(--rb)}\n.rdh-img{display:block;width:100%;aspect-ratio:3/2;object-fit:cover;background:var(--rb)}\n.rdh-ano{display:flex;align-items:center;justify-content:center;width:100%;aspect-ratio:3/2;background:var(--rb);font:700 clamp(20px,1.8vw,28px)/1 Montserrat,sans-serif;color:var(--rw);border-left:3px solid var(--c,#9aa3ad)}\n.rdh-meta{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font:400 12px/1.4 Lato,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--rm)}\n.rdh-bars{display:inline-flex;align-items:flex-end;gap:2px}.rdh-bars i{display:block;width:5px;border-radius:1px;background:rgba(255,255,255,.18)}\n.rdh-t{margin:6px 0 0;font:600 16px/1.3 Montserrat,sans-serif;color:var(--rw);text-transform:none}\n.rdh-x{margin:6px 0 0;font:300 15px/1.5 Lato,sans-serif;color:var(--rm);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.rdh-more{-webkit-appearance:none;appearance:none;background:none;border:0;margin-top:14px;padding:8px 0;color:var(--rw);font:600 14px/1 Montserrat,sans-serif;cursor:pointer}\n.rdh-more[hidden]{display:none}\n.rdh-neu{margin-top:22px;font:400 14px/1.5 Lato,sans-serif;color:var(--rm)}.rdh-neu a{color:#64aaff}\n.rdh-empty{padding:18px 0;color:var(--rm);font:300 15px/1.5 Lato,sans-serif;border-top:1px solid var(--rl)}\n.rdh-btns{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:clamp(36px,4vw,56px)}\n.rdh-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;background:var(--rr);color:#fff;font:600 15px/1 Montserrat,sans-serif;text-decoration:none;border-radius:2px}\n.rdh-btn.sec{background:transparent;border:1px solid #fff}\n@media (max-width:991px){.rdh-cols{grid-template-columns:1fr}}\n@media (max-width:479px){.rdh-a{grid-template-columns:84px minmax(0,1fr);gap:12px}.rdh-x{-webkit-line-clamp:3}}\n";document.head.appendChild(st);})();
(function(){function go(){/* 27/11: Radar WAS (home e /radar). Dados: was-mapa-dados/v1/radar/radar-dados.json */
(function(){
 var BOX=document.querySelectorAll('[data-radar-app]');if(!BOX.length)return;
 var URL='https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@554bcc24425602797f58bc5f43fe418d59ff3ea4/v1/radar/radar-dados.json';
 var p=location.pathname,L=/^\/en(\/|$)/.test(p)?1:/^\/es(\/|$)/.test(p)?2:0,PRE=['','/en','/es'][L];
 var TX={tabs:[['todos','Todos','All','Todos'],['semana','Última semana','Last week','Última semana'],['mes','Último mês','Last month','Último mes'],['ano','Último ano','Last year','Último año'],['decada','Última década','Last decade','Última década'],['seculo','Último século','Last century','Último siglo'],['historia','Toda a história','All of history','Toda la historia']],
  pos:['Em alta','Rising','En alza'],neg:['Em baixa','Falling','En baja'],neu:['Neutro','Neutral','Neutro'],
  mais:['Mostrar mais','Show more','Mostrar más'],vazio:['Nada neste período ainda.','Nothing in this period yet.','Nada en este período todavía.'],
  ativo:['No Radar','On the Radar','En el Radar'],mem:['Memória','Memory','Memoria'],
  int:['Intensidade','Intensity','Intensidad'],iv:[['baixa','média','alta'],['low','medium','high'],['baja','media','alta']]};
 var MES=[['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']];
 var CAB={kick:['Radar WAS','WAS Radar','Radar WAS'],h2:['O que está em alta e em baixa no mundo da aventura','What is rising and falling in the adventure world','Lo que está en alza y en baja en el mundo de la aventura'],
  lead:['Os assuntos do momento para quem viaja, explora e cuida da natureza, e a memória do que marcou o último ano, a última década e o último século.','The topics of the moment for people who travel, explore and care for nature, plus a memory of what marked the last year, decade and century.','Los temas del momento para quien viaja, explora y cuida la naturaleza, y la memoria de lo que marcó el último año, la última década y el último siglo.'],
  btn:['Ver todo o Radar','See all of the Radar','Ver todo el Radar'],btn2:['Memória do Radar','Radar memory','Memoria del Radar']};
 BOX.forEach(function(b){b.querySelectorAll('[data-rdh]').forEach(function(e){var k=e.getAttribute('data-rdh');if(CAB[k])e.textContent=CAB[k][L];if(e.tagName=='A'){var h=e.getAttribute('href');if(h&&h.charAt(0)=='/')e.setAttribute('href',PRE+h);}});});
 function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function fd(d){var a=d.split('-');return (+a[2])+' '+MES[L][+a[1]-1]+' '+a[0];}
 function age(d){return (Date.now()-Date.parse(d+'T12:00:00Z'))/864e5;}
 var RANK={ano:3,decada:4,seculo:5};
 function inTab(e,tab){
  if(e.k=='radar'){if(tab=='semana')return age(e.atu)<=7;if(tab=='mes')return age(e.atu)<=31;return true;}
  var n={todos:0,semana:1,mes:2,ano:3,decada:4,seculo:5,historia:6}[tab];return n>=RANK[e.per];
 }
 function bars(i,c){var h='';for(var j=0;j<3;j++)h+='<i style="height:'+(5+4*j)+'px'+(j<i?';background:'+c:'')+'"></i>';return '<span class="rdh-bars" title="'+TX.int[L]+' '+TX.iv[L][i-1]+'">'+h+'</span>';}
 function item(e){
  var c=e.s=='pos'?'#3ecf8e':e.s=='neg'?'#ff6b5e':'#b9c2cc';
  if(e.k=='radar'){
   return '<li class="rdh-li"><a class="rdh-a" href="'+PRE+'/radar/'+e.slug+'"><img class="rdh-img" src="'+esc(e.img)+'" alt="" loading="lazy"><div><div class="rdh-meta"><span>'+esc(e.ch[L])+'</span><span>'+fd(e.atu)+'</span>'+bars(e.i,c)+'</div><h3 class="rdh-t">'+esc(e.t[L])+'</h3><p class="rdh-x">'+esc(e.x[L])+'</p></div></a></li>';
  }
  var ext=/^https?:/.test(e.u),href=ext?e.u:PRE+e.u;
  return '<li class="rdh-li"><a class="rdh-a" href="'+esc(href)+'"'+(ext?' target="_blank" rel="noopener"':'')+'><span class="rdh-ano" style="--c:'+c+'">'+e.d.slice(0,4)+'</span><div><div class="rdh-meta"><span>'+TX.mem[L]+'</span><span>'+fd(e.d)+'</span></div><h3 class="rdh-t">'+esc(e.t[L])+'</h3><p class="rdh-x">'+esc(e.x[L])+'</p></div></a></li>';
 }
 function col(cls,sym,lab,arr,n){
  var h='<div class="rdh-col rdh-'+cls+'"><div class="rdh-colh"><span aria-hidden="true">'+sym+'</span>'+lab+' <small>'+arr.length+'</small></div>';
  if(!arr.length)return h+'<div class="rdh-empty">'+TX.vazio[L]+'</div></div>';
  h+='<ul class="rdh-list">'+arr.map(function(e,k){return item(e).replace('<li class="rdh-li">','<li class="rdh-li"'+(k>=n?' hidden':'')+'>');}).join('')+'</ul>';
  return h+'<button type="button" class="rdh-more"'+(arr.length>n?'':' hidden')+'>'+TX.mais[L]+'</button></div>';
 }
 function render(box,D,tab){
  var n=+box.getAttribute('data-por-coluna')||5;
  var all=D.ativos.concat(D.memoria).filter(function(e){return inTab(e,tab);});
  all.sort(function(a,b){var da=a.k=='radar'?a.atu:a.d,db=b.k=='radar'?b.atu:b.d;if(a.k!=b.k)return a.k=='radar'?-1:1;if(a.k=='radar'&&a.i!=b.i)return b.i-a.i;return da<db?1:-1;});
  var P=all.filter(function(e){return e.s=='pos';}),N=all.filter(function(e){return e.s=='neg';}),U=all.filter(function(e){return e.s=='neu';});
  var out=box.querySelector('.rdh-out');
  out.innerHTML='<div class="rdh-cols">'+col('pos','▲',TX.pos[L],P,n)+col('neg','▼',TX.neg[L],N,n)+'</div>'+(U.length?'<p class="rdh-neu">● '+TX.neu[L]+': '+U.map(function(e){return '<a href="'+PRE+'/radar/'+e.slug+'">'+esc(e.t[L])+'</a>';}).join(' · ')+'</p>':'');
  out.querySelectorAll('.rdh-more').forEach(function(b){b.addEventListener('click',function(){b.parentNode.querySelectorAll('.rdh-li[hidden]').forEach(function(li,k){if(k<n)li.hidden=false;});if(!b.parentNode.querySelector('.rdh-li[hidden]'))b.hidden=true;});});
 }
 function count(D,tab){return D.ativos.concat(D.memoria).filter(function(e){return inTab(e,tab);}).length;}
 fetch(URL).then(function(r){return r.json();}).then(function(D){
  BOX.forEach(function(box){
   var ini=box.getAttribute('data-aba')||'todos';
   var tabs=box.querySelector('.rdh-tabs');
   tabs.innerHTML=TX.tabs.map(function(t){return '<button type="button" role="tab" class="rdh-tab" data-tab="'+t[0]+'" aria-selected="'+(t[0]==ini)+'">'+t[L+1]+'<sup>'+count(D,t[0])+'</sup></button>';}).join('');
   tabs.addEventListener('click',function(ev){var b=ev.target.closest('.rdh-tab');if(!b)return;tabs.querySelectorAll('.rdh-tab').forEach(function(x){x.setAttribute('aria-selected',x==b);});render(box,D,b.getAttribute('data-tab'));});
   render(box,D,ini);
  });
 }).catch(function(){BOX.forEach(function(b){b.style.display='none';});});
})();

}if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',go);else go();})();
