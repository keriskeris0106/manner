/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 50개 배지, 5개 월드 세부 장소, 바른말 수호대 문제 DB (data.js)
   ========================================================================== */

// 1. 배지 50개 (월드당 10개) & 칭호 정의
export const BADGES = {};

const WORLD_NAMES = ['마을', '동화', '병원', '학교', '조선'];
const WORLD_ICONS = ['🛒', '🏰', '🏥', '🏫', '👑'];

for (let w = 1; w <= 5; w++) {
    for (let b = 1; b <= 10; b++) {
        const id = `W${w}_B${b}`;
        BADGES[id] = {
            id,
            worldId: w,
            badgeNum: b,
            name: `${WORLD_NAMES[w-1]} 탐험 배지 #${b}`,
            icon: b === 10 ? '🏆' : WORLD_ICONS[w-1],
            desc: `${w}월드 세부 장소 #${b} 퀘스트 통과`
        };
    }
}

export const TITLES = [
    { minBadges: 0, title: '🌱 새싹 탐험대 (Lv.1)', desc: '존댓말 탐험을 막 시작한 초보 탐험가' },
    { minBadges: 10, title: '🗡️ 바른말 수호기사 (Lv.2)', desc: '월드 1을 완전 정복한 예의 바른 기사' },
    { minBadges: 20, title: '🛡️ 동화 수호자 (Lv.3)', desc: '동화 속 존댓말을 모두 바로잡은 수호자' },
    { minBadges: 30, title: '🩺 미래 언어 의사 (Lv.4)', desc: '사물 높임 오류를 치료한 언어 의사' },
    { minBadges: 40, title: '🏫 예의범절 마스터 (Lv.5)', desc: '학교와 압존법을 완벽히 이해한 마스터' },
    { minBadges: 50, title: '🌌 차원 대마법사 (Lv.MAX)', desc: '모든 월드의 배지 50개를 수집한 최고의 대마법사' }
];

// 2. 5개 월드 데이터 (월드당 세부 장소 10개씩 = 총 50개 장소 퀘스트)
export const INITIAL_WORLDS_DATA = {
    1: {
        id: 1,
        name: '시끌벅적 우리 마을',
        desc: '상대 높임법 (해요체, 합쇼체)',
        requiredBadges: 0,
        locations: [
            { id: '1_1', name: '동네 마트', npcName: '계산원 할머니', npcAvatar: '👵', npcDialog: '꼬마야, 사과 상자 옮기는 걸 좀 도와주겠니?',
              options: [
                  { text: '네, 기꺼이 도와드릴게요.', isCorrect: true, feedback: '격식에 맞는 올바른 높임표현입니다 (+20점)', scoreDelta: 20, errType: null },
                  { text: '네, 도와줄게요.', isCorrect: false, feedback: '어른에게 높임이 미흡한 어조입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '응, 도와줄게.', isCorrect: false, feedback: '어른에게 반말을 사용했습니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_2', name: '마을 병원', npcName: '의사 선생님', npcAvatar: '👨‍⚕️', npcDialog: '진료 순서를 기다려 주시겠습니까?',
              options: [
                  { text: '네, 조용히 기다리겠습니다.', isCorrect: true, feedback: '합쇼체 격식 높임 바르게 사용! (+20점)', scoreDelta: 20, errType: null },
                  { text: '네, 기다려 줄게요.', isCorrect: false, feedback: '높임 미숙 표현입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '싫어, 빨리 진료해 줘.', isCorrect: false, feedback: '무례한 반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_3', name: '맛있는 식당', npcName: '식당 이모님', npcAvatar: '👩‍🍳', npcDialog: '할머니 모시고 오셨군요! 식사는 무엇으로 드릴까요?',
              options: [
                  { text: '할머니께서 진지 드시는 걸 좋아하세요.', isCorrect: true, feedback: '특수어휘 "진지"와 높임 완벽! (+20점)', scoreDelta: 20, errType: null },
                  { text: '할머니 밥으로 주세요.', isCorrect: false, feedback: '어른의 밥을 "진지"로 높이지 않았습니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '야 밥 아무거나 내와.', isCorrect: false, feedback: '심각한 반말입니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '1_4', name: '행복 약국', npcName: '약사님', npcAvatar: '👨‍🔬', npcDialog: '할머니 연세가 어떻게 되시나요?',
              options: [
                  { text: '할머니께서는 올해 연세가 일흔이십니다.', isCorrect: true, feedback: '특수어휘 "연세" 바르게 사용! (+20점)', scoreDelta: 20, errType: null },
                  { text: '할머니 나이는 70살이에요.', isCorrect: false, feedback: '어른의 나이는 "연세"로 높여야 합니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '몰라. 늙었어.', isCorrect: false, feedback: '반말 및 낮춤 표현입니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '1_5', name: '달콤 빵집', npcName: '빵집 아저씨', npcAvatar: '🍞', npcDialog: '케이크를 누구에게 선물하실 건가요?',
              options: [
                  { text: '선생님께 드릴 선물입니다.', isCorrect: true, feedback: '객체 높임 "-께"를 바르게 썼습니다 (+20점)', scoreDelta: 20, errType: null },
                  { text: '선생님한테 줄 거예요.', isCorrect: false, feedback: '어른에게는 "-한테"보다 "-께"가 바릅니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '선생님 줄 거다.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_6', name: '마을 도서관', npcName: '사서 선생님', npcAvatar: '👓', npcDialog: '찾으시는 책이 있으신가요?',
              options: [
                  { text: '네, 혹시 이 책의 위치를 알려주실 수 있으신가요?', isCorrect: true, feedback: '공손한 해요체 높임법! (+20점)', scoreDelta: 20, errType: null },
                  { text: '네, 책 찾아줘요.', isCorrect: false, feedback: '높임 미숙입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '책 찾아봐.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_7', name: '꽃향기 꽃집', npcName: '꽃집 아주머니', npcAvatar: '💐', npcDialog: '어떤 꽃을 포장해 드릴까요?',
              options: [
                  { text: '어머니께 드릴 카네이션을 보여주세요.', isCorrect: true, feedback: '어머니께 드릴 예쁜 마음과 존댓말! (+20점)', scoreDelta: 20, errType: null },
                  { text: '엄마 줄 꽃 보여줘요.', isCorrect: false, feedback: '어른에게 줄 선물 높임 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '꽃 아무거나 줘.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_8', name: '마을 경찰서', npcName: '경찰관 아저씨', npcAvatar: '👮‍♂️', npcDialog: '길을 잃으셨나요? 집이 어디이신가요?',
              options: [
                  { text: '저희 댁은 이 근처 초등학교 옆입니다.', isCorrect: true, feedback: '자신의 집도 예의 바르게 표현! (+20점)', scoreDelta: 20, errType: null },
                  { text: '우리 집 이 근처예요.', isCorrect: false, feedback: '평범한 해요체 (-10점)', scoreDelta: -10, errType: null },
                  { text: '집 몰라.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_9', name: '시원한 과일가게', npcName: '과일가게 아저씨', npcAvatar: '🍉', npcDialog: '수박이 아주 싱싱합니다! 맛보시겠어요?',
              options: [
                  { text: '네, 맛보게 해주셔서 감사합니다.', isCorrect: true, feedback: '감사의 높임 표현 (+20점)', scoreDelta: 20, errType: null },
                  { text: '네, 먹어볼게요.', isCorrect: false, feedback: '조금 아쉬운 표현 (-10점)', scoreDelta: -10, errType: null },
                  { text: '줘봐.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '1_10', name: '마을 버스정류장', npcName: '버 기사님', npcAvatar: '🚌', npcDialog: '이번 버스는 중앙공원으로 갑니다!',
              options: [
                  { text: '기사님, 안녕히 가십시오!', isCorrect: true, feedback: '마을 월드 최종 10번째 배지 획득! (+20점)', scoreDelta: 20, errType: null },
                  { text: '기사님, 잘 가요.', isCorrect: false, feedback: '높임 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '잘 가라!', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            }
        ]
    },
    2: {
        id: 2,
        name: '신비한 동화 월드',
        desc: '동화 속 존댓말 바로잡기',
        requiredBadges: 10,
        locations: [
            { id: '2_1', name: '용궁 궁전', npcName: '용왕님', npcAvatar: '🐉', npcDialog: '콜록! 내 병을 고칠 토끼의 간이 필요하다. 내 이름이 무엇인지 아느냐?',
              options: [
                  { text: '용왕님의 성함은 해룡 왕이십니다.', isCorrect: true, feedback: '이름 ➔ 성함 높임 특수어휘 완벽! (+20점)', scoreDelta: 20, errType: null },
                  { text: '용왕님 이름은 해룡입니다.', isCorrect: false, feedback: '어른의 이름은 "성함"이라고 높여야 합니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '너 이름 해룡이지?', isCorrect: false, feedback: '용왕님께 반말을 하였습니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '2_2', name: '용궁 침실', npcName: '별주부 토끼', npcAvatar: '🐰', npcDialog: '용왕님께서 침대에서 자고 계신가요?',
              options: [
                  { text: '아니요, 용왕님께서는 편히 주무시고 계십니다.', isCorrect: true, feedback: '자다 ➔ 주무시다 완벽 사용! (+20점)', scoreDelta: 20, errType: null },
                  { text: '아니요, 용왕님이 자는 중입니다.', isCorrect: false, feedback: '자다 특수어휘 미사용 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '어, 자고 있어.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '2_3', name: '흥부네 초가집', npcName: '마음씨 착한 흥부', npcAvatar: '👨‍🌾', npcDialog: '제비가 박 씨를 가져왔군요! 같이 박을 타보시겠습니까?',
              options: [
                  { text: '흥부 선생님, 정말 축하드립니다.', isCorrect: true, feedback: '합쇼체 완벽! (+20점)', scoreDelta: 20, errType: null },
                  { text: '흥부야, 박 타자.', isCorrect: false, feedback: '어른에게 반말입니다 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '나도 보물 줘.', isCorrect: false, feedback: '무례함 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '2_4', name: '놀부네 기와집', npcName: '욕심쟁이 놀부', npcAvatar: '👺', npcDialog: '이놈! 여기가 어디라고 들어오느냐!',
              options: [
                  { text: '놀부님, 어르신 댁에서 예의를 지켜주십시오.', isCorrect: true, feedback: '집 ➔ 댁 높임어 사용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '너네 집에서 나갈게.', isCorrect: false, feedback: '댁 미사용 및 반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '놀부 집 별로네.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '2_5', name: '과자집 숲속', npcName: '과자집 마녀', npcAvatar: '🧙‍♀️', npcDialog: '과자집을 부수지 마라! 탐험가 너의 이름은 무엇이냐?',
              options: [
                  { text: '제 이름은 차원 탐험가입니다.', isCorrect: true, feedback: '자신의 이름은 겸양 표현으로 "이름"이라 합니다 (+20점)', scoreDelta: 20, errType: null },
                  { text: '제 성함은 탐험가이십니다.', isCorrect: false, feedback: '자신의 이름을 "성함"이라 높이는 것은 오류입니다 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '내 이름 알 필요 없다.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '2_6', name: '심청전 연꽃', npcName: '효녀 심청', npcAvatar: '🧜‍♀️', npcDialog: '저희 아버지 눈을 뜨게 해드릴 방법을 아시나요?',
              options: [
                  { text: '심봉사 어르신의 연세를 여쭈어보아도 되겠습니까?', isCorrect: true, feedback: '어르신 나이 ➔ 연세 사용! (+20점)', scoreDelta: 20, errType: null },
                  { text: '아빠 나이가 몇 살이야?', isCorrect: false, feedback: '어른 나이 낮춤 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '몰라.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '2_7', name: '콩쥐팥쥐 우물가', npcName: '콩쥐', npcAvatar: '👧', npcDialog: '밑 빠진 독에 물을 채워야 해요. 어쩌죠?',
              options: [
                  { text: '제가 두꺼비님께 부탁드려 도와드릴게요.', isCorrect: true, feedback: '올바른 도움의 존댓말 (+20점)', scoreDelta: 20, errType: null },
                  { text: '내가 도와줄게.', isCorrect: false, feedback: '어른이나 콩쥐에게 반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '독이나 새로 사.', isCorrect: false, feedback: '무례함 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '2_8', name: '금도끼 은도끼 샘터', npcName: '산신령 할아버지', npcAvatar: '🎅', npcDialog: '이 쇠도끼가 네 도끼이냐?',
              options: [
                  { text: '아닙니다, 정직하신 산신령 할아버지의 도끼입니다.', isCorrect: true, feedback: '정직하고 예의 바른 대답! (+20점)', scoreDelta: 20, errType: null },
                  { text: '금도끼 내놓으시오.', isCorrect: false, feedback: '명령조 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '어 다 내 거다.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '2_9', name: '아기돼지 삼형제 집', npcName: '첫째 돼지', npcAvatar: '🐷', npcDialog: '늑대가 집을 부수려고 해요!',
              options: [
                  { text: '튼튼한 벽돌 댁으로 피하십시오!', isCorrect: true, feedback: '댁 높임 표현 응용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '도망쳐라.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '몰라 늑대한테 먹혀.', isCorrect: false, feedback: '장난식 반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '2_10', name: '동화 차원 성문', npcName: '동화 지킴이', npcAvatar: '🏰', npcDialog: '동화 속 높임법을 모두 바르게 세우셨군요!',
              options: [
                  { text: '감사합니다, 안녕히 계십시오!', isCorrect: true, feedback: '동화 월드 배지 10개 완등! (+20점)', scoreDelta: 20, errType: null },
                  { text: '다음 월드로 보내줘.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '바이바이.', isCorrect: false, feedback: '격식 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            }
        ]
    },
    3: {
        id: 3,
        name: '삐뽀삐뽀 미래 병원',
        desc: '사물 높임 오류 교정 ("주사 맞으실게요 X")',
        requiredBadges: 20,
        locations: [
            { id: '3_1', name: '미래 진료실', npcName: '로봇 간호사', npcAvatar: '🤖', npcDialog: '환자분! 주사 맞으실게요! 약이 들어가실게요!',
              options: [
                  { text: '간호사님, "주사 맞으세요", "약이 들어갑니다"라고 해야 합니다.', isCorrect: true, feedback: '사물 높임 오류를 정확히 지적 교정했습니다! (+20점)', scoreDelta: 20, errType: null },
                  { text: '네! 약님 들어오세요.', isCorrect: false, feedback: '사물을 높이는 오류를 함께 범함 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '주사 아픈데 안 맞아.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_2', name: '원무과 수납처', npcName: '수납 로봇', npcAvatar: '🖥️', npcDialog: '진료비 5000원이십니다! 처방전 나오셨습니다!',
              options: [
                  { text: '진료비와 처방전은 사물이므로 "5000원입니다", "처방전 나왔습니다"가 바릅니다.', isCorrect: true, feedback: '사물 높임 과도 교정을 정확히 수정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '네! 5000원님 여기 계십니다.', isCorrect: false, feedback: '돈을 높이는 심각한 오류 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '돈 없어 안 내.', isCorrect: false, feedback: '반말입니다 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_3', name: '조제 약국', npcName: '미래 약사', npcAvatar: '👨‍🔬', npcDialog: '알약이 포장되셨습니다! 약을 받아가실게요!',
              options: [
                  { text: '알약은 사물이므로 "포장되었습니다. 받아가세요"라고 표현해야 합니다.', isCorrect: true, feedback: '알약 높임 오류 교정 성공 (+20점)', scoreDelta: 20, errType: null },
                  { text: '알약님 감사합니다.', isCorrect: false, feedback: '사물 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '약 던져줘.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_4', name: 'X-Ray 촬영실', npcName: '방사선사 로봇', npcAvatar: '📸', npcDialog: '기계가 촬영 시작하시겠습니다!',
              options: [
                  { text: '기계가 아닌 사람이 주체이므로 "촬영을 시작합니다"가 맞습니다.', isCorrect: true, feedback: '기계 높임 오류 지적 완벽 (+20점)', scoreDelta: 20, errType: null },
                  { text: '기계님 잘 찍어주세요.', isCorrect: false, feedback: '기계를 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '빨리 찍어.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_5', name: '물리치료실', npcName: '치료사 선생님', npcAvatar: '👨‍🦯', npcDialog: '찜질팩이 따뜻하시겠습니다!',
              options: [
                  { text: '선생님, 찜질팩은 사물이므로 "따뜻합니다"라고 하셔야 합니다.', isCorrect: true, feedback: '찜질팩 사물 높임 교정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '찜질팩님 따뜻하세요.', isCorrect: false, feedback: '사물 높임 오류 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '뜨거워 치워.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_6', name: '시력검사실', npcName: '안과 의사', npcAvatar: '👓', npcDialog: '안경테가 예쁘시네요!',
              options: [
                  { text: '안경테는 사물이므로 "예쁘네요"라고 높이지 않아야 합니다.', isCorrect: true, feedback: '사물 높임 오류 교정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '안경테님 감사합니다.', isCorrect: false, feedback: '사물 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '내 안경 탐내지 마.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_7', name: '영양상담실', npcName: '영양사 선생님', npcAvatar: '🥗', npcDialog: '비타민 음료가 시원하시겠습니다!',
              options: [
                  { text: '음료는 사물이므로 "시원합니다"라고 해야 올바릅니다.', isCorrect: true, feedback: '음료 사물 높임 지적 (+20점)', scoreDelta: 20, errType: null },
                  { text: '음료수님 짱 시원하세요.', isCorrect: false, feedback: '음료수 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '음료수 더 줘.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_8', name: '입원실 센서', npcName: '수간호사 로봇', npcAvatar: '👩‍⚕️', npcDialog: '침대가 누우실게요!',
              options: [
                  { text: '침대는 사물이므로 "침대에 누우세요"가 정확합니다.', isCorrect: true, feedback: '침대 사물 높임 오류 교정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '침대님 푹신하시네요.', isCorrect: false, feedback: '사물 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '침대 별로야.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_9', name: '응급센터', npcName: '응급구조사', npcAvatar: '🚑', npcDialog: '구급차가 출발하시겠습니다!',
              options: [
                  { text: '구급차는 사물이므로 "구급차가 출발합니다"가 바릅니다.', isCorrect: true, feedback: '구급차 사물 높임 지적 (+20점)', scoreDelta: 20, errType: null },
                  { text: '구급차님 빨리 가세요.', isCorrect: false, feedback: '사물 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '비켜라 구급차 간다.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '3_10', name: '미래병원 게이트', npcName: '병원장 로봇', npcAvatar: '🏥', npcDialog: '사물 높임 오류 치료 완료! 병원 10개 배지를 수여합니다!',
              options: [
                  { text: '감사합니다, 원장님! 안녕히 계십시오!', isCorrect: true, feedback: '미래 병원 10개 배지 마스터! (+20점)', scoreDelta: 20, errType: null },
                  { text: '배지 이리 내놔.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '잘 있어라 로봇.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            }
        ]
    },
    4: {
        id: 4,
        name: '거꾸로 초등학교',
        desc: '압존법 이해 및 윗사람 높임법',
        requiredBadges: 30,
        locations: [
            { id: '4_1', name: '교장실', npcName: '교장선생님', npcAvatar: '👨‍🦳', npcDialog: '탐험가 학생! 담임선생님이 오셨을 때 나에게 뭐라고 해야 하지?',
              options: [
                  { text: '선생님, 교장선생님께는 "선생님께서 오셨습니다"라고 높여드려야 합니다.', isCorrect: true, feedback: '학교 어른 관계 높임 이해 완벽! (+20점)', scoreDelta: 20, errType: null },
                  { text: '교장 앞이니까 담임선생님이 왔다고 낮출게요.', isCorrect: false, feedback: '학교나 가정 어른을 함부로 낮추는 압존법 오류 (-20점)', scoreDelta: -20, errType: 'APJON' },
                  { text: '담임 왔어.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'APJON' }
              ]
            },
            { id: '4_2', name: '가정통신문 교실', npcName: '담임선생님', npcAvatar: '👩‍🏫', npcDialog: '할아버지께 아버지를 언급할 때는 뭐라고 말씀드릴까?',
              options: [
                  { text: '현대 언어 예절에 따르면 "할아버지, 아버지께서 오셨습니다"라고 높입니다.', isCorrect: true, feedback: '현대 압존법 예절 완벽 지적! (+20점)', scoreDelta: 20, errType: null },
                  { text: '할아버지가 더 높으니 아버지가 왔다고 낮춰야죠.', isCorrect: false, feedback: '잘못된 전통 압존법 고집 (-20점)', scoreDelta: -20, errType: 'APJON' },
                  { text: '아빠 왔다고 소리쳐요.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'APJON' }
              ]
            },
            { id: '4_3', name: '교무실', npcName: '교무부장 선생님', npcAvatar: '👨‍🏫', npcDialog: '교장선생님 말씀이 있으시겠습니다!',
              options: [
                  { text: '선생님, "말씀이 있으시겠습니다"보다 "말씀하시겠습니다"가 바릅니다.', isCorrect: true, feedback: '주체 높임 표현 바르게 정리 (+20점)', scoreDelta: 20, errType: null },
                  { text: '교장 말 안 들어요.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '교장 말한다.', isCorrect: false, feedback: '낮춤 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '4_4', name: '숙제 제출함', npcName: '반장 학생', npcAvatar: '👦', npcDialog: '선생님께 숙제 제출할 때 뭐라고 말해야 해?',
              options: [
                  { text: '선생님, 숙제를 제출하겠습니다 또는 드립니다라고 해야 해.', isCorrect: true, feedback: '객체 높임 올바른 안내 (+20점)', scoreDelta: 20, errType: null },
                  { text: '선생님 여기 숙제 가져라 해야 해.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '책상에 던져.', isCorrect: false, feedback: '무례함 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '4_5', name: '음악실', npcName: '음악 선생님', npcAvatar: '🎵', npcDialog: '교가 제창이 있으시겠습니다!',
              options: [
                  { text: '선생님, 교가는 사물이므로 "교가를 부르겠습니다"가 바릅니다.', isCorrect: true, feedback: '사물 높임 오류 교정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '교가님 잘 부르세요.', isCorrect: false, feedback: '교가 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '노래 안 불러.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '4_6', name: '체육관', npcName: '체육 선생님', npcAvatar: '⚽', npcDialog: '교장선생님께서 시구를 하시겠습니다!',
              options: [
                  { text: '교장선생님께서 시구를 하십니다. 바른 표현입니다!', isCorrect: true, feedback: '주체 높임 올바른 확인 (+20점)', scoreDelta: 20, errType: null },
                  { text: '교장이 공 던진다.', isCorrect: false, feedback: '낮춤 표현 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '공이나 던져라.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '4_7', name: '과학실', npcName: '과학 선생님', npcAvatar: '🔬', npcDialog: '실험 도구가 준비되셨습니다!',
              options: [
                  { text: '도구는 사물이므로 "준비되었습니다"라고 해야 합니다.', isCorrect: true, feedback: '사물 높임 과도 지적 (+20점)', scoreDelta: 20, errType: null },
                  { text: '도구님 준비완료!', isCorrect: false, feedback: '도구 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '실험 안 해.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '4_8', name: '급식실', npcName: '영양사 선생님', npcAvatar: '🍱', npcDialog: '오늘 맛있는 급식이 나오셨습니다!',
              options: [
                  { text: '급식은 사물이므로 "급식이 나왔습니다"가 바릅니다.', isCorrect: true, feedback: '급식 사물 높임 교정 (+20점)', scoreDelta: 20, errType: null },
                  { text: '급식님 맛나게 드세요.', isCorrect: false, feedback: '급식 높임 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' },
                  { text: '급식 맛없다.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'OBJECT_HONORIFIC' }
              ]
            },
            { id: '4_9', name: '방송실', npcName: '방송부 선배', npcAvatar: '🎙️', npcDialog: '선생님께 안내방송 요청할 때 어조는?',
              options: [
                  { text: '선생님, 안내방송을 부탁드립니다라고 경어를 씁니다.', isCorrect: true, feedback: '공손한 어조 바르게 안내 (+20점)', scoreDelta: 20, errType: null },
                  { text: '야 방송 좀 해라.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '방송 켜.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '4_10', name: '초등학교 교문', npcName: '교장선생님', npcAvatar: '👨‍🦳', npcDialog: '학교 높임법 10개 장소를 완벽히 정복했구나!',
              options: [
                  { text: '교장선생님, 안녕히 계십시오!', isCorrect: true, feedback: '학교 월드 배지 10개 마스터! (+20점)', scoreDelta: 20, errType: null },
                  { text: '잘 있어라 교장.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '빠이빠이.', isCorrect: false, feedback: '격식 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            }
        ]
    },
    5: {
        id: 5,
        name: '조선시대 타임슬립',
        desc: '특수 어휘 (진지, 연세, 성함, 주무시다 등)',
        requiredBadges: 40,
        locations: [
            { id: '5_1', name: '동헌 재판소', npcName: '사또 마마', npcAvatar: '👲', npcDialog: '네 이놈! 네 놈의 나이가 몇이냐!',
              options: [
                  { text: '사또 마마, 소인의 나이가 아니라 어르신께는 연세를 여쭈어보아야 합니다.', isCorrect: true, feedback: '연세 지적 및 격식 높임 (+20점)', scoreDelta: 20, errType: null },
                  { text: '사또 너 나이가 몇인데 성질이야?', isCorrect: false, feedback: '사또에게 반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '나 10살인데 사또 나이는?', isCorrect: false, feedback: '연세 특수어휘 미사용 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_2', name: '경복궁 수라간', npcName: '조선 임금님', npcAvatar: '👑', npcDialog: '짐이 수라를 들 시간이 되었다. 수라가 무엇인지 아느냐?',
              options: [
                  { text: '전하, 수라는 임금님께서 드시는 밥을 높여 부르는 특수 어휘입니다.', isCorrect: true, feedback: '수라 특수어휘 완벽 이해 (+20점)', scoreDelta: 20, errType: null },
                  { text: '임금님 밥 먹으러 간다네.', isCorrect: false, feedback: '수라 ➔ 밥 낮춤 및 반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '수라가 라면인가요?', isCorrect: false, feedback: '엉뚱한 대답 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_3', name: '저잣거리', npcName: '봇짐장수', npcAvatar: '🤠', npcDialog: '아이구 탐험가님, 저기 대감마님이 집으로 들어가시는구려!',
              options: [
                  { text: '대감마님께서는 댁으로 들어가시고 계십니다.', isCorrect: true, feedback: '집 ➔ 댁 높임 특수어휘 사용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '대감이 자기 집 들어간다.', isCorrect: false, feedback: '반말 및 낮춤 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '대감집 귀신 나온다.', isCorrect: false, feedback: '비하 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_4', name: '영의정 집 대문', npcName: '영의정 대감', npcAvatar: '👴', npcDialog: '오냐, 네 이름이 무엇이냐?',
              options: [
                  { text: '대감마님, 소인의 이름은 홍길동이라 합니다.', isCorrect: true, feedback: '자신의 이름은 "이름"으로 겸양 표현 (+20점)', scoreDelta: 20, errType: null },
                  { text: '제 성함은 홍길동이십니다.', isCorrect: false, feedback: '자신의 이름을 "성함"으로 높이는 오류 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '내 이름 길동이야.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_5', name: '조선 병원 약방', npcName: '의원 어르신', npcAvatar: '👨‍🌾', npcDialog: '할머니 밥으로 챙겨드릴 약재라네.',
              options: [
                  { text: '의원님, 할머니 진지에 좋은 약재를 주십시오.', isCorrect: true, feedback: '진지 특수어휘 바르게 응용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '할머니 밥 약재 줘.', isCorrect: false, feedback: '특수어휘 미사용 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '약재 다 가져와.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_6', name: '서당 훈장님 방', npcName: '훈장님', npcAvatar: '📜', npcDialog: '내가 책상에서 자고 있을 때 깨우지 말거라.',
              options: [
                  { text: '훈장님께서 주무실 때는 조용히 하겠습니다.', isCorrect: true, feedback: '자다 ➔ 주무시다 특수어휘 사용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '훈장님 쿨쿨 잘 때 안 깨울게.', isCorrect: false, feedback: '주무시다 미사용 및 반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' },
                  { text: '자는 거 방해할 거야.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SPECIAL_WORD' }
              ]
            },
            { id: '5_7', name: '조선 대장간', npcName: '대장장이', npcAvatar: '🔨', npcDialog: '이 칼은 병조판서 대감에게 바칠 물건이오.',
              options: [
                  { text: '대감께 올릴 명검이군요.', isCorrect: true, feedback: '올리다/바치다 높임어 바르게 사용 (+20점)', scoreDelta: 20, errType: null },
                  { text: '대감한테 줄 칼이네.', isCorrect: false, feedback: '높임 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '나한테 줘.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '5_8', name: '성균관 학당', npcName: '성균관 유생', npcAvatar: '🎓', npcDialog: '대궐의 어르신을 만났을 때 인사는?',
              options: [
                  { text: '안녕히 계십시오 전하 또는 소인이 옵니다라고 아룁니다.', isCorrect: true, feedback: '조선시대 정중한 높임 인사 (+20점)', scoreDelta: 20, errType: null },
                  { text: '야 안녕 해.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '바이바이.', isCorrect: false, feedback: '무례함 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '5_9', name: '조선 나루터', npcName: '사공 아저씨', npcAvatar: '🛶', npcDialog: '배를 타고 차원의 문으로 이동하시겠소?',
              options: [
                  { text: '사공님, 배를 태워주셔서 감사드립니다.', isCorrect: true, feedback: '감사의 높임 인사 (+20점)', scoreDelta: 20, errType: null },
                  { text: '배 빨리 노 저어라.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '물에 빠트리지 마.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            },
            { id: '5_10', name: '시공간 차원문', npcName: '조선 임금님', npcAvatar: '👑', npcDialog: '모든 월드의 배지 50개를 마스터하여 차원 대마법사가 되었도다!',
              options: [
                  { text: '전하! 감사합니다! 안녕히 계십시오!', isCorrect: true, feedback: '🎉 배지 50개 완전 정복! 전설의 차원 대마법사 달성! (+20점)', scoreDelta: 20, errType: null },
                  { text: '잘 있어라 임금.', isCorrect: false, feedback: '반말 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' },
                  { text: '포털 탄다.', isCorrect: false, feedback: '격식 부족 (-20점)', scoreDelta: -20, errType: 'SUBJECT_OBJECT' }
              ]
            }
        ]
    }
};

// 3. 바른말 수호대 문제 DB (20개 다량 추가, 마침표 포함, 단일 문장 어절 순서)
export const SURVIVAL_PROBLEMS_DB = [
    {
        id: 1,
        bossAttack: '"할아버지 밥 먹어!"',
        correctOrder: ['할아버지께서', '진지를', '잡수십니다.'],
        pool: ['할아버지께서', '진지를', '잡수십니다.', '밥을', '먹어요.', '할아버지가'],
        errCategory: 'SPECIAL_WORD',
        explanation: '할아버지 ➔ 할아버지께서, 밥 ➔ 진지, 먹다 ➔ 잡수시다.'
    },
    {
        id: 2,
        bossAttack: '"선생님 나이 많아!"',
        correctOrder: ['선생님께서는', '연세가', '많으십니다.'],
        pool: ['선생님께서는', '연세가', '많으십니다.', '나이가', '선생님이', '많아요.'],
        errCategory: 'SPECIAL_WORD',
        explanation: '선생님 ➔ 선생님께서, 나이 ➔ 연세.'
    },
    {
        id: 3,
        bossAttack: '"주사 맞으실게요! 약이 들어가실게요!"',
        correctOrder: ['주사를', '맞으시고', '약 복용을', '시작합니다.'],
        pool: ['주사를', '맞으시고', '약 복용을', '시작합니다.', '맞으실게요.', '약님이'],
        errCategory: 'OBJECT_HONORIFIC',
        explanation: '사물(약, 주사)을 높이는 것은 사물 높임 오류입니다.'
    },
    {
        id: 4,
        bossAttack: '"교장선생님! 담임선생님이 왔어!"',
        correctOrder: ['교장선생님,', '담임선생님께서', '오셨습니다.'],
        pool: ['교장선생님,', '담임선생님께서', '오셨습니다.', '선생님이', '왔습니다.', '왔어.'],
        errCategory: 'APJON',
        explanation: '교장선생님 앞이라도 담임선생님을 함부로 낮추면 안 됩니다.'
    },
    {
        id: 5,
        bossAttack: '"할머니 집에서 자!"',
        correctOrder: ['할머니께서', '댁에서', '주무십니다.'],
        pool: ['할머니께서', '댁에서', '주무십니다.', '집에서', '자십니다.', '할머니가'],
        errCategory: 'SPECIAL_WORD',
        explanation: '집 ➔ 댁, 자다 ➔ 주무시다.'
    },
    {
        id: 6,
        bossAttack: '"선생님 이름 뭐야?"',
        correctOrder: ['선생님의', '성함이', '어떻게', '되시나요?'],
        pool: ['선생님의', '성함이', '어떻게', '되시나요?', '이름이', '뭐니?'],
        errCategory: 'SPECIAL_WORD',
        explanation: '선생님의 이름은 "성함"으로 높입니다.'
    },
    {
        id: 7,
        bossAttack: '"처방전 나오셨습니다!"',
        correctOrder: ['약국에서', '처방전이', '나왔습니다.'],
        pool: ['약국에서', '처방전이', '나왔습니다.', '나오셨습니다.', '처방전님이'],
        errCategory: 'OBJECT_HONORIFIC',
        explanation: '처방전은 사물이므로 "나왔습니다"가 맞습니다.'
    },
    {
        id: 8,
        bossAttack: '"아버지 밥 먹어라!"',
        correctOrder: ['아버지께서', '진지를', '드십니다.'],
        pool: ['아버지께서', '진지를', '드십니다.', '밥을', '먹는다.', '아버지가'],
        errCategory: 'SPECIAL_WORD',
        explanation: '아버지 ➔ 아버지께서, 밥 ➔ 진지.'
    },
    {
        id: 9,
        bossAttack: '"선생님한테 선물 줘!"',
        correctOrder: ['선생님께', '선물을', '올립니다.'],
        pool: ['선생님께', '선물을', '올립니다.', '선생님한테', '준다.', '선물 드려.'],
        errCategory: 'SUBJECT_OBJECT',
        explanation: '선생님한테 ➔ 선생님께, 주다 ➔ 올리다/드르다.'
    },
    {
        id: 10,
        bossAttack: '"할머니 병원 가!"',
        correctOrder: ['할머니께서', '병운에', '가십니다.'],
        pool: ['할머니께서', '병운에', '가십니다.', '할머니가', '간다.', '가라.'],
        errCategory: 'SUBJECT_OBJECT',
        explanation: '할머니 ➔ 할머니께서, 가다 ➔ 가시다.'
    },
    {
        id: 11,
        bossAttack: '"상품 포장되셨습니다!"',
        correctOrder: ['주문하신', '상품이', '포장되었습니다.'],
        pool: ['주문하신', '상품이', '포장되었습니다.', '포장되셨습니다.', '상품님이'],
        errCategory: 'OBJECT_HONORIFIC',
        explanation: '상품(물건)을 높이면 사물 높임 오류입니다.'
    },
    {
        id: 12,
        bossAttack: '"할아버지 말해봐!"',
        correctOrder: ['할아버지께서', '말씀을', '하십니다.'],
        pool: ['할아버지께서', '말씀을', '하십니다.', '말해라.', '할아버지가', '말한다.'],
        errCategory: 'SPECIAL_WORD',
        explanation: '말 ➔ 말씀, 말해라 ➔ 말씀을 하십니다.'
    },
    {
        id: 13,
        bossAttack: '"교장선생님 밥 드셔!"',
        correctOrder: ['교장선생님께서', '진지를', '잡수십니다.'],
        pool: ['교장선생님께서', '진지를', '잡수십니다.', '밥을', '드셔.', '교장이'],
        errCategory: 'SPECIAL_WORD',
        explanation: '교장선생님 ➔ 교장선생님께서, 밥 ➔ 진지.'
    },
    {
        id: 14,
        bossAttack: '"비타민 음료 시원하시겠습니다!"',
        correctOrder: ['비타민', '음료가', '매우', '시원합니다.'],
        pool: ['비타민', '음료가', '매우', '시원합니다.', '시원하시겠습니다.', '음료님'],
        errCategory: 'OBJECT_HONORIFIC',
        explanation: '음료는 사물이므로 "시원합니다"가 올바릅니다.'
    },
    {
        id: 15,
        bossAttack: '"선생님 나 물 줘!"',
        correctOrder: ['선생님,', '제게', '물을', '주십시오.'],
        pool: ['선생님,', '제게', '물을', '주십시오.', '나', '물 줘.', '물 가져와.'],
        errCategory: 'SUBJECT_OBJECT',
        explanation: '나 ➔ 저/제게, 주다 ➔ 주십시오.'
    }
];
