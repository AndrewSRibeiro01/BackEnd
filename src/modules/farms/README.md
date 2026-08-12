# Módulo: farms (placeholder)

Fazendas / propriedades rurais.

Segue a mesma estrutura de camadas do módulo `producers`:
`domain/`, `application/`, `infrastructure/`, `presentation/`.

Regras de negócio previstas:
- Uma fazenda pertence a um produtor (0..N por produtor).
- `área_agricultável + área_de_vegetação <= área_total`.
