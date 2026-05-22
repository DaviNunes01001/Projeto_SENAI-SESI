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
INSERT INTO avaliacao (titulo, nivel, descricao)
VALUES
('Lista básica de Matemática', 'base', 'Questões básicas para estudo de matemática'),
('Lista intermediária de Matemática', 'intermediario', 'Questões intermediárias para estudo de matemática'),
('Lista avançada de Matemática', 'avancado', 'Questões avançadas para estudo de matemática');

INSERT INTO vestibular (nome, ano, instituicao)
VALUES
('ENEM', 2024, 'INEP'),
('Fuvest', 2024, 'USP'),
('Unicamp', 2024, 'UNICAMP');

INSERT INTO subtopico (nome, descricao)
VALUES
('Equação do 1º grau', 'Problemas envolvendo equações lineares'),
('Porcentagem', 'Cálculos com porcentagem, aumento e desconto'),
('Função do 1º grau', 'Estudo de funções lineares'),
('Geometria plana', 'Área, perímetro e figuras planas'),
('Probabilidade', 'Cálculo de chances e eventos');

INSERT INTO questao (
  avaliacao_id,
  vestibular_id,
  subtopico_id,
  enunciado,
  tipo,
  conteudo,
  bloco,
  explicacao,
  comentario_especialista,
  link_explicacao
)
VALUES
(
  1,
  1,
  1,
  'Resolva a equação 2x + 6 = 14.',
  'base',
  'equacao primeiro grau',
  'Álgebra',
  'Subtraindo 6 dos dois lados, temos 2x = 8. Dividindo por 2, x = 4.',
  'Questão simples para praticar isolamento da incógnita.',
  NULL
),
(
  1,
  1,
  2,
  'Um produto custava R$ 200,00 e recebeu desconto de 15%. Qual é o novo preço?',
  'base',
  'porcentagem desconto',
  'Matemática financeira',
  '15% de 200 é 30. Portanto, o novo preço é 200 - 30 = 170.',
  'Boa questão para revisar desconto percentual.',
  NULL
),
(
  2,
  2,
  3,
  'Considere a função f(x) = 3x - 2. Qual é o valor de f(5)?',
  'base',
  'funcao primeiro grau',
  'Funções',
  'Substituindo x por 5: f(5) = 3 · 5 - 2 = 15 - 2 = 13.',
  'Trabalha substituição direta em função.',
  NULL
);

INSERT INTO alternativa (questao_id, letra, texto, correta)
VALUES
-- Questão 1
(1, 'A', 'x = 2', false),
(1, 'B', 'x = 4', true),
(1, 'C', 'x = 6', false),
(1, 'D', 'x = 8', false),
(1, 'E', 'x = 10', false),

-- Questão 2
(2, 'A', 'R$ 150,00', false),
(2, 'B', 'R$ 160,00', false),
(2, 'C', 'R$ 170,00', true),
(2, 'D', 'R$ 180,00', false),
(2, 'E', 'R$ 185,00', false),

-- Questão 3
(3, 'A', '10', false),
(3, 'B', '11', false),
(3, 'C', '12', false),
(3, 'D', '13', true),
(3, 'E', '15', false);
```
