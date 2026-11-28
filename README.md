# was-mapa-dados

Arquivos de dados do **Mapa da aventura no mundo** da World Adventure Society (WAS).

Este repositório é público para que os arquivos sejam servidos pela CDN gratuita do jsDelivr:
`https://cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@<versão>/<arquivo>`

Contém só dados geográficos do mapa. Nada de dados pessoais, senhas ou chaves.

## Pasta `v1`

| Arquivo | O que é | Fonte |
|---|---|---|
| mapa-base-natural-earth.json | Continentes, costas, lagos e rios | Natural Earth (domínio público) |
| mapa-batimetria.json | Profundidade dos oceanos | Natural Earth (domínio público) |
| mapa-relevo-oeste.png / mapa-relevo-leste.png | Sombreado de relevo | Terrain Tiles (AWS) |
| mapa-visao-mundial-2048.jpg / -4096.jpg | Imagem do mundo na visão mundial | NASA Blue Marble (domínio público) |
| mapa-areas-protegidas.json | Parques e áreas protegidas | Wikidata (CC0) |
| mapa-rotas.json | Rotas das grandes expedições e rotas históricas (traçado aproximado) | Pesquisa da WAS |
| mapa-divisas-estados.json | Divisas de estados e províncias | Natural Earth (domínio público) |

Cada versão publicada recebe uma tag (v1, v2…). O site aponta sempre para uma tag fixa, então mudar um arquivo aqui não altera o site até a tag nova ser usada.

## Limite de tamanho (jsDelivr)
O jsDelivr só serve commits cujo conjunto de arquivos tenha até 50 MB (acima disso responde 403 "Package size exceeded 50 MB").
Mantenha o repositório abaixo de 45 MB: rode `python3 ferramentas/tamanho.py` antes de cada push.
Fontes brutas (Wikidata, extratos, candidatos de fotos) NÃO entram aqui: ficam em
/mnt/project-files/mapa-aventura/fichas-areas/fontes/ (a pasta `fontes` do repositório é um atalho para lá).
