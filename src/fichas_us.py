"""Fichas básicas das áreas protegidas dos EUA: v1/fichas/US-<ESTADO>.json e as chaves US-* de v1/fichas/indice.json.
Entradas: v1/mapa-areas-protegidas.json, fontes/fichas/wikidata-us.tsv (q, estados USPS, área m², criação, IUCN Q, imagens ¦, categoria Commons, site),
fontes/fichas/padus-us.json (PAD-US 4.1, USGS, domínio público: registros a até 300 m do ponto),
fontes/fichas/fotos-commons-us.json (opcional: {q: [[arquivo, autor, licença, ...]]}) e textos/us_sec_*.py (opcional: seções S[q]).
Uso: python3 src/fichas_us.py"""
import json, os, re, glob, importlib.util, unicodedata, collections, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'src'))
from estados_us import E as ESTADOS
TX = os.environ.get('FICHAS_TEXTOS', '/mnt/project-files/mapa-aventura/fichas-areas/textos')
IUCNQ = {'Q14545608':'Ia','Q14545620':'Ib','Q14545628':'II','Q14545633':'III','Q14545639':'IV','Q14545646':'V','Q14545652':'VI'}
A = {x[0]: x for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json')) if x[5] == 'US'}
rows = {}
for l in open(f'{R}/fontes/fichas/wikidata-us.tsv', encoding='utf8').read().split('\n'):
    c = l.split('\t')
    if len(c) >= 8: rows[int(c[0])] = c
def carregar(n, padrao):
    p = f'{R}/fontes/fichas/{n}'
    return json.load(open(p)) if os.path.exists(p) else padrao
PAD = carregar('padus-us.json', {})
FOTOS = carregar('fotos-commons-us.json', {})
S = {}; KMX = {}; CRX = {}
for f in sorted(glob.glob(f'{TX}/us_sec_*.py')):
    sp = importlib.util.spec_from_file_location('s', f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); S.update(m.S); KMX.update(getattr(m, 'KM', {})); CRX.update(getattr(m, 'CR', {}))

def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return ' '.join(re.sub(r'[^a-z0-9]+', ' ', s).split())
GW = set('state national park parks forest wilderness area areas recreation natural nature preserve reserve refuge wildlife management monument historic site scenic and of the at county regional memorial beach lake river island'.split())
def toks(s): return set(norm(s).split()) - GW

# ---- tipos (padrão no nome, pt, gênero pt, en, es, gênero es) ----
TIPOS = [
  (r'national park and preserve', 'parque e reserva nacional', 'm', 'national park and preserve', 'parque y reserva nacional', 'm'),
  (r'national historical park|national historic park', 'parque histórico nacional', 'm', 'national historical park', 'parque histórico nacional', 'm'),
  (r'national park', 'parque nacional', 'm', 'national park', 'parque nacional', 'm'),
  (r'national monument', 'monumento nacional', 'm', 'national monument', 'monumento nacional', 'm'),
  (r'national wildlife refuge', 'refúgio nacional de vida selvagem', 'm', 'national wildlife refuge', 'refugio nacional de vida silvestre', 'm'),
  (r'national preserve', 'reserva nacional', 'f', 'national preserve', 'reserva nacional', 'f'),
  (r'national seashore', 'litoral nacional protegido', 'm', 'national seashore', 'litoral nacional protegido', 'm'),
  (r'national lakeshore', 'margem de lago nacional protegida', 'f', 'national lakeshore', 'ribera lacustre nacional protegida', 'f'),
  (r'national recreation area', 'área nacional de recreação', 'f', 'national recreation area', 'área recreativa nacional', 'f'),
  (r'national conservation area', 'área nacional de conservação', 'f', 'national conservation area', 'área nacional de conservación', 'f'),
  (r'national grassland', 'pradaria nacional', 'f', 'national grassland', 'pradera nacional', 'f'),
  (r'national forest', 'floresta nacional', 'f', 'national forest', 'bosque nacional', 'm'),
  (r'national marine sanctuary', 'santuário marinho nacional', 'm', 'national marine sanctuary', 'santuario marino nacional', 'm'),
  (r'wilderness', 'área selvagem', 'f', 'wilderness area', 'área silvestre', 'f'),
  (r'state historic park|state historical park', 'parque histórico estadual', 'm', 'state historic park', 'parque histórico estatal', 'm'),
  (r'state historic site', 'sítio histórico estadual', 'm', 'state historic site', 'sitio histórico estatal', 'm'),
  (r'state recreation area|state recreational area', 'área estadual de recreação', 'f', 'state recreation area', 'área recreativa estatal', 'f'),
  (r'state beach', 'praia estadual', 'f', 'state beach', 'playa estatal', 'f'),
  (r'state forest', 'floresta estadual', 'f', 'state forest', 'bosque estatal', 'm'),
  (r'state natural area|state nature preserve|nature preserve', 'reserva natural', 'f', 'nature preserve', 'reserva natural', 'f'),
  (r'state scenic|scenic viewpoint|scenic area|scenic site', 'mirante protegido', 'm', 'scenic area', 'mirador protegido', 'm'),
  (r'wildlife management area|wildlife area|game management area', 'área de manejo de fauna', 'f', 'wildlife management area', 'área de manejo de fauna', 'f'),
  (r'state reserve|state preserve', 'reserva estadual', 'f', 'state reserve', 'reserva estatal', 'f'),
  (r'state park|state parks', 'parque estadual', 'm', 'state park', 'parque estatal', 'm'),
  (r'county park|regional park|metropark|city park', 'parque regional', 'm', 'regional park', 'parque regional', 'm'),
  (r'park$', 'parque', 'm', 'park', 'parque', 'm'),
]
PT2EN = [(r'^Parque Nacional e Reserva (?:d[eoa]s? )?(.+)$', r'\1 National Park and Preserve'), (r'^Parque Nacional (?:d[eoa]s? )?(.+)$', r'\1 National Park'),
  (r'^Monumento Nacional (?:d[eoa]s? )?(.+)$', r'\1 National Monument'), (r'^Floresta Nacional (?:d[eoa]s? )?(.+)$', r'\1 National Forest'),
  (r'^Refúgio Nacional de Vida Selvagem (?:d[eoa]s? )?(.+)$', r'\1 National Wildlife Refuge'), (r'^Parque Estadual (?:d[eoa]s? )?(.+)$', r'\1 State Park'),
  (r'^Reserva Nacional (?:d[eoa]s? )?(.+)$', r'\1 National Preserve'), (r'^Área Nacional de Recreação (?:d[eoa]s? )?(.+)$', r'\1 National Recreation Area')]
def pt2en(n):
    for a, b in PT2EN:
        if re.match(a, n): return re.sub(a, b, n)
    return None
def tipo0(s):
    n = norm(s)
    for t in TIPOS:
        if re.search(t[0], n): return t
    return None
def tipo(nome, pad):
    return tipo0(nome) or (pad and (tipo0(pad.get('ds') or '') )) or (None, 'área protegida', 'f', 'protected area', 'área protegida', 'f')
GERAL = {'parque estadual':'park','parque nacional':'park','parque':'park','parque regional':'park','parque histórico estadual':'park','área estadual de recreação':'park','praia estadual':'park','mirante protegido':'park'}
def familia(s):
    t = tipo0(s); return GERAL.get(t[1], t[1]) if t else None

# ---- PAD-US: [FeatClass, Unit_Nm, Loc_Nm, Des_Tp, Loc_Ds, Mang_Type, Mang_Name, Loc_Mang, State_Nm, GIS_Acres, IUCN_Cat, Date_Est, GAP_Sts, Pub_Access]
def padus(q, nome):
    nome = re.sub(r'\(.*?\)', ' ', nome)
    a = toks(nome)
    if not a: return None
    f0 = familia(nome)
    cs = []
    for c in PAD.get(str(q)) or []:
        if c[0] == 'Proclamation' or c[5] == 'TRIB' and 'tribal' in norm(c[1]): continue
        sc = len(a & (toks(c[1]) | toks(c[2] or ''))) / len(a)
        if sc < .5: continue
        f1 = familia(c[1]) or familia(c[4] or '')
        if f0 and f1 and f0 != f1: continue
        cs.append((sc, c))
    if not cs: return None
    best = max(s for s, _ in cs)
    nm = max((c for s, c in cs if s == best), key=lambda c: c[9] or 0)[1]
    grp = [c for s, c in cs if c[1] == nm]
    por_classe = collections.defaultdict(float)
    for c in grp: por_classe[c[0]] += c[9] or 0
    acres = max(por_classe.values())
    anos = [int(c[11]) for c in grp if c[11] and str(c[11]).isdigit() and 1800 < int(c[11]) < 2100]
    iu = [c[10] for c in grp if c[10] in ('Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI')]
    ref = max(grp, key=lambda c: c[9] or 0)
    return dict(km=acres * 0.00404686, ano=min(anos) if anos else None, iucn=iu[0] if iu else None, mt=ref[5], mn=ref[6], lm=ref[7], ds=ref[4], st=ref[8])

def gestao(p):
    if not p: return None
    mn, mt = (p.get('mn') or '').upper(), (p.get('mt') or '').upper()
    F = {'NPS': ('do Serviço Nacional de Parques dos EUA (NPS)', 'by the U.S. National Park Service', 'del Servicio de Parques Nacionales de EE. UU.'),
         'FWS': ('do Serviço de Pesca e Vida Selvagem dos EUA', 'by the U.S. Fish and Wildlife Service', 'del Servicio de Pesca y Vida Silvestre de EE. UU.'),
         'USFS': ('do Serviço Florestal dos EUA', 'by the U.S. Forest Service', 'del Servicio Forestal de EE. UU.'),
         'BLM': ('do Escritório de Gestão de Terras dos EUA (BLM)', 'by the Bureau of Land Management', 'de la Oficina de Administración de Tierras de EE. UU. (BLM)'),
         'NOAA': ('da Administração Nacional Oceânica e Atmosférica (NOAA)', 'by NOAA', 'de la Administración Nacional Oceánica y Atmosférica (NOAA)')}
    if mn in F: return F[mn]
    if mt == 'STAT': return ('do governo estadual', 'by the state government', 'del gobierno estatal')
    if mt == 'LOC': return ('do governo local', 'by the local government', 'del gobierno local')
    if mt == 'NGO': return ('de uma organização sem fins lucrativos', 'by a non-profit organization', 'de una organización sin fines de lucro')
    if mt == 'TRIB': return ('de uma nação indígena', 'by a tribal nation', 'de una nación indígena')
    return None

def num(v, l):
    s = f'{v:,.1f}' if v < 100 else f'{round(v):,}'
    if s.endswith('.0'): s = s[:-2]
    return s if l == 'en' else s.replace(',', '§').replace('.', ',').replace('§', '.')
def tam(km, l):
    if km < 1:
        ha = max(1, round(km * 100)); return f'{num(ha, l)} hectare' + ('s' if ha != 1 else '') if l != 'es' else f'{num(ha, l)} hectárea' + ('s' if ha != 1 else '')
    return f'{num(km, l)} km²'
IUCNF = {
  'Ia': ('Na classificação da IUCN, é uma reserva natural estrita: a prioridade é a pesquisa científica e a visitação é muito restrita.', 'Under the IUCN system it is a strict nature reserve: science comes first and visits are tightly restricted.', 'En la clasificación de la UICN es una reserva natural estricta: la prioridad es la ciencia y las visitas están muy restringidas.'),
  'Ib': ('Na classificação da IUCN, é uma área silvestre: um grande espaço pouco alterado, sem infraestrutura permanente.', 'Under the IUCN system it is a wilderness area: a large, largely unmodified space without permanent infrastructure.', 'En la clasificación de la UICN es un área silvestre: un gran espacio poco alterado, sin infraestructura permanente.'),
  'II': ('Na classificação da IUCN, está na categoria II, a dos parques nacionais: protege ecossistemas inteiros e recebe visitantes.', 'Under the IUCN system it is category II, the national park category: it protects whole ecosystems and welcomes visitors.', 'En la clasificación de la UICN está en la categoría II, la de los parques nacionales: protege ecosistemas enteros y recibe visitantes.'),
  'III': ('Na classificação da IUCN, é um monumento natural: protege uma feição específica, como uma cachoeira, uma caverna ou uma formação rochosa.', 'Under the IUCN system it is a natural monument: it protects a specific feature such as a waterfall, a cave or a rock formation.', 'En la clasificación de la UICN es un monumento natural: protege un rasgo específico, como una cascada, una cueva o una formación rocosa.'),
  'IV': ('Na classificação da IUCN, está na categoria IV: o manejo é voltado a habitats e espécies específicos.', 'Under the IUCN system it is category IV: management focuses on particular habitats and species.', 'En la clasificación de la UICN está en la categoría IV: la gestión se centra en hábitats y especies concretos.'),
  'V': ('Na classificação da IUCN, é uma paisagem protegida, onde natureza e uso humano tradicional convivem.', 'Under the IUCN system it is a protected landscape, where nature and traditional human use coexist.', 'En la clasificación de la UICN es un paisaje protegido, donde conviven la naturaleza y el uso humano tradicional.'),
  'VI': ('Na classificação da IUCN, está na categoria VI: conservação com uso sustentável dos recursos naturais.', 'Under the IUCN system it is category VI: conservation combined with sustainable use of natural resources.', 'En la clasificación de la UICN está en la categoría VI: conservación con uso sostenible de los recursos naturales.')}

def apresentacao(nome_pt, nome_en, d, p):
    t = tipo(nome_en or nome_pt, p); st = [k[3:] for k in d.get('pv') or []]
    km, ano, g = d.get('km'), (d.get('cr') or '')[:4] or None, gestao(p)
    out = {}
    # PT
    nm = nome_pt
    art, um = ('O', 'um') if t[2] == 'm' else ('A', 'uma')
    if len(st) == 1:
        e = ESTADOS[st[0]]; onde = f'{e[3]} {e[0]}, nos Estados Unidos' if e[3] != 'em' else f'em {e[0]}, nos Estados Unidos'
    else: onde = 'nos Estados Unidos'
    if norm(nm).startswith(norm(t[1])):
        s = [f'{art} {nm} fica {onde}.']
    else:
        s = [f'{art} {nm} é {um} {t[1]} {onde}.']
    prot = 'protegido' if t[2] == 'm' else 'protegida'
    if km and ano: s.append(f'Tem {tam(km, "pt")} e está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif km: s.append(f'Tem {tam(km, "pt")}' + (f' e está sob gestão {g[0]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif g: s.append(f'Está sob gestão {g[0]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][0])
    out['pt'] = ' '.join(s)
    # EN
    ne = ' '.join(re.sub(r' \(.*?\)$', '', nome_en or nome_pt).split())
    onde = f'in {ESTADOS[st[0]][1]}, United States' if len(st) == 1 else 'in the United States'
    a = 'an' if t[3][0] in 'aeiou' else 'a'
    s = [f'{ne} is {a} {t[3]} {onde}.']
    if km and ano: s.append(f'It covers {tam(km, "en")} and has been protected since {ano}' + (f'. It is managed {g[1]}.' if g else '.'))
    elif km: s.append(f'It covers {tam(km, "en")}' + (f' and is managed {g[1]}.' if g else '.'))
    elif ano: s.append(f'It has been protected since {ano}' + (f' and is managed {g[1]}.' if g else '.'))
    elif g: s.append(f'It is managed {g[1]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][1])
    out['en'] = ' '.join(s)
    # ES
    art, um = ('El', 'un') if t[5] == 'm' else ('La', 'un' if t[4].startswith('área') else 'una')
    onde = f'en {ESTADOS[st[0]][2]}, Estados Unidos' if len(st) == 1 else 'en Estados Unidos'
    s = [f'{art} {ne} es {um} {t[4]} {onde}.']
    prot = 'protegido' if t[5] == 'm' else 'protegida'
    if km and ano: s.append(f'Tiene {tam(km, "es")} y está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif km: s.append(f'Tiene {tam(km, "es")}' + (f' y está bajo la gestión {g[2]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif g: s.append(f'Está bajo la gestión {g[2]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][2])
    out['es'] = ' '.join(s)
    return out

def autor(a):
    return re.sub(r'https?://\S+', '', a or '').strip(' ,;-·')[:70]
def lic(l):
    return {'Public domain': 'Domínio público', 'Public Domain': 'Domínio público', 'PD': 'Domínio público'}.get(l, l)
ABREV = {v[1].lower(): k for k, v in ESTADOS.items()}
conh = [(A[q][2], A[q][3], r[1].split(',')[0]) for q, r in rows.items() if r[1] and q in A]
def vizinho(q):
    x, y = A[q][2], A[q][3]
    return min(conh, key=lambda c: (c[0]-x)**2 + (c[1]-y)**2)[2]

out, idx, N = {}, {}, collections.Counter()
for q, x in A.items():
    r = rows.get(q) or [str(q), '', '', '', '', '', '', '']
    st = [s for s in r[1].split(',') if s in ESTADOS]
    nome_en = x[6].split(':', 1)[1].replace('_', ' ') if x[6] and x[6].startswith('en:') else pt2en(x[1])
    nome = nome_en or x[1]
    p = padus(q, nome)
    if not st and p and p.get('st') in ESTADOS: st = [p['st']]
    d = {}
    if st: d['pv'] = ['US-' + s for s in st]
    arq = 'US-' + (st[0] if st else vizinho(q))
    if r[2]:
        km = float(r[2]) / 1e6
        if km > 0: d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km)
    if r[3] and not r[3].startswith('-'): d['cr'] = r[3]
    if r[4] in IUCNQ: d['iucn'] = IUCNQ[r[4]]
    if r[7]: d['site'] = r[7]
    if x[6]: d['wp'] = x[6] if not x[6].startswith('pt:') else x[6]
    if p:
        N['padus'] += 1; d['fn'] = 'p'
        if 'km' not in d and p['km'] > 0:
            km = p['km']; d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km); N['km'] += 1
        if 'cr' not in d and p['ano']: d['cr'] = str(p['ano']); N['cr'] += 1
        if p['iucn'] and d.get('iucn') != p['iucn']: d['iucn'] = p['iucn']; N['iucn'] += 1  # PAD-US é a fonte oficial
    if q in KMX: d['km'] = KMX[q]
    if q in CRX:
        if CRX[q]: d['cr'] = CRX[q]
        else: d.pop('cr', None)
    fs = FOTOS.get(str(q)) or []
    if fs: d['f'] = [[f[0], autor(f[1]), lic(f[2])] for f in fs[:5]]
    d['t'] = apresentacao(x[1], nome_en, d, p); d['ta'] = 1
    if q in S:
        d['t'] = {l: dict(r=d['t'][l], **{k: v for k, v in S[q][l].items() if v}) for l in ('pt', 'en', 'es')}; d.pop('ta')
    out.setdefault(arq, {})[str(q)] = d
    idx.setdefault(arq, []).append(q)
os.makedirs(f'{R}/v1/fichas', exist_ok=True)
for k, v in out.items():
    json.dump(v, open(f'{R}/v1/fichas/{k}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
ip = f'{R}/v1/fichas/indice.json'
I = json.load(open(ip)) if os.path.exists(ip) else {}
I = {k: v for k, v in I.items() if not k.startswith('US-')}
I.update({k: sorted(v) for k, v in idx.items()})
json.dump(dict(sorted(I.items())), open(ip, 'w'), separators=(',', ':'))
tot = [d for v in out.values() for d in v.values()]
print(len(out), 'arquivos', len(tot), 'áreas', dict(N), {k: sum(1 for d in tot if k in d) for k in ('km', 'cr', 'iucn', 'pv', 'f')}, 'seções', len(S))
