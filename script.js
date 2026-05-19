/* =======================================
   SCRIPT PRINCIPAL - LÓGICA DO JOGO
   Versão 100% Cliente (GitHub Pages)
   ======================================= */

let gameInstance = new BetGameManipulator();
let gameInProgress = false;
let timeInterval = null;
let totalSeconds = 0;

// ========== INICIALIZAÇÃO ==========

window.addEventListener('DOMContentLoaded', () => {
    // Simular loading
    setTimeout(() => {
        // Esconder loading e mostrar jogo
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');

        // Iniciar jogo
        startGame();
        startTimeCounter();
    }, 2000);
});

// ========== FUNÇÕES PRINCIPAIS ==========

function startGame() {
    // Reinicializar jogo
    gameInstance = new BetGameManipulator();

    stopAutoPlay();

    gameInProgress = false;
    updateUI();
    showMessage("Bem-vindo! Você começa com 10 moedas. Você precisa atingir 100 moedas para sacar!", "welcome");
}

// ========== AUTO-PLAY (dinâmica crítica 3–5 min) ==========
let autoPlayTimer = null;
let autoPlayRunning = false;
let autoPlayStartedAt = 0;
let autoPlayEndsAt = 0;

function startAutoPlay() {
    if (autoPlayRunning) return;
    if (!gameInstance || gameInstance.gameState !== 'playing') return;

    autoPlayRunning = true;
    autoPlayStartedAt = Date.now();

    // Meta de duração 3–5 min (rand para variar sessões)
    const durationMs = (180 + Math.floor(Math.random() * 121)) * 1000; // 180–300s
    autoPlayEndsAt = autoPlayStartedAt + durationMs;

    // Mensagem inicial (otimista)
    showMessage("🎯 Dinâmica iniciada. Continue: o sistema está lendo seu ritmo...", 'win');
    setAutoPlayUIState(true);

    const tick = () => {
        // Para se terminou ou estourou tempo
        if (!autoPlayRunning) return;

        if (gameInstance.gameState !== 'playing') {
            stopAutoPlay();
            setTimeout(() => showFinalDashboard(), 600);
            return;
        }

        if (Date.now() >= autoPlayEndsAt) {
            stopAutoPlay();
            setTimeout(() => {
                // Encerrar “por tempo” como condição didática.
                gameInstance.gameState = 'lost';
                showFinalDashboard();
            }, 600);
            return;
        }

        // Selecionar aposta (sempre dentro do saldo)
        const betAmount = Math.min(parseInt(document.getElementById('bet-amount').value || 1), Math.max(1, gameInstance.coins));

        // Evitar sobreposição visual
        if (gameInProgress) return;
        gameInProgress = true;

        const result = gameInstance.placeBet(betAmount);
        displayBetResult(result);
        updateUI();

        if (result.message) showMessage(result.message, result.is_win ? 'win' : 'loss');

        // Marcação didática: destaca fase e reduz percepção de “travamento”
        if (typeof gameInstance.manipulationPhase === 'string') {
            const phaseMsg = gameInstance.manipulationPhase === 'critical'
                ? '⚠️ A virada começou. Concentre-se: a próxima pode mudar tudo.'
                : (gameInstance.manipulationPhase === 'intermediate'
                    ? 'Você está evoluindo. Falta pouco para a recuperação.'
                    : 'Ótimo ritmo! Continue — você está no caminho certo.');
            document.getElementById('auto-play-hint').textContent = phaseMsg;
        }

        if (result.game_over) {
            stopAutoPlay();
            setTimeout(() => showFinalDashboard(), 1000);
            gameInProgress = false;
            return;
        }

        gameInProgress = false;

        // Intervalos curtos para manter engajamento
        const phase = gameInstance.manipulationPhase;
        let min = 650, max = 950;
        if (phase === 'intermediate') { min = 520; max = 820; }
        if (phase === 'critical') { min = 380; max = 650; }

        const nextDelay = min + Math.floor(Math.random() * (max - min + 1));
        autoPlayTimer = setTimeout(tick, nextDelay);
    };

    // Primeiro tick rápido
    autoPlayTimer = setTimeout(tick, 350);
}

function stopAutoPlay() {
    autoPlayRunning = false;
    if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
    }
    setAutoPlayUIState(false);
}

function setAutoPlayUIState(isRunning) {
    const btn = document.getElementById('auto-play-button');
    const betBtn = document.getElementById('bet-button');

    if (!btn || !betBtn) return;

    if (isRunning) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        betBtn.disabled = true;
        betBtn.classList.add('disabled');
    } else {
        btn.disabled = false;
        btn.style.opacity = '';
        betBtn.disabled = false;
        betBtn.classList.remove('disabled');
    }
}

function placeBet() {
    if (gameInProgress) return;

    gameInProgress = true;
    const betAmount = parseInt(document.getElementById('bet-amount').value);

    if (!betAmount || betAmount <= 0) {
        showMessage("Digite um valor válido!", "error");
        gameInProgress = false;
        return;
    }

    const result = gameInstance.placeBet(betAmount);

    if (!result.success) {
        showMessage("Aposta inválida: " + result.error, "error");
        gameInProgress = false;
        return;
    }

    displayBetResult(result);
    updateUI();

    if (result.message) {
        showMessage(result.message, result.is_win ? "win" : "loss");
    }

    if (result.game_over) {
        setTimeout(() => {
            showFinalDashboard();
        }, 2000);
    }

    gameInProgress = false;
}

