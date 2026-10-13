# Aplicação web com Apache e Docker Compose

Lista de tarefas em HTML, CSS e JavaScript, servida pelo Apache httpd.
Permite adicionar, concluir, filtrar e excluir tarefas. Os dados são persistidos
em localStorage por navegador e endereço de acesso. Não há backend, banco de
dados compartilhado ou sincronização entre usuários.

## Estrutura

- docker-compose.yml: define o serviço Apache.
- app/index.html: página da aplicação.
- app/style.css: estilos responsivos.
- app/app.js: funcionalidades e armazenamento no navegador.

## Executar

Instale o Docker com o plugin Docker Compose (Docker Desktop já inclui ambos).
Abra um terminal na pasta que contém docker-compose.yml:

Para obter o projeto:

```sh
git clone https://github.com/BigodeMarine/Container-Aplica-o-WEB.git
cd Container-Aplica-o-WEB
```

```sh
docker compose config
docker compose up -d
docker compose ps
```

Acesse http://localhost:8080 no navegador.

O volume `./app:/usr/local/apache2/htdocs:ro` mapeia a pasta local da aplicação
para o diretório público do Apache, em modo somente leitura.
A porta 8080 do computador encaminha as requisições à porta 80 do container.
A imagem oficial `httpd:2.4-alpine` fornece o servidor Apache.

Verifique a resposta HTTP:

```sh
curl -I http://localhost:8080
docker compose logs apache
```

Adicione uma tarefa, marque-a como concluída e teste os filtros. Recarregue
a página para verificar a persistência e depois exclua a tarefa.
Se localStorage estiver indisponível, a aplicação informa que não conseguiu salvar.

Para parar:

```sh
docker compose down
```

As tarefas permanecem no navegador. Se a porta 8080 estiver ocupada, altere
o mapeamento para "8081:80" e acesse http://localhost:8081.
Portas diferentes possuem armazenamentos separados no navegador.

Se houver erro HTTP 403 em Linux, confira se o Apache pode ler o volume:

```sh
chmod 755 app
chmod 644 app/*
```

## Validação realizada

O projeto foi executado com Docker Compose e Apache retornou HTTP 200.
No Chromium, foram verificados adicionar, concluir, filtrar, excluir,
persistir após recarregar, exibir conteúdo digitado como texto e não ultrapassar
a largura da tela de 375 pixels. A sintaxe JavaScript e o YML também foram validados.

ush -u origin main
```

Publicar os arquivos no GitHub não executa o container. Para executar em outro
computador, clone o repositório e rode `docker compose up -d`.
