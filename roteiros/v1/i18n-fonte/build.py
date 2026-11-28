import sys,re,json,glob
sys.path.insert(0,'.'); import base_patch
SRC='/home/user/was-mapa-dados/roteiros/v1/'
def entries():
    out=[]
    for f in sorted(glob.glob('ui*.txt')):
        for blk in open(f).read().split('\n@@\n'):
            d={}
            for line in blk.strip('\n').split('\n'):
                k,v=line[:3],line[3:]
                assert k in('PT:','EN:','ES:'),(f,line[:50]); d[k[:2]]=v
            out.append((f,d['PT'],d['EN'],d['ES']))
    return out
pt=base_patch.patch(open(SRC+'roteiros.js').read())
E_=entries()
res={}
for L,ix in (('en',2),('es',3)):
    js=pt; bad=[]
    for e in E_:
        if e[1] not in js: bad.append(e[0]+': '+e[1][:80]); continue
        js=js.replace(e[1],e[ix])
    if bad: print(L,'NAO ACHADOS:\n  '+'\n  '.join(bad))
    res[L]=js
open('out-pt.js','w').write(pt)
for L in res: open(f'out-{L}.js','w').write(res[L])
print('entradas',len(E_))
