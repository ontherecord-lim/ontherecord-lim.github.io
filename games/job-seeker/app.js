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
  const jobSector = byId("job-sector");
  const jobSearch = byId("job-search");
  const jobOpenOnly = byId("job-open-only");
  const nextDay = byId("next-day");
  const journalMore = byId("journal-more");

  let state = game.readSave(readLocal(saveKey));
  let audioEnabled = readLocal(soundKey) === "on";
  let musicEnabled = readLocal(musicKey) !== "off";
  let musicActivated = false;
  let sceneFrame = 0;
  let audioContext;
  let overlay = null;
  let chosenWorkplace = null;
  let journalExpanded = false;
  let browsingJob = state?.selectedJob ?? game.jobs[0].id;
  let actionGroup = "basics";

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
    if (action.skill) effects.append(node("span", "effect good", game.skills[action.skill] + " +" + action.gain));
    button.append(name, description, effects);
    button.addEventListener("click", () => {
      if (action.id === "shift") openOverlay("work");
      else dispatch({ type: "act", id: action.id });
    });
    byId("action-grid").append(button);
    return { action, button, description };
  });

  const relationViews = Object.entries(game.relations).map(([key, label]) => {
    const chip = node("div", "relation-chip");
    const title = node("span", "", label);
    const value = node("strong");
    chip.append(title, value);
    byId("relationships").append(chip);
    return { key, title, value };
  });

  const actionFilters = Object.entries(game.actionGroups).map(([key, label]) => {
    const button = node("button", "action-filter", label);
    button.type = "button";
    button.addEventListener("click", () => {
      actionGroup = key;
      drawStatsAndActions();
    });
    byId("action-filters").append(button);
    return { key, button };
  });

  for (const [key, title] of [["all", "전체 " + game.jobs.length + "개"], ...Object.entries(game.sectors)]) {
    const option = node("option", "", title);
    option.value = key;
    jobSector.append(option);
  }

  const jobEntries = game.jobs.map((job) => {
    const button = node("button", "job-list-item");
    button.type = "button";
    button.dataset.job = job.id;
    const status = node("span");
    button.append(node("span", "", job.title), status);
    button.addEventListener("click", () => selectPosting(job.id));
    byId("job-list").append(button);
    const searchText = [job.title, job.company, job.location, game.sectors[job.sector], job.employment,
      game.skills[job.skill], job.description, job.materials].join(" ").toLowerCase();
    return { job, button, status, searchText };
  });

  function selectPosting(id) {
    browsingJob = id;
    if (!state.application && !state.outcome && state.selectedJob !== id) dispatch({ type: "job", id });
    else drawJob();
  }

  function revealAction(id) {
    const view = actionViews.find(({ action }) => action.id === id);
    if (!view) return;
    actionGroup = view.action.group;
    drawStatsAndActions();
    if (!view.button.disabled) view.button.focus({ preventScroll: true });
    view.button.scrollIntoView({ block: "nearest" });
  }

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
    const signature = [profile.nickname, game.genderLabels[profile.gender], profile.age + "세", "캥거루족"];
    byId("player-profile").textContent = signature.filter(Boolean).join(" · ");
    dayTicks.forEach((tick, index) => {
      tick.className = index + 1 === day ? "current" : index + 1 < day ? "elapsed" : "";
    });
    if (outcome?.type === "offer") {
      title.textContent = "첫 합격!";
      description.textContent = (profile.nickname ? profile.nickname + "님, " : "") +
        job.company + " " + job.title + " 채용에 합격했어요.";
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
      const latestAction = state.history.find((entry) => entry.kind === "action" && entry.day === day);
      description.textContent = ["upload", "fandom", "shift"].includes(lastAction.id) && latestAction
        ? latestAction.text.slice(lastAction.title.length + " · ".length)
        : lastAction.entry;
    } else if (day === 1) {
      title.textContent = profile.nickname ? profile.nickname + "의 첫날" : "오늘부터 취준생.";
      description.textContent = game.openings[profile.age] + " " + game.sibling(profile).title + "은 회사에 갔다.";
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
    for (const { key, title, value } of relationViews) {
      if (key === "sibling") title.textContent = game.sibling(state.profile).title;
      value.textContent = state.relationships[key];
    }
    byId("balance").textContent = state.stats.balance.toLocaleString("ko-KR");
    byId("slots-text").textContent = state.slots + "회 남음";
    byId("slot-status").querySelectorAll("i").forEach((dot, index) => dot.classList.toggle("available", index < state.slots));

    for (const { key, button } of actionFilters) button.setAttribute("aria-pressed", String(key === actionGroup));
    for (const { action, button, description } of actionViews) {
      button.hidden = action.group !== actionGroup;
      const reason = game.activityRestriction(state, action);
      button.disabled = Boolean(reason);
      button.title = reason;
      const locked = action.requires && !state[action.requires];
      const restrictedByResources = reason === "체력이 부족해요." || reason === "생활비가 부족해요.";
      const unavailableShift = action.id === "shift" && reason === "오늘 갈 수 있는 알바가 없어요.";
      description.textContent = locked || restrictedByResources || unavailableShift ? reason : action.about;
    }

    nextDay.disabled = Boolean(state.encounter || state.assessment || state.familyMoment || state.outcome);
    nextDay.dataset.ready = String(state.slots === 0 && !state.outcome);
    nextDay.firstChild.nodeValue = state.day === game.LAST_DAY ? "마지막 날 마치기 " : "하루 마치기 ";
    byId("day-hint").textContent = state.outcome ? "도전이 끝났어요." :
      state.slots ? "행동을 남겨두고 하루를 마칠 수도 있어요." : "오늘의 행동을 모두 사용했어요.";
  }

  function drawPostings() {
    const query = jobSearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    let open = 0;
    for (const { job, button, status, searchText } of jobEntries) {
      const closed = state.day > job.deadline;
      const matchesSector = jobSector.value === "all" || jobSector.value === job.sector;
      button.hidden = !matchesSector || (jobOpenOnly.checked && closed) || query.some((word) => !searchText.includes(word));
      button.dataset.closed = String(closed);
      button.setAttribute("aria-pressed", String(job.id === browsingJob));
      status.textContent = (state.application?.job === job.id ? "진행 중" : closed ? "마감" : "DAY " + dayText(job.deadline) + "까지");
      if (!button.hidden) {
        shown++;
        if (!closed) open++;
      }
    }
    byId("job-count").textContent = shown + "개 공고 · 접수 중 " + open;
    byId("job-empty").hidden = shown !== 0;
    const active = byId("active-job");
    active.hidden = !state.application || state.application.job === browsingJob;
    active.textContent = state.application ? "진행 중인 지원 보기 · " + game.getJob(state.application.job).title : "";
  }

  function drawJob() {
    drawPostings();
    const job = game.getJob(browsingJob);
    byId("job-company").textContent = job.company;
    byId("job-title").textContent = job.title;
    byId("job-tags").textContent = job.employment + " · " + job.location + " · " + job.deadline + "일차 마감";
    byId("job-description").textContent = job.description;
    byId("job-materials").textContent = job.materials;
    byId("job-skill-name").textContent = game.skills[job.skill];
    const bonus = game.preparationBonus(state, job);
    const referral = game.referralBonus(state, job);
    byId("job-skill-score").textContent = state.skills[job.skill] + "/100 · 서류 +" + bonus + "%p" +
      (referral ? " · 센터 추천 +" + referral + "%p" : "");
    byId("recommended-actions").replaceChildren(...job.recommended.map((id) => {
      const action = game.actions.find((item) => item.id === id);
      const button = node("button", "", action.title);
      button.type = "button";
      button.addEventListener("click", () => revealAction(id));
      return button;
    }));
    const icon = byId("job-icon");
    icon.dataset.tone = job.color;
    art.drawIcon(icon.querySelector("canvas"), job.icon);

    const application = state.application?.job === job.id ? state.application : null;
    const { outcome } = state;
    const passed = outcome?.type === "offer" && outcome.job === job.id;
    const invited = application?.status === "invited";
    byId("stage-review").className = passed || invited ? "passed" : application ? "active" : "";
    byId("stage-interview").className = passed ? "passed" : invited ? "active" : "";
    byId("stage-offer").className = passed ? "passed" : "";

    let buttonText, label, value, hint, enabled;
    if (outcome) {
      buttonText = "엔딩 다시 보기";
      label = passed ? "최종 면접 점수" : "플레이 결과";
      value = passed ? outcome.score + "점" : outcome.type === "offer" ? "최종 합격" : "21일 종료";
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
      const expired = state.day > job.deadline;
      buttonText = expired ? "접수 마감" : "지원하기";
      label = expired ? "접수 상태" : "서류 통과 확률";
      value = expired ? "마감" : game.reviewChance(state, job) + "%";
      const reason = game.applyRestriction(state, job);
      hint = expired ? job.deadline + "일차에 접수가 끝났어요." : reason || "행동 1회 · 체력 −7 · 다음 날 서류 발표";
      enabled = !reason && !expired;
    }
    byId("job-info-label").textContent = label;
    byId("job-info-value").textContent = value;
    byId("job-hint").textContent = hint;
    jobButton.firstChild.nodeValue = buttonText + " ";
    jobButton.disabled = !enabled;
  }

  function drawPersonal() {
    const { profile, hobby, channel, savings, shares } = state;
    byId("sibling-status").textContent = game.sibling(profile).detail + " · 이미 회사에 다니는 중";
    byId("hobby-status").hidden = !hobby;
    byId("hobby-status").textContent = hobby ? "요즘 덕질 · " + game.hobbies[hobby] : "";
    byId("channel-status").textContent = channel
      ? "유튜브 · 영상 " + channel.videos + "개 · 구독 " + channel.followers + "명"
      : "유튜브 · 개설 전";

    const assetSummary = [];
    if (savings) assetSummary.push("적금 " + savings.amount + "만원");
    if (shares) assetSummary.push("주식 " + shares.value + "만원");
    byId("wallet-assets").textContent = assetSummary.join(" · ");
    byId("wallet-assets").hidden = assetSummary.length === 0;
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
    const mode = state?.assessment ? "assessment" : state?.encounter ? "event" :
      state?.familyMoment ? "family" : overlay;
    if (!mode) {
      if (dialog.open) dialog.close();
      return;
    }

    let title, body, icon, tone, meta, choices, inputLabel;
    if (mode === "event" || mode === "family") {
      const event = mode === "family" ? game.getFamilyMoment(state) : game.getEvent(state);
      ({ title, body } = event);
      icon = "envelope";
      tone = "violet";
      meta = dayText(state.day) + "일차 · " + (mode === "family" ? "가족" : "오늘의 사건");
      choices = event.choices.map((choice, index) => {
        const hints = Object.entries(choice.effects).map(([key, value]) => effectText(key, value));
        for (const [key, value] of Object.entries(choice.trust ?? {})) {
          hints.push(game.relations[key] + " 관계 " + (value > 0 ? "+" + value : "−" + Math.abs(value)));
        }
        if (choice.slots) hints.push("오늘 행동 −" + choice.slots + "회");
        if (choice.lottery) hints.push("게임 당첨 확률 " + game.lotto.winChance + "% · " + game.lotto.small + "만원 또는 " + game.lotto.larger + "만원");
        const reason = game.eventRestriction(state, choice);
        return { title: choice.title, hint: reason || hints.join(" · "), disabled: Boolean(reason),
          run: () => dispatch({ type: mode === "family" ? "family" : "event", index }) };
      });
    } else if (mode === "work") {
      title = "오늘 어느 알바에 갈까?";
      body = "근무 선택에 행동 1회를 써요. 일한 날 바로 생활비가 들어와요.";
      icon = "case";
      tone = "gold";
      choices = Object.entries(game.workplaces).map(([id, place]) => {
        const record = state.shifts[id];
        const reason = game.shiftRestriction(state, id);
        const base = place.pay - place.transit;
        const hints = [place.transit ? "일당 " + place.pay + "만원 − 교통비 " + place.transit + "만원" : "걸어서 · 일당 " + place.pay + "만원",
          "기본 수입 " + base + "만원", place.energy ? "체력 −" + place.energy : "체력 ±0"];
        if (id === "warehouse") hints.push(record.extra >= 2 ? "운영팀 채용 추천 획득" : "좋은 평가 2번이면 채용 추천");
        if (record.warnings) hints.push("경고 " + record.warnings + "회");
        return { title: place.title, hint: reason || hints.join(" · "), disabled: Boolean(reason), run: () => {
          chosenWorkplace = id;
          openOverlay("work-choice");
        } };
      });
      choices.push({ title: "오늘은 쉬어가기", style: "secondary-button", run: closeOverlay });
    } else if (mode === "work-choice") {
      const place = game.workplaces[chosenWorkplace];
      title = place.title;
      body = place.body;
      icon = "case";
      tone = "gold";
      choices = place.decisions.map((decision, index) => {
        const net = place.pay - place.transit + (decision.extra ? place.bonus : 0);
        const hint = decision.work ? "수입 +" + net + "만원" + (decision.extra ? " · 보너스 " + place.bonus + "만원 포함" : "") :
          "일당 0 · 경고 1회 · 두 번 누적되면 근무 종료";
        return { title: decision.title, hint, run: () => dispatch({ type: "shift", id: chosenWorkplace, index }) };
      });
      choices.push({ title: "알바 장소 다시 고르기", style: "secondary-button", run: () => openOverlay("work") });
    } else if (mode === "lottery") {
      const { payout } = state.lottery;
      title = payout ? payout + "만원 당첨!" : "이번 로또는 꽝이었다.";
      body = payout ? "당첨금이 게임 속 생활비에 바로 들어왔어요." : "로또에 쓴 1만원은 오늘의 일지에 남았어요.";
      icon = payout ? "star" : "paper";
      tone = "gold";
      choices = [{ title: "확인", style: "primary-button", run: closeOverlay }];
    } else if (mode === "money") {
      const { savings, shares, stats } = state;
      const rules = game.money;
      title = "생활비 관리";
      meta = "현재 생활비 " + stats.balance + "만원";
      const savingsText = savings ? "적금 " + savings.amount + "만원 · " + savings.dueDay + "일차 만기" :
        "게임 속 적금은 " + rules.deposit + "만원을 넣고 " + rules.term + "일이 지나면 이자 " + rules.interest + "만원을 받아요.";
      const difference = shares ? shares.value - shares.cost : 0;
      const shareText = shares ? "주식 평가액 " + shares.value + "만원 · 매입가 대비 " +
        (difference > 0 ? "+" : "") + difference + "만원" :
        "가상 주식은 " + rules.purchase + "만원으로 사고, 하루가 지나면 가격이 오르내려요.";
      body = savingsText + "\n\n" + shareText;
      icon = "wallet";
      tone = "gold";
      const depositChoice = savings ? ["적금 중도 해지", "withdraw", "원금 반환"] :
        ["적금 " + rules.deposit + "만원 넣기", "deposit", "만기일에 원금과 이자 받기"];
      const stockChoice = shares ? ["주식 팔기", "sell", "지금 평가액을 생활비로 돌리기"] :
        ["가상 주식 " + rules.purchase + "만원어치 사기", "buy", "하루마다 가격 변동"];
      choices = [depositChoice, stockChoice].map(([text, operation, hint]) => {
        const reason = game.financeRestriction(state, operation);
        return { title: text, hint: reason || hint, disabled: Boolean(reason), run: () => dispatch({ type: "money", operation }) };
      });
      choices.push({ title: "닫기", style: "secondary-button", run: closeOverlay });
    } else if (mode === "channel") {
      const { channel, profile } = state;
      title = profile.nickname ? profile.nickname + "의 유튜브" : "내 유튜브 채널";
      body = channel ? "영상 " + channel.videos + "개, 누적 조회 " + channel.views + "회, 구독 " + channel.followers + "명." :
        "취준 브이로그나 좋아하는 걸 소개할 내 채널을 만들 수 있어요. 영상은 취업 준비에도 활용할 수 있어요.";
      icon = "camera";
      tone = "rose";
      if (channel) {
        choices = [{ title: "영상 올리기 행동 보기", style: "primary-button", run: () => {
          closeOverlay();
          revealAction("upload");
        } }];
      } else {
        const reason = game.actionRestriction(state, { energy: -8 });
        choices = [{ title: "게임 속 유튜브 채널 열기", hint: reason || "행동 1회 · 체력 −8",
          disabled: Boolean(reason), run: () => dispatch({ type: "channel" }) }];
      }
      choices.push({ title: "닫기", style: "secondary-button", run: closeOverlay });
    } else if (mode === "nickname") {
      title = "이름 바꾸기";
      body = "게임 속 대화에서 불리고 싶은 이름을 골라요.";
      icon = "pen";
      tone = "violet";
      inputLabel = node("label", "dialog-field-label", "이름 또는 닉네임");
      const field = node("input", "game-field");
      field.type = "text";
      field.maxLength = 16;
      field.autocomplete = "off";
      field.value = state.profile.nickname;
      const saveName = () => {
        const value = game.normalizeNickname(field.value);
        if (!value) {
          field.setCustomValidity("이름 또는 닉네임을 16자 이내로 입력해 주세요.");
          field.reportValidity();
          return;
        }
        closeOverlay();
        dispatch({ type: "nickname", value });
      };
      field.addEventListener("input", () => field.setCustomValidity(""));
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          saveName();
        }
      });
      inputLabel.append(field);
      choices = [{ title: "이름 저장", style: "primary-button", run: saveName }];
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
      meta = won ? job.company + " · " + job.title + " · " + job.employment : "지원 " + state.submitted + "건 · 면접 " + state.interviews + "회";
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
        "가상 공고 " + game.jobs.length + "개 모두 전공을 고를 필요 없이 지원할 수 있어요. 공고마다 마감일과 추천 실습이 달라요.",
        "지원하면 다음 날 서류 결과가 나와요. 관련 실습은 서류와 면접에 보탬이 되고, 면접 점수에는 답변도 반영돼요.",
        "가까운 카페와 먼 물류센터 중 알바 장소를 고를 수 있어요. 장소마다 교통비, 체력 소모와 보너스가 달라요.",
        "집밥이나 낮잠, 채널 개설, 가상 적금과 주식으로 일상을 관리하고, 가족과 친구의 이야기도 골라요. 상단 음표 버튼으로 음악을 조절할 수 있어요.",
        "게임 속 공고와 전형은 가상이에요. 플레이 기록은 사용 중인 브라우저에 자동 저장돼요.",
      ].join("\n\n");
      icon = "paper";
      tone = "cyan";
      choices = [{ title: "확인", style: "primary-button", run: closeOverlay }];
      if (state) choices.push({ title: "새 게임", style: "secondary-button", run: () => openOverlay("reset") });
    }

    closeButton.hidden = mode === "event" || mode === "family" || mode === "assessment";
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
    if (inputLabel) options.prepend(inputLabel);
    if (!dialog.open) dialog.showModal();
    (inputLabel?.lastElementChild ?? options.querySelector("button:not(:disabled)"))?.focus();
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
      drawPersonal();
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

    if (["act", "end", "shift"].includes(command.type)) sceneFrame = 0;
    if (command.type === "shift") overlay = null;
    if ((!prior.outcome && state.outcome) || (command.type === "family" && prior.familyMoment === "offer")) overlay = "outcome";
    if (!prior.lottery && state.lottery) overlay = "lottery";
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
    browsingJob = game.jobs[0].id;
    actionGroup = "basics";
    jobSector.value = "all";
    jobSearch.value = "";
    jobOpenOnly.checked = false;
    persist();
    render();
    form.querySelector("input").focus();
  }

  form.addEventListener("change", drawCreation);
  byId("nickname").addEventListener("input", (event) => event.target.setCustomValidity(""));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const nickname = game.normalizeNickname(values.get("nickname"));
    if (!nickname) {
      byId("nickname").setCustomValidity("이름 또는 닉네임을 16자 이내로 입력해 주세요.");
      byId("nickname").reportValidity();
      return;
    }
    state = game.newGame({ gender: values.get("gender"), age: Number(values.get("age")), nickname });
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
    if (!state?.assessment && !state?.encounter && !state?.familyMoment) closeOverlay();
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
    else if (state.application?.status === "invited") dispatch({ type: "interview" });
    else {
      if (state.selectedJob !== browsingJob) dispatch({ type: "job", id: browsingJob });
      dispatch({ type: "submit" });
    }
  });
  jobSector.addEventListener("change", drawPostings);
  jobSearch.addEventListener("input", drawPostings);
  jobOpenOnly.addEventListener("change", drawPostings);
  byId("active-job").addEventListener("click", () => selectPosting(state.application.job));
  byId("money-button").addEventListener("click", () => openOverlay("money"));
  byId("channel-button").addEventListener("click", () => openOverlay("channel"));
  byId("edit-nickname").addEventListener("click", () => openOverlay("nickname"));
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
