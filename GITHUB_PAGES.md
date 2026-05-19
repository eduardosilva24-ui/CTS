# 🚀 GITHUB PAGES - VERSÃO 100% WEB

Este projeto foi convertido para funcionar **totalmente em GitHub Pages** sem necessidade de backend Python!

## ✨ O Que Mudou

- ✅ Backend Python → **JavaScript Puro**
- ✅ APIs Flask → **Lógica Local**
- ✅ Sem servidor rodando → **Funciona Offline**
- ✅ Deploy automático em Pages

## 📋 Como Colocar no GitHub Pages

### 1. Criar Repositório GitHub

```bash
git init
git add .
git commit -m "Initial commit: Bet Game Educational Project"
git remote add origin https://github.com/SEEUSUARIO/SEUREPOSITORIO.git
git push -u origin main
```

### 2. Ativar GitHub Pages

1. Vá para **Settings** do repositório
2. Procure por **Pages** (ou **GitHub Pages**)
3. Selecione:
   - Source: `main` (ou `master`)
   - Folder: `/ (root)` ou `/frontend` (se quiser)
4. Clique **Save**

### 3. Acessar o Site

Seu site estará em:
```
https://SEEUSUARIO.github.io/SEUREPOSITORIO/
```

Ou se tiver colocado `/frontend`:
```
https://SEEUSUARIO.github.io/SEUREPOSITORIO/frontend/
```

## 🏗️ Estrutura para Pages

Para Pages funcionar corretamente, você pode:

**Opção A: Usar root do repositório**
```
repositorio/
├── index.html
├── styles.css
├── script.js
├── game-logic.js
└── README.md
```

Neste caso, copie os arquivos de `frontend/` para a raiz.

**Opção B: Usar pasta /frontend**
```
repositorio/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── game-logic.js
├── backend/
├── README.md
└── ...
```

Pages reconhecerá automaticamente `/frontend/index.html`.

## 🔧 Estrutura Atual (Após Conversão)

```
CTS/
├── frontend/
│   ├── index.html          ← Estrutura
│   ├── styles.css          ← Estilos
│   ├── script.js           ← Lógica (agora sem API)
│   ├── game-logic.js       ← Nova! Algoritmo em JavaScript
│   └── assets/
├── backend/
│   ├── app.py              ← (opcional agora)
│   ├── game_logic.py       ← (opcional agora)
│   └── requirements.txt
├── README.md
└── ...
```

## ✅ Arquivos Atualizados

### Novo: `frontend/game-logic.js`
- 300+ linhas
- Classe `BetGameManipulator` em JavaScript puro
- Mesma lógica do Python

### Modificado: `frontend/script.js`
- Removed todas chamadas HTTP ao Flask
- Usa `new BetGameManipulator()` localmente
- Funciona 100% offline

### Modificado: `frontend/index.html`
- Adicionado `<script src="game-logic.js"></script>` antes de script.js

## 🎮 Testar Localmente Antes de Fazer Push

```bash
# Simular servidor local (como Pages faria)
cd CTS/frontend
python -m http.server 8000
```

Depois acesse: `http://localhost:8000`

Se funcionar aqui, funcionará em Pages!

## 🚀 Deploy Automático

Após fazer push:
1. GitHub detecta mudanças
2. Compila automaticamente
3. Site fica disponível em 1-2 minutos
4. Você recebe email confirmando publicação

## 📝 Arquivo `.gitignore` (Recomendado)

Se ainda não tem um, crie `CTS/.gitignore`:

```
# Dependências Python (opcional, já que não precisa mais)
backend/venv/
__pycache__/
*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

## 🔄 Atualizações Futuras

Para atualizar o site após publicar:

```bash
# Faça as mudanças
git add .
git commit -m "Update: descrição das mudanças"
git push
```

GitHub Pages atualiza automaticamente!

## ✨ Vantagens Dessa Abordagem

✅ **Sem servidor** - Funciona em qualquer lugar  
✅ **Sem custo** - GitHub Pages é grátis  
✅ **Offline-first** - Funciona sem internet  
✅ **Rápido** - Servido pela CDN do GitHub  
✅ **Simples** - Apenas HTML/CSS/JavaScript  
✅ **Seguro** - Sem backend para hackear  

## ⚠️ Limitações

❌ Não pode salvar dados permanentemente (reset ao recarregar)  
❌ Sem análise de backend (mas não precisamos)  
❌ Sem autenticação (não é necessária)  

## 🎓 Pronto para Apresentação Online

Agora você pode:
1. Compartilhar o link direto
2. Mostrar em qualquer navegador
3. Funciona em mobile
4. Sem instalação necessária

## 📞 Troubleshooting Pages

**Problema: "404 not found" em Pages**
- Verifique se selecionou a branch correta
- Espere 2 minutos após push
- Recarregue a página (Ctrl+F5)

**Problema: CSS/JS não carregam**
- Verifique a estrutura de pastas
- URLs relativas devem estar corretas
- Se em `/frontend/`, caminhos mantêm `/frontend/`

**Problema: Game não funciona**
- Abra DevTools (F12)
- Procure por erros no Console
- Verifique se `game-logic.js` está carregando

## 📚 Referência de URLs

Se seu arquivo está em `/frontend/index.html`:

```html
<!-- Caminhos Relativos (Correto) -->
<link rel="stylesheet" href="styles.css">
<script src="game-logic.js"></script>
<script src="script.js"></script>

<!-- URL Pages final -->
https://usuario.github.io/repo/frontend/
```

Se está na raiz (`/index.html`):

```html
<!-- Mesmos caminhos funcionam -->
<link rel="stylesheet" href="styles.css">
<script src="game-logic.js"></script>
```

---

## 🎉 Resumo

1. ✅ Código está pronto para Pages
2. ✅ Sem dependências de servidor
3. ✅ Funciona offline
4. ✅ Deploy automático
5. ✅ Compartilhável via link

**Próximo passo: Fazer push para GitHub e ativar Pages!**

