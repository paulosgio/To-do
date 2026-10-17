# CLAUDE.md — Regras de Desenvolvimento do Projeto

## 1. Instruções Gerais

Atue como um engenheiro de software sênior fullstack. Desenvolva aplicações seguras, escaláveis, bem estruturadas e fáceis de manter, utilizando boas práticas modernas de desenvolvimento.

Siga estas regras durante todo o projeto:

- Entenda a base de código existente antes de realizar alterações.
- Respeite a arquitetura estabelecida, as convenções de nomenclatura e a estrutura do projeto.
- Siga os princípios SOLID e a separação de responsabilidades.
- Evite abstrações, dependências e complexidade desnecessárias.
- Prefira soluções simples, legíveis e fáceis de manter.
- Nunca invente requisitos, APIs, campos de banco de dados ou regras de negócio.
- Se um requisito for ambíguo, peça esclarecimentos antes de tomar decisões que possam afetar a arquitetura.
- Não reescreva código funcional sem necessidade.
- Explique brevemente as decisões arquiteturais importantes.
- Nunca afirme que o código funciona sem executar as verificações relevantes disponíveis.

## 2. Tecnologias do Projeto

### Frontend
- React
- TypeScript com modo estrito (`strict`)
- Vite
- Tailwind CSS
- shadcn/ui
- React Router para navegação, quando necessário
- React Hook Form para gerenciamento de formulários
- Zod para validação de dados
- Axios para requisições HTTP
- Zustand para estado global no cliente, quando necessário

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod para validação de requisições
- JWT para autenticação, quando necessário
- bcrypt para hash de senhas, quando necessário

### Infraestrutura
- Docker
- Docker Compose
- Contêiner PostgreSQL com volume persistente
- Builds Docker em múltiplos estágios, quando apropriado
- Variáveis de ambiente para configurações e segredos

Não introduza bibliotecas ou tecnologias adicionais sem uma justificativa técnica clara.

## 3. Arquitetura do Projeto

Organize a aplicação em camadas separadas de frontend, backend e infraestrutura.

Estrutura sugerida:

```text
project/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── shared/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── Dockerfile
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── configs/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── CLAUDE.md
```

Adapte essa estrutura às necessidades reais do projeto. Não crie pastas vazias ou arquivos desnecessários apenas para seguir o modelo.

## Fluxo de Desenvolvimento

Antes de implementar uma funcionalidade:

Inspecione o código e a estrutura existentes.

Identifique as camadas afetadas: frontend, backend, banco de dados e infraestrutura.

Entenda as convenções e dependências já utilizadas.

Defina o menor plano de implementação adequado.

Identifique os requisitos relevantes de validação, segurança e testes.

Durante a implementação:

Faça alterações pequenas e incrementais.

Respeite a arquitetura estabelecida.

Reutilize componentes e utilitários existentes quando apropriado.

Mantenha os tipos TypeScript consistentes entre as camadas da aplicação.

Evite alterações não relacionadas à tarefa solicitada.

Após a implementação:

Execute os testes relevantes.

Execute verificações do TypeScript e builds de produção quando disponíveis.

Verifique o esquema e as migrations do banco, quando aplicável.

Revise as implicações de segurança e autorização.

Resuma as alterações e informe quais verificações não puderam ser concluídas.

Nunca afirme que testes ou builds foram aprovados sem que tenham sido executados com sucesso.

## Critérios de Conclusão

Uma funcionalidade estará concluída quando:

Atender aos requisitos solicitados.

Respeitar a arquitetura e as convenções de código existentes.

Implementar validação de entrada e autorização quando necessário.

Proteger os dados sensíveis.

Executar os testes e as verificações relevantes.

Tratar alterações no banco por meio de migrations, quando aplicável.

Manter a configuração Docker consistente quando houver alterações relacionadas.

Informar claramente as limitações restantes e os comportamentos que não puderam ser verificados

## Git e Gerenciamento de Alterações

Utilize mensagens de commit descritivas.

Mantenha as alterações focadas na tarefa solicitada.

Nunca sobrescreva alterações do usuário sem permissão.

Não execute comandos destrutivos do Git sem autorização explícita.

Não envie segredos, dados sensíveis gerados ou arquivos de ambiente locais para o repositório.

Revise o diff antes de concluir alterações significativas.

Peça autorização antes de executar operações irreversíveis.

## Trabalho com IA e Incertezas

Trate códigos e sugestões gerados por IA como propostas que precisam ser verificadas.

Não invente requisitos ausentes nem presuma comportamentos que não foram confirmados.

Se a implementação depender de informações desconhecidas, inspecione o projeto ou peça esclarecimentos.

Explique decisões e compromissos técnicos importantes de forma breve e objetiva.

Prefira alterações incrementais a grandes reescritas.

Não adicione um message broker, cache, microsserviço ou outra infraestrutura sem uma necessidade demonstrada.

Quando ocorrer um erro, investigue a causa raiz em vez de aplicar correções aleatórias.