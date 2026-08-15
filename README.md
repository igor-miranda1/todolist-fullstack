# Todo List Fullstack

Este projeto é uma aplicação de lista de tarefas com frontend em HTML, CSS e JavaScript puro, e backend em Node.js com Express conectando em um banco MySQL.

## Estrutura do projeto

- [backend](backend): API REST e conexão com o banco
- [frontend](frontend): interface do usuário em HTML/CSS/JS
- [Igor](Igor): projeto SQL Server/SQL (.sqlproj)

## Tecnologias e dependências

### Backend
- Node.js
- Express
- MySQL2
- dotenv
- cors
- nodemon
- ESLint

### Frontend
- HTML5
- CSS3
- JavaScript moderno (ES6+)
- Fetch API

### Banco de dados
- MySQL

## Como o backend funciona

O backend fica dentro de [backend/src](backend/src) e expõe endpoints para gerenciar tarefas.

### Arquivos principais
- [backend/src/app.js](backend/src/app.js): configura a aplicação Express e serve o frontend
- [backend/src/server.js](backend/src/server.js): inicia o servidor na porta configurada
- [backend/src/router.js](backend/src/router.js): define as rotas da API
- [backend/src/controllers/tasksControllers.js](backend/src/controllers/tasksControllers.js): recebe a requisição e chama o model
- [backend/src/middlewares/tasksMiddlewares.js](backend/src/middlewares/tasksMiddlewares.js): valida dados antes de salvar
- [backend/src/models/tasksModel.js](backend/src/models/tasksModel.js): executa as queries SQL
- [backend/src/models/connection.js](backend/src/models/connection.js): cria a conexão com o MySQL

### Rotas da API
- GET /tasks
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Banco de dados

A aplicação usa um banco chamado `todolist` e uma tabela chamada `tasks`.

### Estrutura mínima da tabela

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  created_at VARCHAR(45) NOT NULL,
  description VARCHAR(500) NULL
);
```

### Como conectar

1. Instale o MySQL localmente.
2. Crie o banco de dados `todolist`.
3. Crie a tabela `tasks` com o comando acima.
4. Configure o arquivo [backend/.env](backend/.env) com as credenciais do seu ambiente.

Exemplo de configuração:

```env
PORT=3000
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=todolist
```

O arquivo de exemplo está em [backend/.env.example](backend/.env.example).

## Frontend

A interface web está em [frontend/index.html](frontend/index.html), [frontend/styles.css](frontend/styles.css) e [frontend/script.js](frontend/script.js).

Ela consome a API do backend e permite:
- criar tarefas
- listar tarefas
- editar tarefas
- excluir tarefas
- visualizar status e resumo

A página é servida no mesmo servidor do backend, acessível em:

```text
http://localhost:3000
```

## Como rodar o projeto

### 1. Instale as dependências do backend

```bash
cd backend
npm install
```

### 2. Configure o ambiente

Crie o arquivo [.env] no backend com as variáveis do MySQL conforme o exemplo.

### 3. Inicie o backend

```bash
npm run dev
```

### 4. Acesse a aplicação

Abra no navegador:

```text
http://localhost:3000
```

## Observações

- O backend e o frontend foram montados para funcionar juntos em um único servidor local.
- O projeto foi desenvolvido com foco em simplicidade e didática.
- O diretório [frontend](frontend) não exige build tools nem framework para funcionar localmente.
