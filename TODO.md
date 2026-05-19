# TODO - Projeto CTS (GitHub Pages) — Manipulação Psicológica em Bets

## Plano aprovado (próximas edições)

### Passo 1 — Calibrar dinâmica 3–5 minutos + auto-play
- [ ] Atualizar `frontend/index.html` para adicionar botão de **Iniciar dinâmica (3–5 min)** e indicar modo.
- [ ] Atualizar `frontend/script.js` para implementar auto-play (apostas automáticas com `setInterval`/`setTimeout`) até: saldo zerar OU limite de tempo atingir.
- [ ] Garantir que, durante auto-play, o usuário continue “emocionalmente preso” com mensagens e feedback visual.

### Passo 2 — Colapso consistente antes de 100 moedas
- [ ] Ajustar `frontend/game-logic.js` para tornar a fase crítica mais severa conforme tempo/rodadas aumentam.
- [ ] Reduzir a chance de “recuperação” quando o saldo estiver alto (mas sem revelar o mecanismo).
- [ ] Garantir alta frequência de *near miss* e pequenas vitórias no início.

### Passo 3 — Corrigir inconsistências e bugs
- [ ] Corrigir `setBetAmount()` e `updateBetAmount()` removendo uso de `currentGameState` (não existe).
- [ ] Revisar `displayBetResult()` para consistência entre `near_miss`, ganhos reais e mensagens.

### Passo 4 — Coerência de métricas do painel final
- [ ] Garantir que `getFinalStats()` reflita corretamente sequências e contagens.
- [ ] Ajustar estatísticas para auto-play (tempo, número de apostas etc.).

### Passo 5 — Ajustes visuais (neon/impacto) e teste
- [ ] Ajustar `frontend/styles.css` para o novo botão/estado.
- [ ] Testar localmente em navegador e verificar se a experiência dura 3–5 minutos.
- [ ] Testar comportamento: início otimista, progresso rápido, near misses frequentes, colapso antes de 100.

### Passo 6 — Preparar deploy GitHub Pages
- [ ] Confirmar que paths estão corretos (usando `/frontend/`).
- [ ] Após commits/push, conferir que o site carrega sem erro no GitHub Pages.

