

### :information_source: Instruções Back-end

```bash
# instalar PostgreSQL - Banco de dados principal
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11

# nome do banco de dados Posgres
itapet

# instalar os pacotes e dependências
yarn
```
### :gear:  Configuração do env
Faça uma cópia do arquivo .env.example, renomeie para .env e altere as variáveis de acordo com o seu ambiente.
- Valores necessários para que o projeto funcione
  - APP_SECRET
  - DB_HOST
  - DB_USER
  - DB_PASS
  - DB_NAME
```bash
# criar estrutura do banco de dados Postgres
yarn sequelize db:migrate

# povoar o banco de dados
yarn sequelize db:seed:all

# iniciar servidor da aplicação
yarn dev

```

---
