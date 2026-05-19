# 🎰 ANÁLISE CRÍTICA: Manipulação Psicológica em Plataformas de Apostas Online

## Projeto Educacional para Disciplina de CTS (Ciência, Tecnologia e Sociedade)

Este projeto é um **simulador crítico e impactante** que demonstra como plataformas de apostas online utilizam técnicas de **manipulação psicológica**, **design persuasivo** e **algoritmos manipulativos** para manter usuários viciados e prejudicá-los financeiramente.

---

## 🎯 Objetivo

Demonstrar, de forma educacional e crítica, os mecanismos reais de:
- **Reforço Variável** (Variable Reward System)
- **Efeito "Quase Ganhar"** (Near Miss Effect)  
- **FOMO** (Fear of Missing Out)
- **Gamificação** e estímulos dopaminérgicos
- **Ilusão de Controle**
- **Escalada de Comprometimento**
- **Manipulação Emocional** com recompensas visuais exageradas

---

## 🚀 VERSÃO GITHUB PAGES (NOVO!)

**Este projeto agora funciona 100% em GitHub Pages!**

✨ **Sem necessidade de servidor Python!**

Acesse online: **[Seu Link Pages Aqui]**

Para colocar seu próprio projeto no Pages:
👉 Leia: [GUIA_GITHUB_PAGES.txt](GUIA_GITHUB_PAGES.txt) (5 minutos!)

---

## ⚙️ Tecnologias

- **Frontend**: HTML5, CSS3 e JavaScript Vanilla ✨ (Agora 100% standalone!)
- **Lógica**: JavaScript puro (sem backend necessário)
- **Design**: Tema escuro e neon (aparência viciante proposital)
- **Responsividade**: Mobile e desktop
- **Deploy**: GitHub Pages (grátis, automático)

---

## 📋 Pré-requisitos

### Opção 1: GitHub Pages (Recomendado) ⭐
- ✅ Apenas um navegador moderno
- ✅ Sem instalação necessária
- ✅ Funciona online e offline
- ✅ 100% grátis

Leia: [GUIA_GITHUB_PAGES.txt](GUIA_GITHUB_PAGES.txt)

### Opção 2: Rodar Localmente
- **Python 3.8+** instalado
- **pip** (gerenciador de pacotes Python)
- Navegador moderno (Chrome, Firefox, Edge)
- Terminal/PowerShell

---

## 🚀 Como Executar

### ⭐ OPÇÃO 1: GitHub Pages (Recomendado)

Siga o guia rápido: [GUIA_GITHUB_PAGES.txt](GUIA_GITHUB_PAGES.txt)

Em 5 minutos seu projeto estará online e você terá um link para compartilhar!

```
https://seu-usuario.github.io/cts-apostas-critica/
```

### Opção 2: Localmente (Python + Flask)

#### 1. Instalação das Dependências Python

Abra o terminal na pasta do projeto e execute:

```bash
cd backend
pip install -r requirements.txt
```

#### 2. Iniciar o Frontend

**Opção A: Servidor Local (Recomendado)**
```bash
cd frontend
python -m http.server 8000
```
Depois acesse: `http://localhost:8000`

**Opção B: Duplo-clique no arquivo**
- Simplesmente duplo-clique em `frontend/index.html`
- Abre no navegador padrão
- Funciona 100% (sem servidor necessário)

#### 3. Backend Python (Opcional)

Se quiser rodar o backend (não é necessário):
```bash
cd backend
python app.py
```

⚠️ **A lógica está em JavaScript agora!** O backend é completamente opcional.

---

## 🎮 Como Usar

1. **Inicie o jogo** - Você começa com 10 moedas
2. **Escolha valor de aposta** - Use os botões rápidos ou digite um valor
3. **Observe o padrão** de manipulação:
   - Primeiras apostas: maiores chances de ganhar (criar confiança)
   - Apostas intermediárias: reduação gradual de chances
   - Próximo aos 100 moedas: drástica redução de chances
4. **Tente sacar** - Ao atingir 100 moedas, um modal tentará convencê-lo a continuar
5. **Veja o dashboard final** - Análise crítica completa do que aconteceu

---

## 📊 Estrutura do Projeto

```
CTS/
├── backend/
│   ├── app.py                 # Servidor Flask com APIs
│   ├── game_logic.py          # Lógica manipuladora do jogo
│   └── requirements.txt       # Dependências Python
├── frontend/
│   ├── index.html            # Estrutura HTML
│   ├── styles.css            # Estilos escuro/neon
│   ├── script.js             # Lógica de interação
│   └── assets/               # Recursos (imagens, fonts, etc)
└── README.md                 # Este arquivo
```

---

## 🧠 Conceitos de Manipulação Demonstrados

### 1. Reforço Variável
- Recompensas **impredizíveis** ativam mais dopamina que recompensas previsíveis
- Cada aposta libera dopamina (não apenas as vitórias)

### 2. Near Miss Effect
- "Quase ganhar" ativa o mesmo circuito de recompensa que GANHAR
- Mantém o usuário psicologicamente preso

### 3. FOMO (Medo de Perder Oportunidades)
- Mensagens: "Você está tão perto!", "A próxima pode mudar tudo!"
- Cria urgência emocional artificial

### 4. Ilusão de Controle
- Você escolhe o valor da aposta, criando sensação de controle
- Mas o algoritmo controla completamente as odds

