# 🚀 GUIA RÁPIDO DE INÍCIO

## ⚡ Opção 1: Iniciar Automaticamente (Windows)

1. Duplo-clique em `iniciar.bat`
2. Espere 5 segundos
3. O navegador abrirá automaticamente
4. Pronto! Comece a jogar

---

## ⚡ Opção 2: Iniciar Manualmente

### Passo 1: Instalar Dependências

Abra PowerShell/CMD na pasta do projeto:

```bash
cd backend
pip install -r requirements.txt
```

### Passo 2: Rodar Backend

```bash
python app.py
```

Você verá:
```
 * Running on http://0.0.0.0:5000
```

### Passo 3: Abrir Frontend

Abra o arquivo `frontend/index.html` no navegador (duplo-clique)

---

## 🎮 Como Jogar

1. **Comece**: 10 moedas iniciais
2. **Aposta**: Escolha um valor (1, 2, 5 ou custom)
3. **Observe**: O padrão de vitórias que muda ao longo do tempo
4. **Alcance 100**: Atinja 100 moedas para desbloquear saque
5. **Dashboard**: Veja a análise crítica no final

---

## 📊 O Que Demonstra

- ✅ Reforço variável (Variable Reward)
- ✅ Near Miss Effect (quase vitórias)
- ✅ FOMO e mensagens psicológicas
- ✅ Ilusão de controle
- ✅ Manipulação emocional
- ✅ Dashboard crítico final

---

## 🐛 Resolução de Problemas

### Erro: "ModuleNotFoundError: No module named 'flask'"

```bash
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
```

### Erro: "Port 5000 already in use"

Mude a porta em `backend/app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Frontend não carrega dados

Certifique-se que:
1. Backend está rodando (viu a mensagem "Running on...")
2. Não há erro no console do navegador (F12)
3. CORS está habilitado (está no código)

### CORS Error no navegador

Se ver erro de CORS, tente usar:
```bash
# Instalar servidor local
pip install http-server
cd frontend
http-server -p 8000
```

Depois acesse: `http://localhost:8000`

---

## 🎓 Para Apresentação Ao Vivo

### Recomendações:

1. **Testar antes**: Execute no dia anterior
2. **Internet estável**: Servidor local, sem dependências externas
3. **Projetor**: Tela inteira (F11) para melhor visualização
4. **Tempo**: 5 minutos para jogar + 5 minutos para analisar = 10 min total
5. **Narrativa**:
   - "Vocês são usuários de uma plataforma de apostas"
   - "Notem como as vitórias começam fáceis..."
   - "...mas depois fica cada vez mais difícil"
   - "No final, o dashboard mostra como foram manipulados"

### Momentos-Chave para Destacar:

1. **"Você está tão perto!"** - FOMO criado artificialmente
2. **Dashboard final** - Mostrar perda total vs ganho plataforma
3. **Análise crítica** - Explicar cada mecanismo de manipulação

---

## 📱 Responsividade

O projeto funciona em:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768)
- ✅ Tablet (iPad)
- ✅ Mobile (Android, iPhone)

---

## 📚 Referências para Apresentação

Cite estes conceitos durante a apresentação:

1. **B.F. Skinner - Variable Reward**: Pesquisa clássica em comportamento animal mostrando que recompensas variáveis são mais viciantes
2. **Efeito Near Miss**: Neurociência mostra que quase-vitórias ativam dopamina como vitórias reais
3. **FOMO**: Psicologia social - medo de perder oportunidades cria urgência
4. **Gamificação**: Aplicação de mecânicas de jogo para aumentar engajamento
5. **Ilusão de Controle**: Cognitive bias onde cremos ter mais controle do que realmente temos

---

## 🔧 Personalizações Possíveis

Você pode modificar:

- **Moedas iniciais**: Mude em `backend/game_logic.py` `__init__` (linha: `self.coins = 10`)
- **Meta de saque**: Procure por `100` e mude para outro valor
- **Cores neon**: Edite `--primary-neon`, `--secondary-neon` em `frontend/styles.css`
- **Mensagens psicológicas**: Modifique `get_psychological_message()` em `game_logic.py`
- **Probabilidades**: Ajuste em `calculate_win_probability()` em `game_logic.py`

---

## 💡 Dicas de Uso

- **Deixe jogar**: Se em apresentação, deixe alguém da turma jogar
- **Narração**: Comente em tempo real o que está acontecendo
- **Comparação**: Depois, mostre telas de apostas reais como comparação
- **Discussão**: Questione: "Vocês perceberam quando as chances mudaram?"

---

Aproveite a apresentação! 🎓

