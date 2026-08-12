# Módulo: producers

Arquitetura em camadas (a implementação real será feita em iterações futuras).

```
producers/
├─ domain/                # regras de negócio puras
│  ├─ entities/           # ex.: Producer
│  └─ repositories/       # contratos (interfaces)
├─ application/           # orquestração — casos de uso
│  ├─ dtos/
│  └─ use-cases/          # ex.: CreateProducer, UpdateProducer, DeleteProducer
├─ infrastructure/        # detalhes técnicos
│  └─ persistence/
│     ├─ entities/        # entidades TypeORM
│     └─ repositories/    # implementações dos contratos do domain
├─ presentation/          # exposição HTTP
│  └─ controllers/
└─ producers.module.ts
```

Regra de dependência: `presentation` → `application` → `domain` ← `infrastructure`.
O `domain` não conhece nenhuma outra camada.
