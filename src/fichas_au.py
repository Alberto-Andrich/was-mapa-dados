"""Fichas básicas das áreas protegidas da Austrália: v1/fichas/AU-<ESTADO>.json e as chaves AU-* de v1/fichas/indice.json.
Entradas: v1/mapa-areas-protegidas.json, fontes/fichas/wikidata-au.json ({q: [q, estados, área m², criação, IUCN Q, imagens ¦, categoria Commons, site]}),
fontes/fichas/capad-au.json (CAPAD, © Commonwealth of Australia, CC BY 4.0: {'rows': [[camada, PA_ID, NAME, TYPE, IUCN, GAZ_AREA ha, GIS_AREA ha,
GAZ_DATE ms, STATE, AUTHORITY, GOVERNANCE, ENVIRON, LON, LAT]], 'pt': {q: [camada:PA_ID a até 300 m do ponto]}}),
fontes/fichas/fotos-commons-au.json (opcional: {q: [[arquivo, autor, licença, ...]]}) e textos/au_sec_*.py (opcional: seções S[q]).
Uso: python3 src/fichas_au.py"""
import json, os, re, glob, importlib.util, unicodedata, collections, math, datetime
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TX = os.environ.get('FICHAS_TEXTOS', '/mnt/project-files/mapa-aventura/fichas-areas/textos')
IUCNQ = {'Q14545608':'Ia','Q14545620':'Ib','Q14545628':'II','Q14545633':'III','Q14545639':'IV','Q14545646':'V','Q14545652':'VI'}
# código: (pt, en, es, preposição pt)
ESTADOS = {'NSW': ('Nova Gales do Sul', 'New South Wales', 'Nueva Gales del Sur', 'em'), 'VIC': ('Vitória', 'Victoria', 'Victoria', 'em'),
  'QLD': ('Queensland', 'Queensland', 'Queensland', 'em'), 'WA': ('Austrália Ocidental', 'Western Australia', 'Australia Occidental', 'na'),
  'SA': ('Austrália Meridional', 'South Australia', 'Australia Meridional', 'na'), 'TAS': ('Tasmânia', 'Tasmania', 'Tasmania', 'na'),
  'NT': ('Território do Norte', 'Northern Territory', 'Territorio del Norte', 'no'), 'ACT': ('Território da Capital Australiana', 'Australian Capital Territory', 'Territorio de la Capital Australiana', 'no'),
  'JBT': ('Território da Baía de Jervis', 'Jervis Bay Territory', 'Territorio de la Bahía de Jervis', 'no'), 'EXT': ('territórios externos', 'external territories', 'territorios externos', 'nos')}