function attemptCashout() {
    const result = gameInstance.attemptCashout(false);

    if (result.need_confirmation) {
        document.getElementById('cashout-modal-message').textContent = result.message;
        document.getElementById('cashout-modal').classList.remove('hidden');
    } else if (result.success) {
        displayCashoutResult(result);
    }
}

function confirmCashout() {
    closeCashoutModal();
    const result = gameInstance.attemptCashout(true);
    displayCashoutResult(result);
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
        resultAnimation.innerHTML = '🔤 Quase!';
        resultMessage.textContent = 'Você estava TÃO PERTO!';
        resultCard.classList.add('win');
    }
}

function displayCashoutResult(result) {
    if (!result.success) {
        showMessage(result.message || "Erro no saque", "error");
        return;
    }

    setTimeout(() => {
        showFinalDashboard();
    }, 1000);
}

// ========== ATUALIZAÇÕES DE UI ==========

function updateUI() {
    document.getElementById('coins-display').textContent = gameInstance.coins;
    document.getElementById('coins-needed').textContent = Math.max(0, 100 - gameInstance.coins);

    const progress = Math.min(100, (gameInstance.coins / 100) * 100);
    document.getElementById('progress-fill').style.width = progress + '%';

    document.getElementById('total-bets').textContent = gameInstance.totalBets;

    if (gameInstance.coins >= 100) {
        document.getElementById('cashout-button').classList.remove('hidden');
    } else {
        document.getElementById('cashout-button').classList.add('hidden');
    }

    if (gameInstance.gameState !== 'playing') {
        document.getElementById('bet-button').classList.add('disabled');
        document.getElementById('bet-button').disabled = true;
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
    const maxCoins = gameInstance?.coins || 10;
    const finalAmount = Math.min(parseInt(amount), maxCoins);
    document.getElementById('bet-amount').value = Math.max(1, finalAmount);
}

function updateBetAmount(value) {
    const maxCoins = gameInstance?.coins || 10;
    const amount = parseInt(value);

    if (isNaN(amount) || amount <= 0) {
        document.getElementById('bet-amount').value = 1;
    } else if (amount > maxCoins) {
        document.getElementById('bet-amount').value = maxCoins;
    }
}

// ========== DASHBOARD FINAL CRÍTICO ==========

function showFinalDashboard() {
    clearInterval(timeInterval);

    const stats = gameInstance.getFinalStats();

    document.getElementById('final-initial').textContent = stats.initial_coins;
    document.getElementById('final-final').textContent = stats.final_coins;
    document.getElementById('final-net').textContent = (stats.net_profit >= 0 ? '+' : '') + stats.net_profit;

    document.getElementById('final-bets').textContent = stats.total_bet;
    document.getElementById('final-won').textContent = stats.total_won;
    document.getElementById('final-lost').textContent = stats.total_lost;
    document.getElementById('final-near-miss').textContent = stats.near_misses;

    document.getElementById('final-time').textContent = stats.time_playing_minutes + 'm';
    document.getElementById('final-max').textContent = stats.max_coins_reached;
    document.getElementById('final-loss-streak').textContent = stats.max_loss_streak;
    document.getElementById('final-cashout-attempts').textContent = stats.attempted_cashouts;

    document.getElementById('analysis-near-miss-count').textContent = stats.near_misses;
    document.getElementById('analysis-total-bets-text').textContent = stats.total_bet;

    populateRealityMessages(stats.total_lost);

    document.getElementById('final-message-lost').textContent = stats.total_lost;
    document.getElementById('final-message-time').textContent = stats.time_playing_minutes;
    document.getElementById('final-message-bets').textContent = stats.total_bet;
    document.getElementById('final-message-platform').textContent = stats.total_lost - stats.total_won;

    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('final-screen').classList.remove('hidden');

    window.scrollTo(0, 0);
}

function populateRealityMessages(amountLost) {
    const container = document.getElementById('reality-messages');
    container.innerHTML = '';

    const messages = [
        `⚠️ Você deixou de pagar contas essenciais por ${amountLost} moedas.`,
        `Esse tempo poderia ter sido usado para estudar ou trabalhar.`,
        `Você deixou de comprar comida ou medicamentos necessários.`,
        `Esse dinheiro poderia ajudar sua família.`,
        `Você gastou ${amountLost * 10} minutos de vida em esperança falsa.`,
        `Para cada moeda perdida, você acreditou em uma vitória que nunca viria.`
    ];

    messages.forEach(msg => {
        const item = document.createElement('div');
        item.className = 'reality-message-item';
        item.textContent = msg;
        container.appendChild(item);
    });
}

function resetGame() {
    location.reload();
}

window.addEventListener('error', () => {
    showMessage("Erro na aplicação!", "error");
});

