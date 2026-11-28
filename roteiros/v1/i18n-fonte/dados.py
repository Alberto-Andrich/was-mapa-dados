import json,glob,re
SRC='/home/user/was-mapa-dados/roteiros/v1/roteiros-dados.js'
DIC={}
for f in ['/mnt/project-files/mapa-aventura/i18n/textos-mapa.json']+glob.glob('/mnt/project-files/mapa-aventura/i18n/dados/*.json'):
    for k,v in json.load(open(f)).items(): DIC.setdefault(k,v)
MAN={
 'Antes de 1500 ao século XVI':('Before 1500 to the 16th century','Antes de 1500 al siglo XVI'),
 'Antiguidade ao século XVI':('Antiquity to the 16th century','De la Antigüedad al siglo XVI'),
 'Desde o século IX':('Since the 9th century','Desde el siglo IX'),
 'Do século II a.C. ao século XV':('2nd century BC to the 15th century','Del siglo II a. C. al siglo XV'),
 'Século VII a.C. ao século II d.C.':('7th century BC to the 2nd century AD','Del siglo VII a. C. al siglo II d. C.'),
 'Séculos XVII e XVIII':('17th and 18th centuries','Siglos XVII y XVIII'),
 'Parques (destaques WAS)':('Parks (WAS highlights)','Parques (destacados WAS)'),
 'Uso livre com crédito':('Free use with credit','Uso libre con crédito'),
}
raw=open(SRC).read(); pre=raw[:raw.index('=')+1]
d=json.loads(raw[raw.index('=')+1:].rstrip().rstrip(';'))
falta={'en':set(),'es':set()}
def tr(s,L):
    if not s or not isinstance(s,str): return s
    if s in MAN: return MAN[s][0 if L=='en' else 1]
    m=re.fullmatch(r'(\d+) a (\d+) m',s)
    if m: return f'{m[1]} to {m[2]} m' if L=='en' else s
    v=DIC.get(s,{}).get(L)
    if v: return v
    if s.endswith('…'):
        ks=[k for k in DIC if k.startswith(s[:-1]) and DIC[k].get(L)]
        if ks: return DIC[ks[0]][L]
    if re.search('[a-zà-ú]{3}',s,re.I) and not re.match(r'^(CC|K2|4x4|No restrictions|Public domain)',s): falta[L].add(s)
    return s
for L in ('en','es'):
    D=json.loads(json.dumps(d))
    for p in D['pts']:
        p['k']=p['n']; 
        if p.get('pa'): p['pa0']=p['pa']
        for f in ['n','pa','r','f','h','dias','prof','fl']:
            if f in p: p[f]=tr(p[f],L)
        if p.get('es'): p['es']=[tr(x,L) for x in p['es']]
    for r in D['rotas']:
        for f in ['n','quem','t','dados','lk','per']:
            if f in r: r[f]=tr(r[f],L)
    D['cats']={k:tr(v,L) for k,v in D['cats'].items()}
    for l in D['layers']:
        l['nome']=tr(l['nome'],L)
        if l.get('dif'): l['dif']={k:tr(v,L) for k,v in l['dif'].items()}
        if l.get('grupos'): l['grupos']={k:tr(v,L) for k,v in l['grupos'].items()}
    open(f'out-dados-{L}.js','w').write(pre+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n')
for L in falta: print(L,sorted(falta[L])[:30])
