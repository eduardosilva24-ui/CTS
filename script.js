(() => {
  "use strict";

  const CONFIG = {
    initialCoins: 10,
    cashoutGoal: 100,
    minDurationMs: 180000,
    maxDurationMs: 300000,
    targetMinMs: 215000,
    targetMaxMs: 265000,
    reelSpinMs: 620
  };

  const SYMBOLS = ["7", "$", "+", "X", "M", "?"];
  const COLORS = ["#39f5a7", "#3ad7ff", "#ffd166", "#ff4d6d", "#ff4fd8"];

  const messages = {
    engagement: {
      win: [
        "Voce e incrivel! Seu ritmo esta acima da media.",
        "Hoje e seu dia. A plataforma esta sentindo sua energia.",
        "Estamos orgulhosos de voce. Continue nessa sequencia.",
        "Voce nasceu para isso. O premio esta se aproximando.",
        "Seu premio esta chegando, mantenha o foco."
      ],
      near: [
        "Quase uma virada perfeita. Mais uma e encaixa.",
        "Dois simbolos certos. Voce ja entendeu o padrao.",
        "Foi por pouco. O sistema esta aquecendo para voce."
      ],
      loss: [
        "Pequena oscilacao. Jogadores bons continuam frios.",
        "Normal perder uma rodada no comeco. A tendencia ainda e sua.",
        "Isso so ajusta o ciclo. A proxima pode compensar."
      ]
    },
    retention: {
      win: [
        "Agora vai! Voce recuperou exatamente no momento certo.",
        "Seu retorno esta acontecendo. Falta pouco para liberar o saque.",
        "Muitos param antes dessa fase. Voce continuou e foi recompensado.",
        "A sequencia voltou. Continue antes que a janela feche."
      ],
      near: [
        "Voce quase conseguiu. A proxima rodada pode mudar tudo.",
        "Voce esta MUITO perto. Dois acertos nao aparecem por acaso.",
        "So mais uma tentativa. A leitura esta correta.",
        "Muitos jogadores desistem exatamente antes da grande vitoria."
      ],
      loss: [
        "Perda temporaria. Voce ainda esta dentro da zona de recuperacao.",
        "Respira. A virada costuma vir depois de duas quedas.",
        "Voce ja chegou longe demais para parar agora.",
        "A plataforma detectou potencial de recuperacao."
      ]
    },
    collapse: {
      win: [
        "Viu? Ainda existe recuperacao. A proxima pode ser maior.",
        "Essa vitoria prova que nao acabou. Falta muito pouco.",
        "Voce voltou para o jogo. Mantenha a coragem."
      ],
      near: [
        "Quase. Foi a rodada mais proxima ate agora.",
        "Falta muito pouco. A proxima pode mudar tudo.",
        "Voce consegue recuperar. A janela ainda esta aberta.",
        "Dois simbolos. Parar agora seria abandonar a virada."
      ],
      loss: [
        "Voce consegue recuperar. Uma rodada forte resolve.",
        "A proxima rodada pode mudar tudo.",
        "Voce ja investiu demais para sair no pior momento.",
        "Falta pouco para a virada emocional."
      ]
    }
  };

  const impactThresholds = [
    { value: 4, severity: "soft", text: "Voce deixou de pagar um deslocamento ate a universidade." },
    { value: 8, severity: "soft", text: "Esse valor poderia ajudar em xerox, material ou alimentacao no campus." },
    { value: 13, severity: "soft", text: "A perda ja pesa mais do que parecia quando era so uma moeda por rodada." },
    { value: 20, severity: "severe", text: "Voce deixou de pagar parte da conta de agua." },
    { value: 28, severity: "severe", text: "Esse dinheiro poderia ajudar na faculdade ou em uma emergencia pequena." },
    { value: 36, severity: "severe", text: "Voce abriu mao de comida do mes em troca de uma promessa de recuperacao." },
    { value: 46, severity: "severe", text: "Voce perdeu dinheiro equivalente a remedios ou cuidado basico." },
    { value: 60, severity: "severe", text: "Esse valor poderia ajudar sua familia. A interface chamou isso de entretenimento." }
  ];

  const fomoCopies = [
    "Sua janela de oportunidade esta aberta.",
    "Bonus de impulso expira em instantes.",
    "A sequencia esta quente agora.",
    "Rodadas proximas recebem leitura prioritaria.",
    "Jogadores persistentes costumam virar nessa etapa."
  ];

  const selectors = {
    intro: "#intro-screen",
    app: "#app",
    final: "#final-screen",
    start: "#start-experience",
    reveal: "#reveal-now",
    restart: "#restart-experience",
    elapsed: "#elapsed-time",
    rounds: "#round-count",
    lostCount: "#lost-count",
    coins: "#coin-balance",
    cashoutDistance: "#cashout-distance",
    cashoutProgress: "#cashout-progress",
    hopeScore: "#hope-score",
    hopeFill: "#hope-fill",
    grossWon: "#gross-won",
    grossLost: "#gross-lost",
    peakBalance: "#peak-balance",
    resultBanner: "#result-banner",
    persuasion: "#persuasion-message",
    fomoTimer: "#fomo-timer",
    fomoCopy: "#fomo-copy",
    manualPlay: "#manual-play",
    autoToggle: "#auto-play-toggle",
    cashoutButton: "#cashout-button",
    impactFeed: "#impact-feed",
    toastLayer: "#toast-layer",
    confettiLayer: "#confetti-layer",
    reel1: "#reel-1",
    reel2: "#reel-2",
    reel3: "#reel-3"
  };

  const els = {};
  let state = createInitialState();
  let particles = [];
  let particleFrame = 0;
  let canvasContext = null;
  let reducedMotion = false;

  function createInitialState() {
    return {
      coins: CONFIG.initialCoins,
      displayedCoins: CONFIG.initialCoins,
      selectedStake: 1,
      round: 0,
      totalStaked: 0,
      grossWon: 0,
      totalLost: 0,
      nearMisses: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      lossStreak: 0,
      maxWinStreak: 0,
      maxLossStreak: 0,
      maxBalance: CONFIG.initialCoins,
      startTime: 0,
      elapsedMs: 0,
      targetDurationMs: randomInt(CONFIG.targetMinMs, CONFIG.targetMaxMs),
      autoRunning: true,
      locked: false,
      finalShown: false,
      clockTimer: 0,
      nextRoundTimer: 0,
      fomoTimer: 0,
      fomoRemaining: 18,
      fomoCopyIndex: 0,
      retentionBoosts: 0,
      impactShown: new Set(),
      history: [{ round: 0, balance: CONFIG.initialCoins, delta: 0, phase: "engagement", type: "start", elapsed: 0 }],
      phaseHits: {
        engagement: 0,
        retention: 0,
        collapse: 0
      },
      triggerCounts: {
        variableReward: 0,
        nearMiss: 0,
        lossRecovery: 0,
        fomo: 0,
        illusionControl: 0,
        visualReward: 0
      }
    };
  }

  function init() {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Object.entries(selectors).forEach(([key, selector]) => {
      els[key] = document.querySelector(selector);
    });

    bindEvents();
    setupParticles();
    renderState();
  }

  function bindEvents() {
    els.start.addEventListener("click", startExperience);
    els.reveal.addEventListener("click", () => revealAnalysis(true));
    els.restart.addEventListener("click", () => window.location.reload());
    els.manualPlay.addEventListener("click", () => runRound("manual"));
    els.autoToggle.addEventListener("click", toggleAutoPlay);
    els.cashoutButton.addEventListener("click", handleCashoutAttempt);

    document.querySelectorAll(".stake-option").forEach((button) => {
      button.addEventListener("click", () => {
        const requestedStake = Number(button.dataset.stake);
        state.selectedStake = clamp(requestedStake, 1, Math.max(1, state.coins));
        state.triggerCounts.illusionControl += 1;
        updateStakeButtons();
        pulseElement(button);
      });
    });
  }

  function startExperience() {
    state = createInitialState();
    state.startTime = performance.now();
    els.intro.classList.add("is-hidden");
    els.app.classList.remove("is-hidden");
    els.final.classList.add("is-hidden");
    renderState();
    startTimers();
    showToast("A primeira fase aumenta sua confianca com recompensas frequentes.", "win");
    setPersuasionMessage("Voce comeca com 10 moedas. O saque fica logo ali: 100 moedas.");
    scheduleNextRound(900);
  }

  function startTimers() {
    clearInterval(state.clockTimer);
    clearInterval(state.fomoTimer);

    state.clockTimer = window.setInterval(() => {
      if (!state.startTime || state.finalShown) {
        return;
      }

      state.elapsedMs = performance.now() - state.startTime;
      els.elapsed.textContent = formatTime(state.elapsedMs);
      updateFomoTimer();

      if (state.autoRunning && !state.locked && state.elapsedMs >= state.targetDurationMs) {
        runRound("auto");
      }
    }, 1000);

    state.fomoTimer = window.setInterval(() => {
      if (!state.finalShown) {
        state.triggerCounts.fomo += 1;
      }
    }, 7000);
  }

  function toggleAutoPlay() {
    state.autoRunning = !state.autoRunning;
    els.autoToggle.textContent = state.autoRunning ? "Modo automatico ativo" : "Retomar modo automatico";
    els.autoToggle.classList.toggle("paused", !state.autoRunning);

    if (state.autoRunning) {
      setPersuasionMessage("Otimo. Rodadas automaticas reduzem sua hesitacao.");
      scheduleNextRound(650);
    } else {
      setPersuasionMessage("Pausar parece seguro, mas a sensacao de quase ganhar continua ativa.");
      clearTimeout(state.nextRoundTimer);
    }
  }

  function runRound(source) {
    if (state.locked || state.finalShown || !state.startTime) {
      return;
    }

    if (state.coins <= 0) {
      revealAnalysis(false);
      return;
    }

    state.locked = true;
    state.elapsedMs = performance.now() - state.startTime;

    const phase = getCurrentPhase();
    const stake = source === "auto" ? chooseAutoStake(phase) : clamp(state.selectedStake, 1, state.coins);
    state.selectedStake = stake;
    updateStakeButtons();

    const outcome = createOutcome(phase, stake);
    spinReels(outcome.reels, () => {
      applyOutcome(outcome);
      renderOutcome(outcome);
      renderState();

      state.locked = false;

      if (state.coins <= 0 && state.elapsedMs >= CONFIG.minDurationMs) {
        window.setTimeout(() => revealAnalysis(false), 1500);
        return;
      }

      if (state.autoRunning && !state.finalShown) {
        scheduleNextRound(nextDelayForPhase(getCurrentPhase()));
      }
    });
  }

  function getCurrentPhase() {
    const progress = clamp(state.elapsedMs / state.targetDurationMs, 0, 1.2);

    if (progress >= 0.72 || state.maxBalance >= 88) {
      return "collapse";
    }

    if (progress >= 0.28 || state.round >= 18) {
      return "retention";
    }

    return "engagement";
  }

  function chooseAutoStake(phase) {
    if (state.coins <= 1) {
      return 1;
    }

    if (phase === "engagement") {
      const pool = state.coins < 18 ? [1, 1, 1, 2] : [1, 2, 2, 3];
      return clamp(sample(pool), 1, state.coins);
    }

    if (phase === "retention") {
      if (state.coins >= 62) {
        return clamp(sample([3, 4, 5, 5]), 1, state.coins);
      }

      if (state.coins <= 9) {
        return 1;
      }

      return clamp(sample([2, 2, 3, 4]), 1, state.coins);
    }

    if (state.elapsedMs < CONFIG.minDurationMs && state.coins <= 6) {
      return 1;
    }

    const pressureStake = Math.ceil(state.coins * randomFloat(0.24, 0.46));
    return clamp(pressureStake, 1, Math.min(9, state.coins));
  }

  function createOutcome(phase, stake) {
    const progress = clamp(state.elapsedMs / state.targetDurationMs, 0, 1.2);
    const canFinish = state.elapsedMs >= CONFIG.minDurationMs && progress >= 0.86;
    const mustFinish = progress >= 0.96 || state.elapsedMs >= CONFIG.maxDurationMs;

    if ((mustFinish || canFinish) && phase === "collapse") {
      return makeLossOutcome(phase, state.coins, true);
    }

    if (phase === "engagement") {
      if (state.round <= 1) {
        return makeWinOutcome(phase, stake, randomFloat(2.1, 2.8));
      }

      const roll = Math.random();
      if (roll < 0.72) {
        return makeWinOutcome(phase, stake, randomFloat(1.7, 2.6));
      }
      if (roll < 0.86) {
        return makeNearMissOutcome(phase, stake);
      }
      return makeLossOutcome(phase, stake, false);
    }

    if (phase === "retention") {
      if (shouldInjectRetentionBoost(progress)) {
        state.retentionBoosts += 1;
        return makeWinOutcome(phase, stake, randomFloat(2.35, 3.35), true);
      }

      if (state.lossStreak >= 3 && state.coins < 36) {
        return makeWinOutcome(phase, Math.min(stake, 2), randomFloat(1.75, 2.25), true);
      }

      if (state.coins >= 86) {
        return Math.random() < 0.62 ? makeNearMissOutcome(phase, stake) : makeLossOutcome(phase, stake, false);
      }

      const winChance = state.coins < 15 ? 0.54 : state.coins > 70 ? 0.18 : 0.36;
      const nearChance = state.coins > 70 ? 0.42 : 0.31;
      const roll = Math.random();

      if (roll < winChance) {
        return makeWinOutcome(phase, stake, randomFloat(1.45, 2.3));
      }
      if (roll < winChance + nearChance) {
        return makeNearMissOutcome(phase, stake);
      }
      return makeLossOutcome(phase, stake, false);
    }

    if (state.elapsedMs < CONFIG.minDurationMs && state.coins <= Math.max(4, stake)) {
      return makeWinOutcome(phase, 1, randomFloat(2.0, 2.6), true);
    }

    if (progress < 0.84 && state.coins <= 8) {
      return Math.random() < 0.54 ? makeWinOutcome(phase, 1, randomFloat(1.8, 2.4), true) : makeNearMissOutcome(phase, 1);
    }

    if (state.coins >= 82) {
      return Math.random() < 0.72 ? makeLossOutcome(phase, stake, false) : makeNearMissOutcome(phase, stake);
    }

    const roll = Math.random();
    if (roll < 0.08) {
      return makeWinOutcome(phase, Math.min(stake, 2), randomFloat(1.4, 1.8));
    }
    if (roll < 0.43) {
      return makeNearMissOutcome(phase, stake);
    }
    return makeLossOutcome(phase, stake, false);
  }

  function shouldInjectRetentionBoost(progress) {
    if (state.retentionBoosts >= 5) {
      return false;
    }

    if (progress > 0.44 && state.maxBalance < 58) {
      return true;
    }

    if (progress > 0.54 && state.maxBalance < 76) {
      return true;
    }

    if (progress > 0.62 && state.maxBalance < 86) {
      return true;
    }

    return false;
  }

  function makeWinOutcome(phase, stake, multiplier, boosted = false) {
    let payout = Math.max(stake + 1, Math.ceil(stake * multiplier));
    const projected = state.coins - stake + payout;

    if (projected >= CONFIG.cashoutGoal - 3) {
      return makeNearMissOutcome(phase, stake, true);
    }

    if (projected > 93) {
      payout = Math.max(stake + 1, 93 - state.coins + stake);
    }

    if (payout <= stake) {
      return makeNearMissOutcome(phase, stake, true);
    }

    const symbol = sample(["7", "$", "+"]);
    return {
      type: "win",
      phase,
      stake,
      payout,
      delta: payout - stake,
      reels: [symbol, symbol, symbol],
      message: sample(messages[phase].win),
      boosted
    };
  }

  function makeNearMissOutcome(phase, stake, forced = false) {
    let loss = stake;

    if (state.elapsedMs < CONFIG.minDurationMs && state.coins - loss <= 0) {
      loss = Math.max(0, state.coins - 1);
    }

    if (loss === 0) {
      return makeWinOutcome(phase, 1, 2.1, true);
    }

    const anchor = sample(["7", "$", "+"]);
    const third = sample(SYMBOLS.filter((symbol) => symbol !== anchor));
    return {
      type: "near",
      phase,
      stake,
      loss,
      delta: -loss,
      reels: [anchor, anchor, third],
      message: forced ? "Voce bateu na trave do saque. A proxima pode liberar tudo." : sample(messages[phase].near),
      boosted: false
    };
  }

  function makeLossOutcome(phase, stake, finalDrain) {
    let loss = finalDrain ? state.coins : stake;

    if (state.elapsedMs < CONFIG.minDurationMs && state.coins - loss <= 0) {
      loss = Math.max(0, state.coins - 1);
      if (loss === 0) {
        return makeWinOutcome(phase, 1, 2.1, true);
      }
    }

    const reels = shuffle(["7", "$", "+", "X", "M", "?"]).slice(0, 3);
    return {
      type: "loss",
      phase,
      stake: loss,
      loss,
      delta: -loss,
      reels,
      message: finalDrain ? "A ultima rodada absorveu o saldo restante antes do saque." : sample(messages[phase].loss),
      boosted: false,
      finalDrain
    };
  }

  function applyOutcome(outcome) {
    state.round += 1;
    state.phaseHits[outcome.phase] += 1;
    state.totalStaked += outcome.stake;
    state.triggerCounts.variableReward += outcome.type === "win" ? 2 : 1;
    state.triggerCounts.illusionControl += 1;

    if (outcome.type === "win") {
      state.grossWon += outcome.payout;
      state.coins = state.coins - outcome.stake + outcome.payout;
      state.wins += 1;
      state.winStreak += 1;
      state.lossStreak = 0;
      state.maxWinStreak = Math.max(state.maxWinStreak, state.winStreak);
      state.triggerCounts.visualReward += outcome.boosted ? 3 : 2;
    } else {
      const loss = outcome.loss;
      state.totalLost += loss;
      state.coins = Math.max(0, state.coins - loss);
      state.losses += 1;
      state.lossStreak += 1;
      state.winStreak = 0;
      state.maxLossStreak = Math.max(state.maxLossStreak, state.lossStreak);
      state.triggerCounts.lossRecovery += outcome.phase === "collapse" ? 3 : 1;

      if (outcome.type === "near") {
        state.nearMisses += 1;
        state.triggerCounts.nearMiss += 3;
      }
    }

    state.coins = clamp(Math.floor(state.coins), 0, CONFIG.cashoutGoal - 7);
    state.maxBalance = Math.max(state.maxBalance, state.coins);

    state.history.push({
      round: state.round,
      balance: state.coins,
      delta: outcome.delta,
      phase: outcome.phase,
      type: outcome.type,
      elapsed: state.elapsedMs
    });

    checkImpactMessages();
  }

  function renderOutcome(outcome) {
    const className = outcome.type === "win" ? "win" : outcome.type === "near" ? "near" : "loss";
    els.resultBanner.className = `result-banner ${className}`;

    if (outcome.type === "win") {
      els.resultBanner.textContent = `Vitoria! +${outcome.delta} moedas. ${outcome.message}`;
      createConfetti(outcome.boosted ? 72 : 44);
      showToast(outcome.boosted ? "Recuperacao turbinada ativada." : `Voce ganhou ${outcome.delta} moedas.`, "win");
    }

    if (outcome.type === "near") {
      els.resultBanner.textContent = `Quase! -${outcome.loss} moeda${outcome.loss > 1 ? "s" : ""}. ${outcome.message}`;
      createSparks();
      showToast("Quase-vitoria: o prejuizo foi apresentado como progresso.", "near");
    }

    if (outcome.type === "loss") {
      els.resultBanner.textContent = `${outcome.finalDrain ? "Colapso final." : "Rodada perdida."} -${outcome.loss} moeda${outcome.loss > 1 ? "s" : ""}. ${outcome.message}`;
      document.body.classList.add("screen-shake");
      window.setTimeout(() => document.body.classList.remove("screen-shake"), 430);
      showToast(outcome.message, "loss");
    }

    setPersuasionMessage(outcome.message);
  }

  function renderState() {
    updatePhaseUI();
    updateStakeButtons();

    animateNumber(els.coins, state.displayedCoins, state.coins, 520);
    state.displayedCoins = state.coins;

    els.rounds.textContent = String(state.round);
    els.lostCount.textContent = String(state.totalLost);
    els.cashoutDistance.textContent = `faltam ${Math.max(0, CONFIG.cashoutGoal - state.coins)}`;
    els.grossWon.textContent = String(state.grossWon);
    els.grossLost.textContent = String(state.totalLost);
    els.peakBalance.textContent = String(state.maxBalance);

    const progress = clamp((state.coins / CONFIG.cashoutGoal) * 100, 0, 100);
    els.cashoutProgress.style.width = `${progress}%`;

    const hope = calculateHopeScore();
    els.hopeScore.textContent = `${hope}%`;
    els.hopeFill.style.width = `${hope}%`;

    const canCashout = state.coins >= CONFIG.cashoutGoal;
    els.cashoutButton.disabled = !canCashout;
    els.cashoutButton.textContent = canCashout ? "Sacar moedas" : `Saque bloqueado: ${CONFIG.cashoutGoal - state.coins} moedas restantes`;
  }

  function updatePhaseUI() {
    const phase = getCurrentPhase();
    ["engagement", "retention", "collapse"].forEach((name) => {
      const element = document.querySelector(`#phase-${name}`);
      element.classList.toggle("is-active", name === phase);
    });
  }

  function updateStakeButtons() {
    document.querySelectorAll(".stake-option").forEach((button) => {
      const stake = Number(button.dataset.stake);
      button.classList.toggle("is-active", stake === state.selectedStake);
      button.disabled = stake > state.coins || state.locked;
    });
  }

  function calculateHopeScore() {
    const phase = getCurrentPhase();
    const phaseBias = phase === "engagement" ? 12 : phase === "retention" ? 24 : 32;
    const nearBias = Math.min(22, state.nearMisses * 3);
    const lossRecoveryBias = state.lossStreak > 0 ? Math.min(18, state.lossStreak * 4) : 0;
    const peakBias = Math.round(state.maxBalance * 0.62);
    return clamp(18 + phaseBias + nearBias + lossRecoveryBias + peakBias, 18, 98);
  }

  function setPersuasionMessage(text) {
    els.persuasion.textContent = text;
    els.persuasion.classList.remove("is-flashing");
    void els.persuasion.offsetWidth;
    els.persuasion.classList.add("is-flashing");
  }

  function checkImpactMessages() {
    impactThresholds.forEach((item) => {
      if (state.totalLost >= item.value && !state.impactShown.has(item.value)) {
        state.impactShown.add(item.value);
        const li = document.createElement("li");
        li.textContent = item.text;
        li.className = item.severity === "severe" ? "severe" : "";
        els.impactFeed.prepend(li);

        while (els.impactFeed.children.length > 5) {
          els.impactFeed.removeChild(els.impactFeed.lastElementChild);
        }
      }
    });
  }

  function scheduleNextRound(delay) {
    clearTimeout(state.nextRoundTimer);

    if (!state.autoRunning || state.finalShown) {
      return;
    }

    state.nextRoundTimer = window.setTimeout(() => runRound("auto"), delay);
  }

  function nextDelayForPhase(phase) {
    if (reducedMotion) {
      return phase === "collapse" ? 2200 : 2800;
    }

    if (phase === "engagement") {
      return randomInt(2200, 3150);
    }

    if (phase === "retention") {
      return randomInt(1650, 2450);
    }

    return randomInt(1180, 1850);
  }

  function spinReels(finalReels, callback) {
    const reels = [els.reel1, els.reel2, els.reel3];
    reels.forEach((reel) => reel.classList.add("is-spinning"));

    let ticks = 0;
    const spinTimer = window.setInterval(() => {
      ticks += 1;
      reels.forEach((reel) => {
        reel.textContent = sample(SYMBOLS);
      });

      if (ticks >= 8 || reducedMotion) {
        clearInterval(spinTimer);
        reels.forEach((reel, index) => {
          reel.textContent = finalReels[index];
          reel.classList.remove("is-spinning");
        });
        callback();
      }
    }, reducedMotion ? 40 : CONFIG.reelSpinMs / 8);
  }

  function handleCashoutAttempt() {
    if (state.coins < CONFIG.cashoutGoal) {
      setPersuasionMessage("Voce esta perto demais para sacar agora. Complete 100 moedas.");
      showToast("Saque bloqueado: a meta foi desenhada para ficar fora de alcance.", "near");
      return;
    }

    revealAnalysis(true);
  }

  function revealAnalysis(forceDrain) {
    if (state.finalShown) {
      return;
    }

    clearTimeout(state.nextRoundTimer);
    clearInterval(state.clockTimer);
    clearInterval(state.fomoTimer);

    if (forceDrain && state.coins > 0) {
      applyForcedFinalDrain();
    }

    if (state.coins > 0 && state.elapsedMs >= CONFIG.minDurationMs) {
      applyForcedFinalDrain();
    }

    state.finalShown = true;
    state.elapsedMs = state.startTime ? performance.now() - state.startTime : state.elapsedMs;

    els.app.classList.add("is-hidden");
    els.intro.classList.add("is-hidden");
    els.final.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

    renderFinalDashboard();
  }

  function applyForcedFinalDrain() {
    const loss = state.coins;
    if (loss <= 0) {
      return;
    }

    state.round += 1;
    state.totalStaked += loss;
    state.totalLost += loss;
    state.losses += 1;
    state.lossStreak += 1;
    state.maxLossStreak = Math.max(state.maxLossStreak, state.lossStreak);
    state.triggerCounts.lossRecovery += 4;
    state.coins = 0;
    state.history.push({
      round: state.round,
      balance: 0,
      delta: -loss,
      phase: "collapse",
      type: "loss",
      elapsed: state.elapsedMs
    });
  }

  function renderFinalDashboard() {
    const platformProfit = Math.max(0, state.totalStaked - state.grossWon);
    const finalStats = {
      "#final-balance": state.coins,
      "#final-lost": state.totalLost,
      "#final-won": state.grossWon,
      "#final-platform": platformProfit,
      "#final-rounds": state.round,
      "#final-near-misses": state.nearMisses,
      "#final-loss-streak": state.maxLossStreak
    };

    Object.entries(finalStats).forEach(([selector, value]) => {
      const element = document.querySelector(selector);
      animateNumber(element, 0, value, 1100);
    });

    const winStreakElement = document.querySelector("#final-win-streak");
    if (winStreakElement) {
      animateNumber(winStreakElement, 0, state.maxWinStreak, 1100);
    }

    document.querySelector("#final-time").textContent = formatTime(state.elapsedMs);
    renderBalanceChart();
    renderTriggerBars();
    renderFinalRealityList();
  }

  function renderBalanceChart() {
    const svg = document.querySelector("#balance-chart");
    const width = 640;
    const height = 220;
    const pad = 28;
    const points = state.history.length > 1 ? state.history : [
      { balance: CONFIG.initialCoins },
      { balance: state.coins }
    ];

    const maxY = CONFIG.cashoutGoal;
    const pathPoints = points.map((item, index) => {
      const x = pad + (index / Math.max(1, points.length - 1)) * (width - pad * 2);
      const y = height - pad - (clamp(item.balance, 0, maxY) / maxY) * (height - pad * 2);
      return [x, y];
    });

    const linePath = pathPoints.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
    const areaPath = `${linePath} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`;
    const cashoutY = height - pad - (CONFIG.cashoutGoal / maxY) * (height - pad * 2);
    const peakY = height - pad - (clamp(state.maxBalance, 0, maxY) / maxY) * (height - pad * 2);

    svg.innerHTML = `
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#39f5a7" stop-opacity="0.34"></stop>
          <stop offset="100%" stop-color="#39f5a7" stop-opacity="0"></stop>
        </linearGradient>
        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="#39f5a7"></stop>
          <stop offset="52%" stop-color="#ffd166"></stop>
          <stop offset="100%" stop-color="#ff4d6d"></stop>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="rgba(255,255,255,0.03)"></rect>
      <line x1="${pad}" y1="${cashoutY}" x2="${width - pad}" y2="${cashoutY}" stroke="#ff4d6d" stroke-width="1.5" stroke-dasharray="6 7"></line>
      <text x="${pad}" y="${cashoutY + 18}" fill="#ffb4c0" font-size="12" font-weight="800">meta de saque: 100</text>
      <line x1="${pad}" y1="${peakY}" x2="${width - pad}" y2="${peakY}" stroke="#ffd166" stroke-width="1" stroke-dasharray="4 8" opacity="0.7"></line>
      <path d="${areaPath}" fill="url(#areaGradient)"></path>
      <path d="${linePath}" fill="none" stroke="url(#lineGradient)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle cx="${pathPoints[pathPoints.length - 1][0]}" cy="${pathPoints[pathPoints.length - 1][1]}" r="6" fill="#ff4d6d"></circle>
    `;
  }

  function renderTriggerBars() {
    const totalRounds = Math.max(1, state.round);
    const values = [
      ["Reforco variavel", clamp(54 + state.triggerCounts.variableReward / totalRounds * 18, 0, 98)],
      ["Quase-vitoria", clamp(28 + state.nearMisses / totalRounds * 180, 0, 98)],
      ["Recuperacao de perdas", clamp(34 + state.triggerCounts.lossRecovery / totalRounds * 34, 0, 98)],
      ["Urgencia e FOMO", clamp(42 + state.triggerCounts.fomo * 4, 0, 98)],
      ["Ilusao de controle", clamp(48 + state.triggerCounts.illusionControl / totalRounds * 20, 0, 98)],
      ["Recompensa visual", clamp(38 + state.triggerCounts.visualReward / totalRounds * 36, 0, 98)]
    ];

    const container = document.querySelector("#trigger-bars");
    container.innerHTML = values.map(([label, value]) => `
      <div class="trigger-bar">
        <label><span>${label}</span><strong>${Math.round(value)}%</strong></label>
        <div class="bar-track"><div class="bar-fill" data-width="${Math.round(value)}"></div></div>
      </div>
    `).join("");

    window.setTimeout(() => {
      container.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });
    }, 120);
  }

  function renderFinalRealityList() {
    const container = document.querySelector("#final-reality-list");
    const lost = Math.max(state.totalLost, CONFIG.initialCoins);
    const realityItems = [
      `Voce deixou de pagar a conta de agua simbolica da simulacao em ${lost} moedas de perdas acumuladas.`,
      "Esse dinheiro poderia ajudar na faculdade, em transporte, alimentacao ou material de estudo.",
      "A interface celebrou pequenas devolucoes enquanto escondia o custo acumulado da permanencia.",
      "Voce abriu mao de uma escolha concreta em troca de uma chance estatisticamente controlada.",
      "Cada quase-vitoria transformou perda em promessa, mantendo a decisao emocionalmente carregada.",
      "O saldo chegou perto o suficiente para gerar esperanca, mas o algoritmo reduziu as chances antes do saque."
    ];

    container.innerHTML = realityItems.map((item) => `<div>${item}</div>`).join("");
  }

  function updateFomoTimer() {
    state.fomoRemaining -= 1;

    if (state.fomoRemaining <= 0) {
      state.fomoRemaining = randomInt(13, 24);
      state.fomoCopyIndex = (state.fomoCopyIndex + 1) % fomoCopies.length;
      els.fomoCopy.textContent = fomoCopies[state.fomoCopyIndex];
    }

    els.fomoTimer.textContent = `00:${String(state.fomoRemaining).padStart(2, "0")}`;
  }

  function setupParticles() {
    const canvas = document.querySelector("#particle-canvas");
    canvasContext = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvasContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    if (!reducedMotion) {
      drawParticles();
    }
  }

  function createParticles() {
    const amount = Math.round(clamp(window.innerWidth / 16, 36, 96));
    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: randomFloat(0.8, 2.8),
      vx: randomFloat(-0.18, 0.18),
      vy: randomFloat(0.08, 0.32),
      color: sample(COLORS),
      alpha: randomFloat(0.18, 0.58)
    }));
  }

  function drawParticles() {
    if (!canvasContext) {
      return;
    }

    particleFrame = window.requestAnimationFrame(drawParticles);
    canvasContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.y > window.innerHeight + 20) {
        particle.y = -20;
        particle.x = Math.random() * window.innerWidth;
      }

      if (particle.x < -20) {
        particle.x = window.innerWidth + 20;
      }

      if (particle.x > window.innerWidth + 20) {
        particle.x = -20;
      }

      canvasContext.beginPath();
      canvasContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      canvasContext.fillStyle = hexToRgba(particle.color, particle.alpha);
      canvasContext.fill();
    });
  }

  function createConfetti(amount) {
    if (reducedMotion) {
      return;
    }

    for (let index = 0; index < amount; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${randomFloat(4, 96)}%`;
      piece.style.background = sample(COLORS);
      piece.style.setProperty("--drift", `${randomFloat(-180, 180)}px`);
      piece.style.animationDelay = `${randomFloat(0, 260)}ms`;
      els.confettiLayer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 2900);
    }
  }

  function createSparks() {
    if (reducedMotion) {
      return;
    }

    for (let index = 0; index < 24; index += 1) {
      const spark = document.createElement("span");
      spark.className = "spark";
      spark.style.left = `${randomFloat(40, 60)}%`;
      spark.style.top = `${randomFloat(28, 44)}%`;
      spark.style.setProperty("--x", `${randomFloat(-180, 180)}px`);
      spark.style.setProperty("--y", `${randomFloat(-130, 130)}px`);
      els.confettiLayer.appendChild(spark);
      window.setTimeout(() => spark.remove(), 980);
    }
  }

  function showToast(text, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = text;
    els.toastLayer.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2200);
  }

  function animateNumber(element, from, to, duration) {
    if (!element) {
      return;
    }

    const start = Number.isFinite(from) ? from : 0;
    const end = Number.isFinite(to) ? to : 0;

    if (reducedMotion || start === end) {
      element.textContent = String(end);
      return;
    }

    if (element._frame) {
      cancelAnimationFrame(element._frame);
    }

    const startedAt = performance.now();
    const tick = (now) => {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);
      element.textContent = String(value);

      if (progress < 1) {
        element._frame = requestAnimationFrame(tick);
      } else {
        element.classList.remove("number-pop");
        void element.offsetWidth;
        element.classList.add("number-pop");
      }
    };

    element._frame = requestAnimationFrame(tick);
  }

  function pulseElement(element) {
    element.classList.remove("number-pop");
    void element.offsetWidth;
    element.classList.add("number-pop");
  }

  function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function sample(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const value = parseInt(normalized, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(particleFrame);
    clearTimeout(state.nextRoundTimer);
    clearInterval(state.clockTimer);
    clearInterval(state.fomoTimer);
  });

  document.addEventListener("DOMContentLoaded", init);
})();
