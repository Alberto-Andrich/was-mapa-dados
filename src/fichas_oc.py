"""Fichas básicas das áreas protegidas do resto da Oceania (Nova Zelândia e ilhas do Pacífico): v1/fichas/NZ.json, v1/fichas/OC.json
e as chaves NZ e OC de v1/fichas/indice.json.
Entradas: v1/mapa-areas-protegidas.json, fontes/fichas/wikidata-oc.json ({q: [q, regiões ¦ (en), área, unidade Q, criação, IUCN Q,
imagens ¦, categoria Commons, site, rótulo en, wp pt, wp es, wp en]}), fontes/fichas/fotos-commons-oc.json e textos/oc_sec_*.py (S, KM, CR).
Uso: python3 src/fichas_oc.py"""
import json, os, re, glob, importlib.util
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TX = os.environ.get('FICHAS_TEXTOS', '/mnt/project-files/mapa-aventura/fichas-areas/textos')
IUCNQ = {'Q14545608':'Ia','Q14545620':'Ib','Q14545628':'II','Q14545633':'III','Q14545639':'IV','Q14545646':'V','Q14545652':'VI'}
PAISES = {'NZ': ('Nova Zelândia', 'New Zealand', 'Nueva Zelanda', 'na'), 'FJ': ('Fiji', 'Fiji', 'Fiyi', 'em'), 'SB': ('Ilhas Salomão', 'Solomon Islands', 'Islas Salomón', 'nas'),
  'WS': ('Samoa', 'Samoa', 'Samoa', 'em'), 'TO': ('Tonga', 'Tonga', 'Tonga', 'em'), 'KI': ('Kiribati', 'Kiribati', 'Kiribati', 'em'), 'TV': ('Tuvalu', 'Tuvalu', 'Tuvalu', 'em'),
  'CK': ('Ilhas Cook', 'Cook Islands', 'Islas Cook', 'nas'), 'NU': ('Niue', 'Niue', 'Niue', 'em')}
# regiões da Nova Zelândia: rótulo en do Wikidata -> (código, pt, en, es, preposição pt)
REG = {'Northland Region': ('NTL', 'Northland', 'Northland', 'Northland', 'em'), 'Auckland Region': ('AUK', 'Auckland', 'Auckland', 'Auckland', 'em'),
  'Waikato': ('WKO', 'Waikato', 'Waikato', 'Waikato', 'em'), 'Waikato Region': ('WKO', 'Waikato', 'Waikato', 'Waikato', 'em'),
  'Bay of Plenty Region': ('BOP', 'Bay of Plenty', 'Bay of Plenty', 'Bay of Plenty', 'em'), 'Gisborne District': ('GIS', 'Gisborne', 'Gisborne', 'Gisborne', 'em'),
  "Hawke's Bay Region": ('HKB', "Hawke's Bay", "Hawke's Bay", "Hawke's Bay", 'em'), 'Taranaki Region': ('TKI', 'Taranaki', 'Taranaki', 'Taranaki', 'em'),
  'Manawatū-Whanganui Region': ('MWT', 'Manawatū-Whanganui', 'Manawatū-Whanganui', 'Manawatū-Whanganui', 'em'),
  'Wellington Region': ('WGN', 'Wellington', 'Wellington', 'Wellington', 'em'), 'Tasman District': ('TAS', 'Tasman', 'Tasman', 'Tasman', 'em'),
  'Nelson': ('NSN', 'Nelson', 'Nelson', 'Nelson', 'em'), 'Marlborough District': ('MBH', 'Marlborough', 'Marlborough', 'Marlborough', 'em'),
  'West Coast Region': ('WTC', 'Costa Oeste', 'West Coast', 'Costa Oeste', 'na'), 'Canterbury Region': ('CAN', 'Canterbury', 'Canterbury', 'Canterbury', 'em'),
  'Otago Region': ('OTA', 'Otago', 'Otago', 'Otago', 'em'), 'Southland Region': ('STL', 'Southland', 'Southland', 'Southland', 'em'),
  'New Zealand outlying islands': ('OI', 'ilhas periféricas', 'outlying islands', 'islas periféricas', 'nas')}
