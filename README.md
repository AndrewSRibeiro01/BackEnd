# Brain Agriculture — Backend

API REST para gestão de produtores rurais, fazendas, safras e culturas plantadas, com dashboard agregado. Frontend em repositório separado (`agro-front`) consome esta API.

## Stack

- **NestJS 10** + **TypeScript 5**
- **PostgreSQL 16** via **TypeORM**
- **class-validator** / **class-transformer** para validação de entrada
- **nestjs-pino** para logs estruturados
- **@nestjs/swagger** para documentação OpenAPI
- **Jest** para testes unitários e e2e
- **Docker Compose** para orquestrar API + banco

## Arquitetura em camadas (Clean Architecture)

Cada módulo em `src/modules/<feature>/` segue a mesma estrutura:

```
producers/, farms/, harvests/, crops/, dashboard/
├─ domain/                # entidades e contratos (puro TS)
│  ├─ entities/           # regras de negócio e invariantes
│  └─ repositories/       # interfaces (nenhuma dependência de framework)
├─ application/           # orquestração dos casos de uso
│  ├─ use-cases/          # 1 caso de uso por arquivo
│  └─ dtos/               # entrada + resposta com class-validator/Swagger
├─ infrastructure/        # adaptadores
│  └─ persistence/        # ORM entities, mappers e implementações concretas
├─ presentation/          # camada de entrega
│  └─ controllers/        # controllers HTTP + Swagger
└─ <feature>.module.ts    # DI wiring
```

**Regra de dependência:** `presentation → application → domain ← infrastructure`.
O `domain` não conhece Nest, TypeORM ou HTTP. `infrastructure` implementa as interfaces do `domain` (Dependency Inversion).

Além dos módulos, `src/shared/` reúne infra transversal: config/env, database, logger, filtros de exceção e validadores reutilizáveis.

## Modelo de domínio

```
Producer 1 ─── N Farm 1 ─── N Harvest 1 ─── N Crop
   │              │             │              │
 CPF/CNPJ    invariante        year        (name único
 único        de áreas       (2000-2100)     por harvest)
```

- **Producer** — 1 por CPF ou CNPJ (validação com dígitos verificadores).
- **Farm** — pertence a um Producer. Value Object `FarmAreas` garante `arableHa + vegetationHa ≤ totalHa`. Estado é uma UF válida.
- **Harvest** — pertence a uma Farm. Único por `(farmId, year)`.
- **Crop** — pertence a uma Harvest. Único por `(harvestId, name)`.
- Deletar em cascata: apagar Producer → apaga Farms → apaga Harvests → apaga Crops.

## Como rodar

### Docker (recomendado)

```bash
cp .env.example .env
docker compose up --build
```

- API em `http://localhost:3000/api`
- Swagger UI em `http://localhost:3000/api/docs`

Para subir apenas o banco e rodar a API no host (dev com hot-reload):

```bash
docker compose up -d postgres
npm install
npm run start:dev
```

### Variáveis de ambiente

Ver `.env.example`. Padrão:

| Variável | Padrão |
|---|---|
| `NODE_ENV` | `development` |
| `PORT` | `3000` |
| `DATABASE_HOST` | `localhost` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_USER` | `agro` |
| `DATABASE_PASSWORD` | `agro` |
| `DATABASE_NAME` | `agro` |

Em dev, TypeORM usa `synchronize: true` — o schema é criado a partir das entities automaticamente. Em produção, isso é desligado e um fluxo de migrations deve ser adotado.

## Endpoints

Prefixo global: `/api`

| Módulo | Rotas |
|---|---|
| Producers | `POST /producers` · `GET /producers` · `GET /producers/:id` · `PATCH /producers/:id` · `DELETE /producers/:id` |
| Farms | `POST /farms` · `GET /farms[?producerId=…]` · `GET /farms/:id` · `PATCH /farms/:id` · `DELETE /farms/:id` |
| Harvests | `POST /harvests` · `GET /harvests[?farmId=…]` · `GET /harvests/:id` · `DELETE /harvests/:id` |
| Crops | `POST /crops` · `GET /crops[?harvestId=…]` · `GET /crops/:id` · `DELETE /crops/:id` |
| Dashboard | `GET /dashboard` |

A especificação **OpenAPI** completa, com schemas e exemplos, fica em `GET /api/docs`.

### Exemplo de fluxo

```bash
# 1) Criar produtor (aceita CPF/CNPJ com ou sem máscara)
curl -X POST http://localhost:3000/api/producers \
  -H "Content-Type: application/json" \
  -d '{"document":"111.444.777-35","name":"João da Silva"}'

# 2) Criar fazenda
curl -X POST http://localhost:3000/api/farms \
  -H "Content-Type: application/json" \
  -d '{"producerId":"<uuid>","name":"Boa Vista","city":"Uberaba","state":"MG","totalHa":100,"arableHa":60,"vegetationHa":40}'

# 3) Criar safra
curl -X POST http://localhost:3000/api/harvests \
  -H "Content-Type: application/json" \
  -d '{"farmId":"<uuid>","year":2024}'

# 4) Registrar cultura na safra
curl -X POST http://localhost:3000/api/crops \
  -H "Content-Type: application/json" \
  -d '{"harvestId":"<uuid>","name":"Soja"}'

# 5) Consultar dashboard
curl http://localhost:3000/api/dashboard
```

### Payload do dashboard

```json
{
  "totalFarms": 3,
  "totalHectares": 350,
  "farmsByState": [{ "label": "MG", "value": 2, "percentage": 66.67 }],
  "cropsByName":  [{ "label": "Soja", "value": 2, "percentage": 50 }],
  "landUse": [
    { "label": "arable",     "hectares": 190, "percentage": 57.58 },
    { "label": "vegetation", "hectares": 140, "percentage": 42.42 }
  ]
}
```

Cada série vem no mesmo formato `{label, value, percentage}`, pronta para alimentar um gráfico de pizza sem transformação.

## Tratamento de erros

Todas as exceções passam por um filtro global que retorna JSON padronizado:

```json
{
  "statusCode": 422,
  "code": "BUSINESS_RULE_VIOLATION",
  "message": "The sum of arable and vegetation areas cannot exceed the total area",
  "path": "/api/farms",
  "timestamp": "2026-08-12T18:30:46.373Z"
}
```

Códigos de domínio:

| HTTP | code | Origem |
|---|---|---|
| 400 | `BAD_REQUEST` | ValidationPipe (formato de DTO) |
| 404 | `ENTITY_NOT_FOUND` | `EntityNotFound` do domínio |
| 409 | `CONFLICT` | `ConflictError` (documento/nome duplicado) |
| 422 | `BUSINESS_RULE_VIOLATION` | `BusinessRuleViolation` (invariantes de domínio) |

## Testes

```bash
npm test              # unitários
npm run test:cov      # unitários + cobertura em coverage/
npm run test:e2e      # end-to-end
```

Cobertura atual: entidades de domínio, validadores, use-cases principais e o dashboard.

## Scripts

- `npm run start:dev` — dev com watch
- `npm run start` — sem watch
- `npm run build` — compila para `dist/`
- `npm test` — testes unitários
- `npm run test:e2e` — testes end-to-end
- `npm run lint` — ESLint com auto-fix

## Observabilidade

Logs estruturados via `nestjs-pino` (JSON em produção, pretty em dev). Erros 5xx são logados com stack pelo filtro global. Cabeçalhos sensíveis (`authorization`, `cookie`) são removidos automaticamente.

## CORS

Habilitado globalmente para permitir o consumo direto pelo frontend em outro origin.
