(function (root) {
  "use strict";

  const relations = { family: "부모님", sibling: "동생", friend: "친구" };
  const hobbies = { anime: "애니", gaming: "게임", kpop: "K팝" };
  const lotto = { cost: 1, small: 2, larger: 5, winChance: 15, largerChance: 3 };
  const money = { deposit: 10, term: 5, interest: 1, purchase: 10 };

  const workplaces = {
    cafe: {
      title: "집 앞 카페", pay: 13, transit: 0, energy: 0, bonus: 3,
      body: "걸어서 갈 수 있는 카페다. 주말이라 평소보다 주문이 몰려 있다. 사장이 단체 주문표를 들고 어디부터 할지 살핀다.",
      decisions: [
        { title: "사장과 주문을 나눠 맡아 밀린 일을 끝낸다", work: true, extra: true, entry: "단체 주문을 같이 마쳤다. 사장이 오늘 고마웠다며 추가로 정산했다." },
        { title: "맡은 근무를 마치고 시간에 맞춰 퇴근한다", work: true, entry: "마감 전에 맡은 주문과 정리를 끝냈다." },
        { title: "부담스러운 마음에 연락 없이 근무를 건너뛴다", work: false, entry: "사장에게서 출근 약속을 지키지 않았다는 연락이 왔다." },
      ],
    },
    warehouse: {
      title: "외곽 물류센터", pay: 26, transit: 5, energy: 23, bonus: 5,
      body: "환승해서 가는 외곽 물류센터다. 오늘은 출고 목록에서 수량이 맞지 않는 주문이 나왔다. 현장 담당자는 운영팀에 알려줄 사람이 필요하다.",
      decisions: [
        { title: "차이 난 주문을 확인하고 운영팀에 기록을 넘긴다", work: true, extra: true, entry: "수량 차이를 정리해 운영팀에 넘겼다. 담당자가 까다로운 일을 도와줘서 고맙다고 했다." },
        { title: "맡은 구역의 분류와 인수인계를 마친다", work: true, entry: "마지막 상자의 위치를 확인해 다음 조에 알려줬다." },
        { title: "부담스러운 마음에 연락 없이 근무를 건너뛴다", work: false, entry: "현장 담당자에게서 갑자기 빈자리가 생겨 곤란했다는 연락이 왔다." },
      ],
    },
  };

  function sibling(profile) {
    return profile.gender === "female"
      ? { title: "여동생", detail: (profile.age - 2) + "세 여동생" }
      : { title: "남동생", detail: "남동생" };
  }

  function names(state) {
    return { player: state.profile.nickname || "우리 큰애", sibling: sibling(state.profile).title };
  }

  const events = [
    {
      day: 2, title: "저녁 식탁에서",
      body: (state) => {
        const { player, sibling } = names(state);
        const openings = {
          25: "부모님이 처음 모아둔 공고를 같이 볼까 묻는다.",
          26: "어머니가 예전 포트폴리오를 다시 꺼내봤냐고 묻는다.",
          27: "아버지가 지난번 지원 때랑 마음이 달라진 게 있냐고 묻는다.",
        };
        return sibling + "은 입사한 회사에서 첫 사내 발표를 맡았다며 부쩍 들떠 있다. “" + player +
          ", 이번에 어디가 제일 끌려?” " + openings[state.profile.age];
      },
      choices: [
        { title: "어떤 일을 해보고 싶은지 말한다", effects: { interview: 5, morale: 4 }, trust: { family: 6 }, entry: "부모님이 끼어들지 않고 끝까지 들었다. 나도 하고 싶은 일을 조금 더 구체적으로 말하게 됐다." },
        { title: "설거지를 돕고 저녁은 쉬어간다", effects: { energy: 10, morale: 5 }, trust: { family: 3 }, entry: "같이 설거지를 끝내고 거실에서 잠깐 쉬었다." },
      ],
    },
    {
      day: 3, title: "뉴스를 보던 부모님",
      body: (state) => {
        const { player, sibling } = names(state);
        const compared = state.stats.resume < 45 && state.submitted === 0;
        return "TV에서 부모와 함께 사는 청년을 ‘캥거루족’이라고 부르는 보도가 나온다. 아버지가 볼륨을 줄인다. " +
          (compared ? "“" + player + ", 너도 이제 독립 생각은 해야지. " + sibling + "은 출근한 지 얼마나 됐다고 팀 회의까지 하던데.”" :
            "“" + player + ", 너도 저런 뉴스 보면 신경 쓰이지? " + sibling + "이 먼저 취업했으니까 더 그럴까 싶어서.”");
      },
      choices: [
        { title: "동생과 비교하는 말은 힘들다고 말한다", effects: { morale: 5 }, trust: { family: 8, sibling: 3 }, entry: "아버지가 자기는 걱정돼서 그런 말을 했다고 했다. 비교하는 말은 줄여보기로 했다." },
        { title: "이번 주 지원 계획을 보여준다", effects: { interview: 4, energy: -5 }, trust: { family: 5 }, entry: "달력에 표시한 마감일을 같이 봤다. 아직 결과가 없어도 무슨 일을 하고 있는지는 전했다." },
        { title: "말을 아끼고 방으로 들어간다", effects: { energy: 8, morale: -7 }, trust: { family: -7 }, entry: "표정이 굳기 전에 방으로 들어왔다. TV 소리가 문 너머로 조금 들린다." },
      ],
    },
    {
      day: 4, title: "내 유튜브를 열까?",
      when: (state) => !state.channel,
      body: "스터디에 낼 1분 자기소개 영상을 찍어봤다. 파일 이름을 바꿔 저장하다가, 취준하고 좋아하는 걸 기록하는 내 유튜브 채널도 만들 수 있겠다는 생각이 든다.",
      choices: [
        { title: "내 유튜브 채널을 연다", effects: { energy: -8, morale: 5 }, channel: true, entry: "채널을 열었다. 오늘의 행동에서 첫 영상을 올릴 수 있다." },
        { title: "지금은 영상 파일만 남겨둔다", effects: { energy: 5 }, entry: "일단 필요한 영상부터 모아두기로 했다. 채널은 생활 메뉴에서 나중에도 열 수 있다." },
      ],
    },
    {
      day: 5, title: "몸이 으슬으슬",
      body: (state) => state.stats.energy <= 42
        ? "아침에 알람이 울렸는데 온몸이 무겁고 목도 아프다. 노트북을 열다가 잠깐 덮는다. 오늘은 일정 두 개를 다 소화하기 어려울 것 같다."
        : "어제부터 으슬으슬하더니 아침에 목이 따끔하고 몸이 무겁다. 오늘은 약속과 제출할 파일이 겹쳐 있다.",
      choices: [
        { title: "일정을 미루고 쉬면서 진료를 알아본다", effects: { energy: 18, morale: 6 }, slots: 1, trust: { family: 3 }, entry: "미룰 수 있는 일정부터 연락했다. 당장 할 일을 한 가지 줄이니 마음이 덜 급해졌다." },
        { title: "급한 파일만 보내고 집에서 쉰다", effects: { energy: 7, resume: 5 }, entry: "짧게 마무리할 일 하나만 끝냈다. 남은 건 파일에 메모로 적어뒀다." },
        { title: "정해둔 일정을 그대로 간다", effects: { energy: -12, morale: -8, resume: 7 }, entry: "준비는 조금 앞당겼다. 돌아와서는 저녁도 차리기 버거웠다." },
      ],
    },
    {
      day: 6, title: "아끼던 반찬을 꺼낸 날",
      body: (state) => "“" + names(state).player + ", 밥 먹고 해. 네가 좋아하는 반찬 남겨놨어.” 식탁 아래쪽에 내 밥그릇이 미리 나와 있다. 어제 늦게 돌아온 동생 몫도 옆에 있다.",
      choices: [
        { title: "부모님과 앉아서 천천히 먹는다", effects: { energy: 17, morale: 12 }, trust: { family: 9 }, entry: "먹고 살 얘기 대신 어릴 때 갔던 바닷가 얘기를 했다. 밥이 식기 전에 다 먹었다." },
        { title: "고맙다고 하고 내 방으로 가져간다", effects: { energy: 13, morale: 6 }, trust: { family: 3 }, entry: "문을 조금 열어두고 혼자 편하게 먹었다." },
      ],
    },
    {
      day: 7, title: "복권집 앞에서",
      body: "편의점에 들렀다가 복권 가게를 지나친다. 만 원어치만 사볼까? 오늘 쓸 돈에서 빠지고, 추첨 결과는 바로 확인할 수 있다.",
      choices: [
        { title: "로또 1만원어치를 산다", effects: { balance: -lotto.cost }, lottery: true, entry: "게임 속 생활비에서 1만원을 썼다." },
        { title: "복권 가게를 지나간다", effects: {}, entry: "지갑을 닫고 집에 돌아왔다." },
      ],
    },
    {
      day: 8, title: "친구가 합격했다",
      body: "스터디 친구가 채팅방에 합격 화면을 올렸다. 진짜 축하해주고 싶은데, 나도 모르게 내 메일함을 한번 눌러본다.",
      choices: [
        { title: "축하하고 면접 후기를 묻는다", effects: { interview: 9, morale: -4 }, trust: { friend: 7 }, entry: "친구가 가장 많이 받은 꼬리 질문을 보내줬다. 저녁에는 내 지원서도 봐주겠다고 한다." },
        { title: "짧게 축하하고 폰을 잠시 내려둔다", effects: { morale: 10, energy: 6 }, trust: { friend: 2 }, entry: "축하한다고 보내고 그날은 채팅창을 오래 들여다보지 않았다." },
        { title: "오늘은 답장을 미룬다", effects: { energy: 3 }, trust: { friend: -7 }, entry: "어떤 말로 시작할지 고민하다 메시지를 읽은 채로 뒀다." },
      ],
    },
    {
      day: 9, title: "동창회 단체 채팅방",
      body: "이번 주말에 동창회가 열린다는 연락이 왔다. 어디 다니냐는 질문이 제일 먼저 나올 것 같다. 보고 싶던 친구 이름도 참석 목록에 있다.",
      choices: [
        { title: "참석하고, 취업 준비 중이라고 편하게 말한다", effects: { balance: -4, energy: -9, interview: 7 }, trust: { friend: 11 }, entry: "한 친구는 한동안 이직 준비 중이었다고 했다. 직장 얘기만 하다 올 줄 알았는데, 두 시간 웃고 왔다." },
        { title: "모임은 건너뛰고 보고 싶던 친구에게 연락한다", effects: { morale: 5, energy: 5 }, trust: { friend: 5 }, entry: "다음에 둘이 커피 하자고 메시지를 보냈다." },
        { title: "이번 모임에는 불참한다", effects: { energy: 9 }, trust: { friend: -3 }, entry: "이번엔 어렵다고 답하고 일정을 비워뒀다." },
      ],
    },
    {
      day: 10, title: "마음이 무거운 아침",
      body: (state) => state.stats.morale < 55
        ? "며칠째 잠도 설쳤고, 좋아하던 영상도 한 편을 끝까지 못 본다. 마음이 가라앉는 걸 알아챈 부모님이 무슨 일 있냐고 묻는다."
        : "지원서를 앞에 두고 한동안 손이 멈춘다. 요즘 걱정 때문에 잠들기 어렵고, 간단한 일도 전보다 버겁게 느껴진다.",
      choices: [
        { title: "우울감과 불안을 이야기하고 상담을 알아본다", effects: { morale: 7, energy: 6 }, slots: 1, counseling: true, trust: { family: 5 }, entry: "어떤 때 가장 버거운지 적어 상담 일정을 알아봤다. 오늘 잡아둔 계획 하나는 옮겨뒀다." },
        { title: "믿을 만한 친구에게 요즘 상태를 얘기한다", effects: { morale: 10 }, trust: { friend: 9 }, entry: "친구가 답을 주려고 하기보다 무슨 일이 있었는지 먼저 물어봐줬다." },
        { title: "오늘 할 일만 줄이고 조용히 쉬어간다", effects: { energy: 13, morale: 4 }, entry: "마감이 남은 일은 내일로 옮겼다. 오늘 하루 버거웠다는 것도 일지에 적었다." },
      ],
    },
    {
      day: 11, title: "뜸해진 연락",
      body: (state) => state.relationships.friend < 58
        ? "친구와 마지막으로 제대로 얘기한 지 오래됐다. 상대도 읽고 답이 느려졌다. 합격 소식에 답하기 어려웠던 날이 자꾸 생각난다."
        : "취업한 친구와 얘기할 시간이 자꾸 엇갈린다. 달력에 둘이 만나는 약속이 한 번 밀렸고, 이번 주도 답장이 늦다.",
      choices: [
        { title: "서운했지만 보고 싶었다고 솔직하게 말한다", effects: { morale: 6 }, trust: { friend: 12 }, entry: "친구도 출근하고 나니 하루가 빨리 끝난다고 했다. 다음 약속은 시간을 짧게 잡았다." },
        { title: "요즘은 서로 바쁜 시기라 생각하고 기다린다", effects: { energy: 8 }, trust: { friend: -3 }, entry: "다음에 얘기할 여유가 생기면 먼저 연락하기로 했다." },
        { title: "단체 채팅방 알림을 끄고 소식을 잠시 쉬어간다", effects: { morale: 8 }, trust: { friend: -9 }, entry: "알림을 끄니 마음은 편해졌지만, 한동안 소식을 잘 모르게 됐다." },
      ],
    },
    {
      day: 12, title: "알바 대타 제안",
      body: "매니저가 오늘 급하게 빈 근무를 맡아줄 수 있냐고 묻는다. 저녁 한 타임이면 생활비엔 도움이 될 것 같다.",
      choices: [
        { title: "대타를 맡는다", effects: { balance: 18, energy: -14 }, entry: "빈 시간에 근무하고 생활비를 보탰다." },
        { title: "예정대로 면접을 연습한다", effects: { interview: 7, energy: -5 }, entry: "지원 동기를 말한 뒤 이어질 질문 세 가지를 적었다." },
        { title: "오늘은 저녁 시간을 비워둔다", effects: { energy: 8 }, entry: "이번엔 어렵다고 답하고 밀린 집안일을 조금 했다." },
      ],
    },
    {
      day: 13, title: "기분 좋은 날의 용돈",
      body: (state) => {
        const { player, sibling } = names(state);
        return state.relationships.family >= 63
          ? "부모님 일이 잘 풀렸다고 하더니 " + sibling + "하고 저녁을 사왔다. “" + player + ", 밥값에 보태.” 부모님이 봉투를 식탁 위로 밀어준다."
          : "부모님이 반가운 소식을 들었다며 저녁에 들어오면서 웃는다. “" + player + ", 오늘은 내 기분이 좋아서 준다. 필요할 때 써.”";
      },
      choices: [
        { title: "고맙다고 하고 용돈 10만원을 받는다", effects: { balance: 10, morale: 6 }, trust: { family: 5 }, entry: "받은 돈을 생활비에 더했다. 저녁 먹고 물을 따라드렸다." },
        { title: "받고 다음 장보기는 같이 가자고 말한다", effects: { balance: 10, energy: -4, morale: 8 }, trust: { family: 9 }, entry: "부모님과 장바구니를 나눠 들고 장을 봤다. 집에 올 때는 간식도 하나 챙겼다." },
        { title: "고맙다고 하고 오늘은 마음만 받는다", effects: { morale: 9 }, trust: { family: 6 }, entry: "대신 다 같이 차를 끓여 마셨다." },
      ],
    },
    {
      day: 14, title: "친구의 결혼식",
      body: "오래 알고 지낸 친구의 결혼식 날이다. 축하해주러 가고 싶지만 축의금과 사람들 질문도 걸린다. 친구는 네 편한 대로 하라고 메시지를 보내왔다.",
      choices: [
        { title: "예식에 가서 직접 축하한다", effects: { balance: -7, energy: -11, morale: 7 }, trust: { friend: 14 }, entry: "사진 찍기 직전에 친구를 만나 축하한다고 했다. 친구는 와준 걸 오래 기억하겠다고 했다." },
        { title: "축하 영상과 메시지를 보낸다", effects: { energy: -3, morale: 4 }, trust: { friend: 7 }, entry: "예전 같이 찍은 사진 한 장을 찾아 30초짜리 축하 영상에 넣었다." },
        { title: "축하 인사를 보내고 집에서 쉰다", effects: { energy: 9 }, trust: { friend: 3 }, entry: "예식이 시작하기 전에 짧게 메시지를 보냈다." },
      ],
    },
    {
      day: 15, title: "취준 밖에도 좋아하는 게 있다",
      body: "추천 영상 하나를 따라 들어갔더니 시간 가는 줄 몰랐다. 친구가 요즘은 취미에도 일정 잡아서 몰입해야 마음 편하다고 한다. 오늘 저녁엔 뭘 보고 싶을까?",
      choices: [
        { title: "애니 한 편 보고 리뷰를 남긴다", effects: { morale: 13, energy: 5 }, hobby: "anime", entry: "기억에 남은 장면을 캡처 대신 내 말로 적어뒀다. 다음 화가 궁금해졌다." },
        { title: "게임 한 판만 해보고 공략을 읽는다", effects: { morale: 16, energy: -5 }, hobby: "gaming", entry: "내일도 해보고 싶은 미션을 하나 남겨뒀다." },
        { title: "K팝 무대와 팬 편집 영상에 빠진다", effects: { morale: 15, energy: -3 }, hobby: "kpop", entry: "처음 본 무대를 다시 돌려보고 좋아하는 곡을 플레이리스트에 넣었다." },
        { title: "오늘은 화면을 덮고 쉰다", effects: { energy: 13, morale: 5 }, entry: "아무 계획도 더 만들지 않고 저녁을 쉬었다." },
      ],
    },
    {
      day: 16, title: "동생이 내 방 문을 두드렸다",
      body: (state) => {
        const { player, sibling } = names(state);
        return state.relationships.family >= 65
          ? sibling + "이 회사에서 받은 좋은 평가를 말하다 목소리를 낮춘다. “" + player + ", 내 얘기만 해서 미안. 요즘 네가 준비하는 것도 궁금했어.”"
          : sibling + "은 새 프로젝트에 뽑혔다. 부모님이 한참 칭찬한 뒤 조용해진 거실을 지나, 동생이 내 방 앞에 선다. “잠깐 얘기해도 돼?”";
      },
      choices: [
        { title: "모의 면접을 봐달라고 부탁한다", effects: { interview: 10, morale: 6, energy: -5 }, trust: { sibling: 12 }, entry: "동생이 내 첫 문장에서 질문하고 싶은 게 생긴다고 했다. 어디서부터 설명할지 다시 정리했다." },
        { title: "비교되는 게 힘들었다고 동생에게 털어놓는다", effects: { morale: 11 }, trust: { sibling: 10, family: 4 }, entry: "동생도 자기 얘기가 평가의 기준이 될 줄은 몰랐다고 했다. 그날 둘이 라면을 끓였다." },
        { title: "오늘은 얘기할 힘이 없다고 말한다", effects: { energy: 11 }, trust: { sibling: -4 }, entry: "동생이 문 아래로 같이 먹자던 과자를 두고 갔다." },
      ],
    },
    {
      day: 17, title: "마감 전 마지막 피드백",
      body: (state) => state.stats.resume >= 65
        ? "스터디원이 지원서 첫 문장을 읽더니, 해낸 일은 알겠는데 왜 그 일을 골랐는지가 더 궁금하다고 한다."
        : "스터디원이 서로의 지원서 첫 문장을 바꿔 읽자고 한다. 마감 전에 한 문장은 고칠 수 있을 것 같다.",
      choices: [
        { title: "첫 문장을 다시 쓴다", effects: { resume: 8, morale: 3 }, entry: "하고 싶은 일과 해본 일을 한 문장에 연결했다." },
        { title: "면접 답변을 같이 점검한다", effects: { interview: 9, morale: 3 }, entry: "막연했던 강점 하나를 경험으로 설명할 수 있게 됐다." },
      ],
    },
    {
      day: 18, title: "앞으로도 챙기고 싶은 마음",
      when: (state) => state.counseling || state.stats.morale < 45,
      body: (state) => state.counseling
        ? "상담을 알아본 뒤 진료를 받았다. 의사는 면담 끝에 우울증 진단을 설명하고 다음 진료를 잡아줬다. 지원서 마감과 진료 일정을 같은 달력에 적어둘까?"
        : "며칠째 마음이 무겁다. 일지에 컨디션이 안 좋았던 날과 조금 편했던 날을 각각 적어보니, 혼자 참고 넘기기엔 오래 신경 쓰였던 일 같다.",
      choices: [
        { title: "마음 돌볼 일정을 계획에 넣는다", effects: { morale: 10, energy: 6 }, counseling: true, entry: "지원 마감과 내 컨디션을 챙길 시간을 달력에 같이 적었다." },
        { title: "가족에게 이번 주에는 부담을 덜고 싶다고 말한다", effects: { morale: 7 }, trust: { family: 7 }, entry: "이번 주에 도와줬으면 하는 일 하나를 구체적으로 말해봤다." },
      ],
    },
    {
      day: 19, title: "친구와 마주 앉았다",
      when: (state) => state.relationships.friend >= 72 || state.relationships.friend <= 50,
      body: (state) => state.relationships.friend >= 72
        ? "예전에 먼저 연락했던 친구가 집 앞에 왔다. 일 얘기 하나 취미 얘기 하나씩 번갈아 하자는 엉뚱한 약속을 잡았다."
        : "지나가다 친구가 좋아하던 가게 앞을 지났다. 거리가 생긴 게 마음에 걸린다. 지금이라도 가벼운 안부를 물어볼까?",
      choices: [
        { title: "먼저 말을 건네고 이야기를 들어준다", effects: { morale: 12, interview: 4 }, trust: { friend: 10 }, entry: "같이 이야기하다가 취업 소식 밖에도 나눌 얘기가 많았다는 걸 떠올렸다." },
        { title: "오늘은 가볍게 인사하고 다음을 기약한다", effects: { energy: 6 }, trust: { friend: 3 }, entry: "부담 없는 인사만 건네고 집으로 돌아왔다." },
      ],
    },
    {
      day: 20, title: "취준 말고도 남은 것",
      when: (state) => state.hobby || state.channel?.videos,
      body: (state) => state.hobby
        ? hobbies[state.hobby] + " 때문에 새로 알게 된 사람들과 지난 3주 동안 즐거웠던 장면을 나누기로 했다. 지원 일지 옆에 적어둔 메모가 제법 많다."
        : "유튜브에 올린 영상들을 다시 봤다. 첫 영상보다 마지막 영상이 편해 보인다. 이 경험을 지원서에 어떻게 보여주면 좋을까?",
      choices: [
        { title: "좋아하는 걸 소개하는 짧은 글을 남긴다", effects: { resume: 8, morale: 8 }, entry: "내가 좋아하는 걸 남도 이해할 수 있게 설명하는 연습이 됐다." },
        { title: "오늘은 즐긴 것만으로 충분하다고 생각한다", effects: { energy: 10, morale: 12 }, entry: "기록을 닫고 기분 좋게 하루를 마쳤다." },
      ],
    },
  ];

  function getEvent(state, day = state.encounter) {
    const event = events.find((item) => item.day === day);
    if (!event || (event.when && !event.when(state))) return null;
    return { ...event, body: typeof event.body === "function" ? event.body(state) : event.body };
  }

  function getFamilyMoment(state) {
    const { player, sibling: younger } = names(state);
    if (state.familyMoment === "first-shift") {
      return {
        title: "첫 알바를 마친 저녁",
        body: "“" + player + ", 오늘 일하고 왔다며. 어땠어?” 부모님이 따뜻한 국을 내준다. " +
          younger + "도 자기는 첫 근무 날에 출근길을 두 번이나 놓쳤다며 웃는다.",
        choices: [
          { title: "밥 먹으면서 오늘 있었던 일을 이야기한다", effects: { energy: 9, morale: 9 }, trust: { family: 8 }, entry: "일당보다 처음 일을 끝내고 돌아온 게 기뻤다고 말했다. 부모님은 잘 다녀왔다며 한 번 더 밥을 담아줬다." },
          { title: "동생과 간식을 나눠 먹는다", effects: { morale: 10 }, trust: { sibling: 10 }, entry: "둘이 부엌에 서서 각자 첫날에 했던 실수를 얘기했다." },
          { title: "축하해줘서 고맙다고 하고 잠깐 쉰다", effects: { energy: 13, morale: 4 }, trust: { family: 3 }, entry: "방에 들어가기 전에 식탁에 있던 물병을 채워놓았다." },
        ],
      };
    }
    if (state.familyMoment === "offer") {
      const reaction = state.relationships.family >= 65
        ? "부모님이 합격 메일을 몇 번이나 읽고, 바로 저녁 메뉴를 묻는다."
        : "합격 소식을 들은 부모님이 잠깐 말을 잇지 못한다. 그러다 “" + player + ", 그동안 마음 많이 쓰였겠다” 하고 등을 두드린다.";
      return {
        title: "가족에게 전한 합격 소식",
        body: reaction + " " + younger + "이 가장 먼저 축하 이모티콘을 보내고 언제 같이 밥 먹을지 묻는다.",
        choices: [
          { title: "다 같이 저녁을 먹고 지난 이야기를 나눈다", effects: { energy: 10, morale: 14 }, trust: { family: 12, sibling: 6 }, entry: "밥을 먹으며 처음 넣었던 지원서 얘기부터 했다. 다들 한동안 듣고만 있었다." },
          { title: "동생에게 제일 먼저 고맙다고 말한다", effects: { morale: 12 }, trust: { sibling: 15 }, entry: "동생에게 바로 전화했다. 둘 다 회사에서 있었던 얘기를 서로 할 날이 온 게 조금 신기했다." },
          { title: "먼저 혼자 소식을 실감하고, 저녁에 가족에게 간다", effects: { energy: 13, morale: 8 }, trust: { family: 6 }, entry: "잠깐 조용히 있다가 거실로 나갔다. 가족은 내가 오기까지 상을 차려두고 있었다." },
        ],
      };
    }
    return null;
  }

  const api = { relations, hobbies, lotto, money, workplaces, sibling, events, getEvent, getFamilyMoment };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JobStory = api;
})(globalThis);
