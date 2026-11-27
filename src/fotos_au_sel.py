"""Seleciona até 5 fotos por área da Austrália a partir das candidatas do Commons.
Entradas: fontes/fichas/fotos-cand-au.json ({'cand': {q: [arquivo, ...]}, 'meta': {arquivo: [autor, licença, w, h, avaliações, categorias]}}),
fontes/fichas/wikidata-au.json (P18 e categoria do Commons), v1/mapa-areas-protegidas.json.
Saída: fontes/fichas/fotos-commons-au.json ({q: [[arquivo, autor, licença, w, h]]}).
Mesmas regras dos EUA: só licenças livres sem NC/ND; nome distintivo da área no arquivo ou nas categorias; exclui mapas, logos, placas
e nomes de áreas maiores que contêm o nome desta; prioriza a imagem do Wikidata (P18) e Featured, Quality e Valued."""
import json, re, os, unicodedata
from urllib.parse import unquote
def fn(x): return unquote(x.split('Special:FilePath/',1)[-1]).replace('_',' ')
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = f'{R}/fontes/fichas'
C = json.load(open(f'{F}/fotos-cand-au.json')); meta = C['meta']
cand0 = {q: list(dict.fromkeys(fn(f) for f in (l or []))) for q, l in C['cand'].items()}
WD = json.load(open(f'{F}/wikidata-au.json'))
cat = {q: (r[6] or '') for q, r in WD.items()}
p18 = {q: [fn(i) for i in (r[5] or '').split('¦') if i] for q, r in WD.items()}
nome = {}
for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json')):
    if x[5] != 'AU': continue
    q = str(x[0]); r = WD.get(q) or []
    nome[q] = x[6].split(':', 1)[1].replace('_', ' ') if x[6] and x[6].startswith('en:') else (r[8] if len(r) > 8 and r[8] else x[1])
    nome[q] = re.sub(r'\(.*?\)', ' ', nome[q])

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()
GEN = set('national park parks forest forests wildlife area areas wilderness reserve reserves conservation marine nature state regional recreation aquatic sanctuary fish habitat management zone cca commonwealth australian australia aboriginal land cape york peninsula the of and at on in island islands river lake mountain mountains range creek bay beach valley gorge point springs reef north south east west upper lower group'.split())
GENFRACO = set('the of and at on in national park'.split())
nomesn = {q: norm(n) for q, n in nome.items()}
nomesc = {q: norm(c) for q, c in cat.items() if c}
todos = sorted(set(v for v in list(nomesn.values()) + list(nomesc.values()) if v))
maiores = {}
for q in set(nomesn) | set(nomesc):
    n = nomesc.get(q) or nomesn.get(q)
    if n: maiores[q] = [m for m in todos if m != n and f' {n} ' in f' {m} ']
RUIM = re.compile(r'\b(map|maps|locator|logo|seal|diagram|chart|flag|coat of arms|plaque|brochure|stamp|postcard|boundary|topographic|location)\b|\.svg$|\.pdf$|\.tif|\bBHL\d|^Book - |\(Plate [A-Z0-9]+\)|^Page:|\bscan\b|specimen|herbarium', re.I)
MEH = re.compile(r'\b(sign|signs|signage|entrance|ceremony|meeting|parking|toilet|toilets|kiosk|staff|volunteer|volunteers|officials|carpark|car park)\b', re.I)
LIC = re.compile(r'(public domain|^pd|cc0|cc[ -]by|no restrictions|attribution)', re.I)

def pontos(q, f, m, e18):
    autor, lic, w, h, av, cats = m
    if not lic or re.search(r'NC|ND', lic) or not LIC.search(lic): return None
    if RUIM.search(f) or re.search(r'\bsign\b', f, re.I) or (w or 0) < 800: return None
    txt = ' ' + norm(f.rsplit('.', 1)[0] + ' ' + (cats or '').replace('|', ' ')) + ' '
    n = nomesc.get(q) or nomesn.get(q, '')
    if not e18 and any(f' {x} ' in txt for x in maiores.get(q, [])): return None
    cc = nomesc.get(q, '')
    catok = cc and f' {cc} ' in ' ' + norm((cats or '').replace('|', ' ')) + ' '
    dist = [t for t in n.split() if t not in GEN and len(t) > 2]
    if not e18 and not catok:
        if dist:
            if not all(f' {t} ' in txt for t in dist): return None
        else:
            core = ' '.join(t for t in n.split() if t not in GENFRACO)
            if not core or f' {core} ' not in txt: return None
    s = 0
    if e18: s += 50
    av = (av or '').lower()
    if 'featured' in av: s += 100
    if 'quality' in av: s += 60
    if 'valued' in av: s += 40
    if catok: s += 30
    if n and f' {n} ' in txt: s += 15
    fa = ' ' + norm(f.rsplit('.', 1)[0]) + ' '
    if dist and all(f' {x} ' in fa for x in dist): s += 20
    s += min(w, 4000) / 400
    if w >= h: s += 10
    if MEH.search(f): s -= 25
    return s

out = {}; nfeat = 0
for q, lst in cand0.items():
    pts = []
    for f in lst or []:
        m = meta.get(f)
        if not m: continue
        p = pontos(q, f, m, f in p18.get(q, []))
        if p is not None: pts.append((p, f, m))
    pts.sort(key=lambda x: -x[0])
    esc = []
    for p, f, m in pts:
        if len(esc) >= 5: break
        pref = re.sub(r'[\d\W_]+', '', f)[:18].lower()
        if pref and any(re.sub(r'[\d\W_]+', '', e[0])[:18].lower() == pref for e in esc): continue
        w1 = (re.findall(r'[a-z]{3,}', f.lower()) or [''])[0]
        if w1 and w1 not in nomesn.get(q, '').split() and sum(1 for e in esc if (re.findall(r'[a-z]{3,}', e[0].lower()) or [''])[0] == w1) >= 2: continue
        if re.search('featured|quality|valued', (m[4] or '').lower()): nfeat += 1
        esc.append([f, m[0], m[1], m[2], m[3]])
    if esc: out[q] = esc
json.dump(out, open(f'{F}/fotos-commons-au.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('áreas com foto', len(out), 'de', len(cand0), 'fotos', sum(map(len, out.values())), 'Featured/Quality/Valued', nfeat)
