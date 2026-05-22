# Projeto SENAI-SESI

## Estrutura do projeto

```txt
Projeto_SENAI-SESI/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
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

## Minimo de dados para o SQL(pgAdmin4), so roda direto

```SQL
WITH
av_base AS (
  INSERT INTO avaliacao (titulo, nivel, descricao)
  VALUES ('Teste Base', 'base', 'Questao de nivel base')
  RETURNING id
),
av_intermediario AS (
  INSERT INTO avaliacao (titulo, nivel, descricao)
  VALUES ('Teste Intermediario', 'intermediario', 'Questao de nivel intermediario')
  RETURNING id
),
av_avancado AS (
  INSERT INTO avaliacao (titulo, nivel, descricao)
  VALUES ('Teste Avancado', 'avancado', 'Questao de nivel avancado')
  RETURNING id
),
vest AS (
  INSERT INTO vestibular (nome, ano, instituicao)
  VALUES ('ENEM', 2024, 'INEP')
  RETURNING id
),
sub AS (
  INSERT INTO subtopico (nome, descricao)
  VALUES ('Geometria', 'Questoes de geometria')
  RETURNING id
),
q_base AS (
  INSERT INTO questao (
    avaliacao_id, vestibular_id, subtopico_id,
    enunciado, tipo, conteudo, explicacao
  )
  SELECT av_base.id, vest.id, sub.id,
    'Qual é a área de um quadrado de lado 5?',
    'base',
    'Area do quadrado',
    'A área do quadrado é lado vezes lado: 5 x 5 = 25.'
  FROM av_base, vest, sub
  RETURNING id
),
q_inter AS (
  INSERT INTO questao (
    avaliacao_id, vestibular_id, subtopico_id,
    enunciado, tipo, conteudo, explicacao
  )
  SELECT av_intermediario.id, vest.id, sub.id,
    'Um triângulo tem base 10 e altura 6. Qual é sua área?',
    'base',
    'Area do triangulo',
    'A área do triângulo é base vezes altura dividido por 2: 10 x 6 / 2 = 30.'
  FROM av_intermediario, vest, sub
  RETURNING id
),
q_avanc AS (
  INSERT INTO questao (
    avaliacao_id, vestibular_id, subtopico_id,
    enunciado, tipo, conteudo, explicacao
  )
  SELECT av_avancado.id, vest.id, sub.id,
    'Se o raio de uma circunferência é 3, qual é a área em função de pi?',
    'base',
    'Area do circulo',
    'A área do círculo é pi vezes raio ao quadrado: pi x 3² = 9pi.'
  FROM av_avancado, vest, sub
  RETURNING id
)
INSERT INTO alternativa (questao_id, letra, texto, correta)
SELECT id, 'A', '20', false FROM q_base
UNION ALL SELECT id, 'B', '25', true FROM q_base
UNION ALL SELECT id, 'C', '30', false FROM q_base
UNION ALL SELECT id, 'A', '30', true FROM q_inter
UNION ALL SELECT id, 'B', '60', false FROM q_inter
UNION ALL SELECT id, 'C', '15', false FROM q_inter
UNION ALL SELECT id, 'A', '6pi', false FROM q_avanc
UNION ALL SELECT id, 'B', '9pi', true FROM q_avanc
UNION ALL SELECT id, 'C', '12pi', false FROM q_avanc;
```
