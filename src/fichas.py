"""Gera v1/fichas/indice.json e v1/fichas/<PAIS>-<PROV>.json (fichas básicas das áreas protegidas).
Entradas: v1/mapa-areas-protegidas.json, fontes/fichas/wikidata-ca.tsv, fontes/fichas/fotos-commons-ca*.json
e os textos em /mnt/project-files/mapa-aventura/fichas-areas/textos/ca_np_*.py (ou FICHAS_TEXTOS=<pasta>).
Uso: python3 src/fichas.py"""
import json, os, glob, math, importlib.util, re, collections
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
# seções (história, fauna e flora, atrativos) escritas pela WAS para fichas automáticas: textos/ca_sec_*.py definem S[q] = {pt:{h,ff,at}, en:..., es:...}
S = {}
for f in sorted(glob.glob(f'{TX}/ca_sec_*.py')):
    sp = importlib.util.spec_from_file_location('s', f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); S.update(m.S)
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
# ---- CPCAD (Canadian Protected and Conserved Areas Database, Governo do Canadá, Licença de Governo Aberto) ----
# registro: [NAME_E, NAME_F, IUCN_CAT, ESTYEAR, QUALYEAR, O_AREA_HA, TYPE_E, MGMT_E, ZONE_ID, PARENT_ID]
CPP = json.load(open(f'{R}/fontes/fichas/cpcad-ca.json')) if os.path.exists(f'{R}/fontes/fichas/cpcad-ca.json') else {}
f3 = f'{R}/fontes/fichas/cpcad-ca-nome.json'
CPN = json.load(open(f3)) if os.path.exists(f3) else {}
GW = set('provincial national park parks reserve marine wilderness area areas ecological conservation protected territorial wildland nature natural preserve historic site and of the de du des la le parc ecologique aire protegee nationale lake river island'.split())
def toks(s): return set(norm(s).split()) - GW
def base(s): return ' '.join(norm(re.sub(r'\(.*?\)', ' ', s or '')).split())
CPIUCN = {1:'Ia', 2:'Ib', 3:'II', 4:'III', 5:'IV', 6:'V', 7:'VI'}
def cpcad(q, nome):
    a = toks(nome)
    if not a: return None
    t0 = familia(nome)
    for fonte in (CPP, CPN):
        cs = [c for c in (fonte.get(str(q)) or []) if c and len(a & (toks(c[0]) | toks(c[1]))) / len(a) >= .5 and compat(t0, c)]
        if not cs: continue
        g = {}
        for c in cs: g.setdefault(base(c[0]), {})[c[8]] = c
        grp = max(g.values(), key=lambda z: (max(len(a & (toks(c[0]) | toks(c[1]))) / len(a) for c in z.values()), sum(c[5] or 0 for c in z.values())))
        ps = list(grp.values()); maior = max(ps, key=lambda c: c[5] or 0)
        ha = sum(c[5] or 0 for c in ps)
        anos = [c[3] for c in ps if c[3] and c[3] > 1800] or [c[4] for c in ps if c[4] and c[4] > 1800]
        return dict(ha=ha, ano=min(anos) if anos else None, iucn=CPIUCN.get(maior[2]), tipo=maior[6], gestao=maior[7])
    return None
