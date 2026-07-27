/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 메인 앱 컨트롤러 & 100% 이벤트/화면 보장 (app.js)
   ========================================================================== */

import { initAuthSystem, switchScreenView } from './auth.js';
import { renderBadgeGrid, updateWorldBadgeStatus, calculateTitle } from './badge-system.js';
import { startQuestSession } from './game-quest.js';
import { startSurvivalGame } from './game-survival.js';
import { initTeacherDashboard } from './teacher-dashboard.js';
import { 
    getLeaderboardRankings, 
    getCurrentUserSession, 
    saveCreatorPrompt, 
    getCreatorPrompt 
} from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌌 존댓말 차원 탐험대 v2.0 가동!");

    function handleLoginSuccess(user) {
        const userDisplayName = document.getElementById('user-display-name');
        const userTitleDisplay = document.getElementById('user-title-display');
        const lobbyUserName = document.getElementById('lobby-user-name');
        const lobbyUserClass = document.getElementById('lobby-user-class');
        const lobbyUserTitle = document.getElementById('lobby-user-title');
        const btnTeacherManage = document.getElementById('btn-teacher-manage');
        const dashClassTitle = document.getElementById('dash-class-title');
        const dashCodeNum = document.getElementById('dash-code-num');

        const classCode = user.classCode || '363636';

        if (user.role === 'teacher') {
            // 교사도 동일한 게임 로비로 입장!
            if (btnTeacherManage) btnTeacherManage.classList.remove('hidden');
            if (userDisplayName) userDisplayName.textContent = `${user.name || '선생님'} (교사)`;
            if (lobbyUserName) lobbyUserName.textContent = `${user.name || '선생님'}`;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.className || '학급'} (코드: ${classCode})`;
            if (dashClassTitle) dashClassTitle.textContent = `${user.className || '우리 반'}`;
            if (dashCodeNum) dashCodeNum.textContent = classCode;

            switchScreenView('view-lobby');
        } else {
            // 학생 로그인
            if (btnTeacherManage) btnTeacherManage.classList.add('hidden');
            const earned = user.earnedBadges || [];
            const title = calculateTitle(earned.length);

            if (userDisplayName) userDisplayName.textContent = `${user.name} (${user.grade}학년 ${user.classNum}반)`;
            if (userTitleDisplay) userTitleDisplay.textContent = title;
            if (lobbyUserName) lobbyUserName.textContent = user.name;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.grade}학년 ${user.classNum}반 (코드: ${classCode})`;
            if (lobbyUserTitle) lobbyUserTitle.textContent = title;

            renderBadgeGrid(earned);
            updateWorldBadgeStatus(earned);
            switchScreenView('view-lobby');
        }
    }

    // 인증 시스템 초기화 및 자동 로그인
    initAuthSystem({
        onUserLoginSuccess: handleLoginSuccess,
        onLogout: () => switchScreenView('view-login')
    });

    // [👩‍🏫 학생 관리] 버튼 클릭 시 교사 대시보드 팝업/화면 노출
    const btnTeacherManage = document.getElementById('btn-teacher-manage');
    if (btnTeacherManage) {
        btnTeacherManage.onclick = () => {
            switchScreenView('view-teacher-dashboard');
            initTeacherDashboard();
        };
    }

    // 교사 대시보드내 [🏠 게임 로비로 돌아가기] 버튼
    const btnCloseDashView = document.getElementById('btn-close-dash-view');
    if (btnCloseDashView) {
        btnCloseDashView.onclick = () => {
            switchScreenView('view-lobby');
        };
    }

    // 레벨/칭호 가이드 팝업
    const btnTitleDisplay = document.getElementById('user-title-display');
    const btnLobbyTitle = document.getElementById('lobby-user-title');
    const modalLevel = document.getElementById('modal-level-guide');
    const btnCloseLevel = document.getElementById('btn-close-level-modal');

    const openLevelModal = () => { if (modalLevel) modalLevel.classList.remove('hidden'); };
    if (btnTitleDisplay) btnTitleDisplay.onclick = openLevelModal;
    if (btnLobbyTitle) btnLobbyTitle.onclick = openLevelModal;
    if (btnCloseLevel) btnCloseLevel.onclick = () => modalLevel.classList.add('hidden');

    // 제작자 마스터 모드 (암호: 0106)
    const btnCreatorMode = document.getElementById('btn-creator-mode');
    const modalCreator = document.getElementById('modal-creator-master');
    const btnCloseCreator = document.getElementById('btn-close-creator-modal');
    const btnSaveCreator = document.getElementById('btn-save-creator-data');
    const creatorWorldSelect = document.getElementById('creator-target-world');
    const creatorPromptText = document.getElementById('creator-prompt-template');

    if (btnCreatorMode) {
        btnCreatorMode.onclick = () => {
            const code = prompt("🛠️ 제작자 마스터 암호 코드를 입력하세요:");
            if (code === '0106' || code === 'creator' || code === 'keris') {
                modalCreator.classList.remove('hidden');
                creatorPromptText.value = getCreatorPrompt(creatorWorldSelect.value);
            } else if (code !== null) {
                alert("❌ 제작자 암호 코드가 올바르지 않습니다.");
            }
        };
    }

    if (creatorWorldSelect) {
        creatorWorldSelect.onchange = () => {
            creatorPromptText.value = getCreatorPrompt(creatorWorldSelect.value);
        };
    }

    if (btnSaveCreator) {
        btnSaveCreator.onclick = () => {
            const wId = creatorWorldSelect.value;
            const text = creatorPromptText.value;
            saveCreatorPrompt(wId, text);
            alert(`💾 ${wId}월드의 표준 교과 프롬프트 템플릿이 저장되고 AI에 반영되었습니다!`);
            modalCreator.classList.add('hidden');
        };
    }
    if (btnCloseCreator) btnCloseCreator.onclick = () => modalCreator.classList.add('hidden');

    // 모드 탭 전환 (스토리, 서바이벌, AI 오답노트)
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        tab.onclick = () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabTarget = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            const activePanel = document.getElementById(`tab-content-${tabTarget}`);
            if (activePanel) activePanel.classList.remove('hidden');

            if (tabTarget === 'survival') {
                renderSurvivalHallRankings();
            } else if (tabTarget === 'ai-notes') {
                renderAINotesTab();
            }
        };
    });

    // 월드 카드 5개 및 세부 장소 진입 클릭 바인딩
    document.querySelectorAll('.world-card').forEach(card => {
        const btn = card.querySelector('.btn-enter-world');
        const worldId = parseInt(card.getAttribute('data-world'));

        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (card.classList.contains('locked')) {
                    alert('🔒 이전 월드의 10개 배지를 모두 모아야 다음 월드가 해금됩니다!');
                    return;
                }
                switchScreenView('view-quest');
                startQuestSession(worldId, (newBadges) => {
                    const curr = getCurrentUserSession();
                    if (curr) handleLoginSuccess(curr);
                });
            };
        }
    });

    // [⬅️ 월드 지도로] 버튼
    const btnExitQuest = document.getElementById('btn-exit-quest');
    if (btnExitQuest) {
        btnExitQuest.onclick = () => {
            if (confirm("🎮 월드 지도로 돌아가시겠습니까?")) {
                switchScreenView('view-lobby');
            }
        };
    }

    // 바른말 수호대 시작 버튼
    const btnStartSurvival = document.getElementById('btn-start-survival');
    if (btnStartSurvival) {
        btnStartSurvival.onclick = () => {
            switchScreenView('view-survival');
            startSurvivalGame(
                () => {
                    switchScreenView('view-lobby');
                    const tabSurv = document.querySelector('[data-tab="survival"]');
                    if (tabSurv) tabSurv.click();
                },
                () => switchScreenView('view-lobby')
            );
        };
    }

    // 차원 대통합 무한 모드 (6번째 카드)
    const btnCrossover = document.getElementById('btn-start-crossover');
    if (btnCrossover) {
        btnCrossover.onclick = () => {
            switchScreenView('view-quest');
            startQuestSession(Math.floor(1 + Math.random() * 5), () => {
                switchScreenView('view-lobby');
            });
        };
    }

    // 서바이벌 명예의 전당 렌더링
    function renderSurvivalHallRankings() {
        const tbody = document.getElementById('survival-hall-tbody');
        if (!tbody) return;
        const rankings = getLeaderboardRankings();
        tbody.innerHTML = '';

        if (rankings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">아직 서바이벌 기록이 없습니다. 지금 도전해 보세요!</td></tr>';
            return;
        }

        rankings.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${i + 1}위</strong></td>
                <td>${r.name} (${r.classTitle})</td>
                <td><strong style="color: #06d6a0;">${r.score}문제</strong></td>
                <td>${r.title}</td>
                <td>${r.date}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // AI 맞춤 오답노트 탭 렌더링
    function renderAINotesTab() {
        const container = document.getElementById('ai-notes-container');
        if (!container) return;

        const curr = getCurrentUserSession();
        const stats = (curr && curr.errorStats) ? curr.errorStats : { OBJECT_HONORIFIC: 0, APJON: 0, SPECIAL_WORD: 0, SUBJECT_OBJECT: 0 };

        container.innerHTML = `
            <div class="ai-note-card">
                <h3>🍵 사물 높임 오류 교정 팁</h3>
                <p>누적 감점: <strong>${stats.OBJECT_HONORIFIC || 0}회</strong></p>
                <p>💡 <em>"주사 맞으실게요", "커피 나오셨습니다"</em>는 사물을 높이는 잘못된 표현입니다. 사물에는 높임표현(-시-)을 쓰지 않고 <strong>"주사 맞으세요", "커피 나왔습니다"</strong>라고 해야 완벽합니다!</p>
            </div>
            <div class="ai-note-card">
                <h3>👵 현대 언어 예절 (압존법) 팁</h3>
                <p>누적 감점: <strong>${stats.APJON || 0}회</strong></p>
                <p>💡 현대 국어 예절에서는 교장선생님이나 할아버지 앞이라도 담임선생님이나 아버지를 함부로 낮추지 않습니다. <strong>"아버지께서 오셨습니다"</strong>라고 높여 부르는 것이 정답입니다!</p>
            </div>
            <div class="ai-note-card">
                <h3>🍱 특수 어휘 변환 꿀팁</h3>
                <p>누적 감점: <strong>${stats.SPECIAL_WORD || 0}회</strong></p>
                <p>💡 윗사람께는 <strong>밥 ➔ 진지, 나이 ➔ 연세, 이름 ➔ 성함, 자다 ➔ 주무시다, 집 ➔ 댁</strong>으로 단어를 변환하여 사용하여야 바른 존댓말이 됩니다.</p>
            </div>
            <div class="ai-note-card">
                <h3>👑 주체 & 객체 높임법 팁</h3>
                <p>누적 감점: <strong>${stats.SUBJECT_OBJECT || 0}회</strong></p>
                <p>💡 어른의 행동에는 <strong>'-께서'</strong> 조사를 붙이고, 어른에게 무언가를 드릴 때는 <strong>'-한테'</strong> 대신 <strong>'-께'</strong> 조사를 사용해 보세요!</p>
            </div>
        `;
    }

    const btnSound = document.getElementById('btn-sound-toggle');
    let soundOn = false;
    if (btnSound) {
        btnSound.onclick = () => {
            soundOn = !soundOn;
            btnSound.textContent = soundOn ? '🔊' : '🎵';
            alert(soundOn ? '🔊 모험 배경음악이 켜졌습니다.' : '🔇 모험 배경음악이 꺼졌습니다.');
        };
    }
});
