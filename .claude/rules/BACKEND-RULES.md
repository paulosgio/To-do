## Arquitetura do Backend

Siga o fluxo de requisições:

Rotas → Middlewares → Controller → Service → Repository → Banco de dados

Rotas

Defina os endpoints HTTP e seus middlewares.

Mantenha os arquivos de rotas focados no roteamento e na configuração.

Aplique middlewares de autenticação e autorização quando necessário.

Não implemente regras de negócio diretamente nas definições das rotas.

Controllers

Gerencie as requisições e respostas HTTP.

Extraia os dados de entrada já validados.

Chame o serviço correspondente.

Retorne códigos de status HTTP e formatos de resposta consistentes.

Não acesse o Prisma diretamente.

Não implemente regras de negócio nos controllers.

Services

Contenha as regras de negócio e a lógica da aplicação.

Coordene as operações dos repositórios.

Valide restrições de negócio que não possam ser expressas apenas pelos esquemas de requisição.

Lance erros de aplicação com mensagens e tipos significativos.

Não dependa diretamente dos objetos de requisição e resposta do Express.

Repositories

Encapsule o acesso ao banco de dados.

Utilize Prisma para executar operações no banco.

Mantenha as consultas ao banco fora dos controllers e services sempre que possível.

Retorne os dados necessários à aplicação sem expor informações desnecessárias do banco.

Utilize transações quando várias operações precisarem ser concluídas com sucesso ou revertidas em conjunto.

DTOs e validação

Defina DTOs para os contratos relevantes de requisição e resposta.

Valide dados não confiáveis utilizando Zod.

Nunca confie em IDs, funções de usuário, informações de propriedade ou permissões fornecidas pelo cliente.

Evite retornar registros brutos do banco quando contiverem informações sensíveis.

Exclua explicitamente senhas, hashes de senhas, tokens e outros dados sensíveis das respostas públicas.

Gerenciamento de dependências

Prefira injeção de dependências quando isso melhorar a testabilidade e a separação de responsabilidades.

Evite estado global desnecessário e acoplamento excessivo entre classes.

Utilize interfaces ou abstrações quando proporcionarem limites claros entre os módulos.

Não crie interfaces para todas as classes sem um benefício concreto.

Centralize a configuração do banco e reutilize um único cliente Prisma devidamente configurado por processo da aplicação.

## Princípios SOLID

Aplique os princípios SOLID de forma prática:

S — Responsabilidade Única: cada classe, módulo ou componente deve ter uma responsabilidade clara.

O — Aberto/Fechado: permita estender comportamentos sem modificar desnecessariamente código estável.

L — Substituição de Liskov: as implementações devem respeitar os contratos de suas abstrações.

I — Segregação de Interfaces: evite obrigar módulos a depender de métodos que não utilizam.

D — Inversão de Dependência: a lógica de alto nível não deve depender desnecessariamente de implementações de baixo nível.

Não complique projetos pequenos com abstrações excessivas. Utilize-as quando melhorarem a clareza, a testabilidade ou a manutenção.

## Banco de Dados e Prisma

Utilize PostgreSQL como banco de dados relacional.

Utilize Prisma para gerenciamento do esquema e acesso aos dados.

Defina tipos de campos, relacionamentos, restrições de unicidade e índices apropriados.

Utilize chaves estrangeiras e restrições do banco para proteger a integridade dos dados.

Utilize migrations para alterações no esquema.

Não altere manualmente o esquema do banco de produção.

Nunca execute operações destrutivas no esquema de um banco existente sem autorização explícita.

Gere o Prisma Client quando necessário após alterações no esquema ou no gerador.

Utilize transações para operações que exijam atomicidade.

Implemente paginação para coleções potencialmente grandes.

Evite consultas N+1 e requisições desnecessárias ao banco.

Implemente regras de propriedade e autorização no backend.

Armazene datas de maneira consistente e defina o comportamento de fuso horário quando necessário.

## Autenticação e Segurança

Quando houver necessidade de autenticação:

Utilize bcrypt ou um algoritmo seguro apropriado para gerar hashes de senhas.

Nunca armazene senhas em texto puro.

Nunca retorne hashes de senhas nas respostas da API.

Verifique a assinatura, a expiração e as informações obrigatórias dos JWTs.

Mantenha segredos em variáveis de ambiente.

Valide e trate adequadamente dados não confiáveis.

Aplique verificações de autenticação e autorização nas operações protegidas.

Verifique a propriedade dos recursos para evitar acesso indevido a dados de outros usuários.

Configure o CORS explicitamente para as origens permitidas do frontend.

Utilize cabeçalhos de segurança e limitação de requisições quando apropriado.

Evite expor rastreamentos de erros, detalhes internos do banco ou segredos aos clientes.

Nunca envie arquivos .env com credenciais reais para o controle de versão.

Autenticação não substitui autorização. Um usuário autenticado não deve receber automaticamente acesso aos recursos de outros usuários.