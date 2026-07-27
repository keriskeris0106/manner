/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 퀘스트 시나리오, 배지, 칭호, 어절 블록 데이터셋 (data.js)
   ========================================================================== */

// 1. 배지 및 칭호 시스템 정의
export const BADGES = {
    // 특수 어휘 배지
    'JINJI': { id: 'JINJI', name: '진지 배지', icon: '🍚', desc: '밥 ➔ 진지를 올바르게 사용함' },
    'YEONSE': { id: 'YEONSE', name: '연세 배지', icon: '🎂', desc: '나이 ➔ 연세를 올바르게 사용함' },
    'SEONGHAM': { id: 'SEONGHAM', name: '성함 배지', icon: '📛', desc: '이름 ➔ 성함을 올바르게 사용함' },
    'JUMUSIDA': { id: 'JUMUSIDA', name: '주무시다 배지', icon: '🌙', desc: '자다 ➔ 주무시다를 올바르게 사용함' },
    'JIP_DAEK': { id: 'JIP_DAEK', name: '댁 배지', icon: '🏡', desc: '집 ➔ 댁을 올바르게 사용함' },

    // 월드 마스터 배지 (5개)
    'MASTER_1': { id: 'MASTER_1', name: '마을 마스터 배지', icon: '🛒', desc: '월드 1 90점 이상 달성' },
    'MASTER_2': { id: 'MASTER_2', name: '동화 마스터 배지', icon: '🏰', desc: '월드 2 90점 이상 달성' },
    'MASTER_3': { id: 'MASTER_3', name: '병원 마스터 배지', icon: '🏥', desc: '월드 3 90점 이상 달성' },
    'MASTER_4': { id: 'MASTER_4', name: '학교 마스터 배지', icon: '🏫', desc: '월드 4 90점 이상 달성' },
    'MASTER_5': { id: 'MASTER_5', name: '조선 마스터 배지', icon: '👑', desc: '월드 5 90점 이상 달성' }
};

export const TITLES = [
    { minBadges: 0, title: '🌱 새싹 탐험대' },
    { minBadges: 2, title: '🗡️ 바른말 수호기사' },
    { minBadges: 4, title: '🛡️ 예의범절 마스터' },
    { minBadges: 7, title: '👑 존댓말 수호대장' },
    { minBadges: 10, title: '🌌 차원 대마법사' }
];

