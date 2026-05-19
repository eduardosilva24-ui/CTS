from flask import Flask, jsonify, request
from flask_cors import CORS
from game_logic import BetGameManipulator
import json

app = Flask(__name__)
CORS(app)

# Dicionário para manter sessões de jogo
game_sessions = {}

def get_or_create_session(session_id):
    """Obtém ou cria uma sessão de jogo."""
    if session_id not in game_sessions:
        game_sessions[session_id] = BetGameManipulator()
    return game_sessions[session_id]

@app.route('/api/game/start', methods=['POST'])
def start_game():
    """Inicia uma nova sessão de jogo."""
    data = request.json
    session_id = data.get('session_id', 'default')
    
    game = BetGameManipulator()
    game_sessions[session_id] = game
    
    return jsonify({
        "success": True,
        "session_id": session_id,
        "coins": game.coins,
        "message": "Bem-vindo! Você começa com 10 moedas. Você precisa atingir 100 moedas para sacar!"
    })

@app.route('/api/game/state/<session_id>', methods=['GET'])
def get_game_state(session_id):
    """Retorna o estado atual do jogo."""
    game = get_or_create_session(session_id)
    
    return jsonify({
        "coins": game.coins,
        "total_bets": game.total_bets,
        "game_state": game.game_state,
        "near_misses": game.near_misses,
        "max_coins": game.max_coins,
        "manipulation_phase": game.manipulation_phase,
        "win_streak": game.win_streak,
        "loss_streak": game.loss_streak
    })

@app.route('/api/game/bet', methods=['POST'])
def place_bet():
    """Processa uma aposta."""
    data = request.json
    session_id = data.get('session_id', 'default')
    bet_amount = data.get('bet_amount', 1)
    
    game = get_or_create_session(session_id)
    
    if game.game_state != "playing":
        return jsonify({
            "success": False,
            "error": "Jogo já terminou",
            "coins": game.coins
        }), 400
    
    result = game.place_bet(bet_amount)
    
    response = {
        "success": result.get("success", True),
        "bet_amount": result.get("bet_amount", bet_amount),
        "is_win": result.get("is_win", False),
        "coins": result.get("coins", game.coins),
        "message": result.get("message", ""),
        "celebration": result.get("celebration", False),
        "near_miss": result.get("near_miss", False),
        "psychological_impact": result.get("psychological_impact", 0)
    }
    
    if result.get("is_win"):
        response["won"] = result.get("won", 0)
    else:
        response["lost"] = result.get("lost", 0)
    
    if result.get("game_over"):
        response["game_over"] = True
        response["final_message"] = "Você perdeu todas as suas moedas!"
        response["stats"] = game.get_final_stats()
    
    if result.get("cashout_available"):
        response["cashout_available"] = True
    
    return jsonify(response)

@app.route('/api/game/cashout', methods=['POST'])
def cashout():
    """Processa tentativa de saque."""
    data = request.json
    session_id = data.get('session_id', 'default')
    confirmed = data.get('confirmed', False)
    
    game = get_or_create_session(session_id)
    
    result = game.attempt_cashout()
    
    if result.get("need_confirmation") and not confirmed:
        return jsonify({
            "success": False,
            "need_confirmation": True,
            "message": result.get("message"),
            "coins": result.get("coins"),
            "psychological_trap": True
        })
    
    if result.get("success"):
        stats = game.get_final_stats()
        return jsonify({
            "success": True,
            "original_amount": result.get("original_amount"),
            "final_amount": result.get("final_amount"),
            "fees": result.get("fees"),
            "message": result.get("message"),
            "stats": stats,
            "manipulations": game.manipulation_history
        })
    else:
        return jsonify(result), 400

@app.route('/api/game/stats/<session_id>', methods=['GET'])
def get_stats(session_id):
    """Retorna estatísticas finais do jogo."""
    game = get_or_create_session(session_id)
    stats = game.get_final_stats()
    
    return jsonify(stats)

@app.route('/api/game/reset/<session_id>', methods=['POST'])
def reset_game(session_id):
    """Reseta o jogo para a sessão."""
    if session_id in game_sessions:
        del game_sessions[session_id]
    
    return jsonify({"success": True, "message": "Jogo resetado"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
