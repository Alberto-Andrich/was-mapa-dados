"""Acrescenta à camada de áreas protegidas os pontos novos das ilhas do Pacífico (Papua-Nova Guiné, Nova Caledônia, Polinésia Francesa,
Palau, Micronésia, Vanuatu, Pitcairn e mais áreas de Fiji, Samoa, Kiribati, Niue, Cook e Salomão), levantados no Wikidata (CC0).
Entrada: fontes/fichas/pacifico-novos.json ({'p': {q: {...}}, 'cand': {q: [arquivo]}, 'meta': {arquivo: [...]}, 'ex': {q: 'lang|texto'}}).
Saídas: v1/mapa-areas-protegidas.json (linhas novas no fim), fontes/fichas/wikidata-oc.json, fotos-cand-oc.json e extratos-oc.json (mesclados).
Uso: python3 src/pac_novos.py  (depois: fotos_oc_sel.py e fichas_oc.py)"""
import json, os
from urllib.parse import unquote
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); F = f'{R}/fontes/fichas'
N = json.load(open(f'{F}/pacifico-novos.json'))
UN = {'Q712226': 1, 'Q35852': .01, 'Q25343': 1e-6, 'Q81292': .004047}
def km(p):
    try: v = float(p['a']) * UN.get(p['u'], 0)
    except (TypeError, ValueError, KeyError): return 0
    return round(v, 2) if v < 1 else round(v, 1) if v < 100 else round(v)
def tit(u): return unquote(u.split('/wiki/', 1)[1]) if u else ''
lp = f'{R}/v1/mapa-areas-protegidas.json'
L = json.load(open(lp)); ja = {r[0] for r in L}
WD = json.load(open(f'{F}/wikidata-oc.json'))
C = json.load(open(f'{F}/fotos-cand-oc.json'))
EX = json.load(open(f'{F}/extratos-oc.json'))
novos = 0
for q, p in N['p'].items():
    nome = p.get('pt') or p['en']
    wp = f"pt:{tit(p['wppt'])}" if p.get('wppt') else f"en:{tit(p['wpen'])}" if p.get('wpen') else ''
    wp = wp.replace(' ', '_')
    if p['q'] not in ja:
        L.append([p['q'], nome, round(p['lon'], 3), round(p['lat'], 3), p['t'], p['cc'], wp, int(km(p))]); novos += 1
    WD[q] = [q, p.get('adm') or '', p.get('a') or '', p.get('u') or '', p.get('i') or '', p.get('iucn') or '', p.get('imgs') or '',
             p.get('cat') or '', p.get('site') or '', p['en'], p.get('wppt') or '', p.get('wpes') or '', p.get('wpen') or '']
    if N['cand'].get(q): C['cand'][q] = N['cand'][q]
    if N['ex'].get(q): EX[q] = N['ex'][q].split('|', 1)[1]
C['meta'].update(N['meta'])
open(lp, 'w').write('[\n' + ',\n'.join(json.dumps(r, ensure_ascii=False, separators=(',', ':')) for r in L) + '\n]')
for n, d in (('wikidata-oc.json', WD), ('fotos-cand-oc.json', C), ('extratos-oc.json', EX)):
    json.dump(d, open(f'{F}/{n}', 'w'), ensure_ascii=False, separators=(',', ':'))
print('pontos novos na camada', novos, '· total', len(L), '· fichas Pacífico', len(N['p']), '· extratos', len(N['ex']))
