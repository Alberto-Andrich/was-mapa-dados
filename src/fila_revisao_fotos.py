"""Fila de revisão das fotos das fichas das áreas do mapa (pedido do Alberto, 27/11/2026).
Lê v1/fichas/*.json, v1/mapa-areas-protegidas.json e as fotos/candidatas em fontes/fichas.
Saída: /mnt/project-files/fichas-revisao-fotos/fila.csv, da foto mais fraca para a melhor (áreas importantes primeiro em cada faixa),
e no fim as áreas sem foto (das maiores para as menores)."""
import json, glob, os, re, csv, urllib.parse
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); F = f'{R}/fontes/fichas'
OUT = os.environ.get('FILA_OUT', '/mnt/project-files/fichas-revisao-fotos/fila.csv')
PAIS = {'CA': 'Canadá', 'US': 'Estados Unidos', 'AU': 'Austrália', 'NZ': 'Nova Zelândia', 'OC': 'Oceania (ilhas)'}
MAPA = {str(x[0]): x for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json'))}
def lj(n, d):
    p = f'{F}/{n}'; return json.load(open(p)) if os.path.exists(p) else d
# dimensões e avaliações por arquivo
DIM = {}
for n in ('fotos-commons-ca-v2.json', 'fotos-commons-us.json', 'fotos-commons-au.json', 'fotos-commons-oc.json'):
    for q, l in lj(n, {}).items():
        for f in l: DIM[f[0]] = (f[3] if len(f) > 3 else 0, f[4] if len(f) > 4 else 0, '')
CAND = {}  # q -> [(arquivo, autor, licença, w, h, avaliações, cats)]
for q, l in lj('fotos-cand-us.json', {}).items(): CAND[q] = [tuple(x) for x in l if isinstance(x, list)]
ca = lj('fotos-cand-au.json', {}); meta = ca.get('meta', {})
for q, l in ca.get('cand', {}).items():
    CAND[q] = [(f, *meta[f]) for f in (urllib.parse.unquote(x.split('FilePath/', 1)[-1]) for x in l or []) if f in meta]
for q, l in CAND.items():
    for c in l:
        if c[0] in DIM or len(c) < 6: DIM.setdefault(c[0], (c[3], c[4], c[5] or ''))
        else: DIM[c[0]] = (c[3], c[4], c[5] or '')
LIC = re.compile(r'(public domain|^pd|cc0|cc[ -]by|attribution)', re.I)
RUIM0 = re.compile(r'\b(map|maps|locator|location map|zones|poster|figure|diagram|logo|sign|signs|signage|plaque|entrance|parking|toilet|kiosk|ceremony|meeting|council|staff)\b', re.I)
class _R:
    def search(self, f): return RUIM0.search(f.replace('_', ' '))
RUIM = _R()
ESPECIE = re.compile(r'^[A-Z][a-z]+[ _][a-z]+(us|um|is|ii|ae|ensis|oides|ata|ana|ifolia|iflora|ea|ica|ens|alis|osa|ina)\b')
def avalia(f):
    w, h, av = DIM.get(f, (0, 0, '')); motivos = []; p = 0
    if 'featured' in av.lower() or 'quality' in av.lower(): p -= 3
    if not w: motivos.append('resolução desconhecida'); p += 1
    elif w < 1200: motivos.append(f'baixa resolução ({w}×{h})'); p += 3
    elif w < 2000: motivos.append(f'resolução média ({w}×{h})'); p += 1
    if w and h and h > w: motivos.append('foto vertical na capa'); p += 2
    if RUIM.search(f): motivos.append('mapa, placa, entrada ou estrutura em vez da paisagem'); p += 3
    if ESPECIE.search(f): motivos.append('close de planta ou bicho em vez da paisagem'); p += 2
    if re.search(r'panoramio|\(\d{8,}\)|^\d{6,}|img_\d|dsc_?\d', f, re.I): motivos.append('foto genérica de banco de imagens'); p += 1
    if re.search(r'\b(18|19[0-6])\d\b', f) and not re.search(r'\d{4}-\d\d', f): motivos.append('foto histórica (pode estar desbotada)'); p += 1
    return p, motivos
def boa(f):
    w, h, av = DIM.get(f, (0, 0, ''))
    return w >= 2000 and w >= h and not RUIM.search(f) and not ESPECIE.search(f)
link = lambda f: 'https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(f.replace(' ', '_'))
linhas_f, linhas_s = [], []
for arq in sorted(glob.glob(f'{R}/v1/fichas/*-*.json')) + [p for p in (f'{R}/v1/fichas/NZ.json', f'{R}/v1/fichas/OC.json') if os.path.exists(p)]:
    pais = os.path.basename(arq)[:2]
    for q, d in json.load(open(arq)).items():
        x = MAPA.get(q); nome = x[1] if x else q; tipo = x[4] if x else ''
        imp = (2 if tipo == 'N' else 1 if tipo in ('M', 'W') else 0, d.get('km') or 0)
        fs = [f[0] for f in d.get('f') or []]
        if not fs:
            alt = [c[0] for c in sorted(CAND.get(q, []), key=lambda c: -(c[3] or 0)) if LIC.search(c[2] or '') and not re.search('NC|ND', c[2] or '') and (c[3] or 0) >= 1600 and not RUIM.search(c[0])][:2]
            linhas_s.append((imp, [PAIS.get(pais, pais), nome, q, '', 'sem foto', ' | '.join(link(a) for a in alt), '']))
            continue
        p, mot = avalia(fs[0])
        if len(fs) == 1: mot.append('só uma foto'); p += 1
        if not mot: continue
        alt = [f for f in fs[1:] if boa(f)][:2]
        if len(alt) < 2:
            usados = set(fs)
            alt += [c[0] for c in sorted(CAND.get(q, []), key=lambda c: -((c[3] or 0) + (5000 if re.search('featured|quality', (c[5] or ''), re.I) else 0)))
                    if c[0] not in usados and boa(c[0]) and LIC.search(c[2] or '') and not re.search('NC|ND', c[2] or '')][:2 - len(alt)]
        linhas_f.append((-p, imp, [PAIS.get(pais, pais), nome, q, link(fs[0]), '; '.join(mot), ' | '.join(link(a) for a in alt), '']))
linhas_f.sort(key=lambda r: (r[0], -r[1][0], -r[1][1]))
linhas_s.sort(key=lambda r: (-r[0][0], -r[0][1]))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', newline='', encoding='utf-8') as fh:
    w = csv.writer(fh); w.writerow(['ordem', 'país', 'área', 'id do ponto (Wikidata Q)', 'foto atual (capa)', 'motivo', 'alternativas do Commons (conferir)', 'status'])
    for i, r in enumerate([r[2] for r in linhas_f] + [r[1] for r in linhas_s], 1): w.writerow([i] + r)
print('com foto fraca', len(linhas_f), 'sem foto', len(linhas_s), '->', OUT)
