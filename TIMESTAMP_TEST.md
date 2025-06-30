# Teste de Timestamps Automáticos

## 🕐 Como Funcionam os Timestamps

O sistema agora configura automaticamente os timestamps `createdAt` e `updatedAt`:

- **`createdAt`**: Definido automaticamente quando o registro é criado
- **`updatedAt`**: Atualizado automaticamente sempre que o registro é modificado

## 🧪 Como Testar

### 1. Criar um Estudante (POST)

```bash
curl -X POST http://localhost:3000/student \
  -F "nome=João Silva" \
  -F "email=joao@email.com" \
  -F "telefone=(11) 99999-9999" \
  -F "dataNascimento=2000-01-01" \
  -F "turma=A" \
  -F "serie=1º ano" \
  -F "turno=Manhã" \
  -F "responsavel=Maria Silva" \
  -F "pizzaPreferida=Margherita"
```

**Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "2000-01-01",
  "turma": "A",
  "serie": "1º ano",
  "turno": "Manhã",
  "responsavel": "Maria Silva",
  "pizzaPreferida": "Margherita",
  "documentosUrl": null,
  "endereco": null,
  "observacoes": null,
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

**Observação:** `createdAt` e `updatedAt` são iguais na criação.

### 2. Atualizar o Estudante (PATCH)

```bash
curl -X PATCH http://localhost:3000/student/1 \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Atualizado",
    "telefone": "(11) 88888-8888"
  }'
```

**Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "email": "joao@email.com",
  "telefone": "(11) 88888-8888",
  "dataNascimento": "2000-01-01",
  "turma": "A",
  "serie": "1º ano",
  "turno": "Manhã",
  "responsavel": "Maria Silva",
  "pizzaPreferida": "Margherita",
  "documentosUrl": null,
  "endereco": null,
  "observacoes": null,
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:35:00.000Z"
}
```

**Observação:** `updatedAt` foi atualizado, mas `createdAt` permanece o mesmo.

### 3. Atualizar com Documento (PATCH)

```bash
curl -X PATCH http://localhost:3000/student/1 \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -F "nome=João Silva com Documento" \
  -F "documentoIdentidade=@/caminho/para/imagem.jpg"
```

**Resposta esperada:**
```json
{
  "id": 1,
  "nome": "João Silva com Documento",
  "email": "joao@email.com",
  "telefone": "(11) 88888-8888",
  "dataNascimento": "2000-01-01",
  "turma": "A",
  "serie": "1º ano",
  "turno": "Manhã",
  "responsavel": "Maria Silva",
  "pizzaPreferida": "Margherita",
  "documentosUrl": "https://res.cloudinary.com/.../imagem.jpg",
  "endereco": null,
  "observacoes": null,
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:40:00.000Z"
}
```

## 🔍 Verificações Importantes

### ✅ Timestamps Automáticos
- `createdAt` é definido apenas na criação
- `updatedAt` é atualizado em qualquer modificação
- Ambos usam timezone UTC
- Formato ISO 8601

### ✅ Comportamento Esperado
1. **Criação**: `createdAt` = `updatedAt`
2. **Primeira atualização**: `createdAt` permanece, `updatedAt` muda
3. **Atualizações subsequentes**: `createdAt` permanece, `updatedAt` sempre atualiza

### ✅ Operações que Atualizam `updatedAt`
- PATCH (qualquer campo)
- Upload de documento
- Qualquer modificação no registro

## 🛠️ Configuração Técnica

### TypeORM Decorators
```typescript
@CreateDateColumn()
createdAt: string;

@UpdateDateColumn()
updatedAt: string;
```

### Configuração Global
```typescript
// src/configOrm.ts
export const configOrm = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    synchronize: true,
    autoLoadEntities: true,
});
```

## 📊 Benefícios

- **🕐 Rastreabilidade**: Saber exatamente quando cada registro foi criado/modificado
- **📈 Auditoria**: Histórico completo de mudanças
- **⚡ Automático**: Zero configuração manual necessária
- **🌍 Timezone**: Consistente com UTC
- **📋 Analytics**: Dados temporais para análise

## 🚨 Troubleshooting

### Timestamps não estão sendo criados
1. Verificar se a entidade tem os decorators `@CreateDateColumn()` e `@UpdateDateColumn()`
2. Verificar se o banco foi sincronizado (`synchronize: true`)
3. Verificar logs do TypeORM

### Timezone incorreto
1. Verificar configuração `timezone: 'UTC'` no configOrm
2. Verificar timezone do servidor
3. Verificar timezone do banco de dados 