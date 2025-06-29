# Documentação das Rotas da API

## Rotas Públicas (Sem Autenticação)

### Autenticação
- `POST /auth/signup` - Cadastro de usuário comum
- `POST /auth/signup-admin` - Cadastro do primeiro administrador (só funciona se não houver usuários no sistema)
- `POST /auth/login` - Login de usuário

### Formulários
- `POST /student` - Envio de formulário de estudante (público para permitir inscrições)

## Rotas Protegidas (Requerem Autenticação)

### Perfil do Usuário
- `GET /auth/profile` - Obter dados do usuário logado (qualquer usuário autenticado)

## Rotas de Administrador (Requerem role 'admin')

### Gerenciamento de Usuários
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário
- `GET /users/:id` - Obter usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Gerenciamento de Estudantes
- `GET /student` - Listar todos os estudantes
- `GET /student/:id` - Obter estudante específico
- `PATCH /student/:id` - Atualizar dados do estudante
- `PATCH /student/:id/document` - Atualizar documento do estudante
- `DELETE /student/:id` - Deletar estudante

### Monitoramento de Filas (Sistema de Background Jobs)
- `GET /queue/status` - Status da fila de emails
- `GET /queue/jobs` - Detalhes dos jobs de email em processamento

## Como Usar

### 1. Criar o Primeiro Administrador
```bash
POST /auth/signup-admin
{
  "username": "admin",
  "password": "senha123"
}
```

### 2. Fazer Login
```bash
POST /auth/login
{
  "username": "admin",
  "password": "senha123"
}
```

### 3. Usar o Token JWT
Incluir o token no header das requisições:
```
Authorization: Bearer <seu-token-jwt>
```

### 4. Enviar Formulário (Público)
```bash
POST /student
Content-Type: multipart/form-data
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "2000-01-01",
  "turma": "A",
  "serie": "1º ano",
  "turno": "Manhã",
  "responsavel": "Maria Silva",
  "pizzaPreferida": "Margherita",
  "documentoIdentidade": <arquivo>
}
```

**Nota**: Após o envio do formulário, o sistema:
- **Processa upload da imagem** de forma síncrona (para verificação)
- **Salva o estudante** no banco com URL da imagem
- **Responde imediatamente** (sem aguardar emails)
- **Envia emails em background** automaticamente

### 5. Monitorar Filas (Admin)
```bash
# Status da fila de emails
GET /queue/status
Authorization: Bearer <seu-token-jwt>

# Detalhes dos jobs de email
GET /queue/jobs
Authorization: Bearer <seu-token-jwt>
```

## Configuração do Ambiente

Certifique-se de que o arquivo `.env` contenha:

### Configurações JWT
```
JWT_SECRET=sua-chave-secreta-aqui
```

### Configurações de Email
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
ADMIN_EMAIL=admin@example.com
```

### Configurações Redis (Opcional)
```
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Configurações Cloudinary
```
CLOUD_NAME=seu-cloud-name
CLOUD_API_KEY=sua-api-key
CLOUD_API_SECRET=sua-api-secret
```

### Configurações para Gmail
Para usar Gmail, você precisa:
1. Ativar autenticação de 2 fatores
2. Gerar uma "Senha de App" específica
3. Usar essa senha no campo `EMAIL_PASS`

## Observações

- O endpoint `/auth/signup-admin` só funciona se não houver usuários no sistema
- Usuários criados via `/auth/signup` recebem automaticamente a role 'user'
- Apenas usuários com role 'admin' podem acessar as rotas administrativas
- O token JWT expira em 1 dia
- Senhas são hasheadas com bcrypt antes de serem salvas no banco
- **Upload de imagem é processado de forma síncrona** para verificação adequada
- **Emails são processados em background** - a API responde imediatamente após o upload
- Se o processamento de email falhar, a inscrição ainda é salva (não falha o processo)
- O sistema usa Redis para gerenciar as filas de background jobs 