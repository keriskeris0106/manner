/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 바른말 수호대 어절 서바이벌 컨트롤러 (game-survival.js)
   ========================================================================== */

import { SURVIVAL_PROBLEMS_DB } from './data.js';
import { saveLeaderboardScore, getCurrentUserSession, updateStudentProgress } from './firebase-config.js';

let hearts = 3;
let timerSeconds = 300;
let timerInterval = null;
let correctCount = 0;
let assembledWords = [];
let wrongHistoryList = [];
let currentProblem = null;

export function startSurvivalGame(onGameOverCallback, onHomeClickCallback) {
    hearts = 3;
    timerSeconds = 300;
    correctCount = 0;
    assembledWords = [];
    wrongHistoryList = [];

    // 10번: 🏠 로비로 (홈으로) 버튼 이벤트
    const btnHome = document.getElementById('btn-home-survival');
    if (btnHome) {
        btnHome.onclick = () => {
            if (confirm("🏠 진행 중인 바른말 수호대를 종료하고 로비로 돌아가시겠습니까?")) {
                clearInterval(timerInterval);
                onHomeClickCallback();
            }
        };
    }

    updateHeartsUI();
    startTimer(onGameOverCallback);
    loadRandomProblem(onGameOverCallback);
}

function updateHeartsUI() {
    let hStr = '';
    for (let i = 0; i < hearts; i++) hStr += '❤️';
    for (let i = hearts; i < 3; i++) hStr += '🖤';
    document.getElementById('survival-hearts').textContent = hStr;
    document.getElementById('survival-score-count').textContent = correctCount;
}

function startTimer(onGameOverCallback) {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerSeconds--;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        document.getElementById('survival-timer').textContent = `${mins}:${secs}`;

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            endGame(onGameOverCallback, "⏱️ 5분 제한시간이 종료되었습니다!");
        }
    }, 1000);
}

// 14번: 20개 이상 문장 DB 무작위 랜덤 추출
function loadRandomProblem(onGameOverCallback) {
    assembledWords = [];
    renderAssembledSlots();

    const randomIndex = Math.floor(Math.random() * SURVIVAL_PROBLEMS_DB.length);
    currentProblem = SURVIVAL_PROBLEMS_DB[randomIndex];

    document.getElementById('boss-attack-text').textContent = currentProblem.bossAttack;

    const blocksContainer = document.getElementById('blocks-container');
    blocksContainer.innerHTML = '';

    const shuffledPool = [...currentProblem.pool].sort(() => Math.random() - 0.5);
    shuffledPool.forEach(word => {
        const block = document.createElement('button');
        block.className = 'word-block';
        block.textContent = word;
        block.onclick = () => {
            if (!assembledWords.includes(word)) {
                assembledWords.push(word);
                block.style.opacity = '0.3';
                block.disabled = true;
                renderAssembledSlots();
            }
        };
        blocksContainer.appendChild(block);
    });

    document.getElementById('btn-reset-blocks').onclick = () => {
        assembledWords = [];
        renderAssembledSlots();
        loadRandomProblem(onGameOverCallback);
    };

    document.getElementById('btn-submit-sentence').onclick = () => {
        checkAnswer(currentProblem, onGameOverCallback);
    };
}

function renderAssembledSlots() {
    const slots = document.getElementById('assembled-slots');
    slots.innerHTML = '';
    assembledWords.forEach((w, i) => {
        const slotBlock = document.createElement('div');
        slotBlock.className = 'word-block';
        slotBlock.textContent = w;
        slotBlock.onclick = () => {
            assembledWords.splice(i, 1);
            renderAssembledSlots();
            const blocks = document.querySelectorAll('#blocks-container .word-block');
            blocks.forEach(b => {
                if (b.textContent === w) {
                    b.style.opacity = '1';
                    b.disabled = false;
                }
            });
        };
        slots.appendChild(slotBlock);
    });
}

async function checkAnswer(prob, onGameOverCallback) {
    const userSentence = assembledWords.join(' ');
    // 15번: 마침표가 들어간 하나의 완벽한 올바른 문장
    const correctSentence = prob.correctOrder.join(' ');

    if (userSentence === correctSentence) {
        alert("✨ 정답입니다! 올바른 존댓말 한 문장으로 반말 몬스터를 물리쳤습니다!");
        correctCount++;
        updateHeartsUI();
        loadRandomProblem(onGameOverCallback);
    } else {
        hearts--;
        updateHeartsUI();

        wrongHistoryList.push({
            attack: prob.bossAttack,
            userSentence: userSentence || '(미완성)',
            correctSentence: correctSentence,
            explanation: prob.explanation
        });

        const curr = getCurrentUserSession();
        if (curr && curr.studentId) {
            updateStudentProgress(curr.studentId, [], prob.errCategory, {
                mode: 'SURVIVAL',
                attack: prob.bossAttack,
                userSentence: userSentence,
                correctSentence: correctSentence
            });
        }

        if (hearts <= 0) {
            clearInterval(timerInterval);
            endGame(onGameOverCallback, "💔 하트(목숨)가 모두 소진되었습니다!");
        } else {
            alert(`❌ 틀렸습니다! (하트 -1개)\n원래 자리로 흩어집니다. 정답을 맞힐 때까지 다시 조합해 보세요!`);
            assembledWords = [];
            loadRandomProblem(onGameOverCallback);
        }
    }
}

function endGame(onGameOverCallback, reasonMsg) {
    clearInterval(timerInterval);

    const curr = getCurrentUserSession();
    const name = curr ? curr.name : '익명';
    const classTitle = curr ? `${curr.grade || 3}학년 ${curr.classNum || 1}반` : '자유 탐험대';
    const title = curr ? (curr.currentTitle || '🌱 새싹 탐험대 (Lv.1)') : '🌱 새싹 탐험대 (Lv.1)';

    saveLeaderboardScore({
        name,
        classTitle,
        score: correctCount,
        title,
        date: new Date().toLocaleDateString()
    });

    const modal = document.getElementById('modal-survival-gameover');
    document.getElementById('so-correct-count').textContent = correctCount;

    const wrongListContainer = document.getElementById('so-wrong-list');
    wrongListContainer.innerHTML = '';

    if (wrongHistoryList.length === 0) {
        wrongListContainer.innerHTML = '<p>🎉 틀린 문제 없이 완벽하게 서바이벌을 정복했습니다!</p>';
    } else {
        wrongHistoryList.forEach((w, idx) => {
            const item = document.createElement('div');
            item.className = 'wrong-summary-item';
            item.style.marginBottom = '12px';
            item.style.textAlign = 'left';
            item.innerHTML = `
                <p><strong>[문제 #${idx + 1}] 반말 공격:</strong> ${w.attack}</p>
                <p style="color: #ef476f;">❌ 내가 조합한 문장: ${w.userSentence}</p>
                <p style="color: #06d6a0;">✅ 올바른 마침표 한 문장: ${w.correctSentence}</p>
                <p style="font-size: 0.85rem; color: #ffd166;">💡 존댓말 핵심: ${w.explanation}</p>
                <hr class="pixel-hr">
            `;
            wrongListContainer.appendChild(item);
        });
    }

    modal.classList.remove('hidden');

    document.getElementById('btn-close-survival-modal').onclick = () => {
        modal.classList.add('hidden');
        onGameOverCallback();
    };
}
