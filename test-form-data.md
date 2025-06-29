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

## Usando Postman

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

## Usando JavaScript/Fetch

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

## Usando HTML Form

```html
<form action="http://localhost:3000/student" method="post" enctype="multipart/form-data">
  <input type="text" name="nome" placeholder="Nome" required><br>
  <input type="email" name="email" placeholder="Email" required><br>
  <input type="text" name="telefone" placeholder="Telefone" required><br>
  <input type="date" name="dataNascimento" required><br>
  <input type="text" name="turma" placeholder="Turma" required><br>
  <input type="text" name="serie" placeholder="Série" required><br>
  <select name="turno" required>
    <option value="">Selecione o turno</option>
    <option value="Manhã">Manhã</option>
    <option value="Tarde">Tarde</option>
    <option value="Noite">Noite</option>
  </select><br>
  <input type="text" name="responsavel" placeholder="Responsável" required><br>
  <input type="text" name="pizzaPreferida" placeholder="Pizza Preferida" required><br>
  <input type="text" name="endereco" placeholder="Endereço (opcional)"><br>
  <textarea name="observacoes" placeholder="Observações (opcional)"></textarea><br>
  <input type="file" name="documentoIdentidade" accept="image/*"><br>
  <button type="submit">Enviar</button>
</form>
```

## Resposta Esperada

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
  "documentosUrl": "https://res.cloudinary.com/.../image.jpg"
}
```

## Logs do Servidor

Quando o formulário for enviado, você verá no console:
```
Dados recebidos: { nome: 'João Silva', email: 'joao@email.com', ... }
Arquivo recebido: imagem.jpg
Email de confirmação enviado para: joao@email.com
Notificação enviada para admin: admin@example.com
```

## Troubleshooting

1. **Erro 400**: Verifique se todos os campos obrigatórios estão preenchidos
2. **Erro de arquivo**: Certifique-se de que o arquivo é uma imagem (JPEG, PNG, JPG, GIF)
3. **Erro de email**: Verifique as configurações de email no .env
4. **CORS**: O servidor está configurado para aceitar requisições de qualquer origem 