# Como Testar o Endpoint POST /student

## Usando cURL

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
  -F "pizzaPreferida=Margherita" \
  -F "endereco=Rua das Flores, 123" \
  -F "observacoes=Estudante dedicado" \
  -F "documentoIdentidade=@/caminho/para/sua/imagem.jpg"
```

## Como Testar o Endpoint PATCH /student/:id

### Atualizar apenas dados (sem arquivo)
```bash
curl -X PATCH http://localhost:3000/student/1 \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Atualizado",
    "telefone": "(11) 88888-8888",
    "turma": "B"
  }'
```

### Atualizar dados e documento
```bash
curl -X PATCH http://localhost:3000/student/1 \
  -H "Authorization: Bearer <seu-token-jwt>" \
  -F "nome=João Silva Atualizado" \
  -F "telefone=(11) 88888-8888" \
  -F "turma=B" \
  -F "documentoIdentidade=@/caminho/para/nova/imagem.jpg"
```

## Como Testar o Endpoint PATCH /student/:id/approve

### Aprovar um Estudante
```bash
curl -X PATCH http://localhost:3000/student/1/approve \
  -H "Authorization: Bearer <seu-token-jwt>"
```

### Verificar Status de Aprovação
```bash
curl -X GET http://localhost:3000/student/1 \
  -H "Authorization: Bearer <seu-token-jwt>"
```

## Usando Postman

### POST /student
1. **Método**: POST
2. **URL**: `http://localhost:3000/student`
3. **Body**: Form-data
4. **Campos**:
   - `nome` (text): João Silva
   - `email` (text): joao@email.com
   - `telefone` (text): (11) 99999-9999
   - `dataNascimento` (text): 2000-01-01
   - `turma` (text): A
   - `serie` (text): 1º ano
   - `turno` (text): Manhã
   - `responsavel` (text): Maria Silva
   - `pizzaPreferida` (text): Margherita
   - `endereco` (text): Rua das Flores, 123 (opcional)
   - `observacoes` (text): Estudante dedicado (opcional)
   - `documentoIdentidade` (file): Selecione uma imagem

### PATCH /student/:id
1. **Método**: PATCH
2. **URL**: `http://localhost:3000/student/1`
3. **Headers**: 
   - `Authorization: Bearer <seu-token-jwt>`
4. **Body**: Form-data (para incluir arquivo) ou JSON (apenas dados)
5. **Campos** (opcionais):
   - `nome` (text): João Silva Atualizado
   - `telefone` (text): (11) 88888-8888
   - `turma` (text): B
   - `documentoIdentidade` (file): Nova imagem (opcional)

### PATCH /student/:id/approve
1. **Método**: PATCH
2. **URL**: `http://localhost:3000/student/1/approve`
3. **Headers**: 
   - `Authorization: Bearer <seu-token-jwt>`
4. **Body**: Vazio (não precisa de body)

## Usando JavaScript/Fetch

### POST /student
```javascript
const formData = new FormData();
formData.append('nome', 'João Silva');
formData.append('email', 'joao@email.com');
formData.append('telefone', '(11) 99999-9999');
formData.append('dataNascimento', '2000-01-01');
formData.append('turma', 'A');
formData.append('serie', '1º ano');
formData.append('turno', 'Manhã');
formData.append('responsavel', 'Maria Silva');
formData.append('pizzaPreferida', 'Margherita');
formData.append('endereco', 'Rua das Flores, 123');
formData.append('observacoes', 'Estudante dedicado');

// Adicionar arquivo (se houver)
const fileInput = document.getElementById('fileInput');
if (fileInput.files[0]) {
  formData.append('documentoIdentidade', fileInput.files[0]);
}

fetch('http://localhost:3000/student', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log('Sucesso:', data))
.catch(error => console.error('Erro:', error));
```

### PATCH /student/:id
```javascript
// Atualizar apenas dados
fetch('http://localhost:3000/student/1', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <seu-token-jwt>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'João Silva Atualizado',
    telefone: '(11) 88888-8888',
    turma: 'B'
  })
})
.then(response => response.json())
.then(data => console.log('Sucesso:', data))
.catch(error => console.error('Erro:', error));

// Atualizar dados e documento
const updateFormData = new FormData();
updateFormData.append('nome', 'João Silva Atualizado');
updateFormData.append('telefone', '(11) 88888-8888');
updateFormData.append('turma', 'B');

// Adicionar novo arquivo (se houver)
const newFileInput = document.getElementById('newFileInput');
if (newFileInput.files[0]) {
  updateFormData.append('documentoIdentidade', newFileInput.files[0]);
}

fetch('http://localhost:3000/student/1', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <seu-token-jwt>'
  },
  body: updateFormData
})
.then(response => response.json())
.then(data => console.log('Sucesso:', data))
.catch(error => console.error('Erro:', error));
```

### Aprovar Estudante
```javascript
fetch('http://localhost:3000/student/1/approve', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer <seu-token-jwt>'
  }
})
.then(response => response.json())
.then(data => console.log('Estudante aprovado:', data))
.catch(error => console.error('Erro:', error));
```

## Resposta Esperada

### POST /student
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
  "endereco": "Rua das Flores, 123",
  "observacoes": "Estudante dedicado",
  "documentosUrl": "https://res.cloudinary.com/.../image.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### PATCH /student/:id
```json
{
  "id": 1,
  "nome": "João Silva Atualizado",
  "email": "joao@email.com",
  "telefone": "(11) 88888-8888",
  "dataNascimento": "2000-01-01",
  "turma": "B",
  "serie": "1º ano",
  "turno": "Manhã",
  "responsavel": "Maria Silva",
  "pizzaPreferida": "Margherita",
  "endereco": "Rua das Flores, 123",
  "observacoes": "Estudante dedicado",
  "documentosUrl": "https://res.cloudinary.com/.../nova-imagem.jpg",
  "createdAt": "2024-01-15T11:45:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### PATCH /student/:id/approve
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
  "endereco": "Rua das Flores, 123",
  "observacoes": "Estudante dedicado",
  "documentosUrl": "https://res.cloudinary.com/.../image.jpg",
  "approved": true,
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

## Logs do Servidor

Quando o formulário for enviado, você verá no console:
```
Dados recebidos: { nome: 'João Silva', email: 'joao@email.com', ... }
Arquivo recebido: imagem.jpg
📧 Emails adicionados na fila para processamento em background
✅ Email de confirmação enviado para: joao@email.com
✅ Notificação enviada para admin: admin@example.com
```

Quando um estudante for aprovado, você verá no console:
```
📧 Email de aprovação adicionado na fila para processamento em background
✅ Email de aprovação enviado para: joao@email.com
```

## Troubleshooting

1. **Erro 400**: Verifique se todos os campos obrigatórios estão preenchidos
2. **Erro de arquivo**: Certifique-se de que o arquivo é uma imagem (JPEG, PNG, JPG, GIF)
3. **Erro de email**: Verifique as configurações de email no .env
4. **CORS**: O servidor está configurado para aceitar requisições de qualquer origem
5. **Autenticação**: Para PATCH, certifique-se de incluir o token JWT válido 