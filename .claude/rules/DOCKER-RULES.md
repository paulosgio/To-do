## Docker e Docker Compose

Utilize Docker Compose para orquestrar os serviços de frontend, backend e PostgreSQL.

Mantenha as configurações dos serviços em docker-compose.yml.

Utilize Dockerfiles separados para frontend e backend quando apropriado.

Prefira builds em múltiplos estágios para reduzir o tamanho das imagens de produção.

Utilize .dockerignore para excluir node_modules, arquivos de build, .git, arquivos de ambiente locais e arquivos desnecessários.

Utilize volumes nomeados para persistir os dados do PostgreSQL.

Não exponha o PostgreSQL publicamente sem necessidade explícita.

Utilize os nomes dos serviços Docker para comunicação entre contêineres.

Lembre-se de que localhost dentro de um contêiner aponta para o próprio contêiner, não para outro serviço.

Utilize verificações de saúde (health checks) e dependências de inicialização apropriadas.

Não presuma que um contêiner está pronto para uso apenas porque foi iniciado.

Execute as migrations do banco por meio de uma etapa controlada de implantação.

Não exclua volumes de banco de dados nem redefina bancos automaticamente para resolver erros sem autorização.

Utilize usuários sem privilégios de root em imagens de produção sempre que possível.