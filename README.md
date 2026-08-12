# Backend — Brain Agriculture

API REST em **NestJS + TypeScript** com **arquitetura em camadas** por módulo.

## Estrutura de pastas

```
src/
├─ main.ts                        # bootstrap (Swagger, ValidationPipe, logger)
├─ app.module.ts                  # composição raiz
├─ shared/                        # infra transversal
│  ├─ config/                     # validação de env
│  ├─ database/                   # TypeOrmModule
│  ├─ logger/                     # nestjs-pino
│  ├─ filters/                    # exception filters
│  └─ validation/                 # validadores reutilizáveis (CPF/CNPJ, etc.)
└─ modules/
   ├─ producers/                  # produtor rural
   │  ├─ domain/                  # entidades e contratos de repositório
   │  ├─ application/             # casos de uso + DTOs
   │  ├─ infrastructure/          # implementações (TypeORM)
   │  └─ presentation/            # controllers HTTP
   ├─ farms/                      # (placeholder) propriedades rurais
   ├─ harvests/                   # (placeholder) safras
   ├─ crops/                      # (placeholder) culturas plantadas
   └─ dashboard/                  # (placeholder) endpoints agregados
```

Regra de dependência dentro de cada módulo:
`presentation → application → domain ← infrastructure`.

## Como rodar

```bash
cp .env.example .env
npm install
npm run start:dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

Com Docker (na raiz do repositório):

```bash
docker compose up --build
```

## Scripts

- `npm run start:dev` — dev com watch
- `npm run build` — compila para `dist/`
- `npm test` — testes unitários
- `npm run test:e2e` — testes end-to-end
- `npm run lint` — lint + fix

## Observabilidade

Logs estruturados via `nestjs-pino` (JSON em produção, pretty em dev).
Cabeçalhos sensíveis (`authorization`, `cookie`) são removidos automaticamente.
# BackEnd
# BackEnd
