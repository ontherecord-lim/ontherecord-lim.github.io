(function (root) {
  "use strict";

  const LAST_DAY = 21;
  const ACTIONS_PER_DAY = 2;
  const DAILY_COST = 4;
  const VERSION = 2;
  const genderLabels = { male: "남성", female: "여성" };
  const openings = {
    25: "부모님과 사는 집, 방으로 돌아와 처음 저장해 둔 채용 공고를 열었다.",
    26: "부모님과 아침을 먹고 방에 돌아와 오래된 포트폴리오를 꺼냈다.",
    27: "부모님과 사는 집, 책상에 놓인 지난 지원서를 이번 공고 옆에 펼쳤다.",
  };

  function validProfile(profile) {
    return !!profile && Object.hasOwn(genderLabels, profile.gender) &&
      Number.isInteger(profile.age) && Object.hasOwn(openings, profile.age);
  }

  const stats = [
    { key: "energy", label: "체력", icon: "bolt", color: "gold" },
    { key: "morale", label: "멘탈", icon: "heart", color: "rose" },
    { key: "resume", label: "스펙", icon: "star", color: "cyan" },
    { key: "interview", label: "면접력", icon: "chat", color: "violet" },
  ];

  const actions = [
    {
      id: "letter", title: "자소서 쓰기", icon: "pen", color: "cyan",
      about: "경험을 지원 직무에 맞춰 정리한다.",
      effects: { resume: 11, energy: -11, morale: -3 },
      entry: "한 줄로 퉁쳤던 경험에 내가 한 일과 결과를 적었다.",
    },
    {
      id: "portfolio", title: "포트폴리오 만들기", icon: "folder", color: "violet",
      about: "대표 작업을 골라 제출용으로 묶는다.",
      effects: { resume: 17, energy: -17, balance: -3 },
      entry: "가장 잘 설명할 수 있는 작업을 포트폴리오 첫 장에 올렸다.",
    },
    {
      id: "practice", title: "모의 면접", icon: "mic", color: "rose",
      about: "답변을 녹음하고 다시 들어본다.",
      effects: { interview: 14, energy: -13, morale: -4 },
      entry: "녹음을 들어보니 첫 문장만으로도 요점을 말할 수 있었다.",
    },
    {
      id: "shift", title: "알바 가기", icon: "case", color: "gold",
      about: "하루치 근무로 생활비를 번다.",
      effects: { balance: 26, energy: -22, morale: -5 },
      entry: "퇴근하고 급여가 들어왔다. 생활비에 여유가 생겼다.",
    },
    {
      id: "rest", title: "낮잠 자기", icon: "moon", color: "teal",
      about: "이불을 덮고 잠깐 눈을 붙인다.",
      effects: { energy: 32, morale: 15 },
      entry: "알람을 맞추고 눈을 붙였다. 일어나니 머리가 좀 맑아졌다.",
    },
    {
      id: "meal", title: "집밥 먹기", icon: "bowl", color: "rose",
      about: "식탁에서 따뜻한 밥을 먹는다.",
      effects: { energy: 14, morale: 23 },
      entry: "밥솥을 열었다. 남겨둔 밥이 아직 따뜻했다.",
    },
    {
      id: "walk", title: "동네 산책", icon: "leaf", color: "teal",
      about: "집 앞 공원을 한 바퀴 걷는다.",
      effects: { energy: -4, morale: 26, interview: 4 },
      entry: "걸으면서 면접 답변을 혼잣말로 해봤다. 방에서보다 말이 잘 나왔다.",
    },
    {
      id: "study", title: "취준 스터디", icon: "people", color: "blue",
      about: "서로 답변을 듣고 피드백을 나눈다.",
      effects: { interview: 8, morale: 9, energy: -8, balance: -6 },
      entry: "막혔던 질문을 같이 풀었다. 다른 사람도 비슷한 데서 막히고 있었다.",
    },
  ];

  const jobs = [
    {
      id: "broadcast", title: "방송기자", company: "지역 방송국",
      description: "현장을 취재하고 카메라 앞에서 직접 전한다.",
      icon: "camera", color: "gold", resumeTarget: 68, interviewTarget: 72,
      ending: "첫 출근 날, 취재 수첩과 마이크를 받아 들었다. 오늘 만날 사람에게 묻고 싶은 첫 질문을 적었다.",
      questions: [
        {
          prompt: "현장 연결 10분 전. 시민이 전한 피해 규모가 소방 당국 집계와 다릅니다. 어떻게 전할까요?",
          choices: [
            { label: "확인된 집계를 전하고 추가 피해는 확인 중이라고 밝힌다.", score: 13, note: "확인된 사실과 확인 중인 내용을 구분했다." },
            { label: "두 숫자를 나란히 읽고 출처만 덧붙인다.", score: 3, note: "출처는 밝혔지만 수치가 다른 이유를 설명하지 못했다." },
            { label: "더 큰 숫자를 먼저 전한 뒤 연결이 끝나면 확인한다.", score: -10, note: "아직 검증하지 못한 숫자를 방송에서 단정했다." },
          ],
        },
        {
          prompt: "카메라 테스트에서 30초 안에 취재 경험 하나를 소개해 달라고 합니다. 어떻게 시작할까요?",
          choices: [
            { label: "그날 따라갔던 동선을 시간순으로 설명한다.", score: 3, note: "과정이 구체적이었지만 시간 안에 핵심에 도달하기 어려웠다." },
            { label: "취재로 확인한 사실을 먼저 말하고 확인 과정 한 가지를 덧붙인다.", score: 13, note: "짧은 답변으로 취재 결과와 자신의 역할을 전했다." },
            { label: "열정이 많다는 말로 시작해 강점을 최대한 나열한다.", score: -10, note: "면접관이 어떤 일을 직접 해봤는지 파악하기 어려웠다." },
          ],
        },
      ],
    },
    {
      id: "reporter", title: "취재기자", company: "경제 전문 매체",
      description: "숫자와 현장 목소리를 엮어 읽히는 기사로 만든다.",
      icon: "paper", color: "cyan", resumeTarget: 63, interviewTarget: 67,
      ending: "첫 발제 회의가 잡혔다. 보도자료 맨 뒷장 표에 밑줄을 긋고, 숫자가 달라진 이유부터 물어보기로 했다.",
      questions: [
        {
          prompt: "기업 보도자료 제목에는 매출이 사상 최대라고 적혀 있습니다. 표를 보니 영업이익은 줄었습니다. 어떻게 발제할까요?",
          choices: [
            { label: "매출 기록을 제목으로 쓰고 이익 감소는 본문 끝에 넣는다.", score: 3, note: "매출은 정확했지만 수익성 변화가 묻혔다." },
            { label: "매출과 수익성의 변화를 함께 제시하고 이익 감소 요인을 확인한다.", score: 13, note: "두 지표를 함께 읽어 독자가 알아야 할 변화를 짚었다." },
            { label: "이익이 줄었으니 실적이 전반적으로 나빠졌다고 쓴다.", score: -10, note: "어떤 지표가 어떻게 달라졌는지 빠졌다." },
          ],
        },
        {
          prompt: "상인이 제도 변경 때문에 매출이 줄었다고 말합니다. 마감까지 한 시간이 남았습니다. 무엇을 먼저 할까요?",
          choices: [
            { label: "인터뷰가 인상적이어서 제목에 원인으로 단정해 쓴다.", score: -10, note: "한 사람의 경험만으로 원인을 단정했다." },
            { label: "상인의 말을 인용하고 기사 말미에 취재가 더 필요하다고 적는다.", score: 3, note: "인용은 정확했지만 제한된 시간 안에 추가 확인을 할 수 있었다." },
            { label: "제도 시행 시점과 매출 자료를 확인하고 다른 상인에게도 묻는다.", score: 13, note: "주장을 확인할 자료와 비교할 사례를 확보했다." },
          ],
        },
      ],
    },
    {
      id: "producer", title: "콘텐츠 PD", company: "독립 콘텐츠 스튜디오",
      description: "아이디어를 기획하고 촬영부터 편집까지 맡는다.",
      icon: "film", color: "violet", resumeTarget: 66, interviewTarget: 70,
      ending: "첫 기획 회의에 파일 하나를 들고 간다. 이야기를 열 첫 장면과 섭외하고 싶은 출연자의 질문 목록이 들어 있다.",
      questions: [
        {
          prompt: "시범 영상에서 클릭은 많은데 첫 20초에 시청자가 빠져나갑니다. 어디부터 살펴볼까요?",
          choices: [
            { label: "광고비를 늘려 시청자 유입을 키운다.", score: -10, note: "유입을 늘려도 첫 20초의 이탈 이유는 그대로다." },
            { label: "제목과 썸네일의 약속이 오프닝에서 전달되는지 살펴본다.", score: 13, note: "클릭 이후 시청자가 기대한 장면을 받는지 점검했다." },
            { label: "영상 길이를 전반적으로 10퍼센트 줄인다.", score: 3, note: "빠른 편집은 도움이 될 수 있지만 이탈 지점을 먼저 살펴볼 수 있었다." },
          ],
        },
        {
          prompt: "촬영 전날 핵심 출연자가 일정을 취소했습니다. 예산과 공개일은 정해져 있습니다. 어떻게 대응할까요?",
          choices: [
            { label: "기획의 핵심 장면을 정리해 대체 섭외와 촬영 순서 변경을 동시에 검토한다.", score: 13, note: "이야기의 중심과 남은 촬영 시간을 함께 확보했다." },
            { label: "정해진 촬영표대로 진행한 뒤 현장에서 가능한 장면을 찾는다.", score: -10, note: "팀이 움직이기 전에 대체 장면을 확정할 수 있었다." },
            { label: "출연자를 구하기 쉬운 다른 주제를 찾는다.", score: 3, note: "일정은 맞추기 쉽지만 기존 기획과 준비를 활용할 방법이 있었다." },
          ],
        },
      ],
    },
  ];

  const events = [
    {
      day: 2, title: "저녁 식탁에서",
      bodies: {
        25: "부모님이 저장해 둔 공고 중 어디가 가장 끌리냐고 묻는다. 말로 해보니 이유가 정리될 것 같다.",
        26: "밥을 먹다 어머니가 옛날에 만든 포트폴리오 이야기를 꺼낸다. 그때 해본 일을 지금의 지원 동기로 연결해볼 만하다.",
        27: "지난 공고 이야기가 나오자 아버지가 이번에는 어떤 곳에 가고 싶냐고 묻는다.",
      },
      choices: [
        { title: "어떤 일을 하고 싶은지 이야기한다", effects: { interview: 5, morale: 4 }, entry: "얘기하다 보니 이 일에서 해보고 싶은 장면이 하나 떠올랐다." },
        { title: "설거지를 돕고 저녁을 쉬어간다", effects: { energy: 10, morale: 5 }, entry: "같이 설거지를 끝내고 편하게 저녁을 보냈다." },
      ],
    },
    {
      day: 4, title: "선배에게 온 메시지", body: "선배가 포트폴리오를 한번 봐주겠다고 한다. 퇴근 후 잠깐 만날 수 있다.",
      choices: [
        { title: "포트폴리오를 들고 간다", effects: { resume: 9, energy: -9, balance: -2 }, entry: "선배가 결과보다 내가 어떤 결정을 내렸는지가 궁금하다고 했다." },
        { title: "오늘은 일찍 들어간다", effects: { energy: 12, morale: 6 }, entry: "메시지에 고맙다고 답하고 집에 일찍 들어갔다." },
      ],
    },
    {
      day: 8, title: "합격 소식이 들려왔다", body: "스터디 친구가 합격했다. 축하해주고 싶은 마음과 내 차례는 언제 올까 싶은 마음이 동시에 든다.",
      choices: [
        { title: "축하하고 면접 후기를 묻는다", effects: { interview: 9, morale: -4 }, entry: "친구가 가장 많이 받은 꼬리 질문을 보내줬다." },
        { title: "축하 인사를 보내고 동네를 한 바퀴 걷는다", effects: { morale: 13, energy: 7 }, entry: "한 바퀴 돌고 들어오니 마음이 조금 가라앉았다." },
      ],
    },
    {
      day: 12, title: "주말 대타 제안", body: "알바 매니저에게 연락이 왔다. 급하게 대타를 구하고 있다고 한다.",
      choices: [
        { title: "대타를 맡는다", effects: { balance: 18, energy: -14 }, entry: "빈 시간에 근무하고 생활비를 보탰다." },
        { title: "예정대로 면접을 연습한다", effects: { interview: 7, energy: -5 }, entry: "지원 동기를 말한 뒤 이어질 질문 세 가지를 적었다." },
      ],
    },
    {
      day: 17, title: "마감 전 마지막 피드백", body: "스터디원이 서로의 지원서 첫 문장을 바꿔 읽자고 한다. 마지막으로 손볼 시간이 조금 남았다.",
      choices: [
        { title: "첫 문장을 다시 쓴다", effects: { resume: 8, morale: 3 }, entry: "하고 싶은 일과 이미 해본 일을 한 문장에 연결했다." },
        { title: "지원서 대신 면접 답변을 같이 점검한다", effects: { interview: 9, morale: 3 }, entry: "막연했던 강점 하나를 경험으로 설명할 수 있게 됐다." },
      ],
    },
  ];

  const clamp = (value, floor, ceiling) => Math.max(floor, Math.min(value, ceiling));
  const getJob = (id) => jobs.find((job) => job.id === id);

  function newGame(profile, seed = Math.floor(Math.random() * 2 ** 32)) {
    if (!validProfile(profile)) throw new TypeError("성별과 나이를 선택해 주세요.");
    return {
      version: VERSION,
      profile: { gender: profile.gender, age: profile.age },
      seed,
      day: 1,
      slots: ACTIONS_PER_DAY,
      stats: { energy: 82, morale: 72, resume: 26, interview: 18, balance: 62 },
      selectedJob: jobs[0].id,
      application: null,
      assessment: null,
      encounter: null,
      lastAction: null,
      outcome: null,
      submitted: 0,
      interviews: 0,
      history: [{ day: 1, kind: "info", text: openings[profile.age] }],
    };
  }

  function readSave(raw) {
    try {
      const save = JSON.parse(raw);
      if (!save || save.version !== VERSION || !validProfile(save.profile) || !getJob(save.selectedJob)) return null;
      const range = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
      if (!range(save.day, 1, LAST_DAY) || !range(save.slots, 0, ACTIONS_PER_DAY) ||
          !range(save.seed, 0, 2 ** 32 - 1) || !range(save.submitted, 0, LAST_DAY) ||
          !range(save.interviews, 0, save.submitted)) return null;
      if (!save.stats || !stats.every(({ key }) => range(save.stats[key], 0, 100)) ||
          !range(save.stats.balance, 0, 9999)) return null;
      if (!Array.isArray(save.history) || !save.history.length || !save.history.every((entry) =>
        entry && range(entry.day, 1, save.day) && ["info", "action", "good", "warn", "event"].includes(entry.kind) &&
        typeof entry.text === "string")) return null;
      const application = save.application;
      if (application && (!getJob(application.job) || application.job !== save.selectedJob ||
          !["review", "invited"].includes(application.status) ||
          !range(application.chance, 0, 100) || !range(application.roll, 1, 100) ||
          !range(application.resultDay, 2, LAST_DAY) ||
          (application.status === "invited" && !range(application.deadline, save.day, LAST_DAY)))) return null;
      if (save.assessment && (!application || application.status !== "invited" ||
          !range(save.assessment.step, 0, getJob(application.job).questions.length - 1) ||
          !range(save.assessment.base, 0, 110) || !range(save.assessment.bonus, -30, 39))) return null;
      if (save.encounter !== null && (save.encounter !== save.day || !events.some((event) => event.day === save.encounter))) return null;
      if (save.lastAction != null && !actions.some(({ id }) => id === save.lastAction)) return null;
      if (save.outcome && (save.outcome.type === "offer" ? !getJob(save.outcome.job) : save.outcome.type !== "time")) return null;
      return save;
    } catch {
      return null;
    }
  }

  function log(state, kind, text) {
    state.history.unshift({ day: state.day, kind, text });
  }

  function applyEffects(state, effects) {
    for (const [key, amount] of Object.entries(effects)) {
      const ceiling = key === "balance" ? 9999 : 100;
      state.stats[key] = clamp(state.stats[key] + amount, 0, ceiling);
    }
  }

  function actionRestriction(state, effects) {
    if (state.outcome) return "플레이가 끝났어요.";
    if (state.assessment || state.encounter) return "열린 선택을 먼저 마쳐주세요.";
    if (!state.slots) return "오늘 행동을 모두 사용했어요.";
    if (state.stats.energy + (effects.energy ?? 0) < 0) return "체력이 부족해요.";
    if (state.stats.balance + (effects.balance ?? 0) < 0) return "생활비가 부족해요.";
    return "";
  }

  const applyEffectsCost = { energy: -7 };
  const interviewEffectsCost = { energy: -10 };

  function applyRestriction(state) {
    if (state.application) return "진행 중인 지원이 있어요.";
    if (state.day >= LAST_DAY) return "서류 결과는 다음 날에 나와요.";
    if (state.stats.resume < 35) return "스펙 35부터 지원할 수 있어요.";
    return actionRestriction(state, applyEffectsCost);
  }

  function interviewRestriction(state) {
    if (state.application?.status !== "invited") return "면접 일정이 아직 없어요.";
    return actionRestriction(state, interviewEffectsCost);
  }

  function reviewChance(state, job) {
    return clamp(Math.round(62 + (state.stats.resume - job.resumeTarget) * 2 + (state.stats.morale - 65) / 5), 5, 100);
  }

  function rollForApplication(seed, index) {
    let value = (seed + Math.imul(index, 0x9e3779b9)) | 0;
    value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
    value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
    return ((value ^ (value >>> 15)) >>> 0) % 100 + 1;
  }

  function act(state, action) {
    if (!action || actionRestriction(state, action.effects)) return false;
    applyEffects(state, action.effects);
    state.slots--;
    state.lastAction = action.id;
    log(state, "action", action.title + " · " + action.entry);
    return true;
  }

  function selectJob(state, id) {
    if (!getJob(id) || state.application || state.selectedJob === id) return false;
    state.selectedJob = id;
    return true;
  }

  function submit(state) {
    if (applyRestriction(state)) return false;
    const job = getJob(state.selectedJob);
    const chance = reviewChance(state, job);
    state.submitted++;
    state.application = {
      job: job.id,
      status: "review",
      chance,
      roll: rollForApplication(state.seed, state.submitted),
      resultDay: state.day + 1,
    };
    state.slots--;
    applyEffects(state, applyEffectsCost);
    log(state, "info", job.company + "에 " + job.title + " 지원서를 제출했다.");
    return true;
  }

  function startInterview(state) {
    if (interviewRestriction(state)) return false;
    state.slots--;
    state.interviews++;
    applyEffects(state, interviewEffectsCost);
    state.assessment = {
      step: 0,
      bonus: 0,
      base: clamp(Math.round(state.stats.interview + (state.stats.morale - 60) / 5), 0, 110),
    };
    return true;
  }

  function answerInterview(state, index) {
    if (!state.assessment) return false;
    const job = getJob(state.application.job);
    const question = job.questions[state.assessment.step];
    const choice = question.choices[index];
    if (!choice) return false;
    log(state, choice.score > 0 ? "good" : "warn", "면접 · " + choice.note);
    state.assessment.bonus += choice.score;
    state.assessment.step++;
    if (state.assessment.step < job.questions.length) return true;

    const score = clamp(state.assessment.base + state.assessment.bonus, 0, 100);
    if (score >= job.interviewTarget) {
      state.outcome = { type: "offer", job: job.id, score };
      log(state, "good", job.company + " " + job.title + " 최종 합격!");
    } else {
      applyEffects(state, { morale: -8, interview: 5 });
      log(state, "warn", job.title + " 면접 " + score + "점. 합격 기준은 " + job.interviewTarget + "점이었다.");
    }
    state.assessment = null;
    state.application = null;
    return true;
  }

  function resolveApplication(state) {
    const application = state.application;
    if (!application) return;
    const job = getJob(application.job);
    if (application.status === "invited" && application.deadline < state.day) {
      state.application = null;
      log(state, "warn", job.title + " 면접 기한이 지났다. 새 공고에 지원할 수 있다.");
      return;
    }
    if (application.status !== "review" || application.resultDay > state.day) return;
    if (application.roll <= application.chance) {
      application.status = "invited";
      application.deadline = Math.min(state.day + 2, LAST_DAY);
      applyEffects(state, { morale: 8 });
      log(state, "good", job.title + " 서류 합격! " + application.deadline + "일차까지 면접을 볼 수 있다.");
    } else {
      state.application = null;
      applyEffects(state, { morale: -9 });
      log(state, "warn", job.title + " 서류 전형에서 떨어졌다. 공고를 골라 다시 지원할 수 있다.");
    }
  }

  function endDay(state) {
    if (state.day === LAST_DAY) {
      state.outcome = { type: "time" };
      log(state, "info", "21일간의 취준 기록을 마쳤다.");
      return true;
    }
    const shortfall = state.stats.balance < DAILY_COST;
    applyEffects(state, { balance: -DAILY_COST, energy: 8, morale: shortfall ? -8 : 0 });
    state.day++;
    state.slots = ACTIONS_PER_DAY;
    state.lastAction = null;
    if (shortfall) log(state, "warn", "생활비가 모자랐다. 신경 쓸 일이 늘어 멘탈이 8 줄었다.");
    resolveApplication(state);
    const event = events.find(({ day }) => day === state.day);
    if (event) state.encounter = event.day;
    return true;
  }

  function chooseEvent(state, index) {
    const event = events.find(({ day }) => day === state.encounter);
    const choice = event?.choices[index];
    if (!choice) return false;
    if (state.stats.balance + (choice.effects.balance ?? 0) < 0 ||
        state.stats.energy + (choice.effects.energy ?? 0) < 0) return false;
    applyEffects(state, choice.effects);
    log(state, "event", event.title + " · " + choice.entry);
    state.encounter = null;
    return true;
  }

  function update(previous, command) {
    if (previous.outcome) return previous;
    if (previous.encounter && command.type !== "event") return previous;
    if (previous.assessment && command.type !== "answer") return previous;
    const state = structuredClone(previous);
    let changed;
    switch (command.type) {
      case "act": changed = act(state, actions.find(({ id }) => id === command.id)); break;
      case "job": changed = selectJob(state, command.id); break;
      case "submit": changed = submit(state); break;
      case "interview": changed = startInterview(state); break;
      case "answer": changed = answerInterview(state, command.index); break;
      case "event": changed = chooseEvent(state, command.index); break;
      case "end": changed = endDay(state); break;
      default: return previous;
    }
    return changed ? state : previous;
  }

  const api = {
    LAST_DAY, ACTIONS_PER_DAY, DAILY_COST, stats, actions, jobs, events, getJob, genderLabels, openings,
    newGame, readSave, update, reviewChance, actionRestriction, applyRestriction, interviewRestriction,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JobGame = api;
})(globalThis);
