# Feature Specification: Shared Login Foundation & Base Components

**Feature Branch**: `001-shared-login-foundation`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "criação dos esqueleto com ts, ui, components base para tela de login" usando como referência o template HTML (`Genova Cloud — Admin Console • Acesso Restrito`) e o guia visual `DESIGN.md`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estrutura Institucional e Identidade Visual de Autenticação (Priority: P1)

Um administrador ou usuário corporativo acessa a página de autenticação de um portal da plataforma e encontra uma experiência visual limpa, consistente com a identidade `Genova Cloud Console`, composta por cabeçalho institucional com indicador de ambiente seguro, bloco centralizado com identificação do portal (título e subtítulo contextual), cartão de entrada de credenciais, links de apoio e rodapé institucional.

**Why this priority**: Estabelece a casca visual padrão, o posicionamento da marca e os blocos reutilizáveis de layout que sustentam toda a experiência de entrada antes de qualquer lógica específica de formulário.

**Independent Test**: Pode ser validado visual e funcionalmente renderizando os blocos estruturais (cabeçalho, cabeçalho do cartão com contexto, contêiner principal, barra de links auxiliares e rodapé) em tamanhos de tela desktop e mobile sem necessidade de serviço de autenticação ativo.

**Acceptance Scenarios**:

1. **Given** um usuário acessando a tela de login em desktop ou dispositivo móvel, **When** a página é exibida, **Then** o sistema apresenta o cabeçalho superior com a marca, o selo "Ambiente Seguro", o bloco centralizado contendo o cartão principal e o rodapé fixado na base sem rolagem horizontal.
2. **Given** diferentes portais consumidores da mesma base compartilhada (como console administrativo ou portal operacional), **When** o contexto visual é configurado com título, subtítulo e links institucionais próprios, **Then** a estrutura mantém a mesma hierarquia visual, tipografia, cores e espaçamentos alterando apenas os textos e destinos configurados.

---

### User Story 2 - Entrada de Credenciais, Alternância de Senha e Feedback de Submissão (Priority: P1)

Um usuário informa seu e-mail corporativo e sua senha no cartão de autenticação, pode revelar ou ocultar a senha digitada para conferência, opta opcionalmente por lembrar o dispositivo por 30 dias, acessa a opção de recuperação de senha caso necessário e aciona o envio recebendo retorno visual imediato de validação em andamento ou resultado da tentativa.

**Why this priority**: Representa o fluxo central de autenticação que todo usuário executa para entrar na plataforma e evita erros de digitação, envios duplicados ou incerteza sobre o andamento da requisição.

**Independent Test**: Pode ser testado de forma independente preenchendo os campos com entradas válidas e inválidas, alternando a visibilidade da senha, marcando a preferência de dispositivo e simulando o acionamento do envio para verificar validação, bloqueio de duplo envio e retorno visual de estado.

**Acceptance Scenarios**:

1. **Given** um usuário preenchendo o campo de senha, **When** aciona o controle de visibilidade da senha, **Then** os caracteres alternam entre ocultos e visíveis e o indicador visual do controle atualiza de forma correspondente.
2. **Given** um usuário tentando enviar o formulário com e-mail vazio, formato inválido de e-mail ou senha vazia, **When** aciona "Entrar", **Then** o envio é impedido, os campos inválidos exibem foco e mensagem clara de correção e nenhuma solicitação de autenticação é disparada.
3. **Given** um usuário com credenciais preenchidas corretamente, **When** aciona "Entrar", **Then** o botão entra em estado de validação bloqueando cliques repetidos até a conclusão e, em caso de sucesso, exibe confirmação clara de acesso concedido; em caso de falha, restaura o estado interativo exibindo a mensagem de erro sem apagar o e-mail informado.

---

### User Story 3 - Código de Verificação (MFA) e Extensibilidade de Segundo Fator (Priority: P2)

Um usuário sujeito a autenticação multifator insere o código numérico de verificação de 6 dígitos gerado por seu aplicativo autenticador em campo com leitura espaçada e destacada, com suporte estrutural para alternância futura entre métodos de verificação (aplicativo autenticador, chave física ou biometria) quando habilitado pelo portal.

**Why this priority**: O acesso administrativo restrito prevê verificação adicional (MFA); definir o campo, a formatação/validação de 6 dígitos e o contrato de seleção de método já na fundação evita retrabalho futuro na interface de segurança.

**Independent Test**: Pode ser testado de forma isolada inserindo dígitos válidos, tentando inserir letras ou exceder 6 dígitos no campo MFA e verificando a aceitação, formatação e mensagens de validação quando MFA for obrigatório.

