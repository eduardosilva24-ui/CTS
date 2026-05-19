/**
 * BET GAME MANIPULATOR - Versão JavaScript
 * Lógica de manipulação psicológica completamente em cliente
 * Sem dependência de backend Python
 */

class BetGameManipulator {
    constructor() {
        this.reset();
    }

    reset() {
        this.coins = 10;
        this.initialCoins = 10;
        this.totalBets = 0;
        this.totalWon = 0;
        this.totalLost = 0;
        this.gameState = "playing";
        this.nearMisses = 0;
        this.winStreak = 0;
        this.lossStreak = 0;
        this.maxCoins = 10;
        this.timePlayingSeconds = 0;
        this.betHistory = [];
        this.manipulationPhase = "initial";
        this.attemptedCashouts = 0;
    }

    // Calcular probabilidade de vitória com manipulação
    calculateWinProbability(betAmount) {
        // FASE 1: INICIAL (primeiras 5-10 apostas)
        // 60-75% de chance para criar confiança
        if (this.totalBets <= 10) {
            if (this.totalBets <= 3) {
                return 0.65 + Math.random() * 0.10; // 65-75%
            } else {
                return 0.55 + Math.random() * 0.10; // 55-65%
            }
        }

        // FASE 2: INTERMEDIÁRIA (apostas 11-30)
        // Redução gradual de 55% para 35%
        else if (this.totalBets <= 30) {
            const progress = (this.totalBets - 10) / 20;
            let winProb = 0.55 - (progress * 0.20);

            // 15% de chance de "quase vitória"
            if (Math.random() < 0.15) {
                this.nearMisses++;
                return 0.49; // Quase ganha
            }

            return winProb + (Math.random() - 0.5) * 0.10;
        }

        // FASE 3: CRÍTICA (acima de 30 apostas)
        else {
            if (this.coins >= 70) {
                return 0.10 + Math.random() * 0.10; // 10-20%
            } else if (this.coins >= 50) {
                return 0.20 + Math.random() * 0.10; // 20-30%
            } else {
                return 0.25 + Math.random() * 0.10; // 25-35%
            }
        }
    }

    // Calcular valor ganho
    calculateWinAmount(betAmount) {
        let multiplier;
        if (this.totalBets <= 10) {
            multiplier = [1.5, 2.0, 2.5][Math.floor(Math.random() * 3)];
        } else if (this.totalBets <= 25) {
            multiplier = [1.2, 1.5, 1.8][Math.floor(Math.random() * 3)];
        } else {
            multiplier = [1.0, 1.1, 1.2][Math.floor(Math.random() * 3)];
        }

        return Math.floor(betAmount * multiplier);
    }

    // Mensagens psicológicas
    getMessageForEvent(eventType) {
        const messages = {
            "small_win": [
                "Você é incrível!",
                "Ótimo começo!",
                "Você nasceu para isso!",
                "Hoje é o seu dia!",
                "Sua habilidade está em alta!",
                "Vamos lá!",
                "Que performance!"
            ],
            "big_win": [
                "🎯 INCRÍVEL! VOCÊ É EXTRAORDINÁRIO! 🎯",
                "SUA SORTE ESTÁ EM ALTA HOJE!",
                "VOCÊ ESTÁ EVOLUINDO RAPIDAMENTE!",
                "ESTAMOS ORGULHOSOS DE VOCÊ!",
                "SEU GRANDE PRÊMIO ESTÁ CHEGANDO!",
                "VOCÊ NASCEU PARA GANHAR!"
            ],
            "near_miss": [
                "Quase! Você estava TÃO perto!",
                "Que sorte desperdiçada!",
                "A próxima vez você consegue!",
                "Mais um pouquinho e era seu!",
                "Você está evoluindo, continue!"
            ],
            "loss": [
                "Sem problema, a próxima é sua!",
                "Todos os jogadores perdem às vezes",
                "Você pode recuperar isso!",
                "Muitos jogadores desistem antes da grande vitória",
                "Já chegou tão longe... Continue!",
                "A próxima rodada pode mudar tudo!"
            ],
            "desperate": [
                "Você está quase recuperando tudo!",
                "SÓ MAIS UMA TENTATIVA!",
                "AGORA VAI!",
                "Você já investiu tanto... Não desista agora!",
                "Grandes prêmios esperam os destemidos!",
                "Você está a um passo da redenção!"
            ],
            "reaching_cashout": [
                "VOCÊ CONSEGUIU!",
                "PARABÉNS POR ATINGIR 100 MOEDAS!",
                "Suas chances de ganhar aumentaram em 60%!",
                "Você está em uma sequência de ouro!",
                "O SISTEMA RECONHECE SEU TALENTO!"
            ]
        };

        if (messages[eventType]) {
            const msgArray = messages[eventType];
            return msgArray[Math.floor(Math.random() * msgArray.length)];
        }
        return "";
    }

