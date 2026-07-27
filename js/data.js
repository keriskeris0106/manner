/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 50개 배지 & 5개 월드 세부 장소 및 5턴 시나리오 (data.js)
   ========================================================================== */

export const BADGES = Array.from({ length: 50 }, (_, i) => {
    const worldId = Math.floor(i / 10) + 1;
    const subIdx = (i % 10) + 1;
    
    const worldNames = ["마을", "동화", "병원", "학교", "조선"];
    const icons = [
        ["🛒", "💊", "🍔", "🏫", "🏥", "🏪", "🥖", "✂️", "📮", "☕"],
        ["🏰", "🍎", "🐯", "👠", "🐸", "🧜‍♀️", "🪵", "🪓", "🧞‍♂️", "🧙‍♀️"],
        ["🏥", "💉", "🩺", "💊", "🤖", "🚑", "🧬", "🔬", "🦾", "👁️"],
        ["🏫", "📚", "✏️", "📐", "🎨", "🎵", "⚽", "🧪", "🎓", "🔔"],
        ["👑", "🏯", "📜", "🍡", "🍵", "🎎", "⚔️", "🐎", "🏹", "🎐"]
    ];

    const honorificExamples = [
        "선생님께 안부 인사를 드렸습니다.",
        "약사님께 감사한 마음을 전달합니다.",
        "식당 주모님께 맛있게 먹었다고 말씀드립니다.",
        "교장 선생님께 경례를 올립니다.",
        "의사 선생님의 말씀을 경청합니다.",
        "편의점 삼촌께 정중하게 계산을 청합니다.",
        "제과점 사장님께 바른말로 인사합니다.",
        "미용사 아주머니께 헤어 스타일을 부탁드립니다.",
        "우체부 아저씨께 편지를 받으며 감사합니다.",
        "카페 바리스타님께 음료를 주문합니다.",
        
        "할머니께 예쁜 사과를 드렸습니다.",
        "임금님께 소원을 아뢰었습니다.",
        "호랑이에게 지혜롭게 존댓말을 건넵니다.",
        "신데렐라에게 다정하게 이야기합니다.",
        "개구리 왕자님께 다정한 인사를 전합니다.",
        "인어공주님께 따뜻한 말을 건넵니다.",
        "나무꾼 아저씨의 선함을 격려합니다.",
        "산신령님께 솔직하게 아룁니다.",
        "요술지니에게 정중히 소원을 말합니다.",
        "마법사님께 예의 바르게 여쭤봅니다.",

        "의사 선생님께서 진찰을 해주십니다.",
        "간호사님께 아픈 곳을 예의 바르게 설명합니다.",
        "청진기를 귀에 대시는 선생님께 정중히 답합니다.",
        "약품에 대해 약사님께 여쭈어봅니다.",
        "의료 로봇에게 존댓말로 지시합니다.",
        "구급대원님께 감사 인사를 올립니다.",
        "유전자 연구원님께 설명을 청합니다.",
        "현미경 연구원님께 경의를 표합니다.",
        "로봇 의사님께 인사를 드립니다.",
        "시력 검사 선생님께 답변합니다.",

        "선생님께서 교실로 들어오십니다.",
        "선배님께 예의 바르게 인사를 올립니다.",
        "선생님께 연필을 건네드립니다.",
        "삼각자를 선생님께 가져다드립니다.",
        "미술 선생님의 작품을 감상하며 칭찬을 올립니다.",
        "음악 선생님의 바이올린 연주에 감사를 드립니다.",
        "체육 선생님께 축구공을 올려드립니다.",
        "과학 선생님의 실험 시연을 경청합니다.",
        "교장 선생님의 졸업 축사를 경청합니다.",
        "수업 종이 울리자 정숙하게 앉습니다.",

        "할머니께서 진지를 잡수십니다.",
        "할아버지께서 댁에 계십니다.",
        "훈장님께 족자를 바칩니다.",
        "주막 주모님께 음식을 청합니다.",
        "차를 달이시는 스승님께 올립니다.",
        "양반 어르신께 성함을 여쭤봅니다.",
        "장군님께 승전 보고를 올립니다.",
        "어사마패를 지닌 사또께 경의를 표합니다.",
        "궁수 장군님께 활을 올려드립니다.",
        "풍경 소리를 들으며 어르신께 정중히 청합니다."
    ];

    return {
        id: `W${worldId}_B${subIdx}`,
        worldId,
        subIdx,
        name: `${worldNames[worldId - 1]} 탐험 배지 #${subIdx}`,
        icon: icons[worldId - 1][subIdx - 1],
        description: honorificExamples[i] || "상황에 맞는 바른 존댓말 표현을 완벽히 마스터했습니다."
    };
});