**Acceptance Scenarios**:

1. **Given** um portal com verificação MFA ativa, **When** o usuário digita caracteres no campo "Código de Verificação (MFA)", **Then** apenas até 6 dígitos numéricos são aceitos e exibidos com espaçamento que facilita a conferência visual.
2. **Given** um portal que habilita seleção entre métodos de verificação (autenticador, chave física ou biometria), **When** o usuário seleciona um método, **Then** a orientação exibida ao usuário atualiza de acordo com o método escolhido mantendo o mesmo padrão visual de superfície e contraste.

---

### User Story 4 - Regras Compartilhadas de Validação e Acessibilidade (Priority: P2)

Os portais consumidores reutilizam uma mesma biblioteca de regras de validação, normalização de entrada (como remoção de espaços acidentais em e-mail e código de verificação) e padrões de acessibilidade por teclado, garantindo comportamento uniforme de validação e experiência consistente independentemente do portal onde o usuário realiza login.

**Why this priority**: Centralizar validações e normalizações na fundação compartilhada impede divergências entre portais (por exemplo, um portal aceitando entradas que outro rejeita) e garante navegabilidade completa por teclado.

**Independent Test**: Pode ser verificado testando isoladamente as funções de validação/normalização com casos válidos e inválidos e percorrendo toda a tela apenas via teclado (Tab, Shift+Tab, Enter, Espaço).

**Acceptance Scenarios**:

1. **Given** um usuário que digita um e-mail com espaços nas extremidades ou letras maiúsculas, **When** o valor é normalizado e validado antes do envio, **Then** os espaços externos são removidos e o formato é validado de forma consistente em todos os portais.
2. **Given** um usuário navegando exclusivamente por teclado, **When** percorre os campos, o link de recuperação de senha, o botão de exibir senha, a caixa de lembrar dispositivo e o botão "Entrar", **Then** todos os elementos recebem foco visual claro na ordem lógica de leitura e respondem aos comandos padrão de ativação.

---

### Edge Cases

- O que acontece quando o usuário cola um código MFA com espaços (ex.: `123 456`) ou caracteres não numéricos? O sistema deve higienizar espaços/caracteres não numéricos mantendo até 6 dígitos válidos, sem rejeitar a colagem válida com espaço intermediário.
- O que acontece quando o usuário clica repetidamente em "Entrar" durante uma validação em andamento? O controle permanece desabilitado durante o processamento, impedindo múltiplas tentativas simultâneas.
- O que acontece quando o portal não exige MFA para um perfil de usuário específico? O bloco de MFA pode ser ocultado ou marcado como opcional pela configuração do contexto do portal sem quebrar o envio das credenciais principais.
- O que acontece quando a autenticação falha por credencial inválida ou indisponibilidade? Uma mensagem clara de erro é exibida em destaque acessível, o botão retorna ao estado ativo e o campo de senha é limpo ou mantido pronto para correção sem perder o e-mail preenchido.
- Como a tela se comporta em viewports estreitas (mobile) ou com zoom elevado? Os elementos empilham verticalmente com margens consistentes, sem corte de texto nem rolagem horizontal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A fundação compartilhada MUST prover uma base unificada de tokens visuais (cores semânticas, superfícies, tipografia de interface e monoespaçada, espaçamentos, raios de borda e elevações) fiel ao guia `DESIGN.md`.
- **FR-002**: A fundação compartilhada MUST fornecer blocos visuais reutilizáveis e independentes para compor a tela de login: cabeçalho institucional com marca e selo de segurança, contêiner central de autenticação, cartão principal com título/subtítulo configuráveis, links de apoio e rodapé institucional.
- **FR-003**: A estrutura de entrada de credenciais MUST contemplar campo de e-mail corporativo com ícone indicativo, campo de senha com controle de alternância de visibilidade, link de recuperação de senha, opção de lembrar dispositivo por 30 dias e botão principal de envio.
- **FR-004**: O bloco de verificação adicional MUST prover campo dedicado para código de verificação de 6 dígitos com exibição destacada e suporte configurável para exibição opcional/obrigatória e seleção entre métodos de segundo fator.
- **FR-005**: A camada de regras compartilhadas MUST validar formato de e-mail corporativo (com remoção de espaços nas extremidades), obrigatoriedade de senha e formato de código de verificação de 6 dígitos (higienizando espaços de colagem), retornando mensagens claras e padronizadas em português.
- **FR-006**: O acionamento do envio MUST transicionar o estado visual da ação principal para carregamento/validação, impedir múltiplos envios simultâneos enquanto processa e suportar estados finais de sucesso e de erro com recuperação imediata para nova tentativa.
- **FR-007**: Todos os blocos visuais e textos de contexto (nome do portal, subtítulo como "Admin Console • Acesso Restrito", links de "Esqueceu a senha?", "Ajuda", "Políticas de Privacidade", "Status do Sistema", "Termos de Uso", "Segurança", "Suporte" e aviso de copyright) MUST ser parametrizáveis pelos portais consumidores.
- **FR-008**: Todos os controles interativos MUST possuir rótulos associados, atributos de acessibilidade adequados, indicadores de foco visíveis e ordem lógica de navegação por teclado.
- **FR-009**: A fundação compartilhada MUST operar de forma segura sem armazenar segredos, credenciais estáticas ou lógica de emissão própria de tokens, delegando a validação efetiva da autenticação ao fluxo do portal/provedor de identidade consumidor.
- **FR-010**: A fundação compartilhada MUST suportar internacionalização (i18n) por padrão a partir do idioma ativo (`pt-BR` como padrão, com suporte base a `en-US` e `es-ES` e fallback automático para `pt-BR`), traduzindo rótulos, textos de acessibilidade e mensagens de validação, e permitindo sobrescrita contextual pelos portais consumidores.

