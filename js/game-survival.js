/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 바른말 수호대 (어절 블록 서바이벌) (game-survival.js)
   ========================================================================== */

import { SURVIVAL_PROBLEMS } from './data.js';
import { saveLeaderboardScore, getCurrentUserSession, updateStudentProgress } from './firebase-config.js';

let hearts = 3;
let timerSeconds = 300; // 5분
let timerInterval = null;
let currentProblemIndex = 0;
let correctCount = 0;
let assembledWords = [];
let wrongHistoryList = [];

export function startSurvivalGame(onGameOverCallback) {
    hearts = 3;
    timerSeconds = 300;
    currentProblemIndex = 0;
    correctCount = 0;
    assembledWords = [];
    wrongHistoryList = [];

    updateHeartsUI();
    startTimer(onGameOverCallback);
    loadProblem(currentProblemIndex, onGameOverCallback);
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

function loadProblem(index, onGameOverCallback) {
    assembledWords = [];
    renderAssembledSlots();

    const prob = SURVIVAL_PROBLEMS[index % SURVIVAL_PROBLEMS.length];
    document.getElementById('boss-attack-text').textContent = prob.bossAttack;

    // 흩어진 블록 랜덤 셔플 배치
    const blocksContainer = document.getElementById('blocks-container');
    blocksContainer.innerHTML = '';

    const shuffledPool = [...prob.pool].sort(() => Math.random() - 0.5);
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

    // 리셋 및 제출 버튼 이벤트
    document.getElementById('btn-reset-blocks').onclick = () => {
        assembledWords = [];
        renderAssembledSlots();
        loadProblem(index, onGameOverCallback);
    };

    document.getElementById('btn-submit-sentence').onclick = () => {
        checkAnswer(prob, onGameOverCallback);
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
            // 해당 블록 활성화 복구
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
    const correctSentence = prob.correctOrder.join(' ');

    if (userSentence === correctSentence) {
        alert("✨ 정답입니다! 반말 몬스터를 물리쳤습니다!");
        correctCount++;
        currentProblemIndex++;
        updateHeartsUI();
        loadProblem(currentProblemIndex, onGameOverCallback);
    } else {
        // 오답 처리
        hearts--;
        updateHeartsUI();

        // 오답 기록
        wrongHistoryList.push({
            attack: prob.bossAttack,
            userSentence: userSentence || '(미완성)',
            correctSentence: correctSentence,
            explanation: prob.explanation
        });

        // DB 오답 누적
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
            endGame(onGameOverCallback, "💔 목숨이 모두 소진되었습니다!");
        } else {
            alert(`❌ 틀렸습니다! (하트 -1개)\n원래 위치로 흩어집니다. 정답을 맞힐 때까지 다시 시도해 주세요!`);
            assembledWords = [];
            loadProblem(currentProblemIndex, onGameOverCallback);
        }
    }
}

function endGame(onGameOverCallback, reasonMsg) {
    clearInterval(timerInterval);

    // 랭킹 저장
    const curr = getCurrentUserSession();
    const name = curr ? curr.name : '익명';
    const classTitle = curr ? `${curr.grade || 3}학년 ${curr.classNum || 1}반` : '자유 탐험대';
    const title = curr ? (curr.currentTitle || '🌱 새싹 탐험대') : '🌱 새싹 탐험대';

    saveLeaderboardScore({
        name,
        classTitle,
        score: correctCount,
        title,
        date: new Date().toLocaleDateString()
    });

    // 요구사항 3번: 게임 오버 시 틀렸던 문제 팝업 노출!
    const modal = document.getElementById('modal-survival-gameover');
    document.getElementById('so-correct-count').textContent = correctCount;

    const wrongListContainer = document.getElementById('so-wrong-list');
    wrongListContainer.innerHTML = '';

    if (wrongHistoryList.length === 0) {
        wrongListContainer.innerHTML = '<p>🎉 틀린 문제 없이 완벽하게 완료하셨습니다!</p>';
    } else {
        wrongHistoryList.forEach((w, idx) => {
            const item = document.createElement('div');
            item.className = 'wrong-summary-item';
            item.style.marginBottom = '12px';
            item.style.textAlign = 'left';
            item.innerHTML = `
                <p><strong>${idx + 1}. 공격 문장:</strong> ${w.attack}</p>
                <p style="color: #ef476f;">❌ 제출한 문장: ${w.userSentence}</p>
                <p style="color: #06d6a0;">✅ 올바른 정답: ${w.correctSentence}</p>
                <p style="font-size: 0.85rem; color: #ffd166;">💡 교정 핵심: ${w.explanation}</p>
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
