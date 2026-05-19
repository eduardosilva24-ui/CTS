/* =======================================
   SCRIPT PRINCIPAL - LÓGICA DO JOGO
   ======================================= */

const API_BASE = 'http://localhost:5000/api';
let sessionId = `session_${Date.now()}`;
let currentGameState = null;
let gameInProgress = false;
let timeInterval = null;
let totalSeconds = 0;

// ========== INICIALIZAÇÃO ==========

window.addEventListener('DOMContentLoaded', async () => {
    // Simular loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Esconder loading e mostrar jogo
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('main-container').classList.remove('hidden');
    
    // Iniciar jogo
    await startGame();
    startTimeCounter();
});

// ========== FUNÇÕES PRINCIPAIS ==========

async function startGame() {
    try {
        const response = await fetch(`${API_BASE}/game/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        const data = await response.json();
        updateUI();
        showMessage("Bem-vindo! Você começa com 10 moedas. Você precisa atingir 100 moedas para sacar!", "welcome");
    } catch (error) {
        console.error('Erro ao iniciar jogo:', error);
        showMessage("Erro ao conectar com o servidor. Certifique-se que está rodando.", "error");
    }
}

async function placeBet() {
    if (gameInProgress) return;
    
    gameInProgress = true;
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    
    if (!betAmount || betAmount <= 0) {
        showMessage("Digite um valor válido!", "error");
        gameInProgress = false;
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/game/bet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                bet_amount: betAmount
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            showMessage("Aposta inválida: " + result.error, "error");
            gameInProgress = false;
            return;
        }
        
        // Exibir resultado com animações
        displayBetResult(result);
        
        // Atualizar UI
        await updateUI();
        
        // Mostrar mensagem psicológica
        if (result.message) {
            showMessage(result.message, result.is_win ? "win" : "loss");
        }
        
        // Verificar se jogo terminou
        if (result.game_over) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            showFinalDashboard();
        }
        
        gameInProgress = false;
    } catch (error) {
        console.error('Erro ao fazer aposta:', error);
        showMessage("Erro na aposta!", "error");
        gameInProgress = false;
    }
}

async function attemptCashout() {
    try {
        const response = await fetch(`${API_BASE}/game/cashout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                confirmed: false
            })
        });
        
        const result = await response.json();
        
        if (result.need_confirmation) {
            // Mostrar modal de confirmação com mensagem psicológica
            document.getElementById('cashout-modal-message').textContent = result.message;
            document.getElementById('cashout-modal').classList.remove('hidden');
        } else if (result.success) {
            displayCashoutResult(result);
        }
    } catch (error) {
        console.error('Erro ao tentar saque:', error);
    }
}