export const INITIAL_WORLDS_DATA = {
    1: {
        id: 1,
        name: "월드 1: 시끌벅적 우리 마을",
        desc: "상대 높임법 (해요체, 합쇼체)",
        locations: [
            { id: 1, name: "우리동네 마트", npcName: "마트 사장님", npcAvatar: "🛒", subBadgeId: "W1_B1" },
            { id: 2, name: "친절한 약국", npcName: "약사님", npcAvatar: "💊", subBadgeId: "W1_B2" },
            { id: 3, name: "맛있는 식당", npcName: "식당 아주머니", npcAvatar: "🍔", subBadgeId: "W1_B3" },
            { id: 4, name: "마을 초등학교", npcName: "지킴이 아저씨", npcAvatar: "🏫", subBadgeId: "W1_B4" },
            { id: 5, name: "우리동네 병원", npcName: "의사 선생님", npcAvatar: "🏥", subBadgeId: "W1_B5" },
            { id: 6, name: "24시 편의점", npcName: "편의점 점원", npcAvatar: "🏪", subBadgeId: "W1_B6" },
            { id: 7, name: "고소한 빵집", npcName: "제과점 제빵사", npcAvatar: "🥖", subBadgeId: "W1_B7" },
            { id: 8, name: "머리방 미용실", npcName: "미용사 선생님", npcAvatar: "✂️", subBadgeId: "W1_B8" },
            { id: 9, name: "마을 우체국", npcName: "우체국 집배원", npcAvatar: "📮", subBadgeId: "W1_B9" },
            { id: 10, name: "달콤한 카페", npcName: "바리스타 사장님", npcAvatar: "☕", subBadgeId: "W1_B10" }
        ]
    },
    2: {
        id: 2,
        name: "월드 2: 신비한 동화 월드",
        desc: "전래동화/명작 속 존댓말 교정",
        locations: [
            { id: 1, name: "신데렐라 성", npcName: "신데렐라", npcAvatar: "🏰", subBadgeId: "W2_B1" },
            { id: 2, name: "백설공주 오두막", npcName: "백설공주", npcAvatar: "🍎", subBadgeId: "W2_B2" },
            { id: 3, name: "햇님달님 떡집", npcName: "호랑이 어르신", npcAvatar: "🐯", subBadgeId: "W2_B3" },
            { id: 4, name: "콩쥐팥쥐 우물", npcName: "콩쥐", npcAvatar: "👠", subBadgeId: "W2_B4" },
            { id: 5, name: "개구리 연못", npcName: "개구리 왕자", npcAvatar: "🐸", subBadgeId: "W2_B5" },
            { id: 6, name: "인어 바다", npcName: "인어공주", npcAvatar: "🧜‍♀️", subBadgeId: "W2_B6" },
            { id: 7, name: "금도끼 연못", npcName: "산신령님", npcAvatar: "🪓", subBadgeId: "W2_B7" },
            { id: 8, name: "흥부네 초가집", npcName: "흥부 어르신", npcAvatar: "🪵", subBadgeId: "W2_B8" },
            { id: 9, name: "알라딘 동굴", npcName: "램프의 지니", npcAvatar: "🧞‍♂️", subBadgeId: "W2_B9" },
            { id: 10, name: "마법사의 탑", npcName: "지혜의 마법사", npcAvatar: "🧙‍♀️", subBadgeId: "W2_B10" }
        ]
    },
    3: {
        id: 3,
        name: "월드 3: 삐뽀삐뽀 미래 병원",
        desc: "사물 높임 오류 교정",
        locations: [
            { id: 1, name: "종합 안내소", npcName: "안내 간호사", npcAvatar: "🏥", subBadgeId: "W3_B1" },
            { id: 2, name: "주사실", npcName: "주사 전담 의사", npcAvatar: "💉", subBadgeId: "W3_B2" },
            { id: 3, name: "내과 진료실", npcName: "내과 과장님", npcAvatar: "🩺", subBadgeId: "W3_B3" },
            { id: 4, name: "미래 조제실", npcName: "수석 약사님", npcAvatar: "💊", subBadgeId: "W3_B4" },
            { id: 5, name: "AI 로봇 수술실", npcName: "의료 AI 로봇", npcAvatar: "🤖", subBadgeId: "W3_B5" },
            { id: 6, name: "응급센터", npcName: "응급 대원님", npcAvatar: "🚑", subBadgeId: "W3_B6" },
            { id: 7, name: "유전자 연구소", npcName: "유전자 박사님", npcAvatar: "🧬", subBadgeId: "W3_B7" },
            { id: 8, name: "임상 검사실", npcName: "검사 연구원님", npcAvatar: "🔬", subBadgeId: "W3_B8" },
            { id: 9, name: "사이보그 재활실", npcName: "재활치료사님", npcAvatar: "🦾", subBadgeId: "W3_B9" },
            { id: 10, name: "안과 정밀 검진실", npcName: "안과 원장님", npcAvatar: "👁️", subBadgeId: "W3_B10" }
        ]
    },
    4: {
        id: 4,
        name: "월드 4: 거꾸로 초등학교",
        desc: "압존법 이해 및 윗사람 높임법",
        locations: [
            { id: 1, name: "3학년 교실", npcName: "담임 선생님", npcAvatar: "🏫", subBadgeId: "W4_B1" },
            { id: 2, name: "도서관", npcName: "사서 선생님", npcAvatar: "📚", subBadgeId: "W4_B2" },
            { id: 3, name: "교무실", npcName: "교감 선생님", npcAvatar: "✏️", subBadgeId: "W4_B3" },
            { id: 4, name: "수학 탐구실", npcName: "수학 수석교사", npcAvatar: "📐", subBadgeId: "W4_B4" },
            { id: 5, name: "미술실", npcName: "미술 선생님", npcAvatar: "🎨", subBadgeId: "W4_B5" },
            { id: 6, name: "음악실", npcName: "음악 선생님", npcAvatar: "🎵", subBadgeId: "W4_B6" },
            { id: 7, name: "체육관", npcName: "체육 선생님", npcAvatar: "⚽", subBadgeId: "W4_B7" },
            { id: 8, name: "과학실", npcName: "과학 선생님", npcAvatar: "🧪", subBadgeId: "W4_B8" },
            { id: 9, name: "교장실", npcName: "교장 선생님", npcAvatar: "🎓", subBadgeId: "W4_B9" },
            { id: 10, name: "방송실", npcName: "방송 담당 선생님", npcAvatar: "🔔", subBadgeId: "W4_B10" }
        ]
    },
    5: {
        id: 5,
        name: "월드 5: 조선시대 타임슬립",
        desc: "특수 어휘 (진지, 연세, 성함, 댁 등)",
        locations: [
            { id: 1, name: "경복궁 대전", npcName: "조선 임금님", npcAvatar: "👑", subBadgeId: "W5_B1" },
            { id: 2, name: "양반골 대궐", npcName: "영의정 대감", npcAvatar: "🏯", subBadgeId: "W5_B2" },
            { id: 3, name: "마을 서당", npcName: "훈장 선생님", npcAvatar: "📜", subBadgeId: "W5_B3" },
            { id: 4, name: "저잣거리 주막", npcName: "주막 주모님", npcAvatar: "🍡", subBadgeId: "W5_B4" },
            { id: 5, name: "선비 다원", npcName: "차 달이는 선비", npcAvatar: "🍵", subBadgeId: "W5_B5" },
            { id: 6, name: "조선 가옥 댁", npcName: "원로 어르신", npcAvatar: "🎎", subBadgeId: "W5_B6" },
            { id: 7, name: "훈련원 연무장", npcName: "훈련원 장군", npcAvatar: "⚔️", subBadgeId: "W5_B7" },
            { id: 8, name: "조선 역참길", npcName: "암행어사 사또", npcAvatar: "🐎", subBadgeId: "W5_B8" },
            { id: 9, name: "조선 궁술장", npcName: "궁수 사두님", npcAvatar: "🏹", subBadgeId: "W5_B9" },
            { id: 10, name: "조선 풍류정", npcName: "학식 높은 대감", npcAvatar: "🎐", subBadgeId: "W5_B10" }
        ]
    }
};