### Key Entities

- **LoginContextConfiguration**: Descreve a configuração contextual fornecida pelo portal consumidor (nome principal da marca, subtítulo/badge do ambiente, exibição ou obrigatoriedade do campo MFA, texto padrão de ação e URLs dos links institucionais e de suporte).
- **LoginSubmissionInput**: Representa os dados normalizados submetidos pelo usuário na tentativa de acesso (e-mail corporativo, senha, código MFA opcional/obrigatório de 6 dígitos e preferência de lembrar dispositivo por 30 dias).
- **FieldValidationResult**: Representa o resultado da validação por campo e do estado geral do formulário (válido/inválido, mensagens descritivas por campo e estado atual de submissão: ocioso, validando, autenticado ou erro).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos tokens visuais especificados no `DESIGN.md` (paleta de superfícies, cores de marca/erro, famílias tipográficas, escalas de espaçamento e raios) estão representados na base compartilhada e verificáveis por inspeção visual e automatizada.
- **SC-002**: Usuários conseguem preencher credenciais, conferir a senha, inserir código de 6 dígitos e acionar a entrada utilizando apenas teclado em menos de 30 segundos, com 100% dos controles focáveis em ordem lógica.
- **SC-003**: 100% das tentativas com e-mail inválido, campos obrigatórios vazios ou código MFA incompleto (quando obrigatório) são bloqueadas antes do envio com feedback imediato em menos de 100 ms.
- **SC-004**: 0 submissões duplicadas ocorrem quando um usuário aciona repetidamente o botão de entrar durante o estado de processamento.
- **SC-005**: Os componentes base e regras de validação são reutilizados sem duplicação de código visual ou de validação entre os portais da plataforma, exigindo apenas configuração contextual de textos, idioma, links e manipulador de submissão.
- **SC-006**: 100% dos rótulos padrão, mensagens de validação e textos de acessibilidade respondem imediatamente à troca do idioma ativo (`pt-BR`, `en-US`, `es-ES`), com fallback automático para `pt-BR` para chaves ausentes.

## Assumptions

- A fundação compartilhada define o esqueleto estrutural, tokens visuais, regras de validação, dicionários base de i18n e componentes base de interface; a integração efetiva com o provedor de identidade (Auth0 / endpoints de autenticação) é fornecida pelo portal consumidor por meio dos eventos/mecanismos de submissão.
- O idioma padrão é Português do Brasil (`pt-BR`), acompanhado por traduções base em Inglês (`en-US`) e Espanhol (`es-ES`), extensíveis por sobrescrita nos portais consumidores.
- Os dados exemplificativos presentes no HTML de referência (como e-mail e senha pré-preenchidos ou simulação com `setTimeout`) são apenas ilustrativos de protótipo e NÃO devem ir preenchidos como valores reais ou credenciais fixas na implementação.
- A opção "Lembrar este dispositivo por 30 dias" expõe o estado selecionado pelo usuário ao fluxo consumidor, cabendo ao mecanismo de sessão do portal aplicar a duração correspondente.
- O código de MFA é opcional por padrão na configuração genérica da fundação e torna-se obrigatório quando o portal consumidor ativa a exigência de segundo fator no contexto.
