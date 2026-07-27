/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 반말 몬스터 던전 (재도전 보장 & 커스텀 문제 연동) (game-survival.js)
   ========================================================================== */

import { SURVIVAL_QUESTIONS } from './data.js';
import { saveLeaderboardScore, getCurrentUserSession } from './firebase-config.js';

let hearts = 3;
let timerSeconds = 300;
let timerInterval = null;
let currentScoreCount = 0;
let currentQuestion = null;
let assembledWords = [];
let wrongLogsInSession = [];
let customQuestionsList = [];

export function startSurvivalGame(onGameOverCallback, onHomeExitCallback) {
    hearts = 3;
    timerSeconds = 300;
    currentScoreCount = 0;
    wrongLogsInSession = [];
    assembledWords = [];

    // 교사 커스텀 문제 가져오기
    loadTeacherCustomQuestions();

    updateUI();
    loadNextQuestion();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds--;
        if (timerSeconds <= 0) {
            endSurvivalGame(onGameOverCallback);
        } else {
            updateTimerDisplay();
        }
    }, 1000);

    // 🏠 로비로 이탈 버튼
    const btnHome = document.getElementById('btn-home-survival');
    if (btnHome) {
        btnHome.onclick = () => {
            if (confirm("🎮 '반말 몬스터 던전'을 중단하고 로비로 돌아가시겠습니까?")) {
                if (timerInterval) clearInterval(timerInterval);
                onHomeExitCallback();
            }
        };
    }

    const btnReset = document.getElementById('btn-reset-blocks');
    if (btnReset) {
        btnReset.onclick = resetAssembledSlots;
    }

    const btnSubmit = document.getElementById('btn-submit-sentence');
    if (btnSubmit) {
        btnSubmit.onclick = () => submitSentence(onGameOverCallback);
    }
}

function loadTeacherCustomQuestions() {
    try {
        const saved = localStorage.getItem("manner_explorer_custom_quests");
        if (saved) {
            customQuestionsList = JSON.parse(saved);
        }
    } catch (e) {}
}

function updateUI() {
    const heartsEl = document.getElementById('survival-hearts');
    if (heartsEl) heartsEl.textContent = '❤️'.repeat(hearts);
    const scoreEl = document.getElementById('survival-score-count');
    if (scoreEl) scoreEl.textContent = currentScoreCount;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('survival-timer');
    if (!timerEl) return;
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
}

function loadNextQuestion() {
    assembledWords = [];
    renderAssembledSlots();

    // 커스텀 문제와 기본 문제 통합
    let pool = [...SURVIVAL_QUESTIONS];
    if (customQuestionsList.length > 0) {
        pool = [...customQuestionsList, ...SURVIVAL_QUESTIONS];
    }

    const randomIdx = Math.floor(Math.random() * pool.length);
    currentQuestion = pool[randomIdx];

    const bossTextEl = document.getElementById('boss-attack-text');
    if (bossTextEl) bossTextEl.textContent = `"${currentQuestion.wrong}"`;

    // 어절 블록 셔플
    const blocks = [...currentQuestion.correctBlocks].sort(() => Math.random() - 0.5);
    renderWordBlocks(blocks);
}

function renderWordBlocks(blocks) {
    const container = document.getElementById('blocks-container');
    if (!container) return;
    container.innerHTML = '';

    blocks.forEach((word) => {
        const btn = document.createElement('button');
        btn.className = 'word-block';
        btn.textContent = word;
        btn.onclick = () => {
            assembledWords.push(word);
            btn.style.display = 'none';
            renderAssembledSlots();
        };
        container.appendChild(btn);
    });
}

function renderAssembledSlots() {
    const container = document.getElementById('assembled-slots');
    if (!container) return;
    container.innerHTML = '';

    assembledWords.forEach((word, idx) => {
        const slot = document.createElement('span');
        slot.className = 'word-block';
        slot.textContent = word;
        slot.onclick = () => {
            assembledWords.splice(idx, 1);
            renderAssembledSlots();
            restoreWordBlocks();
        };
        container.appendChild(slot);
    });
}

