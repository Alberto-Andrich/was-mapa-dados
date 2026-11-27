"""Gera v1/fichas/indice.json e v1/fichas/<PAIS>-<PROV>.json (fichas básicas das áreas protegidas).
Entradas: v1/mapa-areas-protegidas.json, fontes/fichas/wikidata-ca.tsv, fontes/fichas/fotos-commons-ca*.json
e os textos em /mnt/project-files/mapa-aventura/fichas-areas/textos/ca_np_*.py (ou FICHAS_TEXTOS=<pasta>).
Uso: python3 src/fichas.py"""
import json, os, glob, math, importlib.util, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TX = os.environ.get('FICHAS_TEXTOS', '/mnt/project-files/mapa-aventura/fichas-areas/textos')
PROV = {'Q1951':'AB','Q1973':'BC','Q1948':'MB','Q1965':'NB','Q2003':'NL','Q1952':'NS','Q2007':'NT','Q2023':'NU','Q1904':'ON','Q1978':'PE','Q176':'QC','Q1989':'SK','Q2009':'YT'}
IUCN = {'Q14545608':'Ia','Q14545620':'Ib','Q14545628':'II','Q14545633':'III','Q14545639':'IV','Q14545646':'V','Q14545652':'VI'}
A = {x[0]: x for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json'))}
rows = {}
for l in open(f'{R}/fontes/fichas/wikidata-ca.tsv', encoding='utf8').read().split('\n'):
    c = l.split('\t')
    if len(c) >= 10: rows[int(c[0])] = c
fotos = json.load(open(f'{R}/fontes/fichas/fotos-commons-ca.json'))
f2 = f'{R}/fontes/fichas/fotos-commons-ca-v2.json'
if os.path.exists(f2):
    fotos = json.load(open(f2))  # busca seletiva substitui a primeira
T = {}
for f in sorted(glob.glob(f'{TX}/ca_np_*.py')):
    s = importlib.util.spec_from_file_location('m', f); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); T.update(m.T)
def autor(a):
    a = re.sub(r'https?://\S+', '', a or '').strip(' ,;-·')
    return a[:70]
def lic(l):
    return {'Public domain':'Domínio público','Public Domain':'Domínio público','PD':'Domínio público'}.get(l, l)
# províncias conhecidas para o vizinho mais próximo
conh = [(A[q][2], A[q][3], [PROV[p] for p in r[1].split(',') if p in PROV]) for q, r in rows.items() if r[1]]
def vizinho(q):
    x, y = A[q][2], A[q][3]
    best = min(conh, key=lambda c: (c[0]-x)**2 + (c[1]-y)**2)
    return best[2][0]
import unicodedata
def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return ' ' + ' '.join(re.sub(r'[^a-z0-9]+', ' ', s).split()) + ' '
GEN = re.compile(r' (provincial|national|park|parks|reserve|marine|wilderness|area|ecological|conservation|protected|territorial|wildland|nature|preserve|historic|site|and|of|the|de|du|des|la|le|parc|ecologique|state|parque|nacional|e|reserva) ')
def core(s):
    s = norm(s)
    for _ in range(3): s = GEN.sub(' ', s)
    return ' ' + ' '.join(s.split()) + ' '
CORES = {}
for x in A.values():
    nm = (x[6].split(':', 1)[1].replace('_', ' ') if x[6] else x[1])
    c = core(re.sub(r'\(.*?\)', ' ', nm))
    if len(c.strip()) >= 3: CORES.setdefault(c, set()).add(x[0])
def foto_ok(q, nome, fn):
    c = core(re.sub(r'\(.*?\)', ' ', nome)); f = norm(fn.rsplit('.', 1)[0])
    for cb, qs in CORES.items():
        if cb != c and c.strip() and c in cb and q not in qs and cb in f: return False
    return True
# curadoria manual (27/11): fotos de outro lugar, prédios, veículos, gráficos
EXCLUIR = {'WBNP Angus sinkhole.jpg@1001900', 'Gazebo a.jpg', 'Beached dead pilot whale.jpg', 'Cap-Rouge c 1900.jpg', 'Emerald Lake, B.C.jpg@903323',
  'Captain Molly Kool Heritage Centre.jpg', 'Sable Island Sentinel-2.jpg', 'Aulavik office.jpg', 'Terra Nova NP Visitor Centre.jpg'}
EXCLUIR_PREF = ['Parks Canada Jeep', 'SN-2 at sable Island', 'Effects of climate change on the vegetation', 'Historic postcards and souvenir bag']
SEM_FOTO = {1161253}  # Glacier (Canadá): a busca trouxe fotos do Glacier dos EUA
def excluida(q, f):
    return f in EXCLUIR or f'{f}@{q}' in EXCLUIR or any(f.startswith(p) for p in EXCLUIR_PREF) or q in SEM_FOTO
out = {}; idx = {}
for q, r in rows.items():
    pv = [PROV[p] for p in r[1].split(',') if p in PROV]
    arq = 'CA-' + (pv[0] if pv else vizinho(q))
    d = {}
    if pv: d['pv'] = pv
    if r[2]:
        km = float(r[2]) / 1e6
        if km > 0: d['km'] = round(km, 1) if km < 100 else round(km)
    if r[3]: d['cr'] = r[3]
    if r[4] in IUCN: d['iucn'] = IUCN[r[4]]
    if r[7]: d['site'] = r[7]
    if r[8]: d['wp'] = 'en:' + r[8]
    nome = r[8].replace('_', ' ') if r[8] else A[q][1]
    fs = [f for f in (fotos.get(str(q)) or []) if foto_ok(q, nome, f[0]) and not excluida(q, f[0])]
    if fs: d['f'] = [[f[0], autor(f[1]), lic(f[2])] for f in fs[:5]]
    t = T.get(q)
    if t:
        for k in ('cr', 'fim', 'km'):
            if k in t: d[k] = t[k]
        if 'fim' not in t and q not in (26810464, 2304543): d['iucn'] = 'II'
        if 'fim' in t or q == 2304543: d.pop('iucn', None)
        d['t'] = {l: dict(zip(('r', 'h', 'ff', 'at'), t[l])) for l in ('pt', 'en', 'es')}
    out.setdefault(arq, {})[str(q)] = d
    idx.setdefault(arq, []).append(q)
os.makedirs(f'{R}/v1/fichas', exist_ok=True)
for k, v in out.items():
    json.dump(v, open(f'{R}/v1/fichas/{k}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
json.dump({k: sorted(v) for k, v in sorted(idx.items())}, open(f'{R}/v1/fichas/indice.json', 'w'), separators=(',', ':'))
print({k: len(v) for k, v in sorted(out.items())}, 'textos', sum(1 for v in out.values() for d in v.values() if 't' in d), 'com fotos', sum(1 for v in out.values() for d in v.values() if 'f' in d))