# ---- parágrafo de apresentação (PT/EN/ES), só com dados confirmados ----
TIPOS = [  # (padrão no nome, pt, gênero pt, en, es, gênero es)
  (r'national park reserve', 'reserva de parque nacional', 'f', 'national park reserve', 'reserva de parque nacional', 'f'),
  (r'national marine conservation area', 'área nacional de conservação marinha', 'f', 'national marine conservation area', 'área nacional de conservación marina', 'f'),
  (r'national (marine )?park|parc national', 'parque nacional', 'm', 'national park', 'parque nacional', 'm'),
  (r'national wildlife area', 'área nacional de vida selvagem', 'f', 'national wildlife area', 'área nacional de vida silvestre', 'f'),
  (r'migratory bird sanctuary', 'santuário de aves migratórias', 'm', 'migratory bird sanctuary', 'santuario de aves migratorias', 'm'),
  (r'marine protected area', 'área marinha protegida', 'f', 'marine protected area', 'área marina protegida', 'f'),
  (r'wildland provincial park', 'parque provincial selvagem', 'm', 'wildland provincial park', 'parque provincial silvestre', 'm'),
  (r'marine provincial park|provincial marine park|state marine park', 'parque marinho', 'm', 'marine park', 'parque marino', 'm'),
  (r'territorial park', 'parque territorial', 'm', 'territorial park', 'parque territorial', 'm'),
  (r'ecological reserve', 'reserva ecológica', 'f', 'ecological reserve', 'reserva ecológica', 'f'),
  (r'nature reserve|natural reserve', 'reserva natural', 'f', 'nature reserve', 'reserva natural', 'f'),
  (r'wilderness area|wilderness park', 'área selvagem', 'f', 'wilderness area', 'área silvestre', 'f'),
  (r'recreation area', 'área de recreação', 'f', 'recreation area', 'área recreativa', 'f'),
  (r'wildlife management area|wildlife area', 'área de manejo de fauna', 'f', 'wildlife management area', 'área de manejo de fauna', 'f'),
  (r'conservancy', 'área de conservação', 'f', 'conservancy', 'área de conservación', 'f'),
  (r'conservation reserve', 'reserva de conservação', 'f', 'conservation reserve', 'reserva de conservación', 'f'),
  (r'protected area|protected natural area', 'área protegida', 'f', 'protected area', 'área protegida', 'f'),
  (r'provincial park|parc provincial|park$|parc ', 'parque provincial', 'm', 'provincial park', 'parque provincial', 'm'),
]
PARQUES = {'parque provincial', 'parque marinho', 'parque territorial', 'parque provincial selvagem', 'área de recreação'}
def tipo0(s):
    n = ' '.join(norm(s).split())
    for t in TIPOS:
        if re.search(t[0], n): return t[1]
    return None
def familia(nome, tp=''):
    n = ' '.join(norm(re.sub(r'\(.*?\)', ' ', nome or '')).split())
    if re.search(r'\b(park|parc|parque)\b|provincial nature reserve', n): return 'park'
    t = tipo0(n)
    if t is None and re.search(r'park', (tp or '').lower()): return 'park'
    return t or (tipo0(tp or '') if tp else None)
def compat(t0, c):
    if t0 is None: return True
    t1 = familia(c[0], c[6])
    return t1 == t0 or t1 is None
def tipo(nome, cp):
    for alvo in (nome, (cp or {}).get('tipo') or ''):
        n = ' '.join(norm(alvo).split())
        for t in TIPOS:
            if re.search(t[0], n): return t
    return (None, 'área protegida', 'f', 'protected area', 'área protegida', 'f')
PVL = {'AB':('em Alberta','in Alberta','en Alberta'),'BC':('na Colúmbia Britânica','in British Columbia','en Columbia Británica'),'MB':('em Manitoba','in Manitoba','en Manitoba'),
  'NB':('em Nova Brunswick','in New Brunswick','en Nuevo Brunswick'),'NL':('em Terra Nova e Labrador','in Newfoundland and Labrador','en Terranova y Labrador'),'NS':('na Nova Escócia','in Nova Scotia','en Nueva Escocia'),
  'NT':('nos Territórios do Noroeste','in the Northwest Territories','en los Territorios del Noroeste'),'NU':('em Nunavut','in Nunavut','en Nunavut'),'ON':('em Ontário','in Ontario','en Ontario'),
  'PE':('na Ilha do Príncipe Eduardo','on Prince Edward Island','en la Isla del Príncipe Eduardo'),'QC':('em Quebec','in Quebec','en Quebec'),'SK':('em Saskatchewan','in Saskatchewan','en Saskatchewan'),'YT':('no Yukon','in Yukon','en el Yukón')}
TERR = {'NT', 'NU', 'YT'}
def gestao(g, pv):
    g = g or ''; gl = g.lower(); ter = bool(pv) and pv[0] in TERR
    if 'parks canada' in gl: return ('da Parks Canada, a agência federal de parques', 'by Parks Canada, the federal parks agency', 'de Parks Canada, la agencia federal de parques')
    if 'fisheries and oceans' in gl: return ('do Departamento de Pesca e Oceanos do Canadá', 'by Fisheries and Oceans Canada', 'del Departamento de Pesca y Océanos de Canadá')
    if 'canadian wildlife service' in gl: return ('do Serviço Canadense de Vida Selvagem', 'by the Canadian Wildlife Service', 'del Servicio Canadiense de Vida Silvestre')
    for org in ('Nature Conservancy of Canada', 'Ducks Unlimited Canada', 'Nova Scotia Nature Trust'):
        if gl == org.lower(): return (f'da organização {org}', f'by the {org}', f'de la organización {org}')
    if gl == 'ontario parks': return ('da Ontario Parks, a agência de parques da província', 'by Ontario Parks', 'de Ontario Parks, la agencia de parques de la provincia')
    if re.search(r'government|ministry|minist|department|environment yukon|parks division|forestry and parks|environment and climate change', gl) and ';' not in g and 'co-managed' not in gl:
        return ('do governo territorial', 'by the territorial government', 'del gobierno territorial') if ter else ('do governo provincial', 'by the provincial government', 'del gobierno provincial')
    return None
def num(v, l):
    s = f'{v:,.1f}' if v < 100 else f'{round(v):,}'
    if s.endswith('.0'): s = s[:-2]
    if l == 'en': return s
    return s.replace(',', '§').replace('.', ',').replace('§', '.')
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
def apresentacao(nome, d, cp):
    t = tipo(nome, cp); pv = d.get('pv') or []
    km = d.get('km'); ano = (d.get('cr') or '')[:4] or None; g = gestao((cp or {}).get('gestao'), pv)
    nm = re.sub(r'^the ', '', nome, flags=re.I)
    out = {}
    # PT
    art, um = ('O', 'um') if t[2] == 'm' else ('A', 'uma')
    onde = PVL[pv[0]][0] + ', no Canadá' if len(pv) == 1 else 'no Canadá'
    s = [f'{art} {nm} é {um} {t[1]} {onde}.']
    prot = 'protegido' if t[2] == 'm' else 'protegida'
    if km and ano: s.append(f'Tem {tam(km, "pt")} e está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif km: s.append(f'Tem {tam(km, "pt")}' + (f' e está sob gestão {g[0]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif g: s.append(f'Está sob gestão {g[0]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][0])
    out['pt'] = ' '.join(s)
    # EN
    onde = PVL[pv[0]][1] + ', Canada' if len(pv) == 1 else 'in Canada'
    a = 'an' if t[3][0] in 'aeiou' else 'a'
    s = [f'{nm} is {a} {t[3]} {onde}.']
    if km and ano: s.append(f'It covers {tam(km, "en")} and has been protected since {ano}' + (f'. It is managed {g[1]}.' if g else '.'))
    elif km: s.append(f'It covers {tam(km, "en")}' + (f' and is managed {g[1]}.' if g else '.'))
    elif ano: s.append(f'It has been protected since {ano}' + (f' and is managed {g[1]}.' if g else '.'))
    elif g: s.append(f'It is managed {g[1]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][1])
    out['en'] = ' '.join(s)
    # ES
    art, um = ('El', 'un') if t[5] == 'm' else ('La', 'un' if t[4].startswith('área') else 'una')
    onde = PVL[pv[0]][2] + ', Canadá' if len(pv) == 1 else 'en Canadá'
    s = [f'{art} {nm} es {um} {t[4]} {onde}.']
    prot = 'protegido' if t[5] == 'm' else 'protegida'
    if km and ano: s.append(f'Tiene {tam(km, "es")} y está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif km: s.append(f'Tiene {tam(km, "es")}' + (f' y está bajo la gestión {g[2]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif g: s.append(f'Está bajo la gestión {g[2]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][2])
    out['es'] = ' '.join(s)
    return out
out = {}; idx = {}; NCP = collections.Counter()
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
    cp = cpcad(q, nome)
    if cp:
        NCP['cpcad'] += 1; d['fn'] = 'c'
        if 'km' not in d and cp['ha'] > 0:
            km = cp['ha'] / 100; d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km); NCP['km'] += 1
        if 'cr' not in d and cp['ano']: d['cr'] = str(cp['ano']); NCP['cr'] += 1
        if 'iucn' not in d and cp['iucn']: d['iucn'] = cp['iucn']; NCP['iucn'] += 1
    t = T.get(q)
    if not t:
        d['t'] = apresentacao(A[q][1], d, cp); d['ta'] = 1
        if q in S:
            d['t'] = {l: dict(r=d['t'][l], **{k: v for k, v in S[q][l].items() if v}) for l in ('pt', 'en', 'es')}; d.pop('ta')
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
print({k: len(v) for k, v in sorted(out.items())}, 'seções', len(S), 'textos', sum(1 for v in out.values() for d in v.values() if 't' in d), 'com fotos', sum(1 for v in out.values() for d in v.values() if 'f' in d), dict(NCP),
  {k: sum(1 for v in out.values() for d in v.values() if k in d) for k in ('km', 'cr', 'iucn', 'pv')})
