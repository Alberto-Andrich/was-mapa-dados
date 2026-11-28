# Mudanças neutras de idioma no roteiros.js (valem para PT/EN/ES)
def patch(js):
    def rep(a,b,n=1):
        nonlocal js
        c=js.count(a); assert c==n, (c,a[:70]); js=js.replace(a,b)
    rep("const BASE = (()=>{ const s=[...document.scripts].map(x=>x.src).find(u=>/\\/roteiros\\.js(\\?|$)/.test(u)); return s? s.replace(/roteiros\\.js.*$/,'') : ''; })();",
        "const BASE = (()=>{ const s=[...document.scripts].map(x=>x.src).find(u=>/\\/roteiros(-en|-es)?\\.js(\\?|$)/.test(u)); return s? s.replace(/roteiros(-en|-es)?\\.js.*$/,'') : ''; })();")
    rep("const PT = {}; D.pts.forEach((p,i) => { p.i = i; PT[p.l+'|'+p.n] = p; });",
        "const PT = {}; D.pts.forEach((p,i) => { p.i = i; PT[p.l+'|'+(p.k||p.n)] = p; });\n"
        "const PA = {}; D.pts.forEach(p => { if(p.pa0) PA[p.pa0]=p.pa; });\n"
        "const paT = s => (s||'').split(/(,\\s*| e |\\/)/).map(x=>PA[x]||x).join('');\n"
        "const refDe = r => r.l+'|'+(r.k||r.n);")
    rep("const pa=(r?r.pa:p.pa)||''; pa.split(", "const pa=(r?(r.pa0||r.pa):p.pa)||''; pa.split(")
    rep("function regiao(p){ const r=pontoDe(p); const pa=(r?r.pa:p.pa)||'';", "function regiao(p){ const r=pontoDe(p); const pa=(r?(r.pa0||r.pa):p.pa)||'';")
    rep("function pontoDe(p){ return p.ref ? PT[p.ref] : null; }",
        "function pontoDe(p){ return p.ref ? PT[p.ref] : null; }\nfunction nk(p){ const r=pontoDe(p); return r ? (r.k||r.n) : p.n; }")
    rep("const nomes=T.paradas.map(p=>p.n).join(' | ');", "const nomes=T.paradas.map(nk).join(' | ');")
    rep("T.paradas.filter(x=>re.test(x.n)).map(x=>x.n)", "T.paradas.filter(x=>re.test(nk(x))).map(x=>x.n)")
    rep("const nm=T.paradas.map(p=>p.n).join('|');", "const nm=T.paradas.map(nk).join('|');")
    rep("return {id:uid(),ref:r.l+'|'+r.n,n:r.n,", "return {id:uid(),ref:refDe(r),n:r.n,")
    rep("sel.forEach(p=>t.paradas.push({id:uid(),ref:p.l+'|'+p.n,", "sel.forEach(p=>t.paradas.push({id:uid(),ref:refDe(p),")
    rep("T.paradas.some(s=>s.ref===p.l+'|'+p.n)", "T.paradas.some(s=>s.ref===refDe(p))")
    rep("T.paradas.push({id:uid(),ref:p.l+'|'+p.n,n:p.n,x:p.x,y:p.y,dias:p.l==='CU'", "T.paradas.push({id:uid(),ref:refDe(p),n:p.n,x:p.x,y:p.y,dias:p.l==='CU'")
    rep("function abrir(t,p){ T=t;", "function abrir(t,p){ T=t; (T.paradas||[]).forEach(s=>{ const r=pontoDe(s); if(r) s.n=r.n; });")
    # exibição de países traduzida
    rep("'Ponto livre'+(p.pa?' · '+esc(p.pa):'')", "'Ponto livre'+(p.pa?' · '+esc(paT(p.pa)):'')")
    rep("'Exigência para brasileiros em: '+ext.join(', ')", "'Exigência para brasileiros em: '+ext.map(paT).join(', ')")
    # ritmo mostrado por rótulo
    rep("· ritmo ${T.ritmo}</td>", "· ritmo ${({tranquilo:'tranquilo',moderado:'moderado',intenso:'intenso'})[T.ritmo]||T.ritmo}</td>")
    return js
