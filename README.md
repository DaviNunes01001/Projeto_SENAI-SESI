# Projeto SENAI-SESI

Projeto escolar feito em grupo para praticar **React**, **Node.js**, **Express** e **PostgreSQL**.

A ideia do sistema é mostrar e pesquisar questões, tópicos e provas usando uma API conectada ao banco de dados.

## Tecnologias usadas

- React
- Vite
- Node.js
- Express
- PostgreSQL
- JavaScript
- CSS

## O que o projeto faz

- Lista tópicos
- Lista questões
- Pesquisa questões
- Filtra questões por dificuldade
- Filtra questões por vestibular
- Filtra questões por tópico
- Lista provas/questões por ano recente ou antigo
- Conecta o frontend com o backend usando rotas `/api`

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
│   └── app.js
├── package.json
└── README.md
```

## Como rodar o projeto
Primeiro, instale as dependencias:
```bash
npm install
```

depois, crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000

DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=seu_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
```

Rodar o backend:

> nao precisa criar as `tables`, o `database.js` ja vai fazer isso

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

GET /api/topicos
GET /api/questoes

GET /api/pesquisa
GET /api/pesquisa?q=texto
GET /api/pesquisa/dificuldade
GET /api/pesquisa/vestibular
GET /api/pesquisa/topicos
GET /api/pesquisa/ano/recente
GET /api/pesquisa/ano/antigo

GET /api/prova
GET /api/provas
```

## Pesquisa com ou sem acento
A pesquisa foi feita para aceitar palavras com acento ou sem acento.
