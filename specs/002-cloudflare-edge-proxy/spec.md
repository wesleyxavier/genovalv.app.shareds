# Feature Specification: Proxy de Borda Local (Simulação Cloudflare)

**Feature Branch**: `002-cloudflare-edge-proxy`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Incluir um Docker para simular localmente o reverse proxy do Cloudflare (TLS/HTTPS local, headers CF-* e X-Forwarded-*, cache de borda, rate limit e WAF básico), conforme Princípio VI da constitution v1.1.0."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Acesso HTTPS local com headers de borda (Priority: P1)

Como pessoa desenvolvedora, subo o ambiente local e acesso o playground e os apps consumidores por HTTPS, passando por uma camada de borda que se comporta como o Cloudflare em produção, para validar o contrato de borda antes do deploy.

**Why this priority**: Núcleo do valor. Sem TLS e headers de borda, nenhuma outra simulação faz sentido.

**Independent Test**: Subir o ambiente com um único comando, requisitar a URL local por HTTP e HTTPS e inspecionar redirecionamento e headers recebidos pela aplicação de origem.

**Acceptance Scenarios**:

1. **Given** ambiente local iniciado, **When** uma requisição HTTP chega à borda, **Then** é redirecionada para HTTPS.
2. **Given** uma requisição HTTPS válida, **When** ela atinge a origem, **Then** a origem recebe `CF-Connecting-IP`, `CF-Ray`, `CF-IPCountry`, `CF-Visitor`, `X-Forwarded-For`, `X-Forwarded-Proto` e `X-Forwarded-Host` preenchidos.
3. **Given** uma requisição que já traz headers `CF-*` forjados vindos de fora, **When** passa pela borda, **Then** os valores forjados são substituídos pelos valores gerados pela borda.

---

### User Story 2 - Cache de borda para ativos estáticos (Priority: P2)

Como pessoa desenvolvedora, vejo ativos estáticos servidos do cache da borda, para validar políticas de cache e invalidação.

**Why this priority**: Evita surpresas de cache em produção, mas o ambiente funciona sem ele.

**Independent Test**: Requisitar duas vezes o mesmo ativo estático e comparar indicador de cache (miss, depois hit).

**Acceptance Scenarios**:

1. **Given** um ativo estático nunca requisitado, **When** é requisitado, **Then** a resposta indica cache miss.
2. **Given** o mesmo ativo já em cache, **When** é requisitado novamente, **Then** a resposta indica cache hit sem nova chamada à origem.
3. **Given** uma resposta dinâmica (API/HTML autenticado), **When** passa pela borda, **Then** não é armazenada em cache.

---

### User Story 3 - Rate limiting e WAF básico (Priority: P3)

Como pessoa desenvolvedora, exercito limites de taxa e bloqueios básicos localmente, para garantir que os apps tratam respostas 429/403 de forma correta.

**Why this priority**: Complementar; protege e testa comportamento de erro.

**Independent Test**: Enviar rajada de requisições de um mesmo IP e requisições com padrões maliciosos conhecidos e verificar os status devolvidos.

**Acceptance Scenarios**:

1. **Given** limite de taxa configurado, **When** um mesmo IP excede o limite, **Then** recebe resposta 429 até a janela expirar.
2. **Given** regras de WAF básicas ativas, **When** chega método HTTP inválido ou caminho/user-agent malicioso conhecido, **Then** a borda bloqueia a requisição sem alcançar a origem.
3. **Given** tráfego legítimo dentro do limite, **When** é enviado, **Then** nunca é bloqueado.

---

### User Story 4 - Apps ERP e FactoryFloor atrás da borda (Priority: P2)

Como pessoa desenvolvedora, acesso o ERP e o FactoryFloor por hosts locais HTTPS distintos, ambos servidos pela mesma borda, e o FactoryFloor passa a rodar em contêiner como o ERP já roda.

**Why this priority**: Sem as origens reais, a borda só é validada contra o playground.

**Independent Test**: Subir ambiente completo, acessar o host local do ERP e o do FactoryFloor por HTTPS e confirmar que cada um responde via borda com headers de borda e HMR funcionando.

**Acceptance Scenarios**:

1. **Given** ambiente iniciado, **When** acesso o host local do ERP, **Then** a borda encaminha ao ERP e a página carrega por HTTPS.
2. **Given** ambiente iniciado, **When** acesso o host local do FactoryFloor, **Then** a borda encaminha ao FactoryFloor em contêiner e a página carrega por HTTPS.
3. **Given** o FactoryFloor em contêiner, **When** altero um arquivo-fonte, **Then** a atualização aparece no navegador sem reiniciar o contêiner (HMR via borda).
4. **Given** o Admin, **When** acesso sua URL própria, **Then** ele não passa pela borda (fora de escopo).

---

### Edge Cases

