"""Seleciona até 5 fotos por área dos EUA a partir das candidatas do Commons.
Entradas: fontes/fichas/fotos-cand-us.json ({q: [[arquivo, autor, licença, w, h, avaliações, categorias]]}),
fontes/fichas/fotos-commons-us.json (P18 do Wikidata, v1), fontes/fichas/wikidata-us.tsv, v1/mapa-areas-protegidas.json.
Saída: fontes/fichas/fotos-commons-us.json v2 (mesmo formato: [arquivo, autor, licença, w, h]).
Regras: só licenças livres sem NC/ND; nome distintivo da área no arquivo ou nas categorias; exclui mapas, logos,
placas e nomes de áreas maiores que contêm o nome desta (Glacier x Glacier Bay); prioriza Featured, Quality e Valued."""
import json, re, os, unicodedata
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = f'{R}/fontes/fichas'
cand = json.load(open(f'{F}/fotos-cand-us.json'))
v1p = f'{F}/fotos-commons-us-v1.json'
if not os.path.exists(v1p): os.rename(f'{F}/fotos-commons-us.json', v1p)
v1 = json.load(open(v1p))
cat = {}
for l in open(f'{F}/wikidata-us.tsv'):
    c = l.rstrip('\n').split('\t')
    if len(c) > 6: cat[c[0]] = c[6]
nome = {str(r[0]): r[1] for r in json.load(open(f'{R}/v1/mapa-areas-protegidas.json')) if r[5] == 'US'}

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()
GEN = set('national state park parks forest forests wildlife refuge area areas wilderness monument recreation preserve reserve conservation historic historical site sites memorial seashore lakeshore scenic natural nature county regional management unit wma the of and at on in de la el los las del sanctuary marine estuarine research habitat game fish ecological botanical garden trail river lake mountain mountains island islands creek bay beach valley canyon point springs'.split())
GENFRACO = set('the of and at on in de la el los las del national state park'.split())
nomesn = {q: norm(n) for q, n in nome.items()}
nomesc = {q: norm(c) for q, c in cat.items() if c}
todos = sorted(set(v for v in list(nomesn.values()) + list(nomesc.values()) if v))
maiores = {}
for q in set(nomesn) | set(nomesc):
    n = nomesc.get(q) or nomesn.get(q)
    if not n: continue
    maiores[q] = [m for m in todos if m != n and f' {n} ' in f' {m} ' ]
RUIM = re.compile(r'\b(map|maps|locator|logo|seal|diagram|chart|flag|coat of arms|plaque|brochure|stamp|postcard|aerial view map|boundary|topographic|usgs topo)\b|\.svg$|\.pdf$|\.tif|\bBHL\d|^Book - |\(Plate [A-Z0-9]+\)|^Page:|\bscan\b', re.I)
MEH = re.compile(r'\b(sign|signs|signage|entrance|ribbon cutting|ceremony|guard|meeting|press|parking|restroom|bathroom|toilet|kiosk|anniversary|recognized|award|awards|biologist|staff|employee|employees|volunteer|volunteers|students|secretary|director|superintendent|congressman|senator|governor|officials|briefing|conference|meets|visits)\b', re.I)
LIC = re.compile(r'(public domain|^pd|cc0|cc[ -]by|no restrictions|attribution)', re.I)

def pontos(q, f):
    arq, autor, lic, w, h, av, cats = f
    if not lic or re.search(r'NC|ND', lic) or not LIC.search(lic): return None
    if RUIM.search(arq) or w < 800: return None
    txt = ' ' + norm(arq.rsplit('.', 1)[0] + ' ' + cats.replace('|', ' ')) + ' '
    n = norm(cat.get(q, '')) or nomesn.get(q, '')
    if any(f' {m} ' in txt for m in maiores.get(q, [])): return None
    cc = norm(cat.get(q, ''))
    catok = cc and f' {cc} ' in ' ' + norm(cats.replace('|', ' ')) + ' '
    dist = [t for t in n.split() if t not in GEN and len(t) > 2]
    if not catok:
        if dist:
            if not all(f' {t} ' in txt for t in dist): return None
            # nome inteiro (sem palavras vazias) presente vale mais que tokens soltos
        else:
            core = ' '.join(t for t in n.split() if t not in GENFRACO)
            if not core or f' {core} ' not in txt: return None
    s = 0
    if 'featured' in av: s += 100
    if 'quality' in av: s += 60
    if 'valued' in av: s += 40
    if catok: s += 30
    if n and f' {n} ' in txt: s += 15
    fa = ' ' + norm(arq.rsplit('.', 1)[0]) + ' '
    if dist and all(f' {x} ' in fa for x in dist): s += 20
    s += min(w, 4000) / 400
    if w >= h: s += 10
    if MEH.search(arq): s -= 25
    return s

out = {}; nfeat = 0; novos = 0
for q in set(cand) | set(v1):
    esc = []
    for f in v1.get(q, [])[:1]:
        if LIC.search(f[2] or '') and not re.search(r'NC|ND', f[2] or ''): esc.append(f[:5])
    pts = sorted(((p, f) for f in cand.get(q, []) for p in [pontos(q, f)] if p is not None), key=lambda x: -x[0])
    vistos = {e[0] for e in esc}
    for p, f in pts:
        if len(esc) >= 5: break
        if f[0] in vistos: continue
        pref = re.sub(r'[\d\W_]+', '', f[0])[:18].lower()
        if pref and any(re.sub(r'[\d\W_]+', '', e[0])[:18].lower() == pref for e in esc): continue
        if re.search('featured|quality|valued', f[5]): nfeat += 1
        esc.append(f[:5]); vistos.add(f[0])
    if esc:
        out[q] = esc
        if len(esc) > len(v1.get(q, [])): novos += 1
json.dump(out, open(f'{F}/fotos-commons-us.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('áreas com foto', len(out), 'antes', len(v1), 'áreas com mais fotos', novos, 'fotos', sum(map(len, out.values())), 'Featured/Quality/Valued', nfeat)
