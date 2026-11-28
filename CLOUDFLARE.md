# Dados do Mapa da aventura na Cloudflare: guia completo

Montado em 28/11/2026 por Alberto e Claude. Sem senhas nem tokens: a senha e a confirmação de e-mail da conta ficam só com o Alberto.

## Por que existe
Os dados do mapa (base, relevo, rotas, paradas, fichas das áreas, traduções, fontes do mapa) ficam no repositório público
**github.com/Alberto-Andrich/was-mapa-dados**. Até 28/11 o site lia esses arquivos pelo jsDelivr (cdn.jsdelivr.net/gh/...@SHA),
que recusa qualquer versão do repositório acima de 50 MB (erro 403 "Package size exceeded"). O repositório chegou a 56,9 MB.
A solução definitiva escolhida pelo Alberto: a Cloudflare serve os mesmos arquivos, sem esse limite, de graça.

## O que existe hoje
- **Conta Cloudflare:** do Alberto (plano gratuito). Painel: https://dash.cloudflare.com (ID da conta: a8e942bcee9a0aef78c360b8bca384aa).
- **Tipo:** um **Worker** chamado `was-mapa-dados` (NÃO é um projeto "Pages"; o painel novo da Cloudflare levou para Workers, e funciona igual).
- **Ligação:** o Worker está conectado ao GitHub (Workers Builds) e lê o repositório `Alberto-Andrich/was-mapa-dados`, ramo `main`.
- **Endereço público:** https://was-mapa-dados.albertoandrich.workers.dev
  - Cada arquivo do repositório fica no mesmo caminho. Ex.: https://was-mapa-dados.albertoandrich.workers.dev/v1/rotas-indice.json
- **Publicação:** automática. Cada `git push` no `main` dispara um build e, em cerca de 1 minuto, o arquivo novo está no ar.
  Não há versão fixa (SHA): o site lê sempre o mais novo.
- **Limites do plano gratuito:** até 20 mil arquivos e até 25 MB por arquivo (não há limite de tamanho total como no jsDelivr).
- **Cache:** `Cache-Control: public, max-age=0, must-revalidate` com ETag (o navegador sempre confere se mudou).

## Arquivos de configuração no repositório (não apagar)
- `wrangler.jsonc`: diz que o Worker só serve arquivos estáticos da raiz do repositório.
  ```
  { "name": "was-mapa-dados", "compatibility_date": "2026-11-01",
    "workers_dev": true, "preview_urls": false, "assets": { "directory": "./" } }
  ```
  `workers_dev: true` mantém o endereço .workers.dev ligado a cada build.
- `.assetsignore`: o que NÃO é publicado: `.git`, `.github`, `fontes` (atalho para as fontes brutas, que ficam fora do repositório),
  `src`, `dev`, `ferramentas`, `revisao`, `wrangler.jsonc`, `.assetsignore`, `node_modules`.
- `_headers`: libera o acesso do site aos dados (CORS):
  ```
  /*
    Access-Control-Allow-Origin: *
  ```

## Quem usa (28/11)
- Mapa da aventura v79 (rodapé da página /mundo-was/mapa-da-aventura): tudo pelo Worker.
- Rotas e caminhos: script no rodapé da página põe o `data-src` no Worker (o arquivo embed-v1.html já tem o endereço novo).
- Ainda no jsDelivr (funcionando, commits pequenos): mini-mapa v51, Neste dia na aventura, Radar, quadro de sugestões. Migrar quando forem atualizados.

## Como o Alberto montou (caminho que funcionou)
1. Criou a conta gratuita em dash.cloudflare.com/sign-up (e-mail dele; senha e confirmação com ele).
2. Em **Workers & Pages → Create**, o painel criou um **Worker** ligado ao Git; autorizou o GitHub e escolheu o repositório `was-mapa-dados`.
3. O primeiro build saiu pronto, mas o endereço aparecia como **workers.dev: Disabled / No URLs enabled**.
4. Claude enviou `wrangler.jsonc` + `.assetsignore` + `_headers` ao repositório (novo build, "Ready").
5. Alberto ligou o **workers.dev** no painel do Worker: **Settings → Domains & Routes → workers.dev → Enable**
   (o `workers_dev: true` do wrangler.jsonc também mantém isso ligado).