REGX = {v[0]: v for v in REG.values()}
A = {x[0]: x for x in json.load(open(f'{R}/v1/mapa-areas-protegidas.json')) if x[5] in PAISES}
def carregar(n, padrao):
    p = f'{R}/fontes/fichas/{n}'
    return json.load(open(p)) if os.path.exists(p) else padrao
WD = {int(k): v for k, v in carregar('wikidata-oc.json', {}).items()}
FOTOS = carregar('fotos-commons-oc.json', {})
S = {}; KMX = {}; CRX = {}; PVX = {}
for f in sorted(glob.glob(f'{TX}/oc_sec_*.py')):
    sp = importlib.util.spec_from_file_location('s', f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    S.update(m.S); KMX.update(getattr(m, 'KM', {})); CRX.update(getattr(m, 'CR', {})); PVX.update(getattr(m, 'PV', {}))
UN = {'Q712226': 1, 'Q35852': .01, 'Q25343': 1e-6, 'Q81292': .00404686, 'Q232291': 2.58999}
IUCNF = {
 'Ia': ('Na classificação da IUCN, está na categoria Ia, a das reservas naturais estritas, voltadas à ciência e com visita muito restrita.', 'Under the IUCN system it is category Ia, a strict nature reserve set aside for science, with very limited visits.', 'En la clasificación de la UICN está en la categoría Ia, la de las reservas naturales estrictas, dedicadas a la ciencia y con visitas muy restringidas.'),
 'Ib': ('Na classificação da IUCN, está na categoria Ib, a das áreas selvagens: grandes espaços quase intocados.', 'Under the IUCN system it is category Ib, a wilderness area: a large, largely untouched space.', 'En la clasificación de la UICN está en la categoría Ib, la de las áreas silvestres: grandes espacios casi intactos.'),
 'II': ('Na classificação da IUCN, está na categoria II, a dos parques nacionais: protege ecossistemas inteiros e recebe visitantes.', 'Under the IUCN system it is category II, the national park category: it protects whole ecosystems and welcomes visitors.', 'En la clasificación de la UICN está en la categoría II, la de los parques nacionales: protege ecosistemas enteros y recibe visitantes.'),
 'III': ('Na classificação da IUCN, está na categoria III, a dos monumentos naturais.', 'Under the IUCN system it is category III, a natural monument.', 'En la clasificación de la UICN está en la categoría III, la de los monumentos naturales.'),
 'IV': ('Na classificação da IUCN, está na categoria IV, a das áreas de manejo de habitats e espécies.', 'Under the IUCN system it is category IV, a habitat and species management area.', 'En la clasificación de la UICN está en la categoría IV, la de las áreas de gestión de hábitats y especies.'),
 'V': ('Na classificação da IUCN, está na categoria V, a das paisagens terrestres ou marinhas protegidas.', 'Under the IUCN system it is category V, a protected landscape or seascape.', 'En la clasificación de la UICN está en la categoría V, la de los paisajes terrestres o marinos protegidos.'),
 'VI': ('Na classificação da IUCN, está na categoria VI, a das áreas de uso sustentável dos recursos naturais.', 'Under the IUCN system it is category VI, a protected area with sustainable use of natural resources.', 'En la clasificación de la UICN está en la categoría VI, la de las áreas de uso sostenible de los recursos naturales.')}
# tipo pelo nome en: (regex, pt, gênero pt, en, es, gênero es)
TIPOS = [(r'National Park', 'Parque Nacional', 'm', 'national park', 'Parque Nacional', 'm', 'parque nacional', 'parque nacional'),
 (r'Marine Reserve', 'Reserva Marinha', 'f', 'marine reserve', 'Reserva Marina', 'f', 'reserva marinha', 'reserva marina'),
 (r'Wilderness Area', 'Área Selvagem', 'f', 'wilderness area', 'Área Silvestre', 'f', 'área selvagem', 'área silvestre'),
 (r'Conservation Park', 'Parque de Conservação', 'm', 'conservation park', 'Parque de Conservación', 'm', 'parque de conservação', 'parque de conservación'),
 (r'Marine Park|Marae Moana', 'Parque Marinho', 'm', 'marine park', 'Parque Marino', 'm', 'parque marinho', 'parque marino'),
 (r'Conservation Area|Protected Area', 'Área de Conservação', 'f', 'conservation area', 'Área de Conservación', 'f', 'área de conservação', 'área de conservación')]
def tipo(n):
    for t in TIPOS:
        if re.search(t[0], n): return t
    return ('', 'Área Protegida', 'f', 'protected area', 'Área Protegida', 'f', 'área protegida', 'área protegida')
NOMES = {863815: ('Área Protegida das Ilhas Fénix', 'Área Protegida de las Islas Fénix'), 38121092: ('Marae Moana', 'Marae Moana'), 116769625: ('Parque Marinho de Uso Múltiplo Nukutuluea, de Niue', 'Parque Marino de Uso Múltiple Nukutuluea, de Niue'), 108195527: ("Parque Nacional do Lago Lanoto'o", "Parque Nacional del Lago Lanoto'o")}
q_atual = [0]
def nomes(x, r):
    en = (r[9] if r and r[9] else None) or (x[6].split(':', 1)[1].replace('_', ' ') if x[6] and x[6].startswith('en:') else x[1])
    t = tipo(en); base = re.sub(r'\s*' + (t[0] or '$^') + r'\s*', ' ', en).strip(' -')
    pt = es = None
    if r and r[10]: pt = __import__('urllib.parse').parse.unquote(r[10].split('/wiki/', 1)[-1]).replace('_', ' ')
    if pt and re.search(r'National Park|Marine Reserve', pt): pt = None
    if r and r[11]: es = __import__('urllib.parse').parse.unquote(r[11].split('/wiki/', 1)[-1]).replace('_', ' ')
    dist = [w for w in re.findall(r'[a-zà-ÿāēīōū]{4,}', base.lower()) if w not in ('island', 'islands', 'marine', 'reserve', 'national', 'park')]
    ok = lambda n: n and (not dist or any(w in n.lower() for w in dist))
    if not ok(pt): pt = None
    if not ok(es): es = None
    if q_atual[0] in NOMES: pt, es = NOMES[q_atual[0]]
    if not pt: pt = f'{t[1]} {base}' if t[0] else en
    if not es: es = f'{t[4]} {base}' if t[0] else en
    pt = re.sub(r'^Parque Nacional de ', 'Parque Nacional ', pt) if False else pt
    es = es[0].upper() + es[1:]
    return pt, en, es, t
def tam(km, l):
    if km >= 100: s = f'{round(km):,}'
    elif km >= 1: s = f'{km:,.1f}'.rstrip('0').rstrip('.')
    else: s = f'{km:.2f}'.rstrip('0').rstrip('.')
    if l != 'en': s = s.replace(',', '§').replace('.', ',').replace('§', '.')
    if l == 'es' and km >= 1000 and km < 10000: s = s.replace('.', '')
    return s + ' km²'
def apresentacao(pt, en, es, t, d, pais, reg):
    km, ano, iu = d.get('km'), (d.get('cr') or '')[:4] or None, d.get('iucn')
    P = PAISES[pais]; o = {}
    if pais == 'NZ' and reg and reg[0] != 'OI': onde_pt, onde_en, onde_es = f'na região de {reg[1]}, na Nova Zelândia', f'in the {reg[2]} region of New Zealand', f'en la región de {reg[3]}, en Nueva Zelanda'
    elif pais == 'NZ' and reg: onde_pt, onde_en, onde_es = 'nas ilhas periféricas da Nova Zelândia', "in New Zealand's outlying islands", 'en las islas periféricas de Nueva Zelanda'
    else: onde_pt, onde_en, onde_es = f'{P[3]} {P[0]}', f'in {"the " if P[1].endswith("Islands") else ""}{P[1]}', f'en {"las " if P[2].startswith("Islas") else ""}{P[2]}'
    art = 'O' if (t[2] == 'm' and not pt.startswith(('Área', 'Reserva'))) or pt.startswith(('Parque', 'Santuário')) else 'A'
    um = 'um' if t[2] == 'm' else 'uma'
    s = [f'{art} {pt} fica {onde_pt}.' if pt.lower().startswith(t[6]) else f'{art} {pt} é {um} {t[6]} {onde_pt}.']
    prot = 'protegido' if art == 'O' else 'protegida'
    if km and ano: s.append(f'Tem {tam(km, "pt")} e está {prot} desde {ano}.')
    elif km: s.append(f'Tem {tam(km, "pt")}.')
    elif ano: s.append(f'Está {prot} desde {ano}.')
    if iu in IUCNF: s.append(IUCNF[iu][0])
    o['pt'] = ' '.join(s)
    a = 'an' if t[3][0] in 'aeiou' else 'a'
    s = [f'{en} is {a} {t[3]} {onde_en}.']
    if km and ano: s.append(f'It covers {tam(km, "en")} and has been protected since {ano}.')
    elif km: s.append(f'It covers {tam(km, "en")}.')
    elif ano: s.append(f'It has been protected since {ano}.')
    if iu in IUCNF: s.append(IUCNF[iu][1])
    o['en'] = ' '.join(s)
    art = 'El' if (t[5] == 'm' and not es.startswith('Reserva')) or es.startswith(('Parque', 'Santuario', 'Área')) else 'La'
    um = 'un' if t[5] == 'm' or t[7].startswith('área') else 'una'
    s = [f'{art} {es} está {onde_es}.' if es.lower().startswith(t[7]) else f'{art} {es} es {um} {t[7]} {onde_es}.']
    prot = 'protegido' if art == 'El' and not es.startswith('Área') else 'protegida'
    if km and ano: s.append(f'Tiene {tam(km, "es")} y está {prot} desde {ano}.')
    elif km: s.append(f'Tiene {tam(km, "es")}.')
    elif ano: s.append(f'Está {prot} desde {ano}.')
    if iu in IUCNF: s.append(IUCNF[iu][2])
    o['es'] = ' '.join(s)
    return o
def autor(a): return re.sub(r'https?://\S+', '', a or '').strip(' ,;-·')[:70]
def lic(l): return (l or '').replace('Public domain', 'Domínio público')
out = {}; idx = {}; N = {}
for q, x in A.items():
    r = WD.get(q); pais = x[5]
    q_atual[0] = q; pt, en, es, t = nomes(x, r)
    reg = None
    if pais == 'NZ':
        for rl in (r[1].split('¦') if r and r[1] else []):
            if rl in REG: reg = REG[rl]; break
        if q in PVX: reg = REGX[PVX[q]]
    d = {'pv': ['NZ-' + reg[0]] if reg else [pais]}
    if r and r[2]:
        try:
            km = float(r[2]) * UN.get(r[3], 0)
            if km > 0: d['km'] = round(km, 2) if km < 1 else round(km, 1) if km < 100 else round(km)
        except ValueError: pass
    if r and r[4] and not r[4].startswith('-'): d['cr'] = r[4][:4] if r[4][4:10] == '-01-01' else r[4][:10]
    if r and r[5] in IUCNQ: d['iucn'] = IUCNQ[r[5]]
    if r and r[8]: d['site'] = r[8]
    if x[6]: d['wp'] = x[6]
    d['fn'] = 'w'
    if q in KMX: d['km'] = KMX[q]
    if q in CRX:
        if CRX[q]: d['cr'] = CRX[q]
        else: d.pop('cr', None)
    fs = FOTOS.get(str(q)) or []
    if fs: d['f'] = [[f[0], autor(f[1]), lic(f[2])] for f in fs[:5]]
    d['t'] = apresentacao(pt, en, es, t, d, pais, reg); d['ta'] = 1
    if q in S:
        d['t'] = {l: dict(r=d['t'][l], **{k: v for k, v in S[q][l].items() if v}) for l in ('pt', 'en', 'es')}; d.pop('ta')
    arq = 'NZ' if pais == 'NZ' else 'OC'
    out.setdefault(arq, {})[str(q)] = d; idx.setdefault(arq, []).append(q)
for k, v in out.items():
    json.dump(v, open(f'{R}/v1/fichas/{k}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
ip = f'{R}/v1/fichas/indice.json'
I = json.load(open(ip)) if os.path.exists(ip) else {}
I = {k: v for k, v in I.items() if k not in ('NZ', 'OC')}
I.update({k: sorted(v) for k, v in idx.items()})
json.dump(dict(sorted(I.items())), open(ip, 'w'), separators=(',', ':'))
tot = [d for v in out.values() for d in v.values()]
print(len(out), 'arquivos', len(tot), 'áreas', {k: sum(1 for d in tot if k in d) for k in ('km', 'cr', 'iucn', 'f')}, 'seções', len(S))
