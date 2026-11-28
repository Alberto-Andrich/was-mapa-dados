# Mede o tamanho do repositório como o jsDelivr vê (arquivos do commit, sem histórico).
# O jsDelivr recusa (403 "Package size exceeded 50 MB") qualquer commit cujo conjunto passe de 50 MB.
# Regra: manter abaixo de 45 MB. Rodar antes de cada push:  python3 ferramentas/tamanho.py
import subprocess,sys,collections
out=subprocess.run(['git','ls-files','-s'],capture_output=True,text=True).stdout.split('\n')
import os
tot=0;por=collections.Counter()
for l in out:
    if not l: continue
    p=l.split('\t',1)[1]
    if os.path.islink(p) or not os.path.isfile(p): continue
    s=os.path.getsize(p);tot+=s;por['/'.join(p.split('/')[:2])]+=s
print('total: %.1f MB (limite do jsDelivr 50 MB; manter < 45 MB)'%(tot/1e6))
for k,v in por.most_common(8): print('  %6.1f MB  %s'%(v/1e6,k))
sys.exit(1 if tot>45e6 else 0)
