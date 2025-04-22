# Projeto Fullstack: NestJS + Next.js

Este documento descreve como configurar, executar e avaliar o projeto, seguindo os **Critérios de Avaliação** definidos.

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