6. Claude testou do site de teste: todos os arquivos respondem 200, com CORS; o mapa v79 foi publicado no teste.

## Como conferir se está tudo bem
- Abrir https://was-mapa-dados.albertoandrich.workers.dev/v1/rotas-indice.json : deve mostrar o JSON.
- Ver os builds: painel da Cloudflare → **Workers & Pages → was-mapa-dados → Deployments** (ou aba **Builds**).
  Cada push no GitHub aparece ali com o commit; "Success/Ready" = no ar.
- Do site (console do navegador): `fetch('https://was-mapa-dados.albertoandrich.workers.dev/v1/rotas-indice.json').then(r=>r.status)` → 200.

## Se quebrar
- **Build falhou** (aparece "Failed" no painel): abrir o build e ler o log. Causas prováveis: arquivo acima de 25 MB,
  mais de 20 mil arquivos, `wrangler.jsonc` alterado/apagado, atalho `fontes` quebrado (está no `.assetsignore`; não tirar de lá).
  Enquanto o build novo falha, a versão anterior continua no ar.
- **Dado errado no ar:** como não há versão fixa, desfazer = `git revert <commit>` e push; o build recoloca a versão boa em ~1 minuto.
  Também dá para voltar no painel: **Deployments → versão anterior → Rollback** (Alberto).
- **Endereço não responde:** conferir em Settings → Domains & Routes se o workers.dev continua "Enabled".
- **Erro de CORS no site:** conferir se o `_headers` continua na raiz do repositório.
- **Reserva de emergência:** os mesmos arquivos continuam no jsDelivr por commit, desde que o commit tenha menos de 50 MB
  (ex.: cdn.jsdelivr.net/gh/Alberto-Andrich/was-mapa-dados@5791670a8336ab1d32a8e57cf057eeec94f44b01/v1/...). O mapa v78c
  (asset 6b0a3355b1dd22b63c14252c) usa essa reserva; trocar o rodapé do mapa para ele é o "voltar atrás" mais rápido.

## Como refazer do zero (se precisar recriar)
1. dash.cloudflare.com → **Workers & Pages → Create → Import a repository** (ou "Connect to Git").
2. Autorizar o GitHub (app "Cloudflare Workers and Pages") com acesso ao repositório `was-mapa-dados`.
3. Nome do projeto: `was-mapa-dados`; ramo de produção: `main`. Build command: deixar vazio (ou `rm -f fontes`);
   Deploy command: `npx wrangler deploy` (padrão). O `wrangler.jsonc` do repositório faz o resto.
4. Depois do primeiro build: **Settings → Domains & Routes → workers.dev → Enable**.
5. O endereço será `was-mapa-dados.<subdomínio da conta>.workers.dev`. Se mudar, trocar o endereço no mapa
   (const GHB e o endereço do i18n em mapa-aventura-vNN.js) e no rodapé de Rotas e caminhos.
6. Opcional, quando publicar o site oficial: domínio próprio (ex.: dados.worldadventuresociety.org) em
   Settings → Domains & Routes → Add → Custom domain (exige o DNS do domínio na Cloudflare ou um CNAME; decisão do Alberto).

## Regras para quem mexe no repositório
- Testar antes de cada push: dado quebrado aparece no site em ~1 minuto.
- Fontes brutas (Wikidata, extratos, candidatos de fotos) ficam fora do repositório, em /mnt/project-files/mapa-aventura/fichas-areas/fontes/.
- Não mexer em `wrangler.jsonc`, `.assetsignore` e `_headers` sem combinar.
- `python3 ferramentas/tamanho.py` continua útil para ver o peso do repositório (o limite de 45 MB era do jsDelivr; hoje só importa para a reserva).