- Certificado local ausente ou expirado: ambiente deve falhar com mensagem clara, não subir sem TLS silenciosamente.
- Origem indisponível: a borda devolve erro de gateway claro (502/504), sem expor detalhes internos.
- Porta padrão do host já ocupada: portas são configuráveis sem editar arquivos versionados.
- Requisições WebSocket/HMR do servidor de desenvolvimento devem continuar funcionando através da borda.
- Cabeçalho `X-Forwarded-For` já existente é anexado ao encadeamento, não descartado cegamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O ambiente local DEVE oferecer uma camada de borda dedicada, iniciada junto com os demais serviços de desenvolvimento por um único comando.
- **FR-002**: A borda DEVE terminar HTTPS com certificado de desenvolvimento local e redirecionar HTTP para HTTPS.
- **FR-003**: A borda DEVE injetar `CF-Connecting-IP`, `CF-Ray`, `CF-IPCountry`, `CF-Visitor`, `X-Forwarded-For`, `X-Forwarded-Proto` e `X-Forwarded-Host` e sobrescrever valores `CF-*` vindos do cliente.
- **FR-004**: A borda DEVE armazenar em cache ativos estáticos e expor indicador de cache hit/miss na resposta; respostas dinâmicas NÃO DEVEM ser cacheadas.
- **FR-005**: A borda DEVE aplicar rate limiting por IP com limite e janela configuráveis, respondendo 429 ao exceder.
- **FR-006**: A borda DEVE bloquear requisições com métodos inválidos e padrões maliciosos comuns (paths e user-agents), respondendo 403 sem alcançar a origem.
- **FR-007**: Portas, hosts, limites e caminhos de certificado DEVEM ser configuráveis por variáveis de ambiente com valores padrão seguros.
- **FR-008**: Certificados, chaves privadas e credenciais reais do Cloudflare NÃO DEVEM ser versionados.
- **FR-009**: Dados persistentes (certificados) DEVEM residir em `C:\Docker-Volumes\genova\...`; o cache de borda é efêmero.
- **FR-010**: O comportamento da borda DEVE ser coberto por testes automatizados escritos antes da configuração (redirecionamento, headers, cache hit/miss, 429 e bloqueio WAF).
- **FR-011**: A documentação (README) DEVE declarar que é uma simulação de desenvolvimento, não equivalente funcional ao Cloudflare real.
- **FR-012**: A borda DEVE rotear por host local distinto, no mínimo: ERP, FactoryFloor e playground, usando cada um como origem independente.
- **FR-013**: O app FactoryFloor (`New/FactoryFloor/App/genovalv.app.factoryfloor`) DEVE ser executável em contêiner, seguindo o padrão já usado pelo ERP, com hot reload funcional através da borda.
- **FR-014**: O Admin NÃO DEVE ser roteado pela borda; mantém URL própria.

### Key Entities

- **Regra de borda**: política aplicada às requisições (redirecionamento, injeção de headers, cache, limite, bloqueio), com parâmetros configuráveis.
- **Certificado local**: par certificado/chave de desenvolvimento, gerado localmente e fora do controle de versão.
- **Origem**: serviço atrás da borda (playground, ERP e FactoryFloor) que recebe as requisições já normalizadas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma pessoa nova no projeto sobe o ambiente com borda e acessa o playground por HTTPS em até 5 minutos seguindo apenas o README.
- **SC-002**: 100% das requisições que chegam à origem carregam o conjunto completo de headers de borda definido.
- **SC-003**: Segunda requisição a um ativo estático é servida do cache em 100% dos casos de teste.
- **SC-004**: 100% das requisições acima do limite configurado recebem 429 e 100% das requisições de teste maliciosas conhecidas são bloqueadas, sem bloquear tráfego legítimo dentro do limite.
- **SC-005**: A suíte automatizada de comportamento da borda passa por completo em ambiente limpo.
- **SC-006**: ERP e FactoryFloor abrem por HTTPS em hosts locais distintos via borda, e uma alteração de código no FactoryFloor aparece no navegador em até 5 segundos sem reiniciar contêiner.

## Assumptions

- A tecnologia da borda é definida pela constitution v1.1.0 (Princípio VI) e detalhada em `/speckit-plan`; esta spec foca no comportamento.
- Valores de `CF-IPCountry` e `CF-Ray` são simulados/fixos configuráveis em ambiente local.
- A borda e o roteamento vivem em `New/Shareds/`. O ERP já possui Dockerfile e compose próprios; o FactoryFloor (Nuxt, repositório git próprio) não possui e receberá a dockerização em change separada no repositório dele, após a borda (ordem: Shareds → FactoryFloor).
- Admin tem URL própria e está fora do escopo da borda.
- Docker já está disponível na máquina de desenvolvimento.
- Limites de taxa e regras WAF padrão são valores conservadores de desenvolvimento, ajustáveis.