A = {x[0]: x for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json')) if x[5] == 'AU'}
def carregar(n, padrao):
    p = f'{R}/fontes/fichas/{n}'
    return json.load(open(p)) if os.path.exists(p) else padrao
WD = {int(k): v for k, v in carregar('wikidata-au.json', {}).items()}
CAP = carregar('capad-au.json', {'rows': [], 'pt': {}})
FOTOS = carregar('fotos-commons-au.json', {})
S = {}; KMX = {}; CRX = {}
for f in sorted(glob.glob(f'{TX}/au_sec_*.py')):
    sp = importlib.util.spec_from_file_location('s', f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); S.update(m.S); KMX.update(getattr(m, 'KM', {})); CRX.update(getattr(m, 'CR', {}))

def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return ' '.join(re.sub(r'[^a-z0-9]+', ' ', s).split())
GW = set('national park parks reserve reserves nature conservation area areas marine state regional recreation forest wilderness historic site and of the aboriginal land cape york peninsula cypal indigenous protected sanctuary zone park nrs game refuge heritage agreement covenant flora fauna wildlife ramsar commonwealth australian'.split())
def toks(s): return set(norm(s).split()) - GW
GEO = set('creek lake lakes gorge island islands river mount mountain mountains range ranges cape bay gully rock rocks falls great north south east west upper lower point head beach reef reefs inlet harbour hill hills gap valley cap knoll swamp wetlands springs spring scrub forest forests big little new old group cays cay sound plains plain coast coastal waters dam well lagoon'.split())

# ---- tipos (padrão no nome, pt, gênero pt, en, es, gênero es) ----
TIPOS = [
  (r'australian marine park|commonwealth marine reserve', 'parque marinho australiano', 'm', 'Australian marine park', 'parque marino australiano', 'm'),
  (r'marine national park', 'parque nacional marinho', 'm', 'marine national park', 'parque nacional marino', 'm'),
  (r'marine park', 'parque marinho', 'm', 'marine park', 'parque marino', 'm'),
  (r'marine sanctuary', 'santuário marinho', 'm', 'marine sanctuary', 'santuario marino', 'm'),
  (r'marine management area|marine reserve|aquatic reserve|fish habitat area', 'reserva marinha', 'f', 'marine reserve', 'reserva marina', 'f'),
  (r'indigenous protected area', 'área protegida indígena', 'f', 'Indigenous protected area', 'área protegida indígena', 'f'),
  (r'national park', 'parque nacional', 'm', 'national park', 'parque nacional', 'm'),
  (r'state conservation area', 'área estadual de conservação', 'f', 'state conservation area', 'área estatal de conservación', 'f'),
  (r'conservation park', 'parque de conservação', 'm', 'conservation park', 'parque de conservación', 'm'),
  (r'conservation reserve|conservation area|nature conservation reserve', 'reserva de conservação', 'f', 'conservation reserve', 'reserva de conservación', 'f'),
  (r'regional reserve', 'reserva regional', 'f', 'regional reserve', 'reserva regional', 'f'),
  (r'nature reserve|nature refuge|flora reserve|natural features reserve', 'reserva natural', 'f', 'nature reserve', 'reserva natural', 'f'),
  (r'state forest|forest reserve', 'floresta estadual', 'f', 'state forest', 'bosque estatal', 'm'),
  (r'state park|regional park|reserve park', 'parque estadual', 'm', 'state park', 'parque estatal', 'm'),
  (r'historic site|historic reserve|historical reserve', 'sítio histórico', 'm', 'historic site', 'sitio histórico', 'm'),
  (r'wilderness', 'área silvestre', 'f', 'wilderness area', 'área silvestre', 'f'),
  (r'game reserve', 'reserva de caça', 'f', 'game reserve', 'reserva de caza', 'f'),
  (r'state reserve|reserve$', 'reserva', 'f', 'reserve', 'reserva', 'f'),
  (r'park$', 'parque', 'm', 'park', 'parque', 'm'),
]
def tipo0(s):
    n = norm(s)
    for t in TIPOS:
        if re.search(t[0], n): return t
    return None
def tipo(nome, cp):
    return tipo0(nome) or (cp and tipo0(cp.get('ty') or '')) or (None, 'área protegida', 'f', 'protected area', 'área protegida', 'f')
def familia(s):
    t = tipo0(s)
    if not t: return None
    if 'marinh' in t[1] or t[1] == 'reserva marinha': return 'mar'
    return 'terra'

# ---- CAPAD ----
CR_ROWS = CAP['rows']
POR_ID = collections.defaultdict(list)
for r in CR_ROWS: POR_ID[f'{r[0]}:{r[1]}'].append(r)
POR_TOK = collections.defaultdict(list)
for i, r in enumerate(CR_ROWS):
    for t in toks(r[2]): POR_TOK[t].append(i)
def dist(lon1, lat1, lon2, lat2):
    if None in (lon1, lat1, lon2, lat2): return 9e9
    x = math.radians(lon2 - lon1) * math.cos(math.radians((lat1 + lat2) / 2)); y = math.radians(lat2 - lat1)
    return 6371 * math.hypot(x, y)
def capad(q, nome, x, st=None):
    nome = re.sub(r'\(.*?\)', ' ', nome); a = toks(nome)
    if not a: return None
    f0 = familia(nome); t0 = tipo0(nome)
    ids_perto = set(CAP['pt'].get(str(q), []))
    cands = set()
    for t in a: cands.update(POR_TOK.get(t, []))
    cs = []
    for i in cands:
        r = CR_ROWS[i]
        sc = 0
        for b in (toks(r[2]), toks(re.sub(r'\(.*?\)', ' ', r[2]))):
            if b and (a & b) - GEO: sc = max(sc, min(len(a & b) / len(a), len(a & b) / len(b)) if len(a & b) / len(b) < .99 else len(a & b) / len(a) * .5 + .5)
        if sc < .5: continue
        f1 = familia(r[3]) or ('mar' if r[0] == 1 else 'terra')
        if f0 and f1 != f0: continue
        d = dist(x[2], x[3], r[12], r[13])
        noponto = f'{r[0]}:{r[1]}' in ids_perto
        if not noponto and d > 400: continue
        t1 = tipo0(r[3])
        if t0 and t1 and t0[1] != t1[1] and sc < .8: continue
        bonus = (.6 if t0 and t1 and t0[1] == t1[1] else 0) + (.1 if norm(r[3]) in norm(nome) else 0) + (.2 if st and r[8] in st else 0) + (.5 if noponto else 0)
        cs.append((sc + bonus - d / 4000 + (r[6] or 0) / 1e9, i))
    if not cs: return None
    _, i0 = max(cs)
    r0 = CR_ROWS[i0]
    grp = [r for r in CR_ROWS if r[0] == r0[0] and r[2] == r0[2] and r[3] == r0[3] and r[8] == r0[8]]
    ha = sum(r[6] or 0 for r in grp)  # GIS_AREA (ha); GAZ_AREA é irregular entre estados
    ds = [r[7] for r in grp if r[7]]
    ano = None
    if ds:
        d0 = datetime.datetime(1970, 1, 1) + datetime.timedelta(milliseconds=min(ds) + 12 * 3600 * 1000)
        if 1800 < d0.year < 2100: ano = d0.year
    iu = collections.Counter(r[4] for r in grp if r[4] in ('Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI')).most_common(1)
    return dict(km=ha / 100, ano=ano, iucn=iu[0][0] if iu else None, ty=r0[3], st=r0[8], au=r0[9], gv=r0[10], nm=r0[2])

def gestao(p):
    if not p: return None
    au, st = (p.get('au') or '').upper(), p.get('st')
    if au.startswith('DNP') or 'PARKS AUSTRALIA' in au or au in ('DCCEEW', 'DAWE', 'DOEE') or st == 'COM': return ('do governo federal da Austrália (Parks Australia)', 'by the Australian Government (Parks Australia)', 'del gobierno federal de Australia (Parks Australia)')
    if p.get('gv') == 'T' or 'IPA' in (p.get('ty') or '').upper() or 'Indigenous' in (p.get('ty') or ''): return ('de um povo aborígene ou ilhéu do Estreito de Torres', 'by Aboriginal or Torres Strait Islander people', 'de un pueblo aborigen o isleño del Estrecho de Torres')
    if p.get('gv') == 'JA': return ('compartilhada entre o governo e os donos tradicionais aborígenes', 'jointly by the government and Aboriginal traditional owners', 'compartida entre el gobierno y los dueños tradicionales aborígenes')
    if p.get('gv') in ('NGO', 'PV', 'P'): return ('de uma organização privada ou sem fins lucrativos', 'by a private or non-profit organisation', 'de una organización privada o sin fines de lucro')
    if p.get('gv') == 'G' and st in ('NT', 'ACT', 'JBT'): return ('do governo do território', 'by the territory government', 'del gobierno del territorio')
    if p.get('gv') == 'G': return ('do governo estadual', 'by the state government', 'del gobierno estatal')
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

# nomes em PT/ES a partir do inglês: "X National Park" -> "Parque Nacional X"
EN2 = [('Marine National Park', 'Parque Nacional Marinho', 'Parque Nacional Marino'), ('National Park', 'Parque Nacional', 'Parque Nacional'),
  ('Marine Park', 'Parque Marinho', 'Parque Marino'), ('Conservation Park', 'Parque de Conservação', 'Parque de Conservación'),
  ('State Conservation Area', 'Área Estadual de Conservação', 'Área Estatal de Conservación'), ('Conservation Reserve', 'Reserva de Conservação', 'Reserva de Conservación'),
  ('Nature Reserve', 'Reserva Natural', 'Reserva Natural'), ('Aquatic Reserve', 'Reserva Aquática', 'Reserva Acuática'), ('Marine Reserve', 'Reserva Marinha', 'Reserva Marina'),
  ('Marine Sanctuary', 'Santuário Marinho', 'Santuario Marino'), ('Marine Management Area', 'Área de Manejo Marinho', 'Área de Manejo Marino'),
  ('State Forest', 'Floresta Estadual', 'Bosque Estatal'), ('State Park', 'Parque Estadual', 'Parque Estatal'), ('Regional Park', 'Parque Regional', 'Parque Regional'),
  ('Regional Reserve', 'Reserva Regional', 'Reserva Regional'), ('Wilderness Park', 'Parque Silvestre', 'Parque Silvestre'), ('Wildlife Reserve', 'Reserva de Fauna', 'Reserva de Fauna'),
  ('Game Reserve', 'Reserva de Caça', 'Reserva de Caza'), ('Historic Site', 'Sítio Histórico', 'Sitio Histórico'), ('Indigenous Protected Area', 'Área Protegida Indígena', 'Área Protegida Indígena')]
def en2(n, l):
    n = re.sub(r' CCA Zone \d+', '', n or ''); n = re.sub(r' Commonwealth (?=Marine)', ' ', n)
    m = re.match(r'^(.+?) (' + '|'.join(re.escape(e[0]) for e in EN2) + r')(\b.*)$', n or '')
    if not m: return None
    e = next(e for e in EN2 if e[0] == m.group(2))
    return f"{e[1] if l == 'pt' else e[2]} {m.group(1)}{m.group(3)}".strip()

def onde_pt(st):
    if len(st) == 1:
        e = ESTADOS[st[0]]
        return f'{e[3]} {e[0]}, na Austrália' if st[0] != 'EXT' else 'nos territórios externos da Austrália'
    return 'na Austrália'
def apresentacao(nome_pt, nome_en, d, p):
    t = tipo(nome_en or nome_pt, p); st = [k[3:] for k in d.get('pv') or []]
    km, ano, g = d.get('km'), (d.get('cr') or '')[:4] or None, gestao(p)
    out = {}
    nome_pt = re.sub(r' CCA Zone \d+', '', nome_pt).replace(', Australia', '')
    nm = nome_pt if not (nome_en and nome_pt == nome_en or re.search(r' (National|Marine|Nature|Conservation|State|Reserve|Park)\b', nome_pt)) else (en2(nome_en or nome_pt, 'pt') or nome_pt)
    art, um = ('O', 'um') if t[2] == 'm' else ('A', 'uma')
    if re.match(r'(Reserva|Área|Floresta)\b', nm): art = 'A'
    elif re.match(r'(Parque|Santuário|Sítio)\b', nm): art = 'O'
    onde = onde_pt(st)
    s = [f'{art} {nm} fica {onde}.'] if norm(nm).startswith(norm(t[1])) else [f'{art} {nm} é {um} {t[1]} {onde}.']
    prot = 'protegido' if t[2] == 'm' else 'protegida'
    gt = (lambda x: f', sob gestão {x}.') if g else None
    if km and ano: s.append(f'Tem {tam(km, "pt")} e está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif km: s.append(f'Tem {tam(km, "pt")}' + (f' e está sob gestão {g[0]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', sob gestão {g[0]}.' if g else '.'))
    elif g: s.append(f'Está sob gestão {g[0]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][0])
    out['pt'] = ' '.join(s)
    ne = ' '.join(re.sub(r' \(.*?\)$', '', nome_en or nome_pt).replace(', Australia', '').split())
    onde = (f'in {"the " if "Territory" in ESTADOS[st[0]][1] else ""}{ESTADOS[st[0]][1]}, Australia' if st[0] != 'EXT' else "in Australia's external territories") if len(st) == 1 else 'in Australia'
    a = 'an' if t[3][0].lower() in 'aeiou' else 'a'
    s = [f'{ne} is {a} {t[3]} {onde}.']
    if km and ano: s.append(f'It covers {tam(km, "en")} and has been protected since {ano}' + (f'. It is managed {g[1]}.' if g else '.'))
    elif km: s.append(f'It covers {tam(km, "en")}' + (f' and is managed {g[1]}.' if g else '.'))
    elif ano: s.append(f'It has been protected since {ano}' + (f' and is managed {g[1]}.' if g else '.'))
    elif g: s.append(f'It is managed {g[1]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][1])
    out['en'] = ' '.join(s)
    art, um = ('El', 'un') if t[5] == 'm' else ('La', 'un' if t[4].startswith('área') else 'una')
    onde = (f'en {"el " if ESTADOS[st[0]][2].startswith("Territorio") else ""}{ESTADOS[st[0]][2]}, Australia' if st[0] != 'EXT' else 'en los territorios externos de Australia') if len(st) == 1 else 'en Australia'
    nes = en2(ne, 'es') or ne
    if re.match(r'(Reserva|Área)\b', nes): art = 'La'
    elif re.match(r'(Parque|Santuario|Sitio|Bosque)\b', nes): art = 'El'
    s = [f'{art} {nes} está {onde}.'] if norm(nes).startswith(norm(t[4])) else [f'{art} {nes} es {um} {t[4]} {onde}.']
    prot = 'protegido' if t[5] == 'm' else 'protegida'
    if km and ano: s.append(f'Tiene {tam(km, "es")} y está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif km: s.append(f'Tiene {tam(km, "es")}' + (f' y está bajo la gestión {g[2]}.' if g else '.'))
    elif ano: s.append(f'Está {prot} desde {ano}' + (f', bajo la gestión {g[2]}.' if g else '.'))
    elif g: s.append(f'Está bajo la gestión {g[2]}.')
    if d.get('iucn') in IUCNF: s.append(IUCNF[d['iucn']][2])
    out['es'] = ' '.join(s)
    return out

def autor(a): return re.sub(r'https?://\S+', '', a or '').strip(' ,;-·')[:70]
def lic(l): return {'Public domain': 'Domínio público', 'Public Domain': 'Domínio público', 'PD': 'Domínio público'}.get(l, l)
def estados(r):
    return [s for s in (r[1].split(',') if r and r[1] else []) if s in ESTADOS]
conh = [(A[q][2], A[q][3], estados(r)[0]) for q, r in WD.items() if q in A and estados(r)]
def vizinho(q):
    x, y = A[q][2], A[q][3]
    return min(conh, key=lambda c: (c[0]-x)**2 + (c[1]-y)**2)[2] if conh else 'NSW'

out, idx, N = {}, {}, collections.Counter()
for q, x in A.items():
    r = WD.get(q) or [str(q), '', '', '', '', '', '', '', '']
    st = estados(r)
    nome_en = x[6].split(':', 1)[1].replace('_', ' ') if x[6] and x[6].startswith('en:') else (r[8] if len(r) > 8 and r[8] else None)
    nome = nome_en or x[1]
    p = capad(q, nome, x, st)
    if not st and p and p.get('st') in ESTADOS: st = [p['st']]
    if p and p.get('st') == 'COM' and not st: pass
    d = {}
    if st: d['pv'] = ['AU-' + s for s in st]
    arq = 'AU-' + (st[0] if st else vizinho(q))
    if r[2]:
        km = float(r[2]) / 1e6
        if km > 0: d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km)
    if r[3] and not r[3].startswith('-'): d['cr'] = r[3][:4] if r[3].endswith('-01-01') else r[3]
    if r[4] in IUCNQ: d['iucn'] = IUCNQ[r[4]]
    if r[7]: d['site'] = r[7]
    if x[6]: d['wp'] = x[6]
    if p:
        N['capad'] += 1; d['fn'] = 'a'
        if p['km'] > 0:  # CAPAD é a fonte oficial da área
            km = p['km']; d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km); N['km'] += 1
        if 'cr' not in d and p['ano']: d['cr'] = str(p['ano']); N['cr'] += 1
        if p['iucn'] and d.get('iucn') != p['iucn']: d['iucn'] = p['iucn']; N['iucn'] += 1
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
I = {k: v for k, v in I.items() if not k.startswith('AU-')}
I.update({k: sorted(v) for k, v in idx.items()})
json.dump(dict(sorted(I.items())), open(ip, 'w'), separators=(',', ':'))
tot = [d for v in out.values() for d in v.values()]
print(len(out), 'arquivos', len(tot), 'áreas', dict(N), {k: sum(1 for d in tot if k in d) for k in ('km', 'cr', 'iucn', 'pv', 'f')}, 'seções', len(S))