// 10번 요구사항: 잘못된 높임표현/반말과의 대립으로 이뤄진 5턴 퀘스트 생성기
export function generate5TurnQuestData(worldId, locationName) {
    const scenarios = {
        1: [
            {
                dialog: "손님, 어서 오세요! 찾으시는 물건이 있으신가요?",
                options: [
                    { text: "선생님, 사과 가격이 얼마입니까?", isCorrect: true, feedback: "합쇼체로 정중히 물어보았습니다." },
                    { text: "선생님, 사과 가격이 얼마이십니다.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "'얼마이십니다'는 잘못된 사물 높임입니다." },
                    { text: "사과 얼마야?", isCorrect: false, errType: "INFORMAL", feedback: "어른께 반말을 사용하면 안 됩니다." }
                ]
            },
            {
                dialog: "네, 사과는 한 상자에 만 원입니다. 계산해 드릴까요?",
                options: [
                    { text: "네, 여기 카드를 올립니다.", isCorrect: true, feedback: "공손하게 카드를 전달했습니다." },
                    { text: "네, 카드가 나오셨습니다.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "카드는 사람이 아니므로 '나오셨습니다'를 쓰면 안 됩니다." },
                    { text: "어, 여기 카드 받아.", isCorrect: false, errType: "INFORMAL", feedback: "반말은 예의에 어긋납니다." }
                ]
            },
            {
                dialog: "영수증도 챙겨 드릴까요?",
                options: [
                    { text: "아니요, 영수증은 주시지 않아도 괜찮습니다.", isCorrect: true, feedback: "바른 존댓말로 의사를 표현했습니다." },
                    { text: "영수증은 버려주실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "'~하실게요'는 어색한 높임 표현입니다." },
                    { text: "영수증 버려줘.", isCorrect: false, errType: "INFORMAL", feedback: "반말을 사용했습니다." }
                ]
            },
            {
                dialog: "오늘 날씨가 참 따뜻하네요. 맛있게 드세요!",
                options: [
                    { text: "감사합니다. 사장님도 좋은 하루 보내십시오.", isCorrect: true, feedback: "덕담으로 정중히 인사했습니다." },
                    { text: "좋은 하루 되실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 사물 높임 오류입니다." },
                    { text: "응, 잘 먹을게!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "다음에도 또 우리 마트에 찾아와 주세요!",
                options: [
                    { text: "네, 다음에 다시 찾아뵙겠습니다.", isCorrect: true, feedback: "'찾아뵙다'는 바른 객체 높임입니다." },
                    { text: "네, 다음에 또 찾아오실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "자신의 행동에 높임표현을 쓰면 어색합니다." },
                    { text: "응, 또 올게!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            }
        ],
        2: [
            {
                dialog: "어린 탐험가님, 도움이 필요하신가요?",
                options: [
                    { text: "네, 할머니 댁이 어디인지 여쭈어봐도 될까요?", isCorrect: true, feedback: "'댁'과 '여쭈어보다'를 바르게 사용했습니다." },
                    { text: "할머니 집이 어디이신가요?", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 집은 '댁'이라고 해야 합니다." },
                    { text: "할머니 집 어디야?", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "저 언덕 너머 기와집이 바로 할머니 댁이란다.",
                options: [
                    { text: "친절히 알려주셔서 정말 감사합니다.", isCorrect: true, feedback: "감사 인사를 정중히 하였습니다." },
                    { text: "친절함이 나오시네요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 사물 높임입니다." },
                    { text: "고마워, 잘 갈게!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "할머니께서 지금 식사 중이실 텐데 전해줄 물건이 있니?",
                options: [
                    { text: "네, 할머니께 드릴 진지를 가져왔습니다.", isCorrect: true, feedback: "'진지'와 '드릴'을 바르게 사용했습니다." },
                    { text: "네, 할머니께 드릴 밥을 가져오셨습니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 식사는 '진지'라고 높여 부릅니다." },
                    { text: "응, 할머니 밥 전달할 거야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "참 착한 아이구나! 할머니의 나이(연세)가 어떻게 되시는지 아느니?",
                options: [
                    { text: "네, 할머니 연세는 올해 일흔이십니다.", isCorrect: true, feedback: "'연세' 특수 어휘를 바르게 사용했습니다." },
                    { text: "할머니 나이는 일흔이십니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 나이는 '연세'라고 높여 부릅니다." },
                    { text: "할머니 나이 70살이야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "훌륭하구나! 동화 차원의 평화를 지켜주어 고맙다.",
                options: [
                    { text: "안녕히 계십시오, 덕분에 잘 찾았습니다.", isCorrect: true, feedback: "바른 작별 인사를 하였습니다." },
                    { text: "안녕히 가실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 높임 표현입니다." },
                    { text: "응, 안녕!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            }
        ],
        3: [
            {
                dialog: "환자분, 어디가 불편해서 오셨나요?",
                options: [
                    { text: "의사 선생님, 배가 많이 아파서 왔습니다.", isCorrect: true, feedback: "정중히 증상을 설명했습니다." },
                    { text: "배가 아프실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "자신의 통증에 '아프실게요'를 쓰면 안 됩니다." },
                    { text: "배 아파서 왔어.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "그렇군요. 주사를 한 대 맞으셔야 할 것 같습니다.",
                options: [
                    { text: "네, 선생님 말씀대로 주사를 맞겠습니다.", isCorrect: true, feedback: "바르게 대답했습니다." },
                    { text: "주사 맞으실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "병원에서 자주 틀리는 '주사 맞으실게요' 사물 높임 오류입니다." },
                    { text: "주사 시로! 안 맞을 거야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "처방전을 드릴 테니 약국에서 약을 받아서 드세요.",
                options: [
                    { text: "네, 처방전을 감사히 받겠습니다.", isCorrect: true, feedback: "공손하게 답했습니다." },
                    { text: "처방전 나오셨습니다.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "처방전 사물에 높임말을 쓰면 안 됩니다." },
                    { text: "처방전 줘!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "약은 식후 30분에 물과 함께 잡수시면 됩니다.",
                options: [
                    { text: "네, 안내해주신 대로 잊지 않고 먹겠습니다.", isCorrect: true, feedback: "바르게 대답했습니다." },
                    { text: "약 드실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "잘못된 높임표현입니다." },
                    { text: "응, 잘 먹을게.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "쾌유를 빕니다. 조심히 돌아가세요!",
                options: [
                    { text: "감사합니다. 안녕히 계십시오.", isCorrect: true, feedback: "바른 인사입니다." },
                    { text: "조심히 돌아가실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 사물 높임입니다." },
                    { text: "응, 잘 있어!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            }
        ],
        4: [
            {
                dialog: "어린이 탐험가님, 교장 선생님께서 교무실에 계신가요?",
                options: [
                    { text: "네, 교장 선생님께서 교무실에 계십니다.", isCorrect: true, feedback: "주체 높임 '계시다'를 바르게 사용했습니다." },
                    { text: "교장 선생님께서 교무실에 있으십니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 위치에는 '계시다'를 사용합니다." },
                    { text: "교장 선생님 교무실에 있어.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "그렇군요. 그럼 담임 선생님께서는 무엇을 하고 계시니?",
                options: [
                    { text: "담임 선생님께서 교실에서 책을 읽으십니다.", isCorrect: true, feedback: "현대 언어 예절에서 담임선생님을 바르게 높였습니다." },
                    { text: "담임 선생님이 교실에서 책 읽는다.", isCorrect: false, errType: "APJON", feedback: "윗사람 앞이라도 다른 선생님을 함부로 낮추지 않습니다." },
                    { text: "담임 책 읽고 있어.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "선생님께 드릴 서류가 있는데 전해드릴 수 있겠니?",
                options: [
                    { text: "네, 제가 선생님께 잘 전달해 드리겠습니다.", isCorrect: true, feedback: "윗사람께 올리는 표현 '드리다'를 바르게 썼습니다." },
                    { text: "네, 제가 선생님한테 줄게요.", isCorrect: false, errType: "SUBJECT_OBJECT", feedback: "윗사람에게는 '한테' 대신 '께'를 써야 합니다." },
                    { text: "응, 내가 갖다 줄게.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "고맙다! 선생님 성함이 어떻게 되시는지 말씀해 줄 수 있니?",
                options: [
                    { text: "네, 저희 선생님 성함은 김바른 선생님이십니다.", isCorrect: true, feedback: "윗사람의 이름은 '성함'으로 높여 부릅니다." },
                    { text: "저희 선생님 이름은 김바른입니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 이름은 '성함'이라고 해야 합니다." },
                    { text: "선생님 이름 김바른이야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "학교 예절을 완벽하게 알고 있구나! 훌륭하단다.",
                options: [
                    { text: "감사합니다, 선생님! 더욱 노력하겠습니다.", isCorrect: true, feedback: "바르게 감사 인사를 올렸습니다." },
                    { text: "노력하으실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 높임 표현입니다." },
                    { text: "응, 고마워!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            }
        ],
        5: [
            {
                dialog: "이보게, 한양 땅에 온 선비인가? 어르신의 댁이 어디인가?",
                options: [
                    { text: "네, 어르신 댁은 남산골 인근이십니다.", isCorrect: true, feedback: "윗사람의 집을 '댁'으로 높여 부릅니다." },
                    { text: "어르신 집은 남산골이십니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 집은 '댁'이라고 높여 부릅니다." },
                    { text: "어르신 집 저기야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "어르신께서 많이 연세가 드셨을 텐데, 진지는 잡수셨는가?",
                options: [
                    { text: "네, 어르신께서 이미 진지를 잡수셨습니다.", isCorrect: true, feedback: "'진지'와 '잡수시다' 특수 어휘를 바르게 사용했습니다." },
                    { text: "네, 어르신께서 이미 밥을 드셨습니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 밥은 '진지'가 가장 적절한 높임 표현입니다." },
                    { text: "응, 밥 먹었어.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "어르신의 연세가 올해 어떻게 되시는가?",
                options: [
                    { text: "어르신의 연세는 올해 여순이십니다.", isCorrect: true, feedback: "나이를 높이는 '연세'를 바르게 사용했습니다." },
                    { text: "어르신 나이는 60살이십니다.", isCorrect: false, errType: "SPECIAL_WORD", feedback: "윗사람의 나이는 '연세'라고 높입니다." },
                    { text: "나이 60살이야.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "내가 선물을 바치고자 하는데 무엇을 드리면 좋겠는가?",
                options: [
                    { text: "어르신께 비단 족자를 바치는 것이 좋겠습니다.", isCorrect: true, feedback: "'께' 조사를 바르게 사용했습니다." },
                    { text: "어르신한테 족자 주면 좋아.", isCorrect: false, errType: "SUBJECT_OBJECT", feedback: "어른께는 '한테' 대신 '께'를 써야 합니다." },
                    { text: "어르신 족자 줘.", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            },
            {
                dialog: "조선의 예의범절을 아주 잘 아는 유학자이시구려!",
                options: [
                    { text: "과찬이십니다. 앞으로도 바른 존댓말을 올리겠습니다.", isCorrect: true, feedback: "겸손하고 바르게 인사를 드렸습니다." },
                    { text: "바른 존댓말 올리실게요.", isCorrect: false, errType: "OBJECT_HONORIFIC", feedback: "어색한 사물 높임 오류입니다." },
                    { text: "응, 알고 있어!", isCorrect: false, errType: "INFORMAL", feedback: "반말입니다." }
                ]
            }
        ]
    };

    return scenarios[worldId] || scenarios[1];
}
