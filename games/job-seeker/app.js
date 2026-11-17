(() => {
  "use strict";

  const game = globalThis.JobGame;
  const art = globalThis.JobArt;
  const saveKey = "job-seeker-rpg-save";
  const soundKey = "job-seeker-rpg-sound";
  const musicKey = "job-seeker-rpg-music";
  const weekdays = ["월", "화", "수", "목", "금", "토", "일"];
  const byId = (id) => document.getElementById(id);
  const dayText = (day) => String(day).padStart(2, "0");
  const statLabels = Object.fromEntries(game.stats.map(({ key, label }) => [key, label]));
  statLabels.balance = "생활비";

  const form = byId("character-form");
  const dialog = byId("dialog");
  const options = byId("dialog-options");
  const closeButton = byId("dialog-close");
  const soundButton = byId("sound-button");
  const musicButton = byId("music-button");
  const musicTrack = byId("music-track");
  musicTrack.volume = 0.65;
  const jobButton = byId("job-button");
  const nextDay = byId("next-day");
  const journalMore = byId("journal-more");

  let state = game.readSave(readLocal(saveKey));
  let audioEnabled = readLocal(soundKey) === "on";
  let musicEnabled = readLocal(musicKey) !== "off";
  let musicActivated = false;
  let sceneFrame = 0;
  let audioContext;
  let overlay = null;
  let journalExpanded = false;

  function readLocal(key) {
    try { return localStorage.getItem(key); }
    catch { return null; }
  }

  function storeLocal(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function persist() {
    const saved = storeLocal(saveKey, state ? JSON.stringify(state) : null);
    const status = byId("storage-status");
    status.dataset.local = String(saved);
    status.lastElementChild.textContent = saved ? "자동 저장" : "저장 제한됨";
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function pixelIcon(name) {
    const canvas = node("canvas");
    canvas.width = canvas.height = 16;
    canvas.dataset.icon = name;
    canvas.setAttribute("aria-hidden", "true");
    return canvas;
  }

  function effectText(key, value) {
    const sign = value > 0 ? "+" : "−";
    return statLabels[key] + " " + sign + Math.abs(value) + (key === "balance" ? "만원" : "");
  }

  const statViews = game.stats.map((stat) => {
    const card = node("div", "stat-card");
    card.dataset.tone = stat.color;
    const label = node("div", "stat-label");
    label.append(pixelIcon(stat.icon), node("span", "", stat.label));
    const value = node("strong");
    const number = node("div", "stat-value");
    number.append(value, node("small", "", "/100"));
    const meter = node("div", "meter");
    meter.setAttribute("aria-hidden", "true");
    const fill = node("span");
    meter.append(fill);
    card.append(label, number, meter);
    byId("stat-grid").append(card);
    return { key: stat.key, value, fill };
  });

  const actionViews = game.actions.map((action) => {
    const button = node("button", "action-card");
    button.dataset.tone = action.color;
    button.dataset.action = action.id;
    button.type = "button";
    const name = node("span", "action-name");
    const icon = node("span", "tile-icon");
    icon.append(pixelIcon(action.icon));
    name.append(icon, node("span", "", action.title));
    const description = node("span", "action-desc", action.about);
    const effects = node("span", "effects");
    for (const [key, value] of Object.entries(action.effects)) {
      effects.append(node("span", value > 0 ? "effect good" : "effect cost", effectText(key, value)));
    }
    button.append(name, description, effects);
    button.addEventListener("click", () => dispatch({ type: "act", id: action.id }));
    byId("action-grid").append(button);
    return { action, button, description };
  });

  const jobTabs = game.jobs.map((job) => {
    const button = node("button", "job-tab", job.title);
    button.type = "button";
    button.dataset.job = job.id;
    button.addEventListener("click", () => dispatch({ type: "job", id: job.id }));
    byId("job-tabs").append(button);
    return { id: job.id, button };
  });

  const dayTicks = Array.from({ length: game.LAST_DAY }, () => node("span"));
  byId("day-track").append(...dayTicks);

  function playTone(kind = "tap") {
    if (!audioEnabled) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      audioContext ??= new AudioContext();
      const notes = kind === "offer" ? [523, 659, 784, 1047] : kind === "next" ? [330, 440] : [392];
      audioContext.resume().then(() => {
        const start = audioContext.currentTime;
        notes.forEach((frequency, index) => {
          const at = start + index * 0.09;
          const tone = audioContext.createOscillator();
          const level = audioContext.createGain();
          tone.type = "sine";
          tone.frequency.value = frequency;
          level.gain.setValueAtTime(0.09, at);
          level.gain.exponentialRampToValueAtTime(0.001, at + 0.12);
          tone.connect(level).connect(audioContext.destination);
          tone.start(at);
          tone.stop(at + 0.13);
        });
      }).catch(() => {});
    } catch {
      // The game is fully playable when audio output is unavailable.
    }
  }

  function drawSound() {
    soundButton.setAttribute("aria-pressed", String(audioEnabled));
    soundButton.title = audioEnabled ? "효과음 끄기" : "효과음 켜기";
    art.drawIcon(soundButton.querySelector("canvas"), audioEnabled ? "sound" : "muted");
  }

  function drawMusicControl() {
    musicButton.setAttribute("aria-pressed", String(musicEnabled));
    musicButton.title = musicEnabled ? "배경음악 끄기" : "배경음악 켜기";
    art.drawIcon(musicButton.querySelector("canvas"), musicEnabled ? "music" : "musicOff");
  }

  function syncMusic() {
    if (!musicEnabled || !musicActivated || document.hidden) {
      musicTrack.pause();
      return;
    }
    if (musicTrack.paused) {
      musicTrack.play().catch(() => {
        // Try again at the next play gesture if the browser requires one.
      });
    }
  }

  function activateMusic() {
    musicActivated = true;
    syncMusic();
  }

  function drawCreation() {
    const profile = { gender: form.elements.gender.value || "female" };
    art.drawRoom(byId("setup-room"), { day: 1, slots: 2, profile }, sceneFrame);
  }

  function drawScene() {
    const { day, profile, slots, outcome, application } = state;
    const title = byId("scene-title");
    const description = byId("scene-description");
    const job = game.getJob(state.selectedJob);

    const lastAction = game.actions.find(({ id }) => id === state.lastAction);
    byId("scene-location").textContent = state.lastAction === "walk" ? "동네 공원" :
      state.lastAction === "meal" ? "우리 집 · 식탁" : "우리 집 · 내 방";
    byId("weekday").textContent = Math.ceil(day / 7) + "주차 " + weekdays[(day - 1) % 7] + "요일";
    byId("day-number").textContent = dayText(day);
    byId("day-track").setAttribute("aria-valuenow", String(day));
    byId("player-profile").textContent = game.genderLabels[profile.gender] + " · " + profile.age + "세 · 캥거루족";
    dayTicks.forEach((tick, index) => {
      tick.className = index + 1 === day ? "current" : index + 1 < day ? "elapsed" : "";
    });
    if (outcome?.type === "offer") {
      title.textContent = "첫 합격!";
      description.textContent = job.company + " " + job.title + " 채용에 합격했어요.";
    } else if (outcome?.type === "time") {
      title.textContent = "21일의 취준 일지";
      description.textContent = "이번 도전에서 쌓은 기록을 확인해요.";
    } else if (application?.status === "invited") {
      title.textContent = "면접 연락이 왔다.";
      description.textContent = job.company + " 면접 기한은 " + application.deadline + "일차예요.";
    } else if (application?.status === "review") {
      title.textContent = "지원서를 보냈다.";
      description.textContent = job.company + " 서류 결과는 다음 날 나와요.";
    } else if (lastAction) {
      title.textContent = lastAction.title;
      description.textContent = lastAction.entry;
    } else if (day === 1) {
      title.textContent = "오늘부터 취준생.";
      description.textContent = game.openings[profile.age];
    } else {
      title.textContent = day >= 17 ? "마감이 다가온다." : "오늘은 뭘 해볼까?";
      description.textContent = slots ? "남은 시간과 생활비를 보며 다음 행동을 골라요." : "오늘 할 일을 마쳤다. 일지를 덮고 내일을 준비하자.";
    }
    art.drawRoom(byId("room"), state, sceneFrame);
  }

  function drawStatsAndActions() {
    for (const { key, value, fill } of statViews) {
      value.textContent = state.stats[key];
      fill.style.width = state.stats[key] + "%";
    }
    byId("balance").textContent = state.stats.balance.toLocaleString("ko-KR");
    byId("slots-text").textContent = state.slots + "회 남음";
    byId("slot-status").querySelectorAll("i").forEach((dot, index) => dot.classList.toggle("available", index < state.slots));

    for (const { action, button, description } of actionViews) {
      const reason = game.actionRestriction(state, action.effects);
      button.disabled = Boolean(reason);
      button.title = reason;
      const restrictedByResources = reason === "체력이 부족해요." || reason === "생활비가 부족해요.";
      description.textContent = restrictedByResources ? reason : action.about;
    }

    nextDay.disabled = Boolean(state.encounter || state.assessment || state.outcome);
    nextDay.dataset.ready = String(state.slots === 0 && !state.outcome);
    nextDay.firstChild.nodeValue = state.day === game.LAST_DAY ? "마지막 날 마치기 " : "하루 마치기 ";
    byId("day-hint").textContent = state.outcome ? "도전이 끝났어요." :
      state.slots ? "행동을 남겨두고 하루를 마칠 수도 있어요." : "오늘의 행동을 모두 사용했어요.";
  }

  function drawJob() {
    const job = game.getJob(state.selectedJob);
    for (const { id, button } of jobTabs) {
      button.setAttribute("aria-pressed", String(job.id === id));
      button.disabled = Boolean(state.outcome || (state.application && job.id !== id));
    }

    byId("job-company").textContent = job.company;
    byId("job-title").textContent = job.title;
    byId("job-description").textContent = job.description;
    const icon = byId("job-icon");
    icon.dataset.tone = job.color;
    art.drawIcon(icon.querySelector("canvas"), job.icon);

    const { application, outcome } = state;
    const passed = outcome?.type === "offer";
    const invited = application?.status === "invited";
    byId("stage-review").className = passed || invited ? "passed" : application ? "active" : "";
    byId("stage-interview").className = passed ? "passed" : invited ? "active" : "";
    byId("stage-offer").className = passed ? "passed" : "";

    let buttonText, label, value, hint, enabled;
    if (outcome) {
      buttonText = "엔딩 다시 보기";
      label = passed ? "최종 면접 점수" : "플레이 결과";
      value = passed ? outcome.score + "점" : "21일 종료";
      hint = "";
      enabled = true;
    } else if (invited) {
      buttonText = "면접 보기";
      label = "면접 합격 기준";
      value = job.interviewTarget + "점";
      const reason = game.interviewRestriction(state);
      hint = reason || application.deadline + "일차까지 · 행동 1회 · 체력 −10";
      enabled = !reason;
    } else if (application) {
      buttonText = "서류 심사 중";
      label = "서류 발표";
      value = "DAY " + dayText(application.resultDay);
      hint = "하루를 마치면 결과를 확인할 수 있어요.";
      enabled = false;
    } else {
      buttonText = "지원하기";
      label = "서류 통과 확률";
      value = game.reviewChance(state, job) + "%";
      const reason = game.applyRestriction(state);
      hint = reason || "행동 1회 · 체력 −7 · 다음 날 서류 발표";
      enabled = !reason;
    }
    byId("job-info-label").textContent = label;
    byId("job-info-value").textContent = value;
    byId("job-hint").textContent = hint;
    jobButton.firstChild.nodeValue = buttonText + " ";
    jobButton.disabled = !enabled;
  }

  function drawJournal() {
    const entries = journalExpanded ? state.history : state.history.slice(0, 4);
    byId("journal-list").replaceChildren(...entries.map((entry) => {
      const item = node("li", "journal-entry");
      item.dataset.kind = entry.kind;
      item.append(node("span", "journal-day", "DAY " + dayText(entry.day)), node("p", "", entry.text));
      return item;
    }));
    journalMore.hidden = state.history.length <= 4;
    journalMore.setAttribute("aria-expanded", String(journalExpanded));
    journalMore.textContent = journalExpanded ? "최근 일지만 보기" : "전체 일지 보기";
  }

  function drawDialog() {
    const mode = state?.assessment ? "assessment" : state?.encounter ? "event" : overlay;
    if (!mode) {
      if (dialog.open) dialog.close();
      return;
    }

    let title, body, icon, tone, meta, choices;
    if (mode === "event") {
      const event = game.events.find(({ day }) => day === state.encounter);
      ({ title } = event);
      body = event.bodies?.[state.profile.age] ?? event.body;
      icon = "envelope";
      tone = "violet";
      meta = dayText(state.day) + "일차 · 오늘의 사건";
      choices = event.choices.map((choice, index) => ({
        title: choice.title,
        hint: Object.entries(choice.effects).map(([key, value]) => effectText(key, value)).join(" · "),
        disabled: state.stats.balance + (choice.effects.balance ?? 0) < 0 ||
          state.stats.energy + (choice.effects.energy ?? 0) < 0,
        run: () => dispatch({ type: "event", index }),
      }));
    } else if (mode === "assessment") {
      const job = game.getJob(state.application.job);
      const question = job.questions[state.assessment.step];
      title = job.title + " 면접";
      body = question.prompt;
      icon = job.icon;
      tone = job.color;
      meta = "질문 " + (state.assessment.step + 1) + " / " + job.questions.length;
      choices = question.choices.map((choice, index) => ({
        title: choice.label, run: () => dispatch({ type: "answer", index }),
      }));
    } else if (mode === "outcome") {
      const won = state.outcome.type === "offer";
      const job = won ? game.getJob(state.outcome.job) : null;
      title = won ? "최종 합격!" : "21일이 지났어요.";
      body = won ? job.ending : state.interviews ?
        "면접에서 막혔던 질문을 수첩에 옮겨 적었다. 다음 지원을 시작하면 그 질문부터 준비할 생각이다." :
        "지원 일지를 덮기 전에 직접 한 일들을 세어봤다. 내일 아침에는 제일 자신 있었던 작업을 다시 꺼내볼 생각이다.";
      meta = won ? job.company + " · " + job.title : "지원 " + state.submitted + "건 · 면접 " + state.interviews + "회";
      icon = won ? "trophy" : "paper";
      tone = won ? "gold" : "blue";
      choices = [
        { title: "기록 보기", style: "primary-button", run: closeOverlay },
        { title: "새 게임", style: "secondary-button", run: () => openOverlay("reset") },
      ];
    } else if (mode === "reset") {
      title = "새 게임을 시작할까요?";
      body = "현재 게임의 저장 기록을 지우고 캐릭터 만들기 화면으로 돌아갑니다.";
      icon = "case";
      tone = "gold";
      choices = [
        { title: "계속 플레이", style: "secondary-button", run: closeOverlay },
        { title: "기록 지우고 새 게임", style: "primary-button", run: resetGame },
      ];
    } else {
      title = "게임 안내";
      body = [
        "부모님과 함께 사는 집에서 시작해 21일 안에 첫 합격에 도전해요.",
        "하루에 행동을 두 번 할 수 있어요. 하루를 마치면 체력이 8 회복되고 생활비가 4만원 나가요.",
        "지원하면 다음 날 서류 결과가 나와요. 면접 점수는 면접력, 멘탈, 답변에 따라 달라져요.",
        "집밥을 먹거나 낮잠을 자고 동네를 산책할 수 있어요. 상단 음표 버튼으로 배경음악을 켜고 끌 수 있어요.",
        "게임 속 공고와 전형은 가상이에요. 플레이 기록은 사용 중인 브라우저에 자동 저장돼요.",
      ].join("\n\n");
      icon = "paper";
      tone = "cyan";
      choices = [{ title: "확인", style: "primary-button", run: closeOverlay }];
      if (state) choices.push({ title: "새 게임", style: "secondary-button", run: () => openOverlay("reset") });
    }

    closeButton.hidden = mode === "event" || mode === "assessment";
    const tile = dialog.querySelector(".dialog-icon");
    tile.dataset.tone = tone;
    art.drawIcon(tile.querySelector("canvas"), icon);
    const metaLabel = byId("dialog-meta");
    metaLabel.hidden = !meta;
    metaLabel.textContent = meta ?? "";
    byId("dialog-title").textContent = title;
    byId("dialog-body").textContent = body;
    options.replaceChildren(...choices.map((choice) => {
      const button = node("button", choice.style || "dialog-option", choice.title);
      button.type = "button";
      button.disabled = Boolean(choice.disabled);
      if (choice.hint) button.append(node("small", "", choice.hint));
      button.addEventListener("click", choice.run);
      return button;
    }));
    if (!dialog.open) dialog.showModal();
    options.querySelector("button:not(:disabled)")?.focus();
  }

  function render() {
    byId("setup").hidden = Boolean(state);
    byId("play").hidden = !state;
    byId("storage-status").hidden = !state;
    byId("jump-jobs").hidden = !state;

    if (state) {
      drawScene();
      drawStatsAndActions();
      drawJob();
      drawJournal();
    } else {
      drawCreation();
    }
    drawDialog();
  }

  function dispatch(command) {
    if (!state) return;
    const prior = state;
    state = game.update(state, command);
    if (prior === state) return;

    if (command.type === "act" || command.type === "end") sceneFrame = 0;
    if (!prior.outcome && state.outcome) overlay = "outcome";
    activateMusic();
    persist();
    render();
    if (command.type !== "job") {
      playTone(state.outcome?.type === "offer" ? "offer" : command.type === "end" ? "next" : "tap");
      const status = state.history.length > prior.history.length ? state.history[0].text + " " : "";
      byId("notice").textContent = status + state.day + "일차. 행동 " + state.slots + "회 남음.";
    }
  }

  function openOverlay(mode) {
    overlay = mode;
    drawDialog();
  }

  function closeOverlay() {
    overlay = null;
    drawDialog();
  }

  function resetGame() {
    state = null;
    musicActivated = false;
    syncMusic();
    journalExpanded = false;
    overlay = null;
    form.reset();
    persist();
    render();
    form.querySelector("input").focus();
  }

  form.addEventListener("change", drawCreation);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    state = game.newGame({ gender: values.get("gender"), age: Number(values.get("age")) });
    persist();
    render();
    activateMusic();
    playTone("next");
    byId("main").focus({ preventScroll: true });
  });
  byId("help-button").addEventListener("click", () => openOverlay("help"));
  closeButton.addEventListener("click", closeOverlay);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    if (!state?.assessment && !state?.encounter) closeOverlay();
  });
  soundButton.addEventListener("click", () => {
    audioEnabled = !audioEnabled;
    storeLocal(soundKey, audioEnabled ? "on" : "off");
    drawSound();
    playTone();
  });
  musicButton.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    storeLocal(musicKey, musicEnabled ? "on" : "off");
    drawMusicControl();
    activateMusic();
  });
  document.addEventListener("visibilitychange", syncMusic);
  nextDay.addEventListener("click", () => dispatch({ type: "end" }));
  jobButton.addEventListener("click", () => {
    if (state.outcome) openOverlay("outcome");
    else dispatch({ type: state.application?.status === "invited" ? "interview" : "submit" });
  });
  journalMore.addEventListener("click", () => {
    journalExpanded = !journalExpanded;
    drawJournal();
  });

  document.querySelectorAll("canvas[data-icon]").forEach((canvas) => art.drawIcon(canvas, canvas.dataset.icon));
  drawSound();
  drawMusicControl();
  if (state) persist();
  render();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.setInterval(() => {
    if (document.hidden || motion.matches) return;
    sceneFrame = (sceneFrame + 1) % 120;
    if (state) art.drawRoom(byId("room"), state, sceneFrame);
    else drawCreation();
  }, 440);
})();