    // Fazer aposta
    placeBet(betAmount) {
        if (betAmount > this.coins || betAmount <= 0) {
            return {
                success: false,
                error: "Aposta inválida",
                coins: this.coins
            };
        }

        this.totalBets++;
        this.timePlayingSeconds += Math.floor(Math.random() * 50) + 10;

        const winProb = this.calculateWinProbability(betAmount);
        const isWin = Math.random() < winProb;

        const result = {
            bet_amount: betAmount,
            is_win: isWin,
            near_miss: false,
            coins: this.coins,
            message: "",
            celebration: false,
            psychological_impact: 0
        };

        if (isWin) {
            const winAmount = this.calculateWinAmount(betAmount);
            this.coins += winAmount;
            this.totalWon += winAmount;
            this.winStreak++;
            this.lossStreak = 0;
            result.won = winAmount;
            result.coins = this.coins;

            if (winAmount === betAmount) {
                result.near_miss = true;
                result.message = this.getMessageForEvent("near_miss");
            } else if (winAmount < betAmount * 1.3) {
                result.message = this.getMessageForEvent("small_win");
            } else {
                result.celebration = true;
                result.message = this.getMessageForEvent("big_win");
                result.psychological_impact = 10;
            }
        } else {
            const lossAmount = betAmount;
            this.coins -= lossAmount;
            this.totalLost += lossAmount;
            this.lossStreak++;
            this.winStreak = 0;
            result.lost = lossAmount;
            result.coins = Math.max(0, this.coins);

            if (this.coins < 5 && this.totalBets > 15) {
                result.message = this.getMessageForEvent("desperate");
                result.psychological_impact = -8;
            } else {
                result.message = this.getMessageForEvent("loss");
                result.psychological_impact = -3;
            }
        }

        if (this.coins > this.maxCoins) {
            this.maxCoins = this.coins;
        }

        if (this.coins <= 0) {
            this.gameState = "lost";
            result.game_over = true;
        } else if (this.coins >= 100) {
            this.gameState = "won";
            result.cashout_available = true;
            result.message = this.getMessageForEvent("reaching_cashout");
        }

        this.betHistory.push(result);
        this.updateManipulationPhase();

        return result;
    }

    updateManipulationPhase() {
        if (this.totalBets <= 10) {
            this.manipulationPhase = "initial";
        } else if (this.totalBets <= 30) {
            this.manipulationPhase = "intermediate";
        } else {
            this.manipulationPhase = "critical";
        }
    }

    // Tentativa de saque
    attemptCashout(confirmed = false) {
        this.attemptedCashouts++;

        if (this.coins < 100) {
            return {
                success: false,
                message: "Você precisa de 100 moedas para sacar!",
                coins: this.coins
            };
        }

        if (this.attemptedCashouts === 1 && !confirmed) {
            return {
                success: false,
                need_confirmation: true,
                message: "PARABÉNS! Você atingiu 100 moedas!\n\nSuas chances de ganhar aumentaram 60%!\n\nTem certeza que quer parar agora?",
                coins: this.coins,
                psychological_trap: true
            };
        }

        const coinsToWithdraw = this.coins;
        const finalAmount = this.applyFinalManipulation(coinsToWithdraw);

        this.coins = 0;
        this.gameState = "lost";

        return {
            success: true,
            original_amount: coinsToWithdraw,
            final_amount: finalAmount,
            fees: coinsToWithdraw - finalAmount,
            message: `Saque processado: ${finalAmount} moedas`,
            coins: 0
        };
    }

    // Aplicar manipulação final
    applyFinalManipulation(amount) {
        let finalAmount = amount;

        // Taxa de processamento (80% de chance)
        if (Math.random() < 0.8) {
            const fee = Math.max(Math.floor(finalAmount * 0.15), 3);
            finalAmount -= fee;
        }

        // Rodadas obrigatórias (70% de chance)
        if (Math.random() < 0.7) {
            const lost = Math.floor(Math.random() * 10) + 5;
            finalAmount = Math.max(0, finalAmount - lost);
        }

        // Bônus manipulado (60% de chance)
        if (Math.random() < 0.6 && finalAmount > 5) {
            const lossBonus = Math.floor(Math.random() * 8) + 2;
            finalAmount = Math.max(0, finalAmount - lossBonus);
        }

        return Math.max(0, Math.min(finalAmount, 8));
    }

    // Obter estatísticas finais
    getFinalStats() {
        const netProfit = this.coins - this.initialCoins;
        const platformProfit = this.totalLost - this.totalWon;

        return {
            initial_coins: this.initialCoins,
            final_coins: this.coins,
            total_bet: this.totalBets,
            total_won: this.totalWon,
            total_lost: this.totalLost,
            net_profit: netProfit,
            platform_profit: platformProfit,
            near_misses: this.nearMisses,
            max_coins_reached: this.maxCoins,
            time_playing_minutes: Math.floor(this.timePlayingSeconds / 60),
            max_loss_streak: Math.max(this.lossStreak, 1),
            max_win_streak: Math.max(this.winStreak, 1),
            manipulation_phase: this.manipulationPhase,
            attempted_cashouts: this.attemptedCashouts
        };
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BetGameManipulator;
}
