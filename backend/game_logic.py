import random
import math
from datetime import datetime

class BetGameManipulator:
    """
    Sistema de jogo de apostas com algoritmo PROPOSITALMENTE manipulador
    para demonstrar criticamente como as plataformas reais controlam psicologicamente
    os usuários através de reforço variável, quase vitórias e recompensas emocionais.
    """
    
    def __init__(self):
        self.reset_game()
        self.manipulation_history = []
        self.messages_history = []
        
    def reset_game(self):
        self.coins = 10
        self.initial_coins = 10
        self.total_bets = 0
        self.total_won = 0
        self.total_lost = 0
        self.game_state = "playing"  # playing, won, lost
        self.near_misses = 0
        self.win_streak = 0
        self.loss_streak = 0
        self.max_coins = 10
        self.time_playing_seconds = 0
        self.bet_history = []
        self.emotional_messages = []
        self.manipulation_phase = "initial"  # initial, intermediate, critical
        self.attempted_cashouts = 0
        
    def calculate_win_probability(self, bet_amount):
        """
        Calcula a probabilidade de vitória baseada na MANIPULAÇÃO PSICOLÓGICA.
        Fases progressivas que favorecem o jogador no início e depois o prejudicam.
        """
        
        # FASE 1: INICIAL (primeiras 5-10 apostas)
        # Jogador tem 60-70% de chance de ganhar para criar confiança
        if self.total_bets <= 10:
            if self.total_bets <= 3:
                return random.uniform(0.65, 0.75)  # Muito fácil ganhar
            else:
                return random.uniform(0.55, 0.65)  # Ainda favorável
        
        # FASE 2: INTERMEDIÁRIA (apostas 11-30)
        # Redução gradual. Começa em 55% e vai para 35%
        elif self.total_bets <= 30:
            progress = (self.total_bets - 10) / 20  # 0 a 1
            win_prob = 0.55 - (progress * 0.20)  # De 55% para 35%
            
            # Aumentar "quase vitórias" para manter esperança
            if random.random() < 0.15:  # 15% de chance de "quase vitória"
                self.near_misses += 1
                return 0.49  # Quase ganha (49%)
            
            return win_prob + random.uniform(-0.05, 0.05)
        
        # FASE 3: CRÍTICA (acima de 30 apostas)
        # Destruição progressiva
        else:
            # Se perto de sacar (perto de 100 moedas), reduzir drasticamente
            if self.coins >= 70:
                return random.uniform(0.10, 0.20)  # Apenas 10-20% de chance
            elif self.coins >= 50:
                return random.uniform(0.20, 0.30)  # 20-30%
            else:
                return random.uniform(0.25, 0.35)  # 25-35%
    
    def calculate_win_amount(self, bet_amount):
        """
        Calcula o ganho quando o jogador vence.
        Mantém ganhos pequenos para estender o jogo.
        """
        if self.total_bets <= 10:
            # Ganhos générosos no início para criar esperança
            multiplier = random.choice([1.5, 2.0, 2.5])
        elif self.total_bets <= 25:
            # Ganhos moderados
            multiplier = random.choice([1.2, 1.5, 1.8])
        else:
            # Ganhos mínimos (quase sem lucro)
            multiplier = random.choice([1.0, 1.1, 1.2])
        
        return int(bet_amount * multiplier)
    
    def get_psychological_message(self, event_type, context=None):
        """
        Gera mensagens psicologicamente manipuladoras baseadas no contexto.
        """
        messages = {
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
        }
        
        if event_type in messages:
            msg = random.choice(messages[event_type])
            self.messages_history.append({"type": event_type, "message": msg})
            return msg
        return ""
    
    def place_bet(self, bet_amount):
        """
        Sistema principal de aposta com manipulação psicológica.
        Retorna resultado completo com dados de manipulação.
        """
        
        if bet_amount > self.coins or bet_amount <= 0:
            return {
                "success": False,
                "error": "Aposta inválida",
                "coins": self.coins
            }
        
        self.total_bets += 1
        self.time_playing_seconds += random.randint(10, 60)  # Simular tempo de jogo
        
        # Determinar resultado
        win_prob = self.calculate_win_probability(bet_amount)
        is_win = random.random() < win_prob
        
        result = {
            "bet_amount": bet_amount,
            "is_win": is_win,
            "near_miss": False,
            "coins": self.coins,
            "message": "",
            "celebration": False,
            "psychological_impact": 0
        }
        
        # Processar vitória
        if is_win:
            win_amount = self.calculate_win_amount(bet_amount)
            self.coins += win_amount
            self.total_won += win_amount
            self.win_streak += 1
            self.loss_streak = 0
            result["won"] = win_amount
            result["coins"] = self.coins
            
            # Determinar se é "quase vitória"
            if win_amount == bet_amount:  # Empate = sensação de "quase"
                result["near_miss"] = True
                result["message"] = self.get_psychological_message("near_miss")
                self.near_misses += 1
            elif win_amount < bet_amount * 1.3:
                result["celebration"] = False
                result["message"] = self.get_psychological_message("small_win")
            else:
                result["celebration"] = True
                result["message"] = self.get_psychological_message("big_win")
                result["psychological_impact"] = 10
        
        # Processar derrota
        else:
            loss_amount = bet_amount
            self.coins -= loss_amount
            self.total_lost += loss_amount
            self.loss_streak += 1
            self.win_streak = 0
            result["lost"] = loss_amount
            result["coins"] = max(0, self.coins)
            
            # Mensagem manipuladora baseada na situação
            if self.coins < 5 and self.total_bets > 15:
                result["message"] = self.get_psychological_message("desperate")
                result["psychological_impact"] = -8
            else:
                result["message"] = self.get_psychological_message("loss")
                result["psychological_impact"] = -3
        
        # Atualizar máximo alcançado
        if self.coins > self.max_coins:
            self.max_coins = self.coins
        
        # Verificar estado do jogo
        if self.coins <= 0:
            self.game_state = "lost"
            result["game_over"] = True
        elif self.coins >= 100:
            self.game_state = "won"
            result["cashout_available"] = True
            result["message"] = self.get_psychological_message("reaching_cashout")
        
        self.bet_history.append(result)
        self.update_manipulation_phase()
        
        return result
    
    def update_manipulation_phase(self):
        """Atualiza a fase de manipulação baseada no progresso."""
        if self.total_bets <= 10:
            self.manipulation_phase = "initial"
        elif self.total_bets <= 30:
            self.manipulation_phase = "intermediate"
        else:
            self.manipulation_phase = "critical"
    
    def attempt_cashout(self):
        """
        Tentativa de saque. O sistema manipula para impedir saques reais em lucro.
        """
        self.attempted_cashouts += 1
        
        if self.coins < 100:
            return {
                "success": False,
                "message": "Você precisa de 100 moedas para sacar!",
                "coins": self.coins
            }
        
        # Primeira tentativa de saque: criar ilusão de vitória
        if self.attempted_cashouts == 1:
            return {
                "success": False,
                "need_confirmation": True,
                "message": "PARABÉNS! Você atingiu 100 moedas!\n\nSuas chances de ganhar aumentaram 60%!\n\nTem certeza que quer parar agora?",
                "coins": self.coins,
                "psychological_trap": True
            }
        
        # Se confirmou saque: aplicar "taxas" e perdas rápidas
        coins_to_cashout = self.coins
        
        # Aplicar manipulação final
        final_amount = self.apply_final_manipulation(coins_to_cashout)
        
        self.coins = 0
        self.game_state = "lost"
        
        return {
            "success": True,
            "original_amount": coins_to_cashout,
            "final_amount": final_amount,
            "fees": coins_to_cashout - final_amount,
            "message": f"Saque processado: {final_amount} moedas",
            "coins": 0
        }
    
    def apply_final_manipulation(self, amount):
        """
        Aplicar manipulações finais que impedem saque real em lucro.
        Usa "taxas ocultas", "rodadas obrigatórias", etc.
        """
        
        # Simular várias formas de manipulação
        manipulations = []
        final_amount = amount
        
        # "Taxa de processamento"
        if random.random() < 0.8:
            fee = max(int(final_amount * 0.15), 3)
            final_amount -= fee
            manipulations.append({"type": "taxa_processamento", "amount": fee})
        
        # "Rodadas obrigatórias" que o jogador perde
        if random.random() < 0.7:
            lost_in_mandatory = random.randint(5, 15)
            final_amount = max(0, final_amount - lost_in_mandatory)
            manipulations.append({"type": "rodadas_obrigatorias", "amount": lost_in_mandatory})
        
        # "Bônus que precisa ser apostado"
        if random.random() < 0.6 and final_amount > 5:
            bonus_loss = random.randint(2, 10)
            final_amount = max(0, final_amount - bonus_loss)
            manipulations.append({"type": "bonus_manipulado", "amount": bonus_loss})
        
        self.manipulation_history = manipulations
        
        # Garantir que o jogador sai com muito menos ou nada
        return max(0, min(final_amount, 8))  # Máximo que ele consegue é 8 (ganho mínimo)
    
    def get_final_stats(self):
        """
        Gera estatísticas finais para o dashboard crítico.
        """
        net_profit = self.coins - self.initial_coins
        platform_profit = self.total_lost - self.total_won
        
        return {
            "initial_coins": self.initial_coins,
            "final_coins": self.coins,
            "total_bet": self.total_bets,
            "total_won": self.total_won,
            "total_lost": self.total_lost,
            "net_profit": net_profit,
            "platform_profit": platform_profit,
            "near_misses": self.near_misses,
            "max_coins_reached": self.max_coins,
            "time_playing_minutes": self.time_playing_seconds // 60,
            "max_loss_streak": max([self.loss_streak] + [1]),
            "max_win_streak": max([self.win_streak] + [1]),
            "manipulation_phase": self.manipulation_phase,
            "attempted_cashouts": self.attempted_cashouts
        }
