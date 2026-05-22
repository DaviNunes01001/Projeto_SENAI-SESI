# Projeto SENAI-SESI

## Estrutura do projeto

```txt
Projeto_SENAI-SESI/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
└── README.md
```

## Como rodar o projeto
Primeiro, instale as dependências:
```bash
npm install
```

Depois, crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000

DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=seu_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
```

Rodar o backend:

> Não precisa criar as `tables`, o `database.js` já vai fazer isso.

```bash
npm run backend
```
O backend vai rodar em: `http://localhost:3000`

Rodar o frontend:
Em outro terminal:
```bash
npm run dev
```

Rotas principais da API:
```
GET /
GET /api

GET /api/questoes
GET /api/questoes/primeiroSelect
GET /api/questoes/segundoSelect/:chave
GET /api/questoes/terceiroSelect
GET /api/questoes/topico/:topicoid
GET /api/questoes/:id

POST /api/questoes
PUT /api/questoes/:id
DELETE /api/questoes/:id

GET /api/pesquisa
GET /api/pesquisa?q=texto
GET /api/pesquisa/dificuldade
GET /api/pesquisa/dificuldade/:nivel
GET /api/pesquisa/vestibular
GET /api/pesquisa/vestibular/:vestibular
GET /api/pesquisa/topicos
GET /api/pesquisa/topicos/:topico
GET /api/pesquisa/ano/recente
GET /api/pesquisa/ano/antigo
```

## Pesquisa com ou sem acento
A pesquisa foi feita para aceitar palavras com acento ou sem acento.