// 2. 5개 월드 퀘스트 데이터 (각 5턴 대화)
export const WORLDS_DATA = {
    1: {
        id: 1,
        name: '시끌벅적 우리 마을',
        badgeId: 'MASTER_1',
        locations: ['마트', '병원', '식당', '약국'],
        turns: [
            {
                npcName: '마트 계산원 할머니',
                npcAvatar: '👵',
                npcDialog: '어머, 꼬마야! 사과 한 상자 사려고 하니? 할머니 일손이 부족한데 좀 도와주겠니?',
                options: [
                    { text: '네! 제가 기꺼이 도와드릴게요!', isCorrect: true, feedback: '해요체를 바르게 사용했어요 (+20점)', errType: null },
                    { text: '너 혼자 해라 나 바쁘다.', isCorrect: false, feedback: '어른에게 반말을 사용했습니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '네! 도울 테니까 사과 공짜로 줘요.', isCorrect: false, feedback: '예의에 맞지 않는 부탁입니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '마트 직원',
                npcAvatar: '🧑‍🌾',
                npcDialog: '손님, 어떤 사과를 찾으시나요?',
                options: [
                    { text: '할머니 사과 사 오라고 하셨어요.', isCorrect: false, feedback: '주체 높임(-께서)이 누락되었습니다. (-10점)', errType: 'SUBJECT_OBJECT' },
                    { text: '할머니께서 맛있는 사과를 사 오라고 하셨습니다.', isCorrect: true, feedback: '격식체(합쇼체)와 -께서 높임을 완벽히 썼습니다! (+20점)', errType: null, rewardBadge: 'JIP_DAEK' },
                    { text: '할머니 사과 사 오라는데 어딨어?', isCorrect: false, feedback: '반말과 격식 부족입니다. (-20점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '식당 이모',
                npcAvatar: '👩‍🍳',
                npcDialog: '점심 식사하러 오셨군요! 밥은 따뜻한 걸로 드릴까요?',
                options: [
                    { text: '네! 할머니께서 진지 드시는 걸 좋아하세요.', isCorrect: true, feedback: '특수어휘 "진지"를 바르게 썼어요! (+20점)', errType: null, rewardBadge: 'JINJI' },
                    { text: '네! 할머니 밥 많이 줘요.', isCorrect: false, feedback: '어른의 "밥"을 높여 부르지 않았습니다. (-10점)', errType: 'SPECIAL_WORD' },
                    { text: '어. 아무거나 가져와.', isCorrect: false, feedback: '반말입니다. (-20점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '약국 약사님',
                npcAvatar: '👨‍⚕️',
                npcDialog: '할머니 연세가 어떻게 되시죠? 피로회복제를 챙겨드리려고요.',
                options: [
                    { text: '할머니 나이는 70살이에요.', isCorrect: false, feedback: '어른의 나이는 "연세"라고 높여야 합니다. (-10점)', errType: 'SPECIAL_WORD' },
                    { text: '할머니께서는 올해 연세가 일흔이십니다.', isCorrect: true, feedback: '특수 어휘 "연세"와 높임표현 완벽! (+20점)', errType: null, rewardBadge: 'YEONSE' },
                    { text: '몰라요. 늙으셨어요.', isCorrect: false, feedback: '무례한 표현입니다. (-20점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '마트 계산원 할머니',
                npcAvatar: '👵',
                npcDialog: '고맙다 꼬마 탐험가야! 덕분에 무사히 장을 마쳤구나!',
                options: [
                    { text: '할머니, 안녕히 계세요!', isCorrect: true, feedback: '작별 인사를 올바르게 표현했습니다. (+20점)', errType: null },
                    { text: '잘 가라 할머니!', isCorrect: false, feedback: '어른에게 "잘 가"라고 반말을 하면 안 됩니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '다음에 또 사과 사주세요!', isCorrect: false, feedback: '해요체지만 인사가 누락되었습니다. (-5점)', errType: 'SUBJECT_OBJECT' }
                ]
            }
        ]
    },
    2: {
        id: 2,
        name: '신비한 동화 월드',
        badgeId: 'MASTER_2',
        locations: ['용궁', '흥부네', '과자집'],
        turns: [
            {
                npcName: '용왕님',
                npcAvatar: '🐉',
                npcDialog: '콜록콜록! 내 병을 고치려면 토끼의 간이 필요하다! 내 이름이 무엇인지 아느냐?',
                options: [
                    { text: '용왕님의 성함은 해룡 왕이십니다!', isCorrect: true, feedback: '이름을 높여 "성함"으로 썼습니다! (+20점)', errType: null, rewardBadge: 'SEONGHAM' },
                    { text: '너 이름이 해룡이지?', isCorrect: false, feedback: '임금님께 반말을 하였습니다. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '용왕님 이름은 해룡입니다.', isCorrect: false, feedback: '어른의 이름은 "성함"으로 높여야 합니다. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '토끼',
                npcAvatar: '🐰',
                npcDialog: '탐험가님! 용왕님께서 침대에서 자고 계신가요?',
                options: [
                    { text: '아니요, 용왕님께서는 지금 편히 주무시고 계십니다.', isCorrect: true, feedback: '자다 ➔ 주무시다 완벽 사용! (+20점)', errType: null, rewardBadge: 'JUMUSIDA' },
                    { text: '어! 용왕 자고 있어.', isCorrect: false, feedback: '높임표현이 완전히 누락되었습니다. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '용왕님이 침대에서 자는 중입니다.', isCorrect: false, feedback: '주무시다 특수어휘 미사용입니다. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '흥부',
                npcAvatar: '👨‍🌾',
                npcDialog: '제비야 고맙다! 박 속에서 보물이 나왔구나! 탐험가님도 같이 보시겠습니까?',
                options: [
                    { text: '흥부 선생님, 정말 축하드립니다!', isCorrect: true, feedback: '합쇼체 높임법 완벽! (+20점)', errType: null },
                    { text: '야 흥부야 나도 하나 줘라.', isCorrect: false, feedback: '반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '흥부가 보물을 찾았네.', isCorrect: false, feedback: '어른을 높이지 않았습니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '놀부',
                npcAvatar: '👺',
                npcDialog: '흥부 이놈! 당장 내 집에서 나가지 못할까!',
                options: [
                    { text: '놀부님, 어르신 댁에서 예의를 지켜주세요.', isCorrect: true, feedback: '집 ➔ 댁 높임 특수어휘 바르게 사용! (+20점)', errType: null },
                    { text: '너나 너네 집으로 가라.', isCorrect: false, feedback: '싸우는 반말 사용입니다. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '놀부 집이 어디인데요?', isCorrect: false, feedback: '집 ➔ 댁 미사용. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '과자집 마녀',
                npcAvatar: '🧙‍♀️',
                npcDialog: '어느 차원에서 온 아이냐? 존댓말을 잘 쓰면 과자를 주겠다!',
                options: [
                    { text: '저는 차원 탐험대원입니다. 안녕히 계십시오!', isCorrect: true, feedback: '격식체로 퀘스트 완료! (+20점)', errType: null },
                    { text: '과자 다 내놔라 마녀야!', isCorrect: false, feedback: '무례한 반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '과자 주면 생각해 볼게요.', isCorrect: false, feedback: '조금 아쉬운 표현입니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            }
        ]
    },
    3: {
        id: 3,
        name: '삐뽀삐뽀 미래 병원',
        badgeId: 'MASTER_3',
        locations: ['진료실', '주사실', '약국'],
        turns: [
            {
                npcName: '미래 로봇 간호사',
                npcAvatar: '🤖',
                npcDialog: '탐험가님! 주사 맞으실게요! 주사약이 들어가실게요!',
                options: [
                    { text: '간호사님, "주사 맞으실게요", "약이 들어가실게요"는 사물 높임 오류입니다! "주사 맞으세요"가 맞습니다.', isCorrect: true, feedback: '사물 높임 오류를 정확히 지적 교정했습니다! (+20점)', errType: null },
                    { text: '네! 주사약님 빨리 들어오세요!', isCorrect: false, feedback: '주사약(사물)을 높이는 오류를 함께 범했습니다. (-20점)', errType: 'OBJECT_HONORIFIC' },
                    { text: '주사 아픈데 안 맞을래.', isCorrect: false, feedback: '반말입니다. (-10점)', errType: 'OBJECT_HONORIFIC' }
                ]
            },
            {
                npcName: '의사 선생님',
                npcAvatar: '👨‍⚕️',
                npcDialog: '처방전 나오셨습니다! 금액은 5000원이십니다!',
                options: [
                    { text: '선생님, 처방전과 금액은 사물이므로 "처방전 나왔습니다", "5000원입니다"라고 해야 합니다.', isCorrect: true, feedback: '사물 높임 과도 교정을 잘 집어냈습니다! (+20점)', errType: null },
                    { text: '네! 5000원님 여기 계십니다!', isCorrect: false, feedback: '돈을 높이는 심각한 사물높임 오류입니다. (-20점)', errType: 'OBJECT_HONORIFIC' },
                    { text: '돈 없어. 그냥 줘.', isCorrect: false, feedback: '반말입니다. (-10점)', errType: 'OBJECT_HONORIFIC' }
                ]
            },
            {
                npcName: '약사 로봇',
                npcAvatar: '🦾',
                npcDialog: '알약이 포장되셨습니다! 가져가실게요!',
                options: [
                    { text: '알약은 사물이므로 "포장되었습니다. 가져가세요"가 바른 표현입니다.', isCorrect: true, feedback: '사물 높임 교정 완벽! (+20점)', errType: null },
                    { text: '알약님 감사히 먹겠습니다!', isCorrect: false, feedback: '알약을 높였습니다. (-20점)', errType: 'OBJECT_HONORIFIC' },
                    { text: '알약 던져봐.', isCorrect: false, feedback: '반말입니다. (-10점)', errType: 'OBJECT_HONORIFIC' }
                ]
            },
            {
                npcName: '원장 선생님',
                npcAvatar: '👵',
                npcDialog: '치료를 잘 받았니? 몸은 좀 어떠니?',
                options: [
                    { text: '원장 선생님 덕분에 많이 좋아졌습니다!', isCorrect: true, feedback: '합쇼체 올바른 응답! (+20점)', errType: null },
                    { text: '어 나 다 나았어.', isCorrect: false, feedback: '어른에게 반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '치료비가 너무 비싸요.', isCorrect: false, feedback: '격식 부족입니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '미래 로봇 간호사',
                npcAvatar: '🤖',
                npcDialog: '사물 높임 오류를 교정해주셔서 감사합니다! 병원 포털을 열어드릴게요!',
                options: [
                    { text: '감사합니다! 안녕히 계세요!', isCorrect: true, feedback: '미래 병원 마스터 달성! (+20점)', errType: null },
                    { text: '포털 빨리 열어라.', isCorrect: false, feedback: '반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '바이바이!', isCorrect: false, feedback: '장난스러운 표현입니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            }
        ]
    },
    4: {
        id: 4,
        name: '거꾸로 초등학교',
        badgeId: 'MASTER_4',
        locations: ['교장실', '교무실', '교실'],
        turns: [
            {
                npcName: '선생님',
                npcAvatar: '👩‍🏫',
                npcDialog: '탐험가 학생! 교장선생님께 가서 "선생님이 왔습니다"라고 말씀드려 줄래?',
                options: [
                    { text: '선생님, 압존법에 따르면 교장선생님께는 "선생님께서 오셨습니다"라고 높여 말씀드려야 합니다.', isCorrect: true, feedback: '압존법과 높임 관계를 정확히 이해했습니다! (+20점)', errType: null },
                    { text: '교장한테 선생님 왔다고 반말할게요!', isCorrect: false, feedback: '압존법 오류 및 반말입니다. (-20점)', errType: 'APJON' },
                    { text: '선생님이 왔다고 할게요.', isCorrect: false, feedback: '교장선생님 앞이라도 선생님을 낮추면 안 됩니다. (-10점)', errType: 'APJON' }
                ]
            },
            {
                npcName: '교장선생님',
                npcAvatar: '👨‍🦳',
                npcDialog: '어허! 탐험가 학생! 아버지가 오셨을 때 할아버지께 "할아버지, 아버지가 왔습니다"라고 해야 할까?',
                options: [
                    { text: '할아버지 앞이라도 가정이나 학교 어른께는 "아버지께서 오셨습니다"라고 높이는 것이 바릅니다.', isCorrect: true, feedback: '현대 언어 예절 압존법 교정 성공! (+20점)', errType: null },
                    { text: '네! 할아버지가 더 높으니까 아버지는 낮춰야죠!', isCorrect: false, feedback: '잘못된 압존법 적용입니다. (-20점)', errType: 'APJON' },
                    { text: '아빠 왔다고 소리치면 돼요.', isCorrect: false, feedback: '무례한 표현입니다. (-10점)', errType: 'APJON' }
                ]
            },
            {
                npcName: '담임선생님',
                npcAvatar: '👨‍🏫',
                npcDialog: '교장선생님 말씀이 있으시겠습니다!',
                options: [
                    { text: '선생님, "말씀이 있으시겠습니다"보다 "말씀이 있으시겠습니다/말씀하시겠습니다"가 바릅니다.', isCorrect: true, feedback: '주체 높임 교정 성공! (+20점)', errType: null },
                    { text: '교장 말 안 들을래요.', isCorrect: false, feedback: '반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '교장선생님이 말한다!', isCorrect: false, feedback: '낮춤 표현입니다. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '반장 학생',
                npcAvatar: '👦',
                npcDialog: '탐험가야, 선생님께 숙제 제출할 때 뭐라고 해야 해?',
                options: [
                    { text: '"선생님, 숙제 제출하겠습니다" 또는 "드보드리겠습니다"라고 해야 해.', isCorrect: true, feedback: '객체 높임 올바른 안내! (+20점)', errType: null },
                    { text: '"선생님 여기 숙제 가져라" 해.', isCorrect: false, feedback: '반말 안내입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '그냥 책상에 던져.', isCorrect: false, feedback: '무례함. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            },
            {
                npcName: '교장선생님',
                npcAvatar: '👨‍🦳',
                npcDialog: '거꾸로 초등학교의 높임법 규칙을 바르게 지켜주어 고맙구나!',
                options: [
                    { text: '교장선생님, 가르침에 감사드립니다!', isCorrect: true, feedback: '거꾸로 초등학교 마스터 배지 획득! (+20점)', errType: null },
                    { text: '다음에 또 보자 교장!', isCorrect: false, feedback: '반말입니다. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '바이바이!', isCorrect: false, feedback: '격식 부족. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            }
        ]
    },
    5: {
        id: 5,
        name: '조선시대 타임슬립',
        badgeId: 'MASTER_5',
        locations: ['경복궁', '동헌', '저잣거리'],
        turns: [
            {
                npcName: '사또',
                npcAvatar: '👲',
                npcDialog: '네 이놈! 감히 동헌에 들어오다니! 네 놈의 나이가 몇이냐!',
                options: [
                    { text: '사또 마마, 소인의 나이가 아니라 어르신께는 연세를 여쭈어보아야 합니다.', isCorrect: true, feedback: '특수어휘 연세 지적 및 격식 사용! (+20점)', errType: null },
                    { text: '사또 너 나이가 몇인데 나한테 성질이야?', isCorrect: false, feedback: '사또에게 반말 사용. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '저 10살인데요. 사또 나이는요?', isCorrect: false, feedback: '사또 나이를 "연세"로 높이지 않음. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '조선 임금님',
                npcAvatar: '👑',
                npcDialog: '짐이 수라를 들 시간이 되었다. 수라가 무엇인지 아느냐?',
                options: [
                    { text: '전하, 수라는 임금님께서 드시는 밥을 높여 부르는 특수 어휘입니다!', isCorrect: true, feedback: '조선시대 특수어휘 수라 완벽 이해! (+20점)', errType: null },
                    { text: '임금님 밥 먹으러 가는 소리 하지 마세요.', isCorrect: false, feedback: '수라 ➔ 밥 낮춤 및 반말. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '수라는 라면인가요?', isCorrect: false, feedback: '잘못된 이해. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '봇짐장수',
                npcAvatar: '🤠',
                npcDialog: '아이구 탐험가님, 저기 대감마님이 집으로 들어가시는구려!',
                options: [
                    { text: '대감마님께서는 댁으로 들어가시고 계십니다.', isCorrect: true, feedback: '집 ➔ 댁 높임어 사용! (+20점)', errType: null },
                    { text: '대감이 자기 집 들어간다.', isCorrect: false, feedback: '반말 및 낮춤. (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '대감집 귀신 나온다.', isCorrect: false, feedback: '장난식 비하. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '영의정 대감',
                npcAvatar: '👴',
                npcDialog: '오냐, 탐험가야. 네 이름이 무엇이냐?',
                options: [
                    { text: '대감마님, 소인의 성함은... 아니 소인의 이름은 홍길동이라 합니다.', isCorrect: true, feedback: '자신의 이름은 "성함"이라 하지 않고 "이름"이라 겸양 표현함! (+20점)', errType: null },
                    { text: '제 성함은 홍길동이십니다.', isCorrect: false, feedback: '자신의 이름을 스스로 "성함"이라 높이는 오류! (-20점)', errType: 'SPECIAL_WORD' },
                    { text: '내 이름 길동이야.', isCorrect: false, feedback: '반말. (-10점)', errType: 'SPECIAL_WORD' }
                ]
            },
            {
                npcName: '조선 임금님',
                npcAvatar: '👑',
                npcDialog: '바른말 탐험가 덕분에 조선의 예의와 존댓말이 바로 섰도다!',
                options: [
                    { text: '전하! 안녕히 계시옵소서!', isCorrect: true, feedback: '조선 마스터 배지 획득! (+20점)', errType: null },
                    { text: '임금님 잘 있어라!', isCorrect: false, feedback: '반말. (-20점)', errType: 'SUBJECT_OBJECT' },
                    { text: '타임슬립 포털 탄다!', isCorrect: false, feedback: '격식 부족. (-10점)', errType: 'SUBJECT_OBJECT' }
                ]
            }
        ]
    }
};

// 3. 바른말 수호대 어절 블록 문제 데이터셋
export const SURVIVAL_PROBLEMS = [
    {
        id: 1,
        bossAttack: '"할아버지 밥 먹어!"',
        correctOrder: ['할아버지께서', '진지를', '잡수세요'],
        pool: ['할아버지께서', '진지를', '잡수세요', '밥을', '먹어', '할아버지가'],
        errCategory: 'SPECIAL_WORD',
        explanation: '할아버지 ➔ 할아버지께서, 밥 ➔ 진지, 먹어 ➔ 잡수세요'
    },
    {
        id: 2,
        bossAttack: '"선생님 나이 많아!"',
        correctOrder: ['선생님께서는', '연세가', '많으십니다'],
        pool: ['선생님께서는', '연세가', '많으십니다', '나이가', '선생님이', '많아'],
        errCategory: 'SPECIAL_WORD',
        explanation: '선생님 ➔ 선생님께서, 나이 ➔ 연세'
    },
    {
        id: 3,
        bossAttack: '"주사 맞으실게요! 약이 들어가실게요!"',
        correctOrder: ['주사', '맞으세요', '약이', '들어갑니다'],
        pool: ['주사', '맞으세요', '약이', '들어갑니다', '맞으실게요', '약님이'],
        errCategory: 'OBJECT_HONORIFIC',
        explanation: '사물(약, 주사)을 높이는 것은 오류입니다.'
    },
    {
        id: 4,
        bossAttack: '"교장선생님! 담임선생님이 왔어!"',
        correctOrder: ['교장선생님,', '선생님께서', '오셨습니다'],
        pool: ['교장선생님,', '선생님께서', '오셨습니다', '선생님이', '왔습니다', '왔어'],
        errCategory: 'APJON',
        explanation: '교장선생님 앞이라도 선생님을 높여 말해야 합니다.'
    },
    {
        id: 5,
        bossAttack: '"할머니 집에서 자!"',
        correctOrder: ['할머니께서', '댁에서', '주무십니다'],
        pool: ['할머니께서', '댁에서', '주무십니다', '집에서', '자십니다', '할머니가'],
        errCategory: 'SPECIAL_WORD',
        explanation: '집 ➔ 댁, 자다 ➔ 주무시다'
    }
];
