# Camada "Nomes geográficos" (Natural Earth 10m, domínio público) -> v1/mapa-nomes.json
import json,re
from shapely.geometry import shape,mapping
from shapely.ops import polylabel
N='/tmp/ne/'
def cap(s): return s[:1].upper()+s[1:] if s else s
PTBR=[('Gronelândia','Groenlândia'),('Caraíbas','do Caribe'),('Mar das do Caribe','Mar do Caribe'),('Himalaias','Himalaia'),('Canadiano','Canadense'),('Mar Arábico','Mar da Arábia'),('Namibe','Namíbia'),('Irão','Irã'),('Vietname','Vietnã'),('Faroé','Feroe'),('Ilhas Falkland','Ilhas Malvinas'),('Bósforo','Bósforo')]
def br(s):
    if not s: return s
    for a,b in PTBR: s=s.replace(a,b)
    s=re.sub(r'ónia\b','ônia',s);s=re.sub(r'énia\b','ênia',s);s=s.replace('Antárctic','Antártic').replace('Árctic','Ártic')
    return cap(s)
def lago(s,L):
    if not s: return s
    m=re.match(r'Lake (.+)',s) or re.match(r'(.+) Lake$',s)
    if m and L!='en': return ('Lago ' if L=='pt' else 'Lago ')+m.group(1)
    return s
def ponto(g):
    g=shape(g)
    if g.geom_type=='MultiPolygon': g=max(g.geoms,key=lambda p:p.area)
    if g.geom_type=='Polygon':
        try: p=polylabel(g,tolerance=0.05)
        except Exception: p=g.representative_point()
    else: p=g.representative_point() if g.geom_type!='Point' else g
    return [round(p.x,3),round(p.y,3)]
F=[]
def add(t,z,pt,en,es,geom):
    en=cap(en);es=cap(es or en);pt=br(pt or en)
    F.append({'type':'Feature','properties':{'t':t,'z':round(float(z),1),'pt':pt,'en':en,'es':es},'geometry':geom})
# mares e oceanos
MT={'ocean':'o','sea':'m','gulf':'g','bay':'g','strait':'e','channel':'e','sound':'g','fjord':'g','lagoon':'g','inlet':'g','reef':'g','generic':'m','river':None}
for x in json.load(open(N+'ne_10m_geography_marine_polys.geojson'))['features']:
    p=x['properties'];t=MT.get(p['featurecla'])
    if not t or not p.get('name'): continue
    en=p.get('name_en') or p['name']
    if en.isupper(): en=en.title()
    en=re.sub(r'^(North|South) (Atlantic|Pacific) Ocean$',r'\2 Ocean',en)
    z=max(1.2,p['min_label']-(1.6 if t=='o' else 1.5))
    add(t,z,p.get('name_pt'),en,p.get('name_es'),{'type':'Point','coordinates':ponto(x['geometry'])})
# regiões (penínsulas, cordilheiras, desertos...)
RC={'Peninsula':'p','Pen/cape':'p','Isthmus':'p','Range/mtn':'r','Desert':'d','Plateau':'a','Plain':'a','Basin':'a','Lowland':'a','Tundra':'a','Delta':'a','Valley':'a','Depression':'a','Wetlands':'a','Geoarea':'a','Island group':'i','Coast':None}
for x in json.load(open(N+'ne_10m_geography_regions_polys.geojson'))['features']:
    p=x['properties'];t=RC.get(p['FEATURECLA'])
    if not t or not p.get('NAME'): continue
    z=max(1.6,p['MIN_LABEL']-1.3)+(0.6 if t=='a' else 0)
    add(t,z,p.get('NAME_PT'),p.get('NAME_EN') or p['NAME'],p.get('NAME_ES'),{'type':'Point','coordinates':ponto(x['geometry'])})
