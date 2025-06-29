# Sistema de Filas para Emails

## 🚀 Melhorias Implementadas

O sistema agora usa **filas em background** para processar emails, tornando a resposta da API **muito mais rápida**!

### Antes vs Depois:

**❌ Antes (Lento):**
- API aguardava o envio dos 2 emails
- Resposta demorava vários segundos
- Se o servidor de email estivesse lento, a API travava

**✅ Agora (Rápido):**
- API salva o estudante e retorna imediatamente
- Upload de imagem é processado de forma síncrona (para verificação)
- Emails são processados em background
- Resposta muito mais rápida!

## 🔧 Configuração

### 1. Instalar Dependências
```bash
pnpm add @nestjs/bull bull redis
```

### 2. Iniciar Redis
```bash
# Usando Docker (recomendado)
docker-compose up -d redis

# Ou instalar Redis localmente
sudo apt-get install redis-server
```

### 3. Configurar Variáveis de Ambiente
Adicione ao seu `.env`:
```env
# Redis (opcional - usa localhost:6379 por padrão)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📊 Como Funciona

1. **Cliente envia formulário** → API responde imediatamente
2. **Upload de imagem é processado** → De forma síncrona (para verificação)
3. **Emails são adicionados na fila** → Processamento em background
4. **Worker processa a fila** → Envia emails automaticamente
5. **Retry automático** → Se falhar, tenta 3 vezes com delay exponencial

## 🔍 Monitoramento

### Logs do Sistema
```
📧 Emails adicionados na fila para processamento em background
✅ Email de confirmação enviado para: joao@email.com
✅ Notificação enviada para admin: admin@example.com
```

### Endpoints de Monitoramento (Admin)

#### Status das Filas
```bash
GET /queue/status
Authorization: Bearer <seu-token-jwt>
```

**Resposta:**
```json
{
  "email": {
    "waiting": 2,
    "active": 1,
    "completed": 15,
    "failed": 0
  },
  "total": {
    "waiting": 2,
    "active": 1,
    "completed": 15,
    "failed": 0
  }
}
```

#### Detalhes dos Jobs
```bash
GET /queue/jobs
Authorization: Bearer <seu-token-jwt>
```

## 🛠️ Benefícios

- ⚡ **Resposta mais rápida** da API
- 🖼️ **Upload de imagem síncrono** - para verificação adequada
- 📧 **Emails em background** - não bloqueia a resposta
- 🔄 **Retry automático** em caso de falha
- 📈 **Escalabilidade** - pode processar muitos emails
- 🛡️ **Resiliência** - falhas de email não afetam a API
- 📊 **Monitoramento** - acompanhe o status das filas

## 🔄 Fluxo Completo

### Criação de Estudante
1. **Cliente envia POST /student** com imagem
2. **API processa upload** da imagem de forma síncrona
3. **API salva estudante** no banco com URL da imagem
4. **API retorna resposta** imediatamente
5. **Worker envia emails** de confirmação em background

### Atualização de Imagem
1. **Cliente envia PATCH /student/:id/document**
2. **API processa upload** da nova imagem de forma síncrona
3. **API atualiza estudante** com nova URL
4. **API retorna resposta** com dados atualizados

## 🚨 Troubleshooting

### Redis não conecta
```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Ou testar conexão
redis-cli ping
```

### Emails não são enviados
1. Verificar logs do worker
2. Verificar configurações de email no `.env`
3. Verificar se Redis está funcionando
4. Verificar status das filas: `GET /queue/status`

### Performance
- Ajuste o número de workers conforme necessário
- Configure timeouts apropriados
- Monitore o uso de memória do Redis

## 📈 Métricas de Performance

**Antes:**
- Tempo de resposta: 3-10 segundos
- Bloqueio durante envio de emails

**Depois:**
- Tempo de resposta: 1-3 segundos (depende do upload da imagem)
- Processamento assíncrono de emails
- Escalabilidade melhorada 