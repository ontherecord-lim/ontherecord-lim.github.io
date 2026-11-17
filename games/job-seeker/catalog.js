(function (root) {
  "use strict";

  const sectors = {
    media: "미디어·디자인",
    business: "마케팅·영업",
    administration: "경영·금융·공공",
    digital: "IT·데이터",
    engineering: "제조·엔지니어링",
    science: "바이오·환경",
    logistics: "물류·무역",
  };

  const employment = {
    permanent: { label: "신입 정규직", resumeTarget: 67, interviewTarget: 71 },
    conversion: { label: "채용연계형 인턴", resumeTarget: 64, interviewTarget: 68 },
    internship: { label: "체험형 인턴", resumeTarget: 59, interviewTarget: 64 },
    contract: { label: "신입 계약직", resumeTarget: 62, interviewTarget: 67 },
  };

  const skills = {
    content: "취재·콘텐츠", design: "사용자 조사", business: "고객·시장 분석",
    finance: "엑셀·정산", data: "데이터 분석", software: "개발·테스트",
    industry: "공정·설비", quality: "품질·기록", admin: "행정·문서", ops: "운영·물류",
  };

  const actionGroups = { basics: "지원 준비", practice: "직무 실습", life: "생활·취미" };
  const coreActions = [
    {
      id: "research", group: "basics", title: "채용공고 비교하기", icon: "paper", color: "cyan",
      about: "관심 공고의 업무와 공통 요구 역량을 적는다.",
      effects: { resume: 8, interview: 5, energy: -9 },
      entry: "직무명은 같아도 팀마다 맡는 일이 달랐다. 내 경험과 닿는 곳을 골라봤다.",
    },
    {
      id: "ncs", group: "basics", title: "NCS·인적성 연습", icon: "pen", color: "blue",
      about: "자료 해석과 상황 판단 문제를 시간 내에 푼다.",
      effects: { resume: 9, energy: -12, morale: -3 }, skill: "admin", gain: 16,
      entry: "시간이 오래 걸린 문항을 표시하고 오답의 근거를 다시 읽었다.",
    },
    {
      id: "feedback", group: "basics", title: "현직자에게 피드백 받기", icon: "people", color: "violet",
      about: "지원 동기와 작업 사례를 보여주고 질문한다.",
      effects: { interview: 13, resume: 5, energy: -9, balance: -6 },
      entry: "작업에서 내가 내린 결정 하나를 더 자세히 보여달라는 조언을 받았다.",
    },
  ];

  function practical(id, title, icon, color, skill, gain, effects, about, entry) {
    return { id, group: "practice", title, icon, color, skill, gain, effects, about, entry };
  }

  const practiceActions = [
    practical("reporting", "콘텐츠 샘플 제작", "film", "rose", "content", 22, { resume: 9, energy: -12 },
      "기사, 리포트, 영상 중 하나를 기획해 짧게 완성한다.", "대상이 누구인지 정하고 첫 문장부터 다시 구성했다."),
    practical("ux-test", "UX 사용성 테스트", "people", "violet", "design", 22, { resume: 9, energy: -12 },
      "만든 화면을 실제 사람이 어떻게 쓰는지 관찰한다.", "어디서 멈췄는지 적고 고민하던 버튼부터 다시 그렸다."),
    practical("market", "시장 조사·캠페인 실습", "star", "gold", "business", 22, { resume: 9, energy: -12 },
      "고객을 한 그룹 골라 메시지와 성과 지표를 정한다.", "예산을 쓰기 전에 누가 왜 클릭할지를 먼저 적어봤다."),
    practical("spreadsheet", "엑셀 정산표 만들기", "paper", "teal", "finance", 22, { resume: 9, energy: -12 },
      "매출·비용·환불을 분리하고 자료를 대조한다.", "빠지거나 두 번 입력된 항목을 정산표에서 찾아냈다."),
    practical("sql", "SQL 데이터 분석", "folder", "cyan", "data", 22, { resume: 9, energy: -13 },
      "샘플 데이터에서 행동별 전환율을 계산해본다.", "분모가 달라 숫자를 비교하기 어렵다는 걸 표에 표시했다."),
    practical("ai-review", "AI 답변 검증", "chat", "violet", "data", 17, { resume: 8, interview: 5, energy: -12 },
      "샘플 답변을 원문과 대조해 오류 유형을 나눈다.", "그럴듯하게 맞는 말과 출처에서 확인한 내용을 항목별로 나눴다."),
    practical("coding", "작은 기능 개발", "bolt", "blue", "software", 22, { resume: 9, energy: -14 },
      "작은 기능을 만들고 실행 예시와 변경 내용을 남긴다.", "기능이 왜 필요한지와 데이터가 비어 있을 때를 같이 설명했다."),
    practical("testing", "서비스 QA·테스트", "star", "cyan", "software", 17, { resume: 8, interview: 5, energy: -12 },
      "서로 다른 화면과 상황에서 작동 여부를 확인한다.", "버그가 생긴 환경과 예상했던 결과를 한 장에 적었다."),
    practical("process", "공정·설비 사례 분석", "bolt", "gold", "industry", 22, { resume: 9, energy: -14 },
      "공정 기록을 보고 이상이 생긴 구간을 좁힌다.", "문제가 생기기 전 마지막으로 바뀐 조건을 찾아냈다."),
    practical("quality", "품질 시험·기록 실습", "paper", "teal", "quality", 22, { resume: 9, energy: -13 },
      "검사 결과와 변경 이력을 기준에 맞게 정리한다.", "정상 범위에서 벗어난 수치와 확인이 필요한 항목을 구분했다."),
    practical("brief", "보고서·업무 문서 작성", "pen", "blue", "admin", 22, { resume: 9, energy: -12 },
      "요청 배경과 다음 결정에 필요한 자료를 한 장에 쓴다.", "받는 사람이 해야 할 일과 마감부터 위로 올렸다."),
    practical("inventory", "재고·납기 실습", "case", "gold", "ops", 22, { resume: 9, energy: -12 },
      "주문량과 재고를 대조해 출고 순서를 정한다.", "남은 재고가 아니라 이미 약속한 주문까지 포함해 계산했다."),
    practical("support", "고객 응대 시뮬레이션", "chat", "rose", "ops", 16, { interview: 10, resume: 4, energy: -10 },
      "불편을 들은 뒤 조치 방법과 다음 안내 시각을 정한다.", "바로 답할 수 없는 문제도 어느 시점에 다시 안내할지는 약속했다."),
  ];

  const lifeActions = [
    {
      id: "upload", group: "life", title: "유튜브 영상 올리기", icon: "camera", color: "rose",
      about: "직접 만든 짧은 영상을 편집해 채널에 올린다.",
      effects: { resume: 7, energy: -13 }, skill: "content", gain: 12, requires: "channel",
      entry: "한 편을 완성해 올렸다. 어떤 부분을 다음 영상에서 고칠지 메모했다.",
    },
    {
      id: "fandom", group: "life", title: "덕질 타임", icon: "heart", color: "violet",
      about: "좋아하는 작품이나 무대로 잠깐 머리를 식힌다.",
      effects: { morale: 21, energy: -5 }, requires: "hobby",
      entry: "취업 얘기 말고도 하루를 채운 게 생겼다.",
    },
  ];

  function question(prompt, choices) {
    return { prompt, choices: choices.map(([label, score, note]) => ({ label, score, note })) };
  }

  const originalPostings = {
    broadcast: { sector: "media", kind: "permanent", location: "부산", deadline: 18, skill: "content", recommended: ["reporting", "practice"], materials: "짧은 리포트 영상과 그 안에서 직접 확인한 내용." },
    reporter: { sector: "media", kind: "permanent", location: "서울", deadline: 20, skill: "content", recommended: ["reporting", "research"], materials: "기명 기사 또는 기사 샘플, 취재원과 수치 확인 과정." },
    producer: { sector: "media", kind: "conversion", location: "서울", deadline: 17, skill: "content", recommended: ["reporting", "market"], materials: "짧은 영상 또는 기획안, 시청자와 오프닝을 정한 이유." },
  };

  const jobs = [
    {
      id: "ux", title: "UX/UI 디자이너", company: "생활 앱 스튜디오", sector: "media", kind: "internship", location: "서울", deadline: 16,
      icon: "star", color: "violet", skill: "design", recommended: ["ux-test", "portfolio"],
      description: "사용자 인터뷰를 돕고, 가입과 구매 화면의 프로토타입을 만든다.",
      materials: "화면 시안과 함께 관찰한 사용 문제, 수정 전후 화면을 정리한 포트폴리오.",
      ending: "첫 인턴 과제는 가입 화면 한 장이었다. 시안보다 먼저 지난 사용성 테스트 메모를 펼쳤다.",
      questions: [
        question("테스트 참여자들이 회원가입 마지막 단계에서 멈춥니다. 첫 확인은?", [
          ["동의 문구와 버튼을 사용자가 어떻게 읽는지 관찰한다.", 13, "의미를 잘못 이해했는지 행동과 함께 확인했다."],
          ["전체 화면의 버튼 색을 더 진하게 바꾼다.", 3, "가시성을 바꿀 수 있지만 멈춘 이유를 먼저 확인해야 했다."],
          ["마지막 단계에 있던 필드를 전부 지운다.", -10, "필수 정보와 삭제 가능한 정보를 구분할 필요가 있었다."],
        ]),
        question("포트폴리오에서 화면을 바꾼 이유를 묻습니다.", [
          ["요즘 많이 쓰이는 디자인이라 적용했다고 설명한다.", 3, "유행 외에 사용자 근거가 필요했다."],
          ["변경 전 문제를 관찰한 결과, 수정안, 검증 결과를 연결해 설명한다.", 13, "시안 뒤에 있었던 판단을 보여줬다."],
          ["완성 화면만 확대해서 보여준다.", -10, "변경 이유가 드러나지 않았다."],
        ]),
      ],
    },
    {
      id: "marketing", title: "퍼포먼스 마케터", company: "디지털 광고 대행사", sector: "business", kind: "conversion", location: "서울", deadline: 16,
      icon: "star", color: "gold", skill: "business", recommended: ["market", "sql"],
      description: "광고 소재를 시험하고 전환비용을 확인해 다음 캠페인의 예산을 조정한다.",
      materials: "광고 소재 두 개의 실험 계획과 전환 지표를 읽은 결과.",
      ending: "첫 캠페인 표를 받았다. 클릭이 많은 광고와 구매로 이어진 광고를 색으로 구분해봤다.",
      questions: [
        question("클릭은 늘었는데 구매당 광고비가 올랐습니다. 어떻게 볼까요?", [
          ["가장 클릭이 많은 소재에 예산을 한꺼번에 옮긴다.", -10, "클릭이 구매로 이어졌는지 검토하지 않았다."],
          ["소재별 클릭 후 구매 전환과 추적 오류 여부를 함께 확인한다.", 13, "문제 구간과 데이터 신뢰도를 함께 봤다."],
          ["전체 예산을 조금 줄인 뒤 결과를 기다린다.", 3, "비용은 줄일 수 있지만 원인 파악이 뒤로 밀렸다."],
        ]),
        question("두 광고 소재를 공정하게 비교하려면?", [
          ["더 좋아 보이는 광고만 주말에 집행한다.", -10, "노출 시간이 달라 비교하기 어려웠다."],
          ["전환 목표를 정하고 유사한 집단과 기간에서 소재만 바꿔 본다.", 13, "효과를 분리해 볼 비교 기준을 세웠다."],
          ["두 광고의 댓글 분위기를 주로 비교한다.", 3, "댓글은 단서지만 구매 목표의 결과를 대신하지 못한다."],
        ]),
      ],
    },
    {
      id: "md", title: "이커머스 MD", company: "온라인 리빙몰", sector: "business", kind: "permanent", location: "경기", deadline: 19,
      icon: "folder", color: "rose", skill: "business", recommended: ["market", "inventory"],
      description: "입점 상품을 고르고 기획전의 판매, 수익과 반품 원인을 관리한다.",
      materials: "기획전 상품 구성안과 판매가, 마진, 재고를 비교한 표.",
      ending: "처음 맡은 기획전은 생활용품 세 종류였다. 주문이 몰리는 날에도 보낼 수 있을 만큼만 노출을 잡았다.",
      questions: [
        question("판매량이 높은 상품의 반품도 크게 늘었습니다. 기획전에서 어떻게 할까요?", [
          ["반품 사유와 상세 페이지 설명을 대조하고 노출량을 조정한다.", 13, "판매량과 경험을 함께 반영했다."],
          ["예약 물량을 조금 줄인다.", 3, "재고 부담은 줄지만 고객이 왜 반품했는지 알아야 했다."],
          ["판매량이 높으니 첫 화면에 더 크게 올린다.", -10, "반품 비용과 불편이 더 커질 수 있었다."],
        ]),
        question("두 공급사가 비슷한 상품을 제안했습니다.", [
          ["납기와 품질 기준, 반품 조건까지 표에 넣고 단가와 함께 비교한다.", 13, "실제 운영에 드는 비용과 위험을 봤다."],
          ["상품 사진과 판매가만 비교한다.", 3, "첫 인상 외에 공급 조건을 확인할 수 있었다."],
          ["답장이 먼저 온 쪽에 전체 물량을 맡긴다.", -10, "비교 근거 없이 발주했다."],
        ]),
      ],
    },
    {
      id: "sales", title: "B2B 기술영업", company: "산업 센서 공급사", sector: "business", kind: "permanent", location: "인천", deadline: 18,
      icon: "case", color: "gold", skill: "business", recommended: ["market", "process"],
      description: "기업 고객의 설치 조건을 듣고 엔지니어와 함께 사양과 견적을 제안한다.",
      materials: "고객 요구를 정리한 질문 목록과 사양 비교 제안서.",
      ending: "첫 고객 미팅에서 제안서를 아직 열지 않았다. 고객이 쓰던 장비부터 보여달라고 부탁했다.",
      questions: [
        question("고객이 가장 저렴한 센서를 달라고 합니다. 설치 환경은 아직 모릅니다.", [
          ["최저가 제품을 바로 발주할 수 있다고 약속한다.", -10, "맞지 않는 사양을 판매할 위험이 있었다."],
          ["예산을 먼저 받고 가격표를 보내겠다 한다.", 3, "예산을 알았지만 설치 조건 확인이 필요했다."],
          ["설치 환경과 필요한 기능을 듣고 엔지니어와 후보를 좁힌다.", 13, "가격과 실제 사용 조건을 함께 다뤘다."],
        ]),
        question("제안 단계에서 공급 일정이 바뀌었습니다.", [
          ["고객에게 우선 변동을 알리고 대체 사양이나 분할 납기를 상의한다.", 13, "고객이 일정을 조정할 시간을 확보했다."],
          ["변경된 일정만 메일로 보낸다.", 3, "상황을 공유했고 대안이 있으면 더 도움이 됐다."],
          ["계약까지는 이전 날짜 그대로 말한다.", -10, "지킬 수 있는 일정으로 다시 협의해야 했다."],
        ]),
      ],
    },
    {
      id: "customer", title: "고객 성공 매니저", company: "업무용 소프트웨어 회사", sector: "business", kind: "conversion", location: "서울", deadline: 18,
      icon: "chat", color: "teal", skill: "ops", recommended: ["support", "sql"],
      description: "도입 고객을 교육하고 이용이 줄어드는 계정의 어려움을 찾아 돕는다.",
      materials: "초기 사용 안내 자료와 고객 불편을 개선한 사례.",
      ending: "첫 고객 교육이 끝난 뒤 상대가 직접 기능을 써보는 동안 한 박자 기다렸다.",
      questions: [
        question("도입 한 달 뒤 고객 팀의 사용량이 크게 줄었습니다.", [
          ["기능 소개 메일을 같은 내용으로 매일 보낸다.", -10, "실제 사용을 막는 이유를 알아내지 못했다."],
          ["자주 쓰던 기능과 멈춘 시점을 보고 담당자에게 장애물을 묻는다.", 13, "데이터 단서와 고객 이야기를 연결했다."],
          ["교육 자료를 한번 더 보내준다.", 3, "자료가 도움이 될 수 있지만 필요 목록을 먼저 물을 수 있었다."],
        ]),
        question("해결 시각을 모르는 문의가 들어왔습니다.", [
          ["확인 중이라고 설명하고 다음 안내 시각을 약속한다.", 13, "불확실한 상황에서 지킬 수 있는 약속을 했다."],
          ["팀을 재촉한 뒤 조치될 때만 연락한다.", 3, "내부 확인 외에도 진행 상태를 알려줄 수 있었다."],
          ["오늘 안에 무조건 해결된다고 답한다.", -10, "확인되지 않은 해결 일정을 약속했다."],
        ]),
      ],
    },
    {
      id: "hr", title: "인사·채용 운영", company: "생활소비재 기업", sector: "administration", kind: "conversion", location: "서울", deadline: 17,
      icon: "people", color: "violet", skill: "admin", recommended: ["brief", "feedback"],
      description: "채용 일정을 조율하고 면접 안내, 지원자 문의와 신규 입사 교육을 맡는다.",
      materials: "공정한 면접 운영 체크리스트와 일정 조율 사례.",
      ending: "첫 면접 안내 메일을 썼다. 시간을 틀리지 않았는지 확인하고, 처음 오는 사람이 읽기 쉽게 장소를 적었다.",
      questions: [
        question("면접관 두 명이 다른 기준으로 평가했습니다.", [
          ["팀에서 오래 일한 면접관의 판단만 반영한다.", -10, "같은 직무 기준으로 근거를 비교해야 했다."],
          ["미리 정한 평가 기준에 맞춰 답변 근거를 함께 확인한다.", 13, "일관된 기준으로 판단을 맞췄다."],
          ["두 점수의 평균만 낸다.", 3, "계산은 되지만 서로 다르게 본 근거는 남지 않았다."],
        ]),
        question("면접 장소가 하루 전에 바뀌었습니다.", [
          ["바뀐 장소, 이동 방법과 문의처를 바로 알리고 확인한다.", 13, "지원자가 일정 변경에 대응할 수 있게 했다."],
          ["캘린더 초대장의 장소만 바꾼다.", 3, "알림이 전달됐는지 별도로 확인할 수 있었다."],
          ["당일에 먼저 도착한 지원자에게 알린다.", -10, "방문자에게 미리 변경 내용을 알릴 수 있었다."],
        ]),
      ],
    },
    {
      id: "accounting", title: "재무·회계", company: "산업장비 유통사", sector: "administration", kind: "permanent", location: "서울", deadline: 20,
      icon: "wallet", color: "gold", skill: "finance", recommended: ["spreadsheet", "brief"],
      description: "전표와 증빙을 확인하고 매입·매출 정산과 월말 결산을 돕는다.",
      materials: "엑셀 정산표, 수치가 맞지 않았을 때 대조한 기록.",
      ending: "첫 월말 마감을 앞두고 전표와 증빙을 옆에 띄웠다. 작은 차이 하나도 출처를 확인하고 메모했다.",
      questions: [
        question("장부의 매입액과 거래처 증빙 금액이 다릅니다.", [
          ["차이만큼 엑셀 수식을 고쳐 합계를 맞춘다.", -10, "합계 대신 원인과 증빙을 확인해야 했다."],
          ["거래일과 품목별 증빙을 맞춰 보고 확인할 쟁점을 적는다.", 13, "차이를 만드는 항목을 찾아 근거를 남겼다."],
          ["거래처에 숫자가 다르다고 연락한다.", 3, "확인 요청 전에 어느 항목에서 다른지 좁힐 수 있었다."],
        ]),
        question("반복 입력이 많은 정산표를 정리한다면?", [
          ["검증 규칙을 만들고 원본과 결과의 대조 표본을 남긴다.", 13, "자동화 후에도 잘못 들어온 값을 확인할 수 있게 했다."],
          ["보기 좋은 색과 글꼴로 먼저 정리한다.", 3, "읽기는 편해지지만 입력 오류가 줄어드는 방식도 필요했다."],
          ["표를 복제해서 차이 나는 항목은 감춘다.", -10, "누락과 차이를 확인하기 어렵게 만들었다."],
        ]),
      ],
    },
    {
      id: "fintech", title: "핀테크 서비스 운영", company: "결제 플랫폼", sector: "administration", kind: "internship", location: "서울", deadline: 15,
      icon: "wallet", color: "cyan", skill: "finance", recommended: ["spreadsheet", "support"],
      description: "가입과 정산 과정에서 막히는 고객을 돕고 반복 문의를 개선 과제로 정리한다.",
      materials: "결제 후속 안내 예시와 이용자가 혼란을 겪는 구간을 정리한 메모.",
      ending: "첫 인턴 회의에서 고객 문의가 가장 많이 들어온 문구를 읽었다. 팀과 새 안내 문장을 써봤다.",
      questions: [
        question("정산 화면의 예정일을 실제 입금일로 이해하는 문의가 늘었습니다.", [
          ["문의한 사람에게만 날짜를 다시 말한다.", 3, "지금 문의는 처리했지만 안내 문구 개선 여지가 있었다."],
          ["예정일의 의미와 변경 시 안내 방법을 고객 화면에서 명확히 한다.", 13, "반복 문의를 낳은 정보 차이를 줄였다."],
          ["예정일 표시를 숨긴다.", -10, "고객이 필요한 정보를 더 찾기 어려워졌다."],
        ]),
        question("가입에 필요한 정보가 빠진 문의가 왔습니다.", [
          ["필요한 항목과 안전한 제출 경로를 안내한다.", 13, "확인에 필요한 정보를 정확한 위치로 안내했다."],
          ["개인 채팅방에 서류 전체를 보내 달라고 한다.", -10, "필요한 범위와 처리 경로를 지킬 수 있었다."],
          ["신청을 처음부터 다시 하라고 한다.", 3, "가능한 방법이지만 빠진 항목만 보완할 수 있었다."],
        ]),
      ],
    },
    {
      id: "public-admin", title: "공공기관 일반행정", company: "지역 일자리 지원기관", sector: "administration", kind: "permanent", location: "대전", deadline: 19,
      icon: "paper", color: "blue", skill: "admin", recommended: ["ncs", "brief"],
      description: "청년 지원 사업의 접수 서류와 운영 일정, 참여자 안내를 맡는다.",
      materials: "직무역량기술서, 자료 해석과 상황 판단 연습, 공문 작성 사례.",
      ending: "새로 받은 행정 업무는 모집 안내문 교정이었다. 처음 읽는 사람도 신청 순서를 따라갈 수 있는지 점검했다.",
      questions: [
        question("지원사업 접수 마감 날입니다. 요건 문의가 계속 들어옵니다.", [
          ["접수 담당자가 그때그때 편한 기준으로 답한다.", -10, "같은 문의에는 공통 기준이 있어야 했다."],
          ["공고 기준을 확인해 자주 묻는 질문을 하나의 안내로 정리한다.", 13, "신청자에게 같은 정보를 전달했다."],
          ["운영시간을 연장해 문의를 더 받는다.", 3, "시간을 확보하는 것과 일관된 기준을 정리하는 일은 다르다."],
        ]),
        question("보고서에 이번 달 참여 인원이 지난달보다 크게 늘었다고 나옵니다.", [
          ["인원 집계 대상과 중복 참여 기록이 같은 기준인지 먼저 확인한다.", 13, "비교할 수 있는 자료인지 점검했다."],
          ["증가 폭을 그래프로 보기 좋게 그린다.", 3, "표현 전에 집계 기준을 검토하면 더 정확했다."],
          ["목표를 달성한 것으로 바로 공지한다.", -10, "결과를 알리기 전 집계부터 확인해야 했다."],
        ]),
      ],
    },
    {
      id: "frontend", title: "프론트엔드 개발자", company: "모바일 생활 서비스", sector: "digital", kind: "conversion", location: "경기", deadline: 17,
      icon: "bolt", color: "cyan", skill: "software", recommended: ["coding", "ux-test"],
      description: "사용자 화면을 만들고 작은 화면, 키보드 조작과 로딩 상태를 점검한다.",
      materials: "실행 가능한 작업 링크, 변경 사항과 접근성·예외 처리 설명.",
      ending: "첫 수정 사항은 화면이 좁을 때 보이지 않는 버튼이었다. 휴대폰과 키보드로 직접 다시 눌러봤다.",
      questions: [
        question("마우스로는 되는 메뉴가 키보드로 열리지 않습니다.", [
          ["클릭 가능한 요소와 포커스 이동을 점검하고 키보드로 시험한다.", 13, "입력 방식에 관계없이 메뉴를 쓸 수 있는지 확인했다."],
          ["마우스로 눌러달라는 안내를 추가한다.", 3, "우회는 가능하지만 접근 문제는 남았다."],
          ["키보드 사용자는 적다고 보고 다음 업무로 넘어간다.", -10, "핵심 탐색 기능은 다른 입력 방식에서도 필요하다."],
        ]),
        question("목록을 불러오다 오류가 나면 사용자가 빈 화면을 봅니다.", [
          ["오류와 빈 결과를 구분해 안내하고 다시 시도할 방법을 제공한다.", 13, "사용자가 상태를 이해하고 다음 행동을 선택할 수 있다."],
          ["작업이 끝날 때까지 계속 로딩 표시를 유지한다.", -10, "화면이 멈춘 듯 보였다."],
          ["실패하더라도 목록이 없는 것처럼 보인다.", 3, "화면은 유지되지만 실패 원인이 전달되지 않는다."],
        ]),
      ],
    },
    {
      id: "backend", title: "백엔드 개발자", company: "예약 플랫폼", sector: "digital", kind: "permanent", location: "서울", deadline: 20,
      icon: "folder", color: "blue", skill: "software", recommended: ["coding", "testing"],
      description: "예약 API와 데이터 흐름을 개발하고 테스트·오류 로그를 관리한다.",
      materials: "사용법과 예외 처리, 테스트 결과가 담긴 작은 프로젝트.",
      ending: "첫 업무로 예약 변경 요청을 받았다. 잘됐을 때와 이미 취소된 예약일 때를 각각 시험했다.",
      questions: [
        question("같은 요청이 두 번 들어와 예약 두 건이 생겼습니다.", [
          ["화면에서 버튼 클릭 간격만 늘린다.", 3, "일부 발생은 줄지만 요청이 다시 들어올 수 있다."],
          ["같은 요청 식별자를 확인해 서버가 한 번만 반영하도록 시험한다.", 13, "여러 번 호출해도 의도한 결과가 한 번 저장되게 했다."],
          ["중복은 운영팀에서 발견할 때마다 지운다.", -10, "중복 때문에 고객이 받은 결과를 되돌리기 어렵다."],
        ]),
        question("오류율이 올라갔습니다. 어디부터 볼까요?", [
          ["영향받은 기능과 시각을 좁히고 배포·로그를 비교한다.", 13, "근거를 모아 원인 후보를 좁혔다."],
          ["모든 서비스를 동시에 재시작한다.", -10, "영향 범위와 원인을 확인하기 어려워졌다."],
          ["개발 채팅방에 오류가 늘었다는 것만 알린다.", 3, "상황 공유와 함께 구체적인 범위를 알릴 수 있었다."],
        ]),
      ],
    },
    {
      id: "data", title: "데이터 분석가", company: "커머스 분석팀", sector: "digital", kind: "permanent", location: "서울", deadline: 20,
      icon: "star", color: "cyan", skill: "data", recommended: ["sql", "spreadsheet"],
      description: "SQL로 가입·구매 행동을 분석하고 실험 결과를 팀이 쓰기 좋은 표로 전달한다.",
      materials: "지표 정의, 분석 쿼리와 해석 근거가 이어지는 사례.",
      ending: "첫 분석 자료를 공유하면서 숫자 밑에 분모를 적었다. 상품팀이 다른 뜻으로 오해할 여지를 줄이고 싶었다.",
      questions: [
        question("구매 전환율 두 개의 분모가 서로 다릅니다.", [
          ["높은 숫자가 나온 쪽으로 성과를 보고한다.", -10, "서로 다른 분모의 수치로 결론을 낼 수 없다."],
          ["어떤 사용자를 어느 기간에 셌는지 확인하고 같은 기준으로 다시 계산한다.", 13, "같은 집단과 기간의 결과를 비교했다."],
          ["두 숫자를 함께 올리고 각주를 붙인다.", 3, "정의는 밝혔지만 같은 기준으로 다시 계산할 수 있었다."],
        ]),
        question("실험에서 전환이 소폭 높았지만 표본이 작습니다.", [
          ["좋은 신호라고 알리되 표본 한계와 추가 확인 계획을 기록한다.", 13, "결과와 불확실성을 함께 전했다."],
          ["숫자가 올랐으니 즉시 전체 적용한다.", -10, "일시적 차이인지 구분하기 어려웠다."],
          ["차이가 없다고 결론낸다.", 3, "판단을 보류하고 추가 데이터를 볼 수 있었다."],
        ]),
      ],
    },
    {
      id: "ai-ops", title: "AI 서비스 운영·품질 평가", company: "업무 자동화 스타트업", sector: "digital", kind: "conversion", location: "서울", deadline: 19,
      icon: "chat", color: "violet", skill: "data", recommended: ["ai-review", "testing"],
      description: "업무용 AI 답변을 평가하고 실패 사례와 검증 기준을 제품팀에 전달한다.",
      materials: "평가 질문 예시, 확인 근거와 오류 유형을 분류한 표.",
      ending: "첫날 받은 답변은 모두 말이 그럴듯했다. 맞는 것과 근거가 없는 것부터 다르게 표시했다.",
      questions: [
        question("AI가 실제 문서에 없는 수치를 자신 있게 말합니다.", [
          ["문장이 자연스럽다면 통과 처리한다.", -10, "표현과 근거를 따로 평가해야 했다."],
          ["원문과 대조해 검증 실패 사례로 남기고 유사 질문을 시험한다.", 13, "오류 근거와 범위를 확인했다."],
          ["해당 질문만 평가에서 지운다.", 3, "문제 사례를 유지해 개선 여부를 확인할 수 있었다."],
        ]),
        question("모델 변경 후 답변이 더 길어졌습니다.", [
          ["답변 길이와 별도로 정확성, 필요한 내용과 출처를 평가한다.", 13, "길이 변화가 품질 변화인지 검증했다."],
          ["더 길어진 답변을 전부 합격으로 센다.", -10, "길이만으로 유용성을 판단하기 어렵다."],
          ["답변이 길어진 예시 몇 개를 골라 전달한다.", 3, "일부 사례와 함께 기존과 같은 평가 기준을 적용할 수 있었다."],
        ]),
      ],
    },
    {
      id: "cloud", title: "클라우드 운영 엔지니어", company: "기업형 클라우드 운영사", sector: "digital", kind: "permanent", location: "경기", deadline: 18,
      icon: "bolt", color: "blue", skill: "software", recommended: ["testing", "coding"],
      description: "서버 상태와 비용을 모니터링하고 장애 대응 내역과 배포 기록을 관리한다.",
      materials: "작은 배포 구성도와 장애 대응·복구 계획을 정리한 문서.",
      ending: "첫 교대 인수인계 때 읽던 운영 문서에 빠진 알림 이름 하나를 추가했다.",
      questions: [
        question("배포 뒤 오류 알림이 늘었습니다. 첫 조치는 무엇인가요?", [
          ["알림을 잠시 모두 끈다.", -10, "영향과 조치 결과를 관찰하기 어려워졌다."],
          ["영향 범위를 확인하고 팀 기준에 따라 되돌리기 판단과 상황 공유를 한다.", 13, "서비스 영향과 필요한 대응 순서를 함께 봤다."],
          ["알림 화면을 팀 채팅에 복사한다.", 3, "공유하면서 발생 시점과 범위를 같이 정리할 수 있었다."],
        ]),
        question("계속 울리지만 조치할 필요가 없는 알림이 생겼습니다.", [
          ["과거 기록을 보고 실제 조치 기준을 팀과 맞춰 규칙을 조정한다.", 13, "알림 피로를 줄이면서 필요한 경보를 살폈다."],
          ["알림 개수를 줄이려고 해당 서비스를 목록에서 뺀다.", -10, "실제 장애의 신호도 놓칠 수 있다."],
          ["설명을 한 줄 더 적는다.", 3, "안내는 좋아지지만 불필요한 호출 문제는 남았다."],
        ]),
      ],
    },
    {
      id: "semicon", title: "반도체 공정 엔지니어", company: "반도체 부품 제조사", sector: "engineering", kind: "permanent", location: "경기", deadline: 18,
      icon: "bolt", color: "gold", skill: "industry", recommended: ["process", "sql"],
      description: "설비·공정 데이터를 보고 불량이나 수율 변동 원인을 찾는다.",
      materials: "공정 이상을 기록한 사례, 데이터를 나눠 원인 후보를 좁힌 과정.",
      ending: "첫 라인 회의에서 수율 표를 펼쳤다. 평균만으로 보이지 않는 구간을 시간대별로 표시했다.",
      questions: [
        question("특정 설비를 거친 물량에서만 불량이 늘었습니다.", [
          ["조건을 한꺼번에 조정해 결과를 기다린다.", -10, "여러 변수를 동시에 바꾸면 원인을 가리기 어렵다."],
          ["물량과 시간대, 설비 변경 기록을 대조한다.", 13, "가능한 원인을 분리해 확인하기 시작했다."],
          ["전체 주간 평균을 다시 계산한다.", 3, "전체 추세 외에 해당 설비의 이력이 중요했다."],
        ]),
        question("개선안을 적용하기 전에 무엇을 정리할까요?", [
          ["안전하고 제한된 범위에서 검증할 기준과 원복 조건을 합의한다.", 13, "성과를 판단할 기준과 결정을 되돌릴 조건을 준비했다."],
          ["성공 예상치만 보고한다.", 3, "예상치에 검증 방식이 들어가면 더 설득력 있다."],
          ["기록은 개선이 끝난 뒤 작성한다.", -10, "무엇을 바꿨는지 정확히 추적하기 어려웠다."],
        ]),
      ],
    },
    {
      id: "manufacturing", title: "생산기술·설비 엔지니어", company: "배터리 장비 제조사", sector: "engineering", kind: "permanent", location: "충남", deadline: 19,
      icon: "bolt", color: "gold", skill: "industry", recommended: ["process", "quality"],
      description: "생산 설비를 점검하고 작업 중단 원인, 교체 이력과 개선안을 기록한다.",
      materials: "설비 이상을 좁힌 과정과 안전하게 시험하는 계획.",
      ending: "첫 현장 점검 때 배운 건 라인 한 칸을 왜 멈춰야 하는지 설명하는 일이었다.",
      questions: [
        question("설비 정지가 특정 교대 시간에 반복됩니다.", [
          ["교대 기록, 작업 순서와 알림 이력을 시간대로 비교한다.", 13, "사람을 탓하기 전에 반복 패턴을 확인했다."],
          ["작업자를 먼저 바꾸고 지켜본다.", -10, "기록 확인 없이 원인을 단정했다."],
          ["정지 횟수를 월 단위로만 집계한다.", 3, "반복 시점이 어디인지 볼 세부 기록이 필요했다."],
        ]),
        question("작업자가 새 점검표가 불편하다고 합니다.", [
          ["현장에서 실제로 막히는 항목을 살피고 필요한 기록은 유지하며 개선한다.", 13, "안전·기록 기준과 작업 흐름을 함께 고려했다."],
          ["불편한 항목을 모두 삭제한다.", -10, "점검에 필요한 기록까지 빠질 수 있었다."],
          ["교육 자료 분량만 늘린다.", 3, "교육 외에 실제 점검표의 사용 흐름을 확인할 수 있었다."],
        ]),
      ],
    },
    {
      id: "quality", title: "제조 품질관리(QC)", company: "정밀부품 생산사", sector: "engineering", kind: "contract", location: "경남", deadline: 17,
      icon: "paper", color: "teal", skill: "quality", recommended: ["quality", "process"],
      description: "부품의 검사 결과를 정리하고 규격에 맞지 않는 물량의 이력을 추적한다.",
      materials: "검사표 예시, 이상 발견부터 팀 공유까지의 기록.",
      ending: "첫 검사표에 이상값을 동그라미 쳤다. 어느 물량에서 나온 결과인지 같이 기록했다.",
      questions: [
        question("규격에 맞지 않는 부품이 섞였습니다.", [
          ["해당 물량을 구분하고 검사값과 생산 이력을 팀과 확인한다.", 13, "문제 범위와 기록을 확보했다."],
          ["당일 출고량을 맞추고 나중에 보고한다.", -10, "의심되는 물량의 확산을 막기 어려웠다."],
          ["눈에 띄는 부품만 한 개 빼놓는다.", 3, "개별 대응과 함께 영향 물량을 확인할 수 있었다."],
        ]),
        question("같은 부품의 측정값이 검사자마다 크게 다릅니다.", [
          ["사람마다 낸 결과의 평균을 기록한다.", 3, "평균만 보면 측정 차이가 왜 생겼는지 알기 어렵다."],
          ["측정 환경과 방법을 비교하고 같은 기준으로 다시 확인한다.", 13, "측정 자체의 조건을 일치시켰다."],
          ["기준에 가장 가까운 결과만 고른다.", -10, "결과를 선택하기 전에 측정 방법을 확인해야 했다."],
        ]),
      ],
    },
    {
      id: "pharma", title: "제약 품질보증(QA)", company: "의약품 생산사", sector: "science", kind: "permanent", location: "충북", deadline: 18,
      icon: "paper", color: "teal", skill: "quality", recommended: ["quality", "brief"],
      description: "현장 기록과 문서 변경 이력을 검토해 누락이나 기준 이탈을 확인한다.",
      materials: "품질 문서 검토 사례와 변경 사항을 기록하는 방법.",
      ending: "첫 서류 검토 때 비어 있는 칸 하나를 발견했다. 누가 언제 무엇을 확인했는지부터 물어봤다.",
      questions: [
        question("생산 기록의 확인 항목이 한 곳 빠져 있습니다.", [
          ["담당자와 기록 근거를 확인해 절차에 따라 누락 내용을 남긴다.", 13, "임의로 채우지 않고 기록을 추적할 수 있게 정리했다."],
          ["형식이 맞도록 기억나는 내용을 대신 쓰고 서명한다.", -10, "확인하지 않은 기록을 적으면 추적하기 어렵다."],
          ["팀에 공유하고 해당 페이지를 표시한다.", 3, "공유 외에 확인 근거와 후속 기록이 필요했다."],
        ]),
        question("현장에서 이전 버전의 문서 양식을 쓰고 있었습니다.", [
          ["사용한 범위와 시점을 확인하고 새 양식을 배포한다.", 13, "영향받은 기록과 재발 방지 조치를 함께 챙겼다."],
          ["새 출력물을 더 가져다주고 지나간다.", 3, "새 양식 외에 어떤 기록이 해당되는지 확인할 수 있었다."],
          ["이전 기록을 전부 지운다.", -10, "기존 기록도 확인하고 보존할 필요가 있다."],
        ]),
      ],
    },
    {
      id: "food", title: "식품 제품개발", company: "간편식 개발사", sector: "science", kind: "internship", location: "경기", deadline: 16,
      icon: "bowl", color: "rose", skill: "quality", recommended: ["quality", "market"],
      description: "시제품 평가를 보조하고 맛, 표시 정보와 평가 기록을 정리한다.",
      materials: "서로 다른 시제품을 같은 기준으로 비교한 기록.",
      ending: "첫 시식 의견을 모았다. ‘맛있다’ 옆에 어떤 점이 좋았는지 추가로 물을 질문을 적었다.",
      questions: [
        question("비슷한 시제품 두 개의 시식 의견이 서로 엇갈립니다.", [
          ["두 제품 모두 맛이 같다고 결론낸다.", -10, "엇갈린 의견이 나온 조건과 이유를 볼 수 있었다."],
          ["같은 평가 항목을 적용해 의견을 모으고 차이가 난 항목을 살핀다.", 13, "비교 기준과 개선 방향을 함께 정했다."],
          ["전체 점수의 평균만 비교한다.", 3, "큰 차이 외에 식감과 향의 구체적인 이유를 볼 수 있었다."],
        ]),
        question("새 시제품 설명과 실제 원재료 목록이 다릅니다.", [
          ["전달을 멈추고 최신 원재료와 안내 자료를 확인한다.", 13, "틀린 제품 설명이 더 퍼지는 것을 줄였다."],
          ["시식이 끝난 뒤 설명을 고친다.", -10, "시식 전에 참가자가 알아야 할 정보가 있다."],
          ["설명지에 확인 중이라는 표시만 한다.", 3, "표시와 함께 실제 자료를 확인해 바로잡을 수 있었다."],
        ]),
      ],
    },
    {
      id: "environment", title: "환경·안전 운영", company: "산업시설 운영사", sector: "science", kind: "permanent", location: "충남", deadline: 20,
      icon: "leaf", color: "teal", skill: "industry", recommended: ["process", "brief"],
      description: "현장의 환경·안전 점검 기록을 관리하고 개선 조치의 완료 여부를 추적한다.",
      materials: "점검 우선순위, 개선 담당자와 완료 기준이 들어간 표.",
      ending: "첫 현장 순회에서 발견한 표지 하나를 사진과 함께 기록했다. 넘겨줄 담당자와 확인할 날짜도 적었다.",
      questions: [
        question("지나가던 사람이 작업 구역 표지가 잘 보이지 않는다고 합니다.", [
          ["위치와 동선을 확인하고 개선 필요를 담당자에게 기록으로 넘긴다.", 13, "같은 문제에 반복해서 노출되지 않도록 조치 경로를 만들었다."],
          ["표지가 이미 있다고 답하고 지나간다.", -10, "실제 동선에서 보이는지 확인할 수 있었다."],
          ["직원들에게 조심하라고만 전달한다.", 3, "임시 안내 외에 방문자도 볼 수 있는 개선이 필요했다."],
        ]),
        question("점검표에는 개선 완료로 적혔는데 현장 확인 기록이 없습니다.", [
          ["담당자와 완료 기준을 맞추고 현장 확인 내용을 남긴다.", 13, "완료 여부를 확인할 근거를 만들었다."],
          ["표에 적힌 상태를 그대로 믿고 종료한다.", -10, "완료를 증명할 확인이 빠져 있다."],
          ["‘재확인’이라고 상태만 바꾼다.", 3, "상태 표시와 함께 누구에게 확인받을지 정할 수 있었다."],
        ]),
      ],
    },
    {
      id: "scm", title: "물류 SCM 운영", company: "온라인 주문 물류사", sector: "logistics", kind: "permanent", location: "인천", deadline: 19,
      icon: "case", color: "gold", skill: "ops", recommended: ["inventory", "spreadsheet"],
      description: "입고·재고·출고 일정을 맞추고 배송 지연과 재고 차이를 관리한다.",
      materials: "주문 수요와 가용 재고를 대조한 표, 지연 대응 계획.",
      ending: "첫 출근 날 배송 예정표를 받았다. 이미 약속한 주문부터 셌더니 화면에는 재고가 남아 보여도 여유 물량은 적었다.",
      questions: [
        question("시스템에는 재고가 있는데 출고할 실물이 부족합니다.", [
          ["운송사에 출고 완료로 먼저 알린다.", -10, "실제 처리 상태와 안내가 어긋났다."],
          ["예약분과 실재고를 확인하고 영향 고객에게 수정 일정을 안내한다.", 13, "차이와 약속한 일정에 동시에 대응했다."],
          ["발주 수량을 내일 조금 늘린다.", 3, "다음 물량에는 도움이 되지만 오늘 영향을 받은 주문이 남았다."],
        ]),
        question("행사로 주문이 몰릴 가능성이 있습니다.", [
          ["지난 행사 수요, 가용 재고와 창고 처리량을 넣어 계획을 세운다.", 13, "수요와 운영 제약을 같이 봤다."],
          ["예상 주문을 최대한 크게 잡고 한 번에 넣는다.", -10, "처리량과 과잉 재고 위험을 고려해야 했다."],
          ["지난주 주문량만 그대로 복사한다.", 3, "기준점은 있지만 행사에 따른 변화를 반영할 수 있었다."],
        ]),
      ],
    },
    {
      id: "trade", title: "수출입·무역 사무", company: "생활용품 수출사", sector: "logistics", kind: "contract", location: "부산", deadline: 20,
      icon: "folder", color: "blue", skill: "ops", recommended: ["inventory", "brief"],
      description: "파트너의 발주 내용을 확인하고 선적 일정과 거래 문서를 맞춘다.",
      materials: "발주·선적 일정표와 누락 정보를 확인하는 이메일 예시.",
      ending: "첫 해외 발주를 받았다. 제품 이름과 수량을 다시 읽고, 수정이 필요한 칸을 담당자에게 물었다.",
      questions: [
        question("발주서의 수량과 배송 요청 문서가 다릅니다.", [
          ["최근 확정된 발주부터 확인하고 파트너에게 변경 내용을 묻는다.", 13, "출고 전에 합의된 수량을 확인했다."],
          ["배송 문서가 나중에 왔으니 그 숫자를 바로 쓴다.", 3, "어떤 변경이 확정되었는지 확인할 필요가 있다."],
          ["두 수량 중 큰 쪽으로 먼저 보낸다.", -10, "거래처와 합의하지 않은 물량을 출고했다."],
        ]),
        question("선적일이 미뤄졌습니다. 어떻게 연락할까요?", [
          ["변동된 일정, 영향을 받는 주문과 다음 확인 시각을 알린다.", 13, "파트너가 납기 정보를 갱신할 수 있게 했다."],
          ["일정이 다시 잡힐 때까지 침묵한다.", -10, "상대가 기존 일정으로 준비해 생기는 문제가 커질 수 있다."],
          ["개인적으로 사과만 전한다.", 3, "사과와 함께 어떤 주문이 영향받는지 알려줄 수 있었다."],
        ]),
      ],
    },
  ];

  const api = { sectors, employment, skills, actionGroups, coreActions, practiceActions, lifeActions, originalPostings, jobs };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JobCatalog = api;
})(globalThis);
