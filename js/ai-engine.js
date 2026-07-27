/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 하이브리드 AI 대화 & 높임법 평가 엔진 (ai-engine.js)
   ========================================================================== */

/**
 * 하이브리드 AI 로직:
 * 1. 선택지의 정답 여부(isCorrect) 및 감점/오류 카테고리 분석
 * 2. 아동 친화적 AI 피드백 문장 가공 (Safety Shield 보장)
 */
export async function processAITurnResponse(turnData, selectedOption) {
    // 1. 기본 턴 평가 결과 가져오기
    const isCorrect = selectedOption.isCorrect;
    const feedback = selectedOption.feedback;
    const errType = selectedOption.errType;
    const rewardBadge = selectedOption.rewardBadge || null;

    // 2. AI 안전 가이드라인 적용 피드백 가공
    let aiMessage = "";
    if (isCorrect) {
        aiMessage = `✨ [AI 판정: 정답!] ${selectedOption.text} - ${feedback}`;
    } else {
        aiMessage = `❌ [AI 판정: 오류!] ${selectedOption.text} - ${feedback}`;
    }

    return {
        isCorrect,
        aiFeedback: aiMessage,
        scoreDelta: isCorrect ? 20 : (errType === 'SUBJECT_OBJECT' ? -20 : -10),
        errType,
        rewardBadge
    };
}