function resetAssembledSlots() {
    assembledWords = [];
    renderAssembledSlots();
    restoreWordBlocks();
}

function restoreWordBlocks() {
    const container = document.getElementById('blocks-container');
    if (!container || !currentQuestion) return;

    const allBlocks = currentQuestion.correctBlocks;
    const remaining = [...allBlocks];
    
    assembledWords.forEach(w => {
        const i = remaining.indexOf(w);
        if (i >= 0) remaining.splice(i, 1);
    });

    renderWordBlocks(remaining.sort(() => Math.random() - 0.5));
}

// 7번 요구사항: 정답 실패 시 하트 1개 차감 후 현재 문제를 다시 풀 수 있도록 유지!
function submitSentence(onGameOverCallback) {
    if (!currentQuestion) return;

    const userSentence = assembledWords.join(' ').trim();
    const correctSentence = currentQuestion.correctBlocks.join(' ').trim();

    if (userSentence === correctSentence) {
        alert('✨ 정답입니다! 반말 몬스터를 격파했습니다!');
        currentScoreCount++;
        updateUI();
        loadNextQuestion();
    } else {
        hearts--;
        updateUI();
        wrongLogsInSession.push({
            wrong: currentQuestion.wrong,
            userSentence: userSentence || '(미완성)',
            correct: correctSentence
        });

        if (hearts <= 0) {
            alert('💔 하트를 모두 소모하였습니다!');
            endSurvivalGame(onGameOverCallback);
        } else {
            // 현재 문제를 다시 올바르게 풀도록 블록 리셋 후 유지!
            alert(`❌ 잘못된 조립입니다! 하트 1개가 차감되었습니다. (남은 하트: ${hearts}개)\n올바른 정답 문장으로 다시 조립해 보세요!`);
            resetAssembledSlots();
        }
    }
}

function endSurvivalGame(onGameOverCallback) {
    if (timerInterval) clearInterval(timerInterval);

    const curr = getCurrentUserSession();
    const entry = {
        name: curr ? curr.name : '탐험가',
        classTitle: curr ? `${curr.grade}학년 ${curr.classNum}반` : '학급',
        score: currentScoreCount,
        title: '🛡️ 반말 몬스터 던전 수호자',
        date: new Date().toLocaleDateString('ko-KR')
    };

    saveLeaderboardScore(entry);

    const modal = document.getElementById('modal-survival-gameover');
    const wrongList = document.getElementById('so-wrong-list');
    document.getElementById('so-correct-count').textContent = currentScoreCount;

    if (wrongList) {
        wrongList.innerHTML = '';
        if (wrongLogsInSession.length === 0) {
            wrongList.innerHTML = '<p>🎉 틀린 문제 없이 완벽하게 정복하였습니다!</p>';
        } else {
            wrongLogsInSession.forEach(log => {
                const item = document.createElement('div');
                item.className = 'wrong-log-item';
                item.style.cssText = 'background:#1a102b; padding:8px; border-radius:4px; margin-bottom:6px; font-size:0.85rem;';
                item.innerHTML = `
                    <p style="color:#ef476f;">👾 반말 공격: "${log.wrong}"</p>
                    <p style="color:#ffd166;">❌ 나의 조립: "${log.userSentence}"</p>
                    <p style="color:#06d6a0;">✅ 올바른 정답: "${log.correct}"</p>
                `;
                wrongList.appendChild(item);
            });
        }
    }

    if (modal) modal.classList.remove('hidden');

    const btnClose = document.getElementById('btn-close-survival-modal');
    if (btnClose) {
        btnClose.onclick = () => {
            modal.classList.add('hidden');
            onGameOverCallback();
        };
    }
}
