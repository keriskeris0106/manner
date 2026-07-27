/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 5턴 연속 대화 & 렌덤 선택지 & 100점 배지 획득 시스템 (game-quest.js)
   ========================================================================== */

import { INITIAL_WORLDS_DATA, generate5TurnQuestData } from './data.js';
import { updateStudentProgress, getCurrentUserSession } from './firebase-config.js';

let currentWorldId = 1;
let currentSubLocationIdx = 0;
let currentTurnIdx = 0;
let currentScore = 100;
let questScenarios = [];
let earnedInQuest = [];

export function startQuestSession(worldId, onFinishCallback) {
    currentWorldId = worldId;
    currentSubLocationIdx = 0;
    earnedInQuest = [];

    const worldData = INITIAL_WORLDS_DATA[worldId];
    renderSubLocationButtons(worldData, onFinishCallback);
}

function renderSubLocationButtons(worldData, onFinishCallback) {
    const selectorBox = document.getElementById('sub-location-selector');
    const container = document.getElementById('sub-location-buttons');
    selectorBox.classList.remove('hidden');
    container.innerHTML = '';

    const currUser = getCurrentUserSession();
    const earnedBadges = (currUser && currUser.earnedBadges) ? currUser.earnedBadges : [];

    worldData.locations.forEach((loc, idx) => {
        const badgeId = `W${currentWorldId}_B${idx + 1}`;
        const isPassed = earnedBadges.includes(badgeId) || earnedInQuest.includes(badgeId);

        const btn = document.createElement('button');
        btn.className = `btn-sub-loc ${idx === currentSubLocationIdx ? 'active' : ''}`;
        btn.textContent = `${isPassed ? '✅ ' : ''}${idx + 1}. ${loc.name}`;
        btn.onclick = () => {
            currentSubLocationIdx = idx;
            document.querySelectorAll('.btn-sub-loc').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            startSubLocationQuest(loc, onFinishCallback);
        };
        container.appendChild(btn);
    });

    startSubLocationQuest(worldData.locations[currentSubLocationIdx], onFinishCallback);
}

function startSubLocationQuest(locationData, onFinishCallback) {
    currentTurnIdx = 0;
    currentScore = 100;
    questScenarios = generate5TurnQuestData(currentWorldId, locationData.name);

    document.getElementById('quest-current-score').textContent = currentScore;
    const worldData = INITIAL_WORLDS_DATA[currentWorldId];
    document.getElementById('quest-location-name').textContent = `${worldData.name} - [${locationData.name}]`;

    const chatBody = document.getElementById('messenger-chat-body');
    chatBody.innerHTML = '';

    loadTurnQuestion(locationData, onFinishCallback);
}

function loadTurnQuestion(locationData, onFinishCallback) {
    const turnCounter = document.getElementById('quest-turn-counter');
    if (turnCounter) turnCounter.textContent = `대화 턴: ${currentTurnIdx + 1} / 5`;

    const currentTurnData = questScenarios[currentTurnIdx];
    const chatBody = document.getElementById('messenger-chat-body');

    // NPC 대사 렌더링
    const npcBubble = document.createElement('div');
    npcBubble.className = 'chat-bubble-wrapper npc';
    npcBubble.innerHTML = `
        <div class="chat-avatar">${locationData.npcAvatar}</div>
        <div class="chat-content-box">
            <span class="chat-sender-name">${locationData.npcName} (턴 ${currentTurnIdx + 1}/5)</span>
            <div class="chat-bubble">${currentTurnData.dialog}</div>
        </div>
    `;
    chatBody.appendChild(npcBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3번 요구사항: 1, 2, 3번 선택지 무작위 셔플 (Fisher-Yates Shuffle)
    const shuffledOptions = [...currentTurnData.options].sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('quest-options-container');
    optionsContainer.innerHTML = '';

    shuffledOptions.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = `${idx + 1}. ${opt.text}`;
        btn.onclick = () => handleUserTurnSelection(opt, locationData, onFinishCallback);
        optionsContainer.appendChild(btn);
    });
}

function handleUserTurnSelection(selectedOption, locationData, onFinishCallback) {
    const chatBody = document.getElementById('messenger-chat-body');

    // 학생 선택 대사 추가
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

    // 4번 요구사항: 정답 시 유지, 틀리면 -10점 차감!
    if (!selectedOption.isCorrect) {
        currentScore = Math.max(0, currentScore - 10);
    }
    document.getElementById('quest-current-score').textContent = currentScore;

    // 피드백 말풍선
    const fbBubble = document.createElement('div');
    fbBubble.className = `feedback-bubble ${selectedOption.isCorrect ? 'correct' : 'wrong'}`;
    fbBubble.textContent = selectedOption.isCorrect 
        ? `✨ [정답!] ${selectedOption.feedback}`
        : `❌ [오답 (-10점)] ${selectedOption.feedback}`;
    chatBody.appendChild(fbBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    // 선택 이력 저장
    const curr = getCurrentUserSession();
    if (curr && curr.studentId) {
        updateStudentProgress(curr.studentId, [], selectedOption.errType, {
            mode: 'QUEST',
            worldId: currentWorldId,
            location: locationData.name,
            userChoice: selectedOption.text,
            feedback: selectedOption.feedback,
            errType: selectedOption.errType
        });
    }

    // 다음 턴 또는 완료
    setTimeout(() => {
        currentTurnIdx++;
        if (currentTurnIdx < 5) {
            loadTurnQuestion(locationData, onFinishCallback);
        } else {
            finishSubLocationSession(locationData, onFinishCallback);
        }
    }, 1400);
}

function finishSubLocationSession(locationData, onFinishCallback) {
    const modal = document.getElementById('modal-quest-result');
    const badgeAnim = document.getElementById('badge-reward-anim');
    document.getElementById('modal-final-score').textContent = currentScore;

    const badgeId = `W${currentWorldId}_B${currentSubLocationIdx + 1}`;

    // 4번 요구사항: 최종 점수가 100점이어야만 배지 획득!
    if (currentScore === 100) {
        document.getElementById('modal-result-title').textContent = '🎉 100점 만점! 탐험 배지 획득!';
        badgeAnim.classList.remove('hidden');
        document.getElementById('reward-badge-icon').textContent = locationData.npcAvatar || '🎖️';
        document.getElementById('reward-badge-name').textContent = `${locationData.name} 배지`;
        document.getElementById('modal-score-comment').textContent = `5번의 존댓말 대화를 오답 없이 완벽하게 마쳤습니다!`;
        earnedInQuest.push(badgeId);

        const curr = getCurrentUserSession();
        if (curr && curr.studentId) {
            updateStudentProgress(curr.studentId, [badgeId], null);
        }
    } else {
        document.getElementById('modal-result-title').textContent = '👍 5턴 대화 완료 (재도전 필요)';
        badgeAnim.classList.add('hidden');
        document.getElementById('modal-score-comment').textContent = `최종 점수가 ${currentScore}점입니다. 100점 만점을 받아야 배지를 획득할 수 있습니다. 다시 도전해 보세요!`;
    }

    modal.classList.remove('hidden');

    document.getElementById('btn-close-quest-modal').onclick = () => {
        modal.classList.add('hidden');
        renderSubLocationButtons(INITIAL_WORLDS_DATA[currentWorldId], onFinishCallback);
        onFinishCallback(earnedInQuest);
    };
}
