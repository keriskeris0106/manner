/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 월드 퀘스트 5턴 대화 컨트롤러 (game-quest.js)
   ========================================================================== */

import { WORLDS_DATA, BADGES } from './data.js';
import { processAITurnResponse } from './ai-engine.js';
import { updateStudentProgress, getCurrentUserSession } from './firebase-config.js';

let currentWorldId = 1;
let currentTurnIndex = 0;
let currentScore = 100;
let earnedInQuest = [];
let wrongLogsInQuest = [];

export function startQuestSession(worldId, onFinishCallback) {
    currentWorldId = worldId;
    currentTurnIndex = 0;
    currentScore = 100;
    earnedInQuest = [];
    wrongLogsInQuest = [];

    const worldData = WORLDS_DATA[worldId];
    document.getElementById('quest-location-name').textContent = `${worldData.name} - [${worldData.locations[0]}]`;
    document.getElementById('messenger-chat-body').innerHTML = '';
    
    renderTurn(currentTurnIndex, onFinishCallback);
}

function renderTurn(turnIndex, onFinishCallback) {
    const worldData = WORLDS_DATA[currentWorldId];
    const turnData = worldData.turns[turnIndex];

    document.getElementById('quest-turn-counter').textContent = `TURN ${turnIndex + 1} / 5`;
    document.getElementById('quest-current-score').textContent = currentScore;

    // NPC 대사 렌더링
    const chatBody = document.getElementById('messenger-chat-body');
    const npcBubble = document.createElement('div');
    npcBubble.className = 'chat-bubble-wrapper npc';
    npcBubble.innerHTML = `
        <div class="chat-avatar">${turnData.npcAvatar}</div>
        <div class="chat-content-box">
            <span class="chat-sender-name">${turnData.npcName}</span>
            <div class="chat-bubble">${turnData.npcDialog}</div>
        </div>
    `;
    chatBody.appendChild(npcBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 하단 선택지 버튼 3개 렌더링
    const optionsContainer = document.getElementById('quest-options-container');
    optionsContainer.innerHTML = '';

    turnData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = `${idx + 1}. ${opt.text}`;
        btn.onclick = () => handleUserSelection(opt, turnData, turnIndex, onFinishCallback);
        optionsContainer.appendChild(btn);
    });
}

async function handleUserSelection(selectedOption, turnData, turnIndex, onFinishCallback) {
    const chatBody = document.getElementById('messenger-chat-body');

    // 1. 학생 대사 말풍선 추가
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble-wrapper user';
    userBubble.innerHTML = `
        <div class="chat-avatar">🧙‍♂️</div>
        <div class="chat-content-box">
            <span class="chat-sender-name">나 (탐험가)</span>
            <div class="chat-bubble">${selectedOption.text}</div>
        </div>
    `;
    chatBody.appendChild(userBubble);

    // 2. AI 판정
    const result = await processAITurnResponse(turnData, selectedOption);
    currentScore = Math.max(0, currentScore + result.scoreDelta);
    document.getElementById('quest-current-score').textContent = currentScore;

    // 3. AI 피드백 말풍선 추가
    const fbBubble = document.createElement('div');
    fbBubble.className = `feedback-bubble ${result.isCorrect ? 'correct' : 'wrong'}`;
    fbBubble.textContent = result.aiFeedback;
    chatBody.appendChild(fbBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 오답 및 배지 기록
    if (result.rewardBadge) earnedInQuest.push(result.rewardBadge);
    if (!result.isCorrect) {
        wrongLogsInQuest.push({
            worldId: currentWorldId,
            turn: turnIndex + 1,
            npc: turnData.npcName,
            userChoice: selectedOption.text,
            feedback: selectedOption.feedback,
            errType: result.errType
        });

        // DB 업데이트
        const curr = getCurrentUserSession();
        if (curr && curr.studentId) {
            updateStudentProgress(curr.studentId, [], result.errType, wrongLogsInQuest[wrongLogsInQuest.length - 1]);
        }
    }

    // 4. 다음 턴 또는 종료
    setTimeout(() => {
        if (turnIndex < 4) {
            renderTurn(turnIndex + 1, onFinishCallback);
        } else {
            finishQuest(onFinishCallback);
        }
    }, 1200);
}

function finishQuest(onFinishCallback) {
    const worldData = WORLDS_DATA[currentWorldId];
    const isMastered = currentScore >= 90;
    if (isMastered) {
        earnedInQuest.push(worldData.badgeId);
    }

    // 학생 DB 배지 저장
    const curr = getCurrentUserSession();
    if (curr && curr.studentId) {
        updateStudentProgress(curr.studentId, earnedInQuest, null, null);
    }

    // 결과 모달 팝업
    const modal = document.getElementById('modal-quest-result');
    const badgeAnim = document.getElementById('badge-reward-anim');
    document.getElementById('modal-final-score').textContent = currentScore;
    
    if (isMastered) {
        document.getElementById('modal-result-title').textContent = '🎉 월드 마스터 배지 획득!';
        badgeAnim.classList.remove('hidden');
        document.getElementById('reward-badge-icon').textContent = BADGES[worldData.badgeId].icon;
        document.getElementById('reward-badge-name').textContent = BADGES[worldData.badgeId].name;
    } else {
        document.getElementById('modal-result-title').textContent = '👍 퀘스트 완료!';
        badgeAnim.classList.add('hidden');
    }

    modal.classList.remove('hidden');

    document.getElementById('btn-close-quest-modal').onclick = () => {
        modal.classList.add('hidden');
        onFinishCallback(earnedInQuest);
    };
}