async function confirmCashout() {
    closeCashoutModal();
    
    try {
        const response = await fetch(`${API_BASE}/game/cashout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                confirmed: true
            })
        });
        
        const result = await response.json();
        displayCashoutResult(result);
    } catch (error) {
        console.error('Erro no saque:', error);
    }
}

// ========== EXIBIÇÃO DE RESULTADOS ==========

function displayBetResult(result) {
    const resultCard = document.getElementById('result-card');
    const resultAnimation = document.getElementById('result-animation');
    const resultMessage = document.getElementById('result-message');
    
    resultCard.classList.remove('hidden', 'win', 'loss');
    
    if (result.is_win) {
        resultCard.classList.add('win');
        resultAnimation.innerHTML = '🎉✨';
        resultMessage.textContent = `VOCÊ GANHOU! +${result.won} moedas!`;
        
        // Criar confete
        if (result.celebration) {
            createConfetti();
            playWinAnimation();
        }
    } else {
        resultCard.classList.add('loss');
        resultAnimation.innerHTML = '😞💔';
        resultMessage.textContent = `VOCÊ PERDEU -${result.lost} moedas!`;
    }
    
    if (result.near_miss) {
        resultAnimation.innerHTML = '😤 Quase!';
        resultMessage.textContent = 'Você estava TÃO PERTO!';
        resultCard.classList.add('win');
    }
}

function displayCashoutResult(result) {
    if (!result.success) {
        showMessage(result.message || "Erro no saque", "error");
        return;
    }
    
    // Mostrar modal com resultado final
    const messageHTML = `
        <h3>SAQUE PROCESSADO</h3>
        <p>Valor solicitado: ${result.original_amount} moedas</p>
        <p>Valor recebido: ${result.final_amount} moedas</p>
        <p style="color: #ff0055; font-weight: bold;">Taxa de saque: ${result.fees} moedas</p>
    `;
    
    setTimeout(() => {
        showFinalDashboard();
    }, 1000);
}

// ========== ATUALIZAÇÕES DE UI ==========

async function updateUI() {
    try {
        const response = await fetch(`${API_BASE}/game/state/${sessionId}`);
        const state = await response.json();
        currentGameState = state;
        
        // Atualizar saldo
        document.getElementById('coins-display').textContent = state.coins;
        document.getElementById('coins-needed').textContent = Math.max(0, 100 - state.coins);
        
        // Atualizar barra de progresso
        const progress = Math.min(100, (state.coins / 100) * 100);
        document.getElementById('progress-fill').style.width = progress + '%';
        
        // Atualizar estatísticas
        document.getElementById('total-bets').textContent = state.total_bets;
        
        // Mostrar botão de cashout se atingiu 100 moedas
        if (state.coins >= 100) {
            document.getElementById('cashout-button').classList.remove('hidden');
        } else {
            document.getElementById('cashout-button').classList.add('hidden');
        }
        
        // Desabilitar aposta se jogo terminou
        if (state.game_state !== 'playing') {
            document.getElementById('bet-button').classList.add('disabled');
            document.getElementById('bet-button').disabled = true;
        }
    } catch (error) {
        console.error('Erro ao atualizar UI:', error);
    }
}

// ========== ANIMAÇÕES ==========

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.innerHTML = ['🎉', '🎊', '✨', '⭐', '💰'][Math.floor(Math.random() * 5)];
        
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '0';
        confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s ease-out forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

function playWinAnimation() {
    const coinsDisplay = document.getElementById('coins-display');
    coinsDisplay.style.animation = 'none';
    setTimeout(() => {
        coinsDisplay.style.animation = 'pulse-number 0.6s ease-out';
    }, 10);
}

// ========== MENSAGENS PSICOLÓGICAS ==========

function showMessage(message, type = 'info') {
    const msgBox = document.getElementById('psychological-message');
    msgBox.textContent = message;
    msgBox.style.animation = 'none';
    
    setTimeout(() => {
        msgBox.style.animation = 'message-fade 0.5s ease-out';
    }, 10);
}

// ========== GERENCIAMENTO DE RESULTADO ==========

function closeResult() {
    document.getElementById('result-card').classList.add('hidden');
}

function closeCashoutModal() {
    document.getElementById('cashout-modal').classList.add('hidden');
}

// ========== CONTADOR DE TEMPO ==========

function startTimeCounter() {
    timeInterval = setInterval(() => {
        totalSeconds++;
        const minutes = Math.floor(totalSeconds / 60);
        document.getElementById('time-playing').textContent = minutes + 'm';
    }, 1000);
}

// ========== CONTROLE DE APOSTA ==========

function setBetAmount(amount) {
    const maxCoins = currentGameState?.coins || 10;
    const finalAmount = Math.min(amount, maxCoins);
    document.getElementById('bet-amount').value = finalAmount;
}

function updateBetAmount(value) {
    const maxCoins = currentGameState?.coins || 10;
    const amount = parseInt(value);
    
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('bet-amount').value = 1;
    } else if (amount > maxCoins) {
        document.getElementById('bet-amount').value = maxCoins;
    }
}

// ========== DASHBOARD FINAL CRÍTICO ==========

async function showFinalDashboard() {
    // Parar contador de tempo
    clearInterval(timeInterval);
    
    try {
        const statsResponse = await fetch(`${API_BASE}/game/stats/${sessionId}`);
        const stats = await statsResponse.json();
        
        // Preencher dados do dashboard
        document.getElementById('final-initial').textContent = stats.initial_coins;
        document.getElementById('final-final').textContent = stats.final_coins;
        document.getElementById('final-net').textContent = 
            (stats.net_profit >= 0 ? '+' : '') + stats.net_profit;
        
        document.getElementById('final-bets').textContent = stats.total_bet;
        document.getElementById('final-won').textContent = stats.total_won;
        document.getElementById('final-lost').textContent = stats.total_lost;
        document.getElementById('final-near-miss').textContent = stats.near_misses;
        
        document.getElementById('final-time').textContent = stats.time_playing_minutes + 'm';
        document.getElementById('final-max').textContent = stats.max_coins_reached;
        document.getElementById('final-loss-streak').textContent = stats.max_loss_streak;
        document.getElementById('final-cashout-attempts').textContent = stats.attempted_cashouts;
        
        // Preencher análise
        document.getElementById('analysis-near-miss-count').textContent = stats.near_misses;
        document.getElementById('analysis-total-bets-text').textContent = stats.total_bet;
        
        // Preencher mensagens de impacto
        populateRealityMessages(stats.total_lost);
        
        // Preencher mensagem final
        document.getElementById('final-message-lost').textContent = stats.total_lost;
        document.getElementById('final-message-time').textContent = stats.time_playing_minutes;
        document.getElementById('final-message-bets').textContent = stats.total_bet;
        document.getElementById('final-message-platform').textContent = stats.total_lost - stats.total_won;
        
        // Mostrar tela final
        document.getElementById('main-container').classList.add('hidden');
        document.getElementById('final-screen').classList.remove('hidden');
        
        // Scroll para topo
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('Erro ao carregar dashboard final:', error);
    }
}

function populateRealityMessages(amountLost) {
    const container = document.getElementById('reality-messages');
    container.innerHTML = '';
    
    const messages = [
        `Você deixou de pagar contas essenciais por ${amountLost} moedas.`,
        `Esse tempo poderia ter sido usado para estudar ou trabalhar.`,
        `Você deixou de comprar comida ou medicamentos necessários.`,
        `Esse dinheiro poderia ajudar sua família.`,
        `Você gastou ${amountLost * 10} minutos de vida em esperança falsa.`,
        `Para cada moeda perdida, você acreditou em uma vitória que nunca viria.`
    ];
    
    messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'reality-message-item';
        item.textContent = '⚠️ ' + msg;
        container.appendChild(item);
    });
}

// ========== RESET DO JOGO ==========

async function resetGame() {
    try {
        await fetch(`${API_BASE}/game/reset/${sessionId}`, { method: 'POST' });
    } catch (error) {
        console.error('Erro ao resetar:', error);
    }
    
    // Recarregar página
    location.reload();
}

// ========== TRATAMENTO DE ERROS ==========

window.addEventListener('error', (event) => {
    console.error('Erro global:', event.error);
    showMessage("Erro na aplicação!", "error");
});

// Verificar conexão com servidor
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE}/game/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: 'test' })
        }).catch(() => null);
        
        if (!response) {
            console.warn('Servidor não está disponível!');
            showMessage("⚠️ Servidor não está rodando. Inicie com: python backend/app.py", "error");
        }
    } catch (error) {
        console.warn('Erro ao verificar servidor:', error);
    }
});