for x in json.load(open(N+'ne_10m_geography_regions_points.geojson'))['features']:
    p=x['properties'];c=p['featurecla']
    t={'island':'i','cape':'c','waterfall':'w','island group':'i'}.get(c)
    if not t: continue
    z=max(3,(p.get('min_zoom') or 5)-1)
    add(t,z,p.get('name_pt'),p.get('name_en') or p['name'],p.get('name_es'),x['geometry'])
# lagos
for x in json.load(open(N+'ne_10m_lakes.geojson'))['features']:
    p=x['properties']
    if not p.get('name') or p['scalerank']>6: continue
    en=p.get('name_en') or p['name']
    if re.search(r'\bBay\b|Bahía|Baía',en): continue
    pt=p.get('name_pt') or en; es=p.get('name_es') or en
    agua=r'(?i)\b(lake|lago|lagoa|lac|reservoir|represa|reservat|embalse|mar|sea|loch|ozero|see|meer|nuur|hu|co|tso|salar|chott|lagune|laguna|water)\b'
    if not re.search(agua,en): en=(en+' Lake') if en.startswith('Great ') else 'Lake '+en
    if not re.search(agua,pt): pt='Lago '+pt
    if not re.search(agua,es): es='Lago '+es
    z=max(2.4,(p.get('min_label') or 6)-1.5)
    add('l',z,pt,en,es,{'type':'Point','coordinates':ponto(x['geometry'])})
# rios (linhas)
RIO={'Nile':('Nilo','Nilo'),'White Nile':('Nilo Branco','Nilo Blanco'),'Blue Nile':('Nilo Azul','Nilo Azul'),'Albert Nile':('Nilo Alberto','Nilo Alberto'),'Victoria Nile':('Nilo Vitória','Nilo Victoria'),'Mountain Nile':('Bahr el Jebel','Bahr el Jebel'),'Yangtze':('Yangtzé','Yangtsé'),'Yellow':('Rio Amarelo','Río Amarillo'),'Huang':('Rio Amarelo','Río Amarillo'),'Danube':('Danúbio','Danubio'),'Rhine':('Reno','Rin'),'Rhein':('Reno','Rin'),'Seine':('Sena','Sena'),'Dnieper':('Dniepre','Dniéper'),'Indus':('Indo','Indo'),'Euphrates':('Eufrates','Éufrates'),'Tigris':('Tigre','Tigris'),'Zambezi':('Zambeze','Zambeze'),'Niger':('Níger','Níger'),'St. Lawrence':('São Lourenço','San Lorenzo'),'Irtysh':('Irtix','Irtish'),'Yenisey':('Ienissei','Yeniséi'),'Irrawaddy':('Irauádi','Irawadi'),'Rio Grande':('Rio Grande','Río Bravo'),'Amazonas':('Amazonas','Amazonas'),'Thames':('Tâmisa','Támesis'),'Elbe':('Elba','Elba'),'Loire':('Loire','Loira'),'Rhône':('Ródano','Ródano'),'Po':('Pó','Po'),'Tagus':('Tejo','Tajo'),'Douro':('Douro','Duero'),'Ebro':('Ebro','Ebro'),'Jordan':('Jordão','Jordán'),'Ganges':('Ganges','Ganges'),'Volga':('Volga','Volga'),'Orange':('Orange','Orange'),'Oder':('Oder','Óder'),'Vistula':('Vístula','Vístula'),'Dniester':('Dniestre','Dniéster'),'Don':('Don','Don'),'Ural':('Ural','Ural'),'Lena':('Lena','Lena'),'Amur':('Amur','Amur'),'Mekong':('Mekong','Mekong'),'Congo':('Congo','Congo'),'Mississippi':('Mississippi','Misisipi'),'Missouri':('Missouri','Misuri'),'Colorado':('Colorado','Colorado'),'Columbia':('Columbia','Columbia'),'Yukon':('Yukon','Yukón'),'Mackenzie':('Mackenzie','Mackenzie'),'Orinoco':('Orinoco','Orinoco'),'Paraná':('Paraná','Paraná'),'Paraguay':('Paraguai','Paraguay'),'Uruguay':('Uruguai','Uruguay'),'Negro':('Negro','Negro'),'Madeira':('Madeira','Madeira'),'São  Francisco':('São Francisco','São Francisco'),'Brahmaputra':('Brahmaputra','Brahmaputra'),'Salween':('Salween','Salween'),'Ob':('Ob','Obi'),'Murray':('Murray','Murray'),'Darling':('Darling','Darling')}
from shapely.ops import linemerge,unary_union
grp={}
for x in json.load(open(N+'ne_10m_rivers_lake_centerlines.geojson'))['features']:
    p=x['properties']
    if p['featurecla']!='River' or not p.get('name') or p['scalerank']>7: continue
    en=(p.get('name_en') or p['name']).replace('  ',' ')
    if re.search(r'Delta|Branch|Protoka|Canal|Bratul',en): continue
    k=(en,p.get('rivernum') or en)
    g=grp.setdefault(k,{'p':p,'en':en,'gs':[]});g['gs'].append(shape(x['geometry']))
    g['p']=min(g['p'],p,key=lambda q:(q.get('min_label') or 9))
