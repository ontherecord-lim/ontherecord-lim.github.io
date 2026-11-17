(function (root) {
  "use strict";

  const catalog = typeof module !== "undefined" && module.exports ? require("./catalog.js") : root.JobCatalog;
  const story = typeof module !== "undefined" && module.exports ? require("./story.js") : root.JobStory;
  const LAST_DAY = 21;
  const DAILY_COST = 4;
  const VERSION = 3;
  const PREVIOUS_VERSION = 2;
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

  const originalActions = [
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
      about: "집 앞 카페와 외곽 물류센터 중 오늘 갈 곳을 고른다.",
      effects: {},
      entry: "오늘 근무 기록과 일당을 일지에 적었다.",
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

  const originalJobs = [
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

  const lifeIds = new Set(["shift", "rest", "meal", "walk"]);
  const actions = [
    ...originalActions.map((action) => ({ ...action, group: lifeIds.has(action.id) ? "life" : "basics" })),
    ...catalog.coreActions,
    ...catalog.practiceActions,
    ...catalog.lifeActions,
  ];
  const jobs = [
    ...originalJobs.map((job) => ({ ...job, ...catalog.originalPostings[job.id] })),
    ...catalog.jobs,
  ].map((job) => {
    const { label, resumeTarget, interviewTarget } = catalog.employment[job.kind];
    return { resumeTarget, interviewTarget, ...job, employment: label, majors: catalog.majorPreferences[job.id] };
  });
  const { events, getEvent, getFamilyMoment, relations, hobbies, sibling, lotto, money, workplaces } = story;

  function normalizeNickname(value) {
    if (typeof value !== "string") return "";
    const name = value.replace(/\s+/g, " ").trim();
    return name.length <= 16 && !/[\p{Cc}\p{Cf}]/u.test(name) ? name : "";
  }

  function normalizeMajor(value) {
    return typeof value === "string" && Object.hasOwn(catalog.majors, value) ? value : "";
  }

  function lifeDefaults() {
    return {
      skills: Object.fromEntries(Object.keys(catalog.skills).map((key) => [key, 0])),
      relationships: { family: 55, sibling: 55, friend: 64 },
      counseling: false,
      channel: null,
      hobby: null,
      lottery: null,
      savings: null,
      shares: null,
      shifts: Object.fromEntries(Object.keys(workplaces).map((key) => [key, { worked: 0, extra: 0, warnings: 0 }])),
      familyMoment: null,
    };
  }

  const clamp = (value, floor, ceiling) => Math.max(floor, Math.min(value, ceiling));
  const getJob = (id) => jobs.find((job) => job.id === id);

  function newGame(profile, seed = Math.floor(Math.random() * 2 ** 32)) {
    if (!validProfile(profile)) throw new TypeError("성별과 나이를 선택해 주세요.");
    return {
      version: VERSION,
      profile: {
        gender: profile.gender,
        age: profile.age,
        nickname: normalizeNickname(profile.nickname),
        major: normalizeMajor(profile.major),
      },
      ...lifeDefaults(),
      seed,
      day: 1,
      stats: { energy: 82, morale: 72, resume: 26, interview: 18, balance: 62 },
      selectedJob: jobs[0].id,
      application: null,
      assessment: null,
      encounter: null,
      lastAction: null,
      outcome: null,
      submitted: 0,
      interviews: 0,
      history: [{ day: 1, kind: "info", text: openings[profile.age] + " " +
        sibling(profile).title + "은 이미 취업해서 오늘도 먼저 출근했다." }],
    };
  }

  function readSave(raw) {
    try {
      const save = JSON.parse(raw);
      if (!save || ![VERSION, PREVIOUS_VERSION].includes(save.version) ||
          !validProfile(save.profile) || !getJob(save.selectedJob)) return null;
      const range = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
      if (!range(save.day, 1, LAST_DAY) ||
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
      if (save.outcome && (save.outcome.type === "offer" ? !getJob(save.outcome.job) || !range(save.outcome.score, 0, 100) : save.outcome.type !== "time")) return null;

      const resumed = { ...lifeDefaults(), ...save, version: VERSION };
      delete resumed.slots;
      const nickname = normalizeNickname(save.profile.nickname);
      if (save.profile.nickname && !nickname) return null;
      resumed.profile = { ...save.profile, nickname, major: normalizeMajor(save.profile.major) };
      if (!resumed.skills || !Object.keys(catalog.skills).every((key) => range(resumed.skills[key], 0, 100)) ||
          !resumed.relationships || !Object.keys(relations).every((key) => range(resumed.relationships[key], 0, 100)) ||
          typeof resumed.counseling !== "boolean") return null;
      if (resumed.hobby !== null && !Object.hasOwn(hobbies, resumed.hobby)) return null;
      if (resumed.channel && (!range(resumed.channel.videos, 0, Number.MAX_SAFE_INTEGER) ||
          !range(resumed.channel.views, 0, Number.MAX_SAFE_INTEGER) || !range(resumed.channel.followers, 0, Number.MAX_SAFE_INTEGER))) return null;
      if (resumed.lottery && (resumed.day < 7 || ![0, lotto.small, lotto.larger].includes(resumed.lottery.payout))) return null;
      if (resumed.savings && (resumed.savings.amount !== money.deposit ||
          !range(resumed.savings.dueDay, resumed.day + 1, LAST_DAY))) return null;
      if (resumed.shares && (!range(resumed.shares.value, 1, 99) || resumed.shares.cost !== money.purchase)) return null;
      if (!resumed.shifts || !Object.keys(workplaces).every((key) => {
        const shift = resumed.shifts[key];
        return shift && range(shift.worked, 0, Number.MAX_SAFE_INTEGER) && range(shift.extra, 0, shift.worked) && range(shift.warnings, 0, 2);
      })) return null;
      if (resumed.familyMoment !== null && !getFamilyMoment(resumed)) return null;
      if (resumed.familyMoment === "offer" && resumed.outcome?.type !== "offer") return null;
      if (resumed.encounter && !getEvent(resumed)) return null;
      return resumed;
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
    if (state.assessment || state.encounter || state.familyMoment) return "열린 선택을 먼저 마쳐주세요.";
    if (state.stats.energy + (effects.energy ?? 0) < 0) return "체력이 부족해요.";
    if (state.stats.balance + (effects.balance ?? 0) < 0) return "생활비가 부족해요.";
    return "";
  }

  const applyEffectsCost = { energy: -7 };
  const interviewEffectsCost = { energy: -10 };

  function applyRestriction(state, job = getJob(state.selectedJob)) {
    if (state.application) return "진행 중인 지원이 있어요.";
    if (state.day > job.deadline) return job.deadline + "일차에 접수가 끝났어요.";
    if (state.stats.resume < 35) return "스펙 35부터 지원할 수 있어요.";
    return actionRestriction(state, applyEffectsCost);
  }

  function interviewRestriction(state) {
    if (state.application?.status !== "invited") return "면접 일정이 아직 없어요.";
    return actionRestriction(state, interviewEffectsCost);
  }

  function preparationBonus(state, job) {
    return Math.min(18, Math.floor(state.skills[job.skill] / 4));
  }

  function referralBonus(state, job) {
    return job.id === "scm" && state.shifts.warehouse.extra >= 2 && state.shifts.warehouse.warnings < 2 ? 12 : 0;
  }

  const majorBonuses = {
    direct: { label: "직접 관련", screening: 12, interview: 6 },
    adjacent: { label: "인접 전공", screening: 6, interview: 3 },
    standard: { label: "일반 지원", screening: 0, interview: 0 },
  };

  function majorFit(profile, job) {
    if (job.majors.direct.includes(profile.major)) return majorBonuses.direct;
    if (job.majors.adjacent.includes(profile.major)) return majorBonuses.adjacent;
    return majorBonuses.standard;
  }

  function reviewChance(state, job) {
    const score = 62 + (state.stats.resume - job.resumeTarget) * 2 +
      (state.stats.morale - 65) / 5 + preparationBonus(state, job) + referralBonus(state, job) +
      majorFit(state.profile, job).screening;
    return clamp(Math.round(score), 5, 100);
  }

  function rollForApplication(seed, index) {
    let value = (seed + Math.imul(index, 0x9e3779b9)) | 0;
    value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
    value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
    return ((value ^ (value >>> 15)) >>> 0) % 100 + 1;
  }

  function activityRestriction(state, action) {
    if (action.id === "shift" && Object.keys(workplaces).every((id) => state.shifts[id].warnings >= 2)) return "오늘 갈 수 있는 알바가 없어요.";
    if (action.requires === "channel" && !state.channel) return "채널을 먼저 개설하면 영상을 올릴 수 있어요.";
    if (action.requires === "hobby" && !state.hobby) return "일상 이벤트에서 좋아하는 분야를 골라보세요.";
    return actionRestriction(state, action.effects);
  }

  function openChannel(state) {
    state.channel = { videos: 0, views: 0, followers: 0 };
  }

  function act(state, action) {
    if (!action || action.id === "shift" || activityRestriction(state, action)) return false;
    applyEffects(state, action.effects);
    if (action.skill) state.skills[action.skill] = clamp(state.skills[action.skill] + action.gain, 0, 100);
    state.lastAction = action.id;
    let details = action.entry;
    if (action.id === "upload") {
      state.channel.videos++;
      const roll = rollForApplication(state.seed ^ 0x11ba7e2, state.channel.videos);
      const views = 16 + roll * 3 + state.skills.content + (state.hobby ? 12 : 0);
      const followers = Math.max(1, Math.floor(views / 24));
      state.channel.views += views;
      state.channel.followers += followers;
      details = state.channel.videos + "번째 영상에 조회 " + views + "회와 구독 " + followers + "명이 들어왔다.";
    } else if (action.id === "fandom") {
      details = hobbies[state.hobby] + " 덕질을 하며 잠깐 머리를 식혔다. " + action.entry;
    }
    log(state, "action", action.title + " · " + details);
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
    applyEffects(state, applyEffectsCost);
    log(state, "info", job.company + "에 " + job.title + (referralBonus(state, job) ? " 지원서를 센터 추천으로 제출했다." : " 지원서를 제출했다."));
    return true;
  }

  function startInterview(state) {
    if (interviewRestriction(state)) return false;
    const job = getJob(state.application.job);
    state.interviews++;
    applyEffects(state, interviewEffectsCost);
    state.assessment = {
      step: 0,
      bonus: 0,
      base: clamp(Math.round(state.stats.interview + (state.stats.morale - 60) / 5 +
        Math.floor(preparationBonus(state, job) / 2) + majorFit(state.profile, job).interview), 0, 110),
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
      state.familyMoment = "offer";
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
    state.lastAction = null;
    if (shortfall) log(state, "warn", "생활비가 모자랐다. 신경 쓸 일이 늘어 멘탈이 8 줄었다.");
    settleFinances(state);
    resolveApplication(state);
    const event = getEvent(state, state.day);
    if (event) state.encounter = event.day;
    return true;
  }

  function eventRestriction(state, choice) {
    if (state.stats.balance + (choice.effects.balance ?? 0) < 0) return "생활비가 부족해요.";
    if (state.stats.energy + (choice.effects.energy ?? 0) < 0) return "체력이 부족해요.";
    return "";
  }

  function chooseEvent(state, index) {
    const event = getEvent(state);
    const choice = event?.choices[index];
    if (!choice || eventRestriction(state, choice)) return false;

    applyStoryChoice(state, event, choice);
    state.encounter = null;
    return true;
  }

  function applyStoryChoice(state, event, choice) {
    applyEffects(state, choice.effects);
    for (const [key, amount] of Object.entries(choice.trust ?? {})) {
      state.relationships[key] = clamp(state.relationships[key] + amount, 0, 100);
    }
    if (choice.channel) openChannel(state);
    if (choice.counseling) state.counseling = true;
    if (choice.hobby) state.hobby = choice.hobby;
    log(state, "event", event.title + " · " + choice.entry);
    if (choice.lottery) {
      const roll = rollForApplication(state.seed ^ 0x10bb73d, state.day);
      const payout = roll <= lotto.largerChance ? lotto.larger : roll <= lotto.winChance ? lotto.small : 0;
      state.lottery = { payout };
      applyEffects(state, { balance: payout });
      log(state, payout ? "good" : "info", payout ? "로또에서 " + payout + "만원이 당첨됐다." : "이번 로또는 꽝이었다.");
    }
  }

  function chooseFamilyMoment(state, index) {
    const event = getFamilyMoment(state);
    const choice = event?.choices[index];
    if (!choice || eventRestriction(state, choice)) return false;
    applyStoryChoice(state, event, choice);
    state.familyMoment = null;
    return true;
  }

  function shiftRestriction(state, id) {
    const place = workplaces[id];
    if (!place) return "알바 장소를 골라주세요.";
    if (state.shifts[id].warnings >= 2) return "근무가 종료된 곳이에요.";
    if (state.stats.balance < place.transit) return "교통비가 부족해요.";
    return actionRestriction(state, { energy: -place.energy });
  }

  function takeShift(state, id, index) {
    if (shiftRestriction(state, id)) return false;
    const place = workplaces[id];
    const decision = place.decisions[index];
    if (!decision) return false;

    const shifts = state.shifts[id];
    if (!decision.work) {
      shifts.warnings++;
      log(state, "warn", place.title + " · " + decision.entry +
        (shifts.warnings === 2 ? " 경고가 두 번 쌓여 알바에서 잘렸다." : " 첫 경고를 받았다."));
      return true;
    }

    const first = Object.values(state.shifts).every((record) => record.worked === 0);
    const bonus = decision.extra ? place.bonus : 0;
    const net = place.pay - place.transit + bonus;
    shifts.worked++;
    if (decision.extra) shifts.extra++;
    applyEffects(state, { balance: net, energy: -place.energy });
    state.lastAction = "shift";
    if (id === "warehouse") {
      state.skills.ops = clamp(state.skills.ops + (decision.extra ? 8 : 5), 0, 100);
      if (shifts.extra === 2 && decision.extra) {
        log(state, "good", "운영팀 추천을 받았다. 물류 SCM 공고에 지원할 때 서류 통과 확률이 12%p 올라간다.");
      }
    }
    if (first) state.familyMoment = "first-shift";
    const details = "교통비를 뺀 오늘 수입 " + net + "만원" + (bonus ? " · 보너스 " + bonus + "만원 포함" : "");
    log(state, "action", "알바 가기 · " + place.title + " · " + details + ". " + decision.entry);
    return true;
  }

  function settleFinances(state) {
    if (state.savings?.dueDay === state.day) {
      const result = state.savings.amount + money.interest;
      applyEffects(state, { balance: result });
      state.savings = null;
      log(state, "good", "적금이 만기돼 이자 " + money.interest + "만원을 포함해 " + result + "만원이 들어왔다.");
    }
    if (state.shares) {
      const roll = rollForApplication(state.seed ^ 0x5e40a1, state.day);
      const change = roll <= 25 ? -2 : roll <= 45 ? -1 : roll <= 55 ? 0 : roll <= 85 ? 1 : 2;
      const before = state.shares.value;
      state.shares.value = clamp(before + change, 1, 99);
      if (state.shares.value !== before) {
        const difference = state.shares.value - before;
        log(state, difference > 0 ? "good" : "info", "주식 평가액이 " + Math.abs(difference) +
          "만원 " + (difference > 0 ? "올라 " : "내려 ") + state.shares.value + "만원이 됐다.");
      }
    }
  }

  function financeRestriction(state, operation) {
    if (state.outcome) return "플레이가 끝났어요.";
    if (state.encounter || state.assessment || state.familyMoment) return "열린 선택을 먼저 마쳐주세요.";
    switch (operation) {
      case "deposit":
        if (state.savings) return "진행 중인 적금이 있어요.";
        if (state.day + money.term > LAST_DAY) return "남은 기간 안에 만기되는 적금이 없어요.";
        return state.stats.balance < money.deposit ? "생활비가 부족해요." : "";
      case "withdraw": return state.savings ? "" : "적금이 없어요.";
      case "buy": return state.shares ? "이미 보유한 주식이 있어요." :
        state.stats.balance < money.purchase ? "생활비가 부족해요." : "";
      case "sell": return state.shares ? "" : "보유한 주식이 없어요.";
      default: return "선택을 확인해 주세요.";
    }
  }

  function manageMoney(state, operation) {
    if (financeRestriction(state, operation)) return false;
    switch (operation) {
      case "deposit":
        state.savings = { amount: money.deposit, dueDay: state.day + money.term };
        applyEffects(state, { balance: -money.deposit });
        log(state, "info", "적금에 " + money.deposit + "만원을 넣었다. 만기는 " + state.savings.dueDay + "일차.");
        break;
      case "withdraw":
        applyEffects(state, { balance: state.savings.amount });
        state.savings = null;
        log(state, "info", "적금을 중도 해지해 원금을 생활비로 돌렸다.");
        break;
      case "buy":
        state.shares = { cost: money.purchase, value: money.purchase };
        applyEffects(state, { balance: -money.purchase });
        log(state, "info", "가상 주식을 " + money.purchase + "만원어치 샀다.");
        break;
      case "sell": {
        const value = state.shares.value;
        applyEffects(state, { balance: value });
        state.shares = null;
        log(state, "info", "가상 주식을 팔아 " + value + "만원을 생활비에 더했다.");
        break;
      }
    }
    return true;
  }

  function launchChannel(state) {
    if (state.channel || actionRestriction(state, { energy: -8 })) return false;
    openChannel(state);
    applyEffects(state, { energy: -8 });
    log(state, "event", "내 유튜브 채널을 열었다. 생활·취미에서 첫 영상을 올릴 수 있다.");
    return true;
  }

  function update(previous, command) {
    if (command.type === "nickname") {
      const nickname = normalizeNickname(command.value);
      return !nickname || nickname === previous.profile.nickname ? previous :
        { ...previous, profile: { ...previous.profile, nickname } };
    }
    if (command.type === "major") {
      const major = normalizeMajor(command.value);
      return !major || previous.profile.major ? previous :
        { ...previous, profile: { ...previous.profile, major } };
    }
    if (previous.familyMoment && command.type !== "family") return previous;
    if (previous.outcome && command.type !== "family") return previous;
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
      case "family": changed = chooseFamilyMoment(state, command.index); break;
      case "shift": changed = takeShift(state, command.id, command.index); break;
      case "money": changed = manageMoney(state, command.operation); break;
      case "channel": changed = launchChannel(state); break;
      case "end": changed = endDay(state); break;
      default: return previous;
    }
    return changed ? state : previous;
  }

  const api = {
    LAST_DAY, DAILY_COST, stats, actions, jobs, events, getJob, genderLabels, openings,
    sectors: catalog.sectors, skills: catalog.skills, actionGroups: catalog.actionGroups,
    majorGroups: catalog.majorGroups, majors: catalog.majors, majorFit,
    getEvent, getFamilyMoment, relations, hobbies, sibling, lotto, money, workplaces, normalizeNickname,
    newGame, readSave, update, preparationBonus, referralBonus, reviewChance, actionRestriction, activityRestriction,
    applyRestriction, interviewRestriction, eventRestriction, financeRestriction, shiftRestriction,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JobGame = api;
})(globalThis);
