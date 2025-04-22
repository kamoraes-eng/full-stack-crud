#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Verificação de Ambiente ===${NC}"

if ! docker info &>/dev/null; then
    echo -e "${RED}× Docker não está rodando ou não está instalado${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Docker está rodando${NC}"
fi

if ! docker-compose ps | grep -q 'Up'; then
    echo -e "${RED}× Containers não estão rodando${NC}"
    echo -e "${YELLOW}Execute: docker-compose up -d${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Containers estão rodando${NC}"
fi

if docker-compose exec -T postgres pg_isready -U postgres &>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL está respondendo${NC}"
else
    echo -e "${RED}× PostgreSQL não está respondendo${NC}"
    exit 1
fi


if docker-compose exec -T redis redis-cli ping | grep -q 'PONG'; then
    echo -e "${GREEN}✓ Redis está respondendo${NC}"
else
    echo -e "${RED}× Redis não está respondendo${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Verificação de Dependências ===${NC}"

check_cmd() {
    if command -v $1 &>/dev/null; then
        echo -e "${GREEN}✓ $1 instalado ($($1 --version 2>&1 | head -n 1))${NC}"
    else
        echo -e "${RED}× $1 não instalado${NC}"
    fi
}

check_cmd node
check_cmd npm
check_cmd git
check_cmd docker
check_cmd docker-compose

echo -e "${YELLOW}=== Verificação Concluída ===${NC}"