for (en,_),g in grp.items():
    p=g['p'];u=unary_union(g['gs']);m=linemerge(u) if u.geom_type=='MultiLineString' else u
    x={'properties':p,'geometry':mapping(m)}
    pt,es=RIO.get(en,RIO.get(p['name'],(en,en)))
    g2=m.simplify(0.08,preserve_topology=False)
    if g2.is_empty or g2.length<0.6: continue
    gm=mapping(g2)
    def chaikin(c,n=2):
        for _ in range(n):
            o=[c[0]]
            for (x0,y0),(x1,y1) in zip(c,c[1:]): o+= [(0.75*x0+0.25*x1,0.75*y0+0.25*y1),(0.25*x0+0.75*x1,0.25*y0+0.75*y1)]
            o.append(c[-1]);c=o
        return c
    def rnd(c): return [[round(a,3),round(b,3)] for a,b in chaikin(list(c))]
    co=rnd(gm['coordinates']) if gm['type']=='LineString' else [rnd(l) for l in gm['coordinates'] if len(l)>1]
    z=max(2.6,(p.get('min_label') or p.get('min_zoom') or 5)-0.6)
    F.append({'type':'Feature','properties':{'t':'v','z':round(float(z),1),'pt':pt,'en':en,'es':es},'geometry':{'type':gm['type'],'coordinates':co}})
for x in []:
    p=x['properties']
    if p['featurecla']!='River' or not p.get('name') or p['scalerank']>7: continue
    en=(p.get('name_en') or p['name']).replace('  ',' ')
    if re.search(r'Delta|Branch|Protoka|Canal|Bratul',en): continue
    pt,es=RIO.get(en,RIO.get(p['name'],(en,en)))
    g=shape(x['geometry']).simplify(0.02,preserve_topology=False)
    if g.is_empty: continue
    gm=mapping(g)
    def rnd(c): return [[round(a,3),round(b,3)] for a,b in c]
    if gm['type']=='LineString': co=rnd(gm['coordinates'])
    else: co=[rnd(l) for l in gm['coordinates']]
    z=max(3,(p.get('min_label') or p.get('min_zoom') or 5)+0.5)
    F.append({'type':'Feature','properties':{'t':'v','z':round(float(z),1),'pt':pt,'en':en,'es':es},'geometry':{'type':gm['type'],'coordinates':co}})
out={'type':'FeatureCollection','fonte':'Natural Earth 1:10m (domínio público); nomes PT ajustados para o português do Brasil','features':F}
s=json.dumps(out,ensure_ascii=False,separators=(',',':'))
open('/home/user/was-mapa-dados/v1/mapa-nomes.json','w').write(s)
import collections;print(len(F),len(s)//1024,'KB',collections.Counter(f['properties']['t'] for f in F))
