/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 월드 퀘스트 세부 장소 & 대화 컨트롤러 (game-quest.js)
   ========================================================================== */

import { INITIAL_WORLDS_DATA } from './data.js';
import { updateStudentProgress, getCurrentUserSession, getCreatorPrompt } from './firebase-config.js';

let currentWorldId = 1;
let currentSubLocationIdx = 0;
let currentScore = 100;
let earnedInQuest = [];

export function startQuestSession(worldId, onFinishCallback) {
    currentWorldId = worldId;
    currentSubLocationIdx = 0;
    currentScore = 100;
    earnedInQuest = [];

    const worldData = INITIAL_WORLDS_DATA[worldId];
    document.getElementById('quest-current-score').textContent = currentScore;

    // 세부 장소 선택 버튼 10개 렌더링
    renderSubLocationButtons(worldData, onFinishCallback);
}

function renderSubLocationButtons(worldData, onFinishCallback) {
    const selectorBox = document.getElementById('sub-location-selector');
    const container = document.getElementById('sub-location-buttons');
    selectorBox.classList.remove('hidden');
    container.innerHTML = '';

    worldData.locations.forEach((loc, idx) => {
        const btn = document.createElement('button');
        btn.className = `btn-sub-loc ${idx === currentSubLocationIdx ? 'active' : ''}`;
        btn.textContent = `${idx + 1}. ${loc.name}`;
        btn.onclick = () => {
            currentSubLocationIdx = idx;
            document.querySelectorAll('.btn-sub-loc').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadSubLocationQuest(loc, onFinishCallback);
        };
        container.appendChild(btn);
    });

    // 첫 번째 세부 장소 자동 실행
    loadSubLocationQuest(worldData.locations[currentSubLocationIdx], onFinishCallback);
}

function loadSubLocationQuest(locationData, onFinishCallback) {
    const worldData = INITIAL_WORLDS_DATA[currentWorldId];
    document.getElementById('quest-location-name').textContent = `${worldData.name} - [${locationData.name}]`;
    
    const chatBody = document.getElementById('messenger-chat-body');
    chatBody.innerHTML = '';

    // NPC 대사 렌더링
    const npcBubble = document.createElement('div');
    npcBubble.className = 'chat-bubble-wrapper npc';
    npcBubble.innerHTML = `
        <div class="chat-avatar">${locationData.npcAvatar}</div>
        <div class="chat-content-box">
            <span class="chat-sender-name">${locationData.npcName}</span>
            <div class="chat-bubble">${locationData.npcDialog}</div>
        </div>
    `;
    chatBody.appendChild(npcBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 16번: 선택지 버튼 3개 렌더링 (올바른 표현, 높임 미숙, 반말)
    const optionsContainer = document.getElementById('quest-options-container');
    optionsContainer.innerHTML = '';

    // 제작자 프롬프트 로드
    const creatorPrompt = getCreatorPrompt(currentWorldId);

    locationData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = `${idx + 1}. ${opt.text}`;
        btn.onclick = () => handleUserOptionSelection(opt, locationData, onFinishCallback);
        optionsContainer.appendChild(btn);
    });
}

function handleUserOptionSelection(selectedOption, locationData, onFinishCallback) {
    const chatBody = document.getElementById('messenger-chat-body');

    // 학생 대사 추가
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

    // 6번: 점수 차감 계산 오류 완전 교정! (scoreDelta 수치와 실제 currentScore 100% 동일 처리)
    const delta = selectedOption.scoreDelta || (selectedOption.isCorrect ? 20 : -20);
    currentScore = Math.max(0, currentScore + delta);
    document.getElementById('quest-current-score').textContent = currentScore;

    // 피드백 말풍선 추가
    const fbBubble = document.createElement('div');
    fbBubble.className = `feedback-bubble ${selectedOption.isCorrect ? 'correct' : 'wrong'}`;
    fbBubble.textContent = selectedOption.isCorrect 
        ? `✨ [AI 판정: 정답!] ${selectedOption.feedback}`
        : `❌ [AI 판정: 오류 (점수 ${delta}점)] ${selectedOption.feedback}`;
    chatBody.appendChild(fbBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 배지 획득 및 오답 DB 저장
    const badgeId = `W${currentWorldId}_B${currentSubLocationIdx + 1}`;
    if (selectedOption.isCorrect) {
        earnedInQuest.push(badgeId);
    }

    const curr = getCurrentUserSession();
    if (curr && curr.studentId) {
        updateStudentProgress(curr.studentId, selectedOption.isCorrect ? [badgeId] : [], selectedOption.errType, {
            mode: 'QUEST',
            worldId: currentWorldId,
            location: locationData.name,
            userChoice: selectedOption.text,
            feedback: selectedOption.feedback,
            errType: selectedOption.errType
        });
    }

    // 퀘스트 완료 처리
    setTimeout(() => {
        finishSubLocationQuest(selectedOption.isCorrect, badgeId, onFinishCallback);
    }, 1500);
}

function finishSubLocationQuest(isCorrect, badgeId, onFinishCallback) {
    const modal = document.getElementById('modal-quest-result');
    const badgeAnim = document.getElementById('badge-reward-anim');
    document.getElementById('modal-final-score').textContent = currentScore;

    if (isCorrect) {
        document.getElementById('modal-result-title').textContent = '🎉 세부 장소 탐험 배지 획득!';
        badgeAnim.classList.remove('hidden');
        document.getElementById('reward-badge-icon').textContent = '🎖️';
        document.getElementById('reward-badge-name').textContent = `${currentWorldId}월드 배지 #${currentSubLocationIdx + 1}`;
    } else {
        document.getElementById('modal-result-title').textContent = '👍 장소 탐험 완료!';
        badgeAnim.classList.add('hidden');
    }

    modal.classList.remove('hidden');

    document.getElementById('btn-close-quest-modal').onclick = () => {
        modal.classList.add('hidden');
        onFinishCallback(earnedInQuest);
    };
}