### 5. Escalada de Comprometimento
- Quanto mais você joga, mais "tem" que continuar para recuperar perdas
- Efeito psicológico chamado "Sunk Cost Fallacy"

### 6. Manipulação Visual
- Celebrações exageradas com confete, cores brilhantes, efeitos neon
- Derrotas minimizadas
- Cria associação emocional positiva com o jogo

---

## 🔍 Análise Técnica: Como o Algoritmo Funciona

### Fase 1: INICIAL (primeiras 5-10 apostas)
```
Probabilidade de Ganho: 60-75%
Objetivo: Criar confiança rápida
```

### Fase 2: INTERMEDIÁRIA (apostas 10-30)
```
Probabilidade de Ganho: 55% → 35% (redução gradual)
Objetivo: Manter esperança enquanto reduz ganhos
Quase Vitórias: 15% de chance (manipulação psicológica)
```

### Fase 3: CRÍTICA (acima de 30 apostas)
```
Se perto de 100 moedas: 10-20% de chance de ganho
Se acima de 70 moedas: 10-20% de chance de ganho
Objetivo: Destruir ganhos antes de saque
```

### Manipulação Final (Cashout)
Mesmo quando o jogador atinge 100 moedas:
- Simuladas "taxas de processamento" (15% de perda)
- "Rodadas obrigatórias" que perdem dinheiro
- "Bônus especiais" que precisa ser apostado e perdido

**Resultado típico**: Jogador com 100 moedas termina com 0-8 moedas (menos que começou)

---

## 📈 Dashboard Final: O Que Você Verá

O projeto exibe no final:

### Estatísticas Financeiras
- Moedas iniciais vs finais
- Total ganho vs total perdido
- Lucro/prejuízo líquido

### Estatísticas de Comportamento
- Número total de apostas
- "Quase vitórias" (quantas vezes quase ganhou)
- Maior sequência de perdas
- Tempo gasto

### Análise Crítica em 6 Pontos
1. Como o reforço variável funcionou
2. Como as "quase vitórias" o prenderam
3. Ilusão de controle
4. Escalada de comprometimento
5. FOMO criado
6. Manipulação visual

### Comparação com Realidade
Mostra coisas que você deixou de fazer com esse tempo/dinheiro:
- Pagar contas
- Comprar comida
- Estudar
- Ajudar família

### Mensagem Final Impactante

> "NENHUMA BET MUDA A VIDA DAS PESSOAS COMUNS."
> "ELAS LUCRAM DESTRUINDO FINANCEIRAMENTE PESSOAS VULNERÁVEIS."

E enfatiza:
- O sistema foi feito para manter você jogando, NÃO para fazer você vencer
- O verdadeiro produto das bets é sua **atenção**, **tempo** e **esperança**

---

## 🎓 Para Apresentação Universitária

### Pontos a Destacar

1. **Design Proposital**: A interface parece viciante porque IS viciante - é uma crítica através da mimética

2. **Algoritmo Estudado**: Baseia-se em pesquisas reais de neurociência comportamental e manipulação

3. **Números Impactantes**: Jogadores reais perdem em média 90%+ do valor investido

4. **Vulnerabilidade**: O sistema explora especificamente pessoas com:
   - Dificuldades financeiras
   - Depressão/ansiedade
   - Baixa literácia financeira
   - Compulsão para comportamentos repetitivos

5. **Legalidade Questionável**: Muitas jurisdições consideram as técnicas usadas ilegais para jogos de azar, mas não para apps "de entretenimento"

---

## 📸 Capturas de Tela

### Loading Screen
- Título brilhante em neon cyan
- Spinner animado

### Game Screen
- Saldo em destaque com número grande brilhando
- Barra de progresso para 100 moedas
- Botões de aposta responsivos
- Mensagens psicológicas em tempo real
- Animações de vitória/derrota

### Final Dashboard
- 3 cards de estatísticas
- 6 análises críticas destacadas
- Comparação com realidade
- Mensagem final impactante

---

## 🔐 Notas Importantes

**Este projeto é PURAMENTE EDUCACIONAL.**

- ❌ NÃO incentiva apostas reais
- ✅ DEMONSTRA criticamente como apostas manipulam
- 📚 Usa fundamentos de neurociência e psicologia comportamental
- 🎓 Apropriado para apresentação universitária de CTS

---

## 🤝 Contribuições Éticas

Este projeto pode ser melhorado com:
- Mais contexto sobre vício comportamental
- Comparações com outras plataformas viciantes (redes sociais, games)
- Recursos de prevenção e ajuda para vício em apostas
- Legislação sobre bets em diferentes países

---

## 📞 Contato / Dúvidas

Para dúvidas sobre o funcionamento técnico ou conceitual, consulte:
- Documentação comentada no código
- Referências em neurociência comportamental
- Estudos sobre "variable reward" (BF Skinner)
- Pesquisa sobre near-miss effect

---

## ⚖️ Disclaimer

**Este é um projeto educacional crítico e não representa um jogo real ou recomendação de apostas.**

Plataformas reais de apostas online têm responsabilidades legais e éticas que frequentemente violam ao usar essas técnicas.

---

**Criado para: Disciplina CTS - Universidade**  
**Propósito: Demonstração crítica de manipulação psicológica em tecnologia**  
**Data: 2026**

#   C T S 
 
 