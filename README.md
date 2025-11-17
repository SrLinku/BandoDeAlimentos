# Banco de Alimentos de Londrina — MVP

Aplicação web para gestão de doações, estoque, doadores e instituições, com dashboards e relatórios. Projeto full‑stack (Node.js + Express + MySQL + HTML/CSS/JS puro com Chart.js).

## 🧭 Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração & Execução](#configuração--execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Páginas](#páginas)
- [API](#api)
- [Banco de Dados](#banco-de-dados)
- [Recursos de UI/UX](#recursos-de-uiux)
- [Boas Práticas e Segurança](#boas-práticas-e-segurança)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Licença](#licença)

## Visão Geral

- **Gestão de Doações**: cadastro de doações e itens doados (com lote/validade).
- **Doadores & Instituições**: CRUD completo com busca por nome e paginação no grid.
- **Estoque**: consolidação por lote e indicadores de risco de vencimento.
- **Relatórios & Dashboard**: KPIs + gráfico de recebimento vs. distribuição (30 dias) com Chart.js.
- **Autenticação**: telas de Login/Cadastro/Esqueci a senha; proteção de páginas com `ensureAuth()` no frontend.
- **Tema Claro/Escuro**: toggle na topbar com persistência simples.
- **Responsivo**: layout com sidebar, topbar e rodapé fixo que respeita o menu lateral.

## Arquitetura e Tecnologias

- **Backend**: Node.js + Express, MySQL (`mysql2/promise`), `dotenv`.
- **Frontend**: HTML5, CSS modular (`theme.css`, `layout.css`, `components.css`), JavaScript vanilla, Chart.js.
- **Dev**: `nodemon` para hot‑reload em desenvolvimento.
- **Configuração**: `.env` com parâmetros de banco/porta.

## Estrutura de Pastas

```
./
  .env
  README.md
  package-lock.json
  package.json
  server.js
  db/
    schema.sql
  node_modules/
    node_modules/.bin/
    node_modules/accepts/
    node_modules/anymatch/
    node_modules/array-flatten/
    node_modules/aws-ssl-profiles/
      node_modules/aws-ssl-profiles/lib/
    node_modules/balanced-match/
      node_modules/balanced-match/.github/
    node_modules/binary-extensions/
    node_modules/body-parser/
      node_modules/body-parser/lib/
    node_modules/brace-expansion/
    node_modules/braces/
      node_modules/braces/lib/
    node_modules/bytes/
    node_modules/call-bind-apply-helpers/
      node_modules/call-bind-apply-helpers/.github/
      node_modules/call-bind-apply-helpers/test/
    node_modules/call-bound/
      node_modules/call-bound/.github/
      node_modules/call-bound/test/
    node_modules/chokidar/
      node_modules/chokidar/lib/
      node_modules/chokidar/types/
    node_modules/concat-map/
      node_modules/concat-map/example/
      node_modules/concat-map/test/
    node_modules/content-disposition/
    node_modules/content-type/
    node_modules/cookie/
    node_modules/cookie-signature/
    node_modules/debug/
      node_modules/debug/src/
    node_modules/denque/
    node_modules/depd/
      node_modules/depd/lib/
    node_modules/destroy/
    node_modules/dotenv/
      node_modules/dotenv/lib/
    node_modules/dunder-proto/
      node_modules/dunder-proto/.github/
      node_modules/dunder-proto/test/
    node_modules/ee-first/
    node_modules/encodeurl/
    node_modules/es-define-property/
      node_modules/es-define-property/.github/
      node_modules/es-define-property/test/
    node_modules/es-errors/
      node_modules/es-errors/.github/
      node_modules/es-errors/test/
    node_modules/es-object-atoms/
      node_modules/es-object-atoms/.github/
      node_modules/es-object-atoms/test/
    node_modules/escape-html/
    node_modules/etag/
    node_modules/express/
      node_modules/express/lib/
    node_modules/fill-range/
    node_modules/finalhandler/
    node_modules/forwarded/
    node_modules/fresh/
    node_modules/function-bind/
      node_modules/function-bind/.github/
      node_modules/function-bind/test/
    node_modules/generate-function/
    node_modules/get-intrinsic/
      node_modules/get-intrinsic/.github/
      node_modules/get-intrinsic/test/
    node_modules/get-proto/
      node_modules/get-proto/.github/
      node_modules/get-proto/test/
    node_modules/glob-parent/
    node_modules/gopd/
      node_modules/gopd/.github/
      node_modules/gopd/test/
    node_modules/has-flag/
    node_modules/has-symbols/
      node_modules/has-symbols/.github/
      node_modules/has-symbols/test/
    node_modules/hasown/
      node_modules/hasown/.github/
    node_modules/http-errors/
    node_modules/iconv-lite/
      node_modules/iconv-lite/encodings/
      node_modules/iconv-lite/lib/
    node_modules/ignore-by-default/
    node_modules/inherits/
    node_modules/ipaddr.js/
      node_modules/ipaddr.js/lib/
    node_modules/is-binary-path/
    node_modules/is-extglob/
    node_modules/is-glob/
    node_modules/is-number/
    node_modules/is-property/
    node_modules/long/
      node_modules/long/umd/
    node_modules/lru-cache/
    node_modules/lru.min/
      node_modules/lru.min/browser/
      node_modules/lru.min/lib/
    node_modules/math-intrinsics/
      node_modules/math-intrinsics/.github/
      node_modules/math-intrinsics/constants/
      node_modules/math-intrinsics/test/
    node_modules/media-typer/
    node_modules/merge-descriptors/
    node_modules/methods/
    node_modules/mime/
      node_modules/mime/src/
    node_modules/mime-db/
    node_modules/mime-types/
    node_modules/minimatch/
    node_modules/ms/
    node_modules/mysql2/
      node_modules/mysql2/lib/
      node_modules/mysql2/node_modules/
      node_modules/mysql2/typings/
    node_modules/named-placeholders/
    node_modules/negotiator/
      node_modules/negotiator/lib/
    node_modules/nodemon/
      node_modules/nodemon/bin/
      node_modules/nodemon/doc/
      node_modules/nodemon/lib/
      node_modules/nodemon/node_modules/
    node_modules/normalize-path/
    node_modules/object-inspect/
      node_modules/object-inspect/.github/
      node_modules/object-inspect/example/
      node_modules/object-inspect/test/
    node_modules/on-finished/
    node_modules/parseurl/
    node_modules/path-to-regexp/
    node_modules/picomatch/
      node_modules/picomatch/lib/
    node_modules/proxy-addr/
    node_modules/pstree.remy/
      node_modules/pstree.remy/lib/
      node_modules/pstree.remy/tests/
    node_modules/qs/
      node_modules/qs/.github/
      node_modules/qs/dist/
      node_modules/qs/lib/
      node_modules/qs/test/
    node_modules/range-parser/
    node_modules/raw-body/
    node_modules/readdirp/
    node_modules/safe-buffer/
    node_modules/safer-buffer/
    node_modules/semver/
      node_modules/semver/bin/
      node_modules/semver/classes/
      node_modules/semver/functions/
      node_modules/semver/internal/
      node_modules/semver/ranges/
    node_modules/send/
      node_modules/send/node_modules/
    node_modules/seq-queue/
      node_modules/seq-queue/lib/
      node_modules/seq-queue/test/
    node_modules/serve-static/
    node_modules/setprototypeof/
      node_modules/setprototypeof/test/
    node_modules/side-channel/
      node_modules/side-channel/.github/
      node_modules/side-channel/test/
    node_modules/side-channel-list/
      node_modules/side-channel-list/.github/
      node_modules/side-channel-list/test/
    node_modules/side-channel-map/
      node_modules/side-channel-map/.github/
      node_modules/side-channel-map/test/
    node_modules/side-channel-weakmap/
      node_modules/side-channel-weakmap/.github/
      node_modules/side-channel-weakmap/test/
    node_modules/simple-update-notifier/
      node_modules/simple-update-notifier/build/
      node_modules/simple-update-notifier/src/
    node_modules/sqlstring/
      node_modules/sqlstring/lib/
    node_modules/statuses/
    node_modules/supports-color/
    node_modules/to-regex-range/
    node_modules/toidentifier/
    node_modules/touch/
      node_modules/touch/bin/
    node_modules/type-is/
    node_modules/undefsafe/
      node_modules/undefsafe/.github/
      node_modules/undefsafe/lib/
    node_modules/unpipe/
    node_modules/utils-merge/
    node_modules/vary/
  public/
    public/css/
      components.css
      layout.css
      theme.css
    public/img/
      logo.png
    public/js/
      app.js
      inicio_charts.js
      relatorios.js
      validation.js
  views/
    cadastro.html
    doacoes.html
    doadores.html
    esqueci.html
    estoque.html
    inicio.html
    instituicoes.html
    login.html
    relatorios.html
```

> _Obs.:_ `node_modules/` omitido para brevidade.

## Configuração & Execução

1. **Pré‑requisitos**: Node 18+, MySQL 8+.
2. **Variáveis de ambiente**: crie `.env` na raiz com:
   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=1234
   DB_NAME=banco_alimentos
   DB_PORT=3306
   PORT=3000
   ```
3. **Instalar dependências**:
   ```bash
   npm install
   ```
4. **Rodar em dev**:

   ```bash
   npm run dev
   ```

   Acesse: http://localhost:${os.environ.get("PORT","3000")}

5. **Produção**:
   ```bash
   npm run start
   ```

## Páginas

- `/inicio` — Dashboard (KPIs e gráfico).
- `/doacoes` — Registro e listagem de doações + itens.
- `/doadores` — CRUD de doadores com busca por nome e paginação.
- `/instituicoes` — CRUD de instituições com busca por nome e paginação.
- `/estoque` — Visão de lotes/validades e filtros.
- `/relatorios` — Painéis com gráficos e tabelas.
- `/cadastro`, `/esqueci` e `/` (login).

## API

A API é servida pelo `server.js`. Endpoints principais:

| Método   | Caminho                                         |
| -------- | ----------------------------------------------- |
| `DELETE` | `/api/doadores/:id`                             |
| `DELETE` | `/api/instituicoes/:id`                         |
| `GET`    | `/`                                             |
| `GET`    | `/api/doacoes`                                  |
| `GET`    | `/api/doadores`                                 |
| `GET`    | `/api/estoque`                                  |
| `GET`    | `/api/instituicoes`                             |
| `GET`    | `/api/itens`                                    |
| `GET`    | `/api/relatorios/alertas`                       |
| `GET`    | `/api/relatorios/alimentos-mais-doados`         |
| `GET`    | `/api/relatorios/distribuicao-tipo-instituicao` |
| `GET`    | `/api/relatorios/distribuicoes-mes`             |
| `GET`    | `/api/relatorios/historico-doa-dist`            |
| `GET`    | `/api/relatorios/mini-grid-instituicoes`        |
| `GET`    | `/api/relatorios/novas-instituicoes`            |
| `GET`    | `/api/relatorios/novos-doadores`                |
| `GET`    | `/api/relatorios/recebimentos-mes`              |
| `GET`    | `/api/relatorios/recebimentos-vs-distribuicoes` |
| `GET`    | `/api/relatorios/risco-lotes`                   |
| `GET`    | `/api/relatorios/total-distribuido`             |
| `GET`    | `/api/relatorios/total-recebido`                |
| `GET`    | `/cadastro`                                     |
| `GET`    | `/doacoes`                                      |
| `GET`    | `/doadores`                                     |
| `GET`    | `/esqueci`                                      |
| `GET`    | `/estoque`                                      |
| `GET`    | `/inicio`                                       |
| `GET`    | `/instituicoes`                                 |
| `GET`    | `/relatorios`                                   |
| `POST`   | `/api/doacoes`                                  |
| `POST`   | `/api/doadores`                                 |
| `POST`   | `/api/instituicoes`                             |
| `POST`   | `/api/login`                                    |
| `POST`   | `/api/signup`                                   |
| `PUT`    | `/api/doadores/:id`                             |
| `PUT`    | `/api/instituicoes/:id`                         |

### Convenções

- **Formato JSON** para request/response.
- **Erros** retornam `{ ok:false, message }` com `status 4xx/5xx`.
- **Filtros**: endpoints de listagem aceitam query strings (ex.: `?nome=...`, `?de=YYYY-MM-DD&ate=...`).

## Banco de Dados

Entidades principais:

- **doadores**: `id, nome, tipo, documento, email, telefone`
- **instituicoes**: `id, nome, tipo, cnpj, email, telefone, endereco`
- **doacoes**: `id, doador_id, data_doacao, observacao`
- **doacao_itens**: `id, doacao_id, item_id, quantidade, unidade, validade, lote`
- **itens**: catálogo de itens doados
- **estoque_lotes**: `item_id, lote, validade, saldo` (visão consolidada usada nos relatórios)

> O servidor utiliza consultas SQL diretas; os relatórios somam itens doados vs. distribuídos e calculam risco por validade (ex.: <= 15 dias).

## Recursos de UI/UX

- **Sidebar responsiva** com ícone hamburguer em telas pequenas.
- **Topbar alinhada à direita** (ícones e avatar).
- **Rodapé** fixa no fim da página, alinhada ao menu lateral.
- **Paginação** para tabelas via JS (classe `.paginacao`).
- **Busca por nome** nas telas de Doadores e Instituições.
- **Chart.js** com `maintainAspectRatio: false` + `min-height` CSS para garantir legibilidade.
- **Dark Mode**: `body.dark` troca tokens de cor.

## Boas Práticas e Segurança

- Nunca commitar senhas reais no `.env`.
- Usar usuário MySQL com privilégios mínimos.
- Validar inputs no backend (alguns campos já são verificados no frontend via `validation.js`).
- Ativar CORS apenas quando necessário.
- Logs de erro no servidor mantêm stack para diagnóstico.

## Troubleshooting

- **`ECONNREFUSED` / banco não conecta**: verifique host/porta e se o MySQL está ativo; teste com `mysql -u root -p`.
- **Porta ocupada (EADDRINUSE)**: altere `PORT` no `.env`.
- **Página pede login**: confirme `ensureAuth()` e cookies/localStorage do navegador.
- **Gráfico não aparece**: garanta `Chart.js` carregado.

## Roadmap

- Controle de usuários e perfis de acesso.
- Exportação CSV/PDF das tabelas.
- Upload em massa de doações.
- Testes automatizados (Jest + Supertest).
- Docker Compose com MySQL.
- Módulo de distribuição para instituições (saídas de estoque).
