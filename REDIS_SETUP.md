# Configuração do Redis para Produção

## 🔍 Onde o Redis é usado no projeto

### 1. **Sistema de Filas (Bull Queue)**
- **Arquivo**: `src/queue/queue.module.ts`
- **Função**: Gerenciar filas de background jobs para emails
- **Uso**: Processar emails em background sem bloquear a API

### 2. **Tipos de Jobs Processados**
- **Email de confirmação**: Enviado para o estudante após inscrição
- **Notificação para admin**: Enviado para o admin sobre nova inscrição  
- **Email de aprovação**: Enviado para o estudante quando aprovado

## 🛠️ Configuração Necessária

### 1. **Variáveis de Ambiente (.env)**
```env
# Redis (já existe - opcional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 2. **Dependências Instaladas**
```bash
# Já instaladas via pnpm
@nestjs/bull
bull
redis
```

## 📍 Onde está configurado no código

### 1. **Configuração Principal** - `src/queue/queue.module.ts`
```typescript
BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
    },
  }),
  inject: [ConfigService],
}),
```

### 2. **Registro das Filas** - `src/queue/queue.module.ts`
```typescript
BullModule.registerQueue({
  name: 'email',
}),
```

### 3. **Processador de Jobs** - `src/queue/email.processor.ts`
```typescript
@Processor('email')
export class EmailProcessor {
  @Process('send-email')
  async handleSendEmail(job: Job<EmailJobData>) {
    // Processa emails em background
  }
}
```

### 4. **Serviço de Filas** - `src/queue/queue.service.ts`
```typescript
@InjectQueue('email') private readonly emailQueue: Queue<EmailJobData>
```

## 🚀 Para Produção

### 1. **Opções de Redis**

#### A) Redis Local (Desenvolvimento)
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### B) Redis Cloud (Produção Recomendado)
```env
REDIS_HOST=seu-redis-cloud.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=sua-senha-redis
REDIS_TLS=true
```

#### C) Redis no Docker (Produção)
```env
REDIS_HOST=redis
REDIS_PORT=6379
```

### 2. **Configuração Atualizada para Produção**
```typescript
// src/queue/queue.module.ts
BullModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
      password: configService.get('REDIS_PASSWORD'), // Para Redis Cloud
      tls: configService.get('REDIS_TLS') === 'true' ? {} : undefined, // Para Redis Cloud
    },
  }),
  inject: [ConfigService],
}),
```

## 📊 Monitoramento

### 1. **Endpoints de Monitoramento**
```bash
# Status das filas
GET /queue/status
Authorization: Bearer <seu-token-jwt>

# Detalhes dos jobs
GET /queue/jobs  
Authorization: Bearer <seu-token-jwt>
```

### 2. **Logs do Sistema**
```
📧 Emails adicionados na fila para processamento em background
✅ Email de confirmação enviado para: joao@email.com
✅ Notificação enviada para admin: admin@example.com
✅ Email de aprovação enviado para: joao@email.com
```

## 🔧 Comandos Úteis

### 1. **Verificar se Redis está rodando**
```bash
# Local
redis-cli ping
# Deve retornar: PONG

# Docker
docker ps | grep redis
```

### 2. **Monitorar filas em tempo real**
```bash
# Acessar Redis CLI
redis-cli

# Ver todas as chaves
KEYS *

# Ver jobs da fila email
LRANGE bull:email:wait 0 -1
```

### 3. **Limpar filas (emergência)**
```bash
# Redis CLI
FLUSHALL

# Ou apenas filas Bull
DEL bull:email:*
```

## 🚨 Troubleshooting

### 1. **Redis não conecta**
```bash
# Verificar se está rodando
redis-cli ping

# Verificar porta
netstat -an | grep 6379

# Verificar logs
docker logs redis_queue
```

### 2. **Jobs não são processados**
1. Verificar se Redis está funcionando
2. Verificar se o worker está rodando
3. Verificar logs do aplicação
4. Verificar status das filas: `GET /queue/status`

### 3. **Performance**
- **Memória**: Redis usa ~50-100MB para filas pequenas
- **CPU**: Baixo uso, apenas para processar jobs
- **Rede**: Baixo tráfego, apenas para comunicação com Redis

## 📈 Benefícios do Redis

- **⚡ Performance**: Emails não bloqueiam a API
- **🔄 Retry automático**: Jobs falhados são tentados novamente
- **📊 Monitoramento**: Visualização do status das filas
- **🛡️ Resiliência**: Falhas de email não afetam a API
- **📈 Escalabilidade**: Pode processar muitos emails simultaneamente

## 🎯 Resumo

**O que precisa para produção:**
1. ✅ Redis rodando (local, cloud ou Docker)
2. ✅ Variáveis de ambiente configuradas
3. ✅ Aplicação conectando no Redis
4. ✅ Workers processando as filas

**Onde está sendo usado:**
- 📧 **Sistema de emails em background**
- 🔄 **Retry automático de jobs falhados**
- 📊 **Monitoramento de filas**
- ⚡ **Performance da API** 