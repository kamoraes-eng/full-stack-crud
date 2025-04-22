# Projeto Fullstack: NestJS + Next.js

Este documento descreve como configurar, executar e avaliar o projeto, seguindo os **Critérios de Avaliação** definidos.

O projeto segue os fundanmentos de abordagem Domain‑Driven Design (DDD) aliado à Clean Architecture (camadas concêntricas). O objetivo é manter o código modular, testável e escalável, permitindo trocar detalhes técnicos (DB, APIs) sem afetar o núcleo de regras de negócio. 

Domínio > Responsabilidade > Conhecimento

infelizmente por tempo de implementacao, como peguei hoje (22) no inicio do dia,
a impl percorre de forma brusca abordando somente o necessario funcional, principalmente no frontend. mas serve de exemplo. 

Visão Geral das Camadas: na arquitetura limpa utilizada, o projeto é dividido em camadas concêntricas (similar à Onion Architecture) ([Structuring a NestJS Project with DDD and Onion Architecture | by Patrick D Paulo Baia Cunha | Medium](https://medium.com/@patrick.cunha336/structuring-a-nestjs-project-with-ddd-and-onion-architecture-65b04b7f2754#:~:text=The%20Domain%20Layer%20represents%20the,core%20contracts%20of%20your%20domain)):

- **Domínio (Domain):** Coração do sistema, contendo as regras de negócio puras (entidades, objetos de valor etc.), **sem dependências de detalhes externos** ([Clean architecture with NestJS. This is my experience with clean… | by Mohit Singh | Medium](https://medium.com/@mohitkumarsingh907/clean-architecture-with-nestjs-632437e699a7#:~:text=,including%20databases)).
- **Aplicação (Application):** Orquestra as operações de negócio (casos de uso), chamando o domínio e mediando interação com outras camadas (por exemplo, repositórios, gateways de APIs) ([Structuring a NestJS Project with DDD and Onion Architecture | by Patrick D Paulo Baia Cunha | Medium](https://medium.com/@patrick.cunha336/structuring-a-nestjs-project-with-ddd-and-onion-architecture-65b04b7f2754#:~:text=Service%20Example%3A%20InvoiceService)).
- **Infraestrutura & Integração (Infrastructure/Integration):** Detalhes técnicos externos – acesso a banco de dados, chamadas a APIs de terceiros, sistemas externos, etc. Aqui vivem os **repositórios** (para BD) e **adapters** de **gateways** (para APIs externas).
- **Apresentação (Presentation):** Interface com o “mundo de fora” – por exemplo, os **Controllers** do NestJS que expõem endpoints HTTP (ou GraphQL, etc.) e consomem os casos de uso da aplicação.


---

## Pré-requisitos

- Node.js ≥ 16
- npm ou pnpm
- Docker e Docker Compose

## Passo a Passo

### 1. Clonar o repositório

```bash
git clone git@github.com:kamoraes-eng/ambev-backend.git
cd ambev-backend
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
# Ajuste as credenciais em .env:
# DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
# REDIS_HOST, REDIS_PORT
# JWT_SECRET, JWT_EXPIRES_IN
```

### 3. Subir containers (Postgres + Redis)

```bash
docker-compose up -d
```

Verificar que os containers estão saudáveis:

```bash
docker-compose ps
```

### 4. Instalar dependências

No backend:
```bash
npm install   # ou pnpm install
```

No frontend (dentro de /frontend):
```bash
cd frontend
npm install
```

### 5. Executar migrações e seed (Backend)

```bash
npm run migration:run
npm run seed   # se disponível
```

### 6. Iniciar a aplicação

#### Backend

```bash
npm run start:dev
# API disponível em http://localhost:3000
```

#### Frontend

```bash
cd frontend
npm run dev
# App disponível em http://localhost:3001
```

### 7. Executar testes automatizados

```bash
npm test            # testes unitários e de integração
npm run test:e2e    # testes end-to-end (se configurados)
```
