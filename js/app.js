/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 애플리케이션 진입점 & 라우터 컨트롤러 (app.js)
   ========================================================================== */

import { initAuthSystem } from './auth.js';
import { renderBadgeGrid, updateWorldBadgeStatus, calculateTitle } from './badge-system.js';
import { startQuestSession } from './game-quest.js';
import { startSurvivalGame } from './game-survival.js';
import { initTeacherDashboard } from './teacher-dashboard.js';
import { initSuperAdminPage } from './super-admin.js';
import { 
    getLeaderboardRankings, 
    getCurrentUserSession, 
    saveCreatorPrompt, 
    getCreatorPrompt 
} from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌌 존댓말 차원 탐험대 v2.0 가동!");

    function showView(viewId) {
        document.querySelectorAll('.view-screen').forEach(s => s.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) targetView.classList.remove('hidden');

        const gnb = document.getElementById('gnb');
        if (viewId === 'view-login') gnb.classList.add('hidden');
        else gnb.classList.remove('hidden');
    }

    function handleLoginSuccess(user) {
        const userDisplayName = document.getElementById('user-display-name');
        const userTitleDisplay = document.getElementById('user-title-display');
        const lobbyUserName = document.getElementById('lobby-user-name');
        const lobbyUserClass = document.getElementById('lobby-user-class');
        const lobbyUserTitle = document.getElementById('lobby-user-title');

        if (user.isSuperAdmin) {
            showView('view-super-admin');
            initSuperAdminPage();
        } else if (user.role === 'teacher') {
            if (user.status === 'APPROVED') {
                showView('view-teacher-dashboard');
                initTeacherDashboard();
            } else {
                showView('view-login');
                document.getElementById('tab-teacher-login').click();
                document.getElementById('teacher-pending-notice').classList.remove('hidden');
                document.getElementById('form-teacher-register').classList.add('hidden');
            }
        } else {
            const earned = user.earnedBadges || [];
            const title = calculateTitle(earned.length);

            if (userDisplayName) userDisplayName.textContent = `${user.name} (${user.grade}학년 ${user.classNum}반)`;
            if (userTitleDisplay) userTitleDisplay.textContent = title;
            if (lobbyUserName) lobbyUserName.textContent = user.name;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.grade}학년 ${user.classNum}반 (${user.classCode})`;
            if (lobbyUserTitle) lobbyUserTitle.textContent = title;

            renderBadgeGrid(earned);
            updateWorldBadgeStatus(earned);
            showView('view-lobby');
        }
    }

    initAuthSystem({
        onUserLoginSuccess: handleLoginSuccess,
        onLogout: () => showView('view-login')
    });

    // 8번: 레벨/칭호 클릭 시 전체 레벨 및 필요 배지 조건 팝업 표시!
    const btnTitleDisplay = document.getElementById('user-title-display');
    const btnLobbyTitle = document.getElementById('lobby-user-title');
    const modalLevel = document.getElementById('modal-level-guide');
    const btnCloseLevel = document.getElementById('btn-close-level-modal');

    const openLevelModal = () => modalLevel.classList.remove('hidden');
    if (btnTitleDisplay) btnTitleDisplay.onclick = openLevelModal;
    if (btnLobbyTitle) btnLobbyTitle.onclick = openLevelModal;
    if (btnCloseLevel) btnCloseLevel.onclick = () => modalLevel.classList.add('hidden');

    // 5번: 제작자 마스터 모드 (암호 코드: 0106 또는 creator)
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

    // 모드 탭 전환
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
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
        });
    });

    // 5개 월드 카드 클릭 이벤트
    document.querySelectorAll('.world-card').forEach(card => {
        const btn = card.querySelector('.btn-enter-world');
        const worldId = parseInt(card.getAttribute('data-world'));

        if (btn) {
            btn.onclick = () => {
                showView('view-quest');
                startQuestSession(worldId, (newBadges) => {
                    const curr = getCurrentUserSession();
                    if (curr) handleLoginSuccess(curr);
                });
            };
        }
    });

    // [⬅️ 월드 지도로] 버튼
    document.getElementById('btn-exit-quest').onclick = () => {
        if (confirm("🎮 월드 지도로 돌아가시겠습니까?")) {
            showView('view-lobby');
        }
    };

    // 10번: 바른말 수호대 시작 버튼 (홈으로 이탈 콜백 연동)
    document.getElementById('btn-start-survival').onclick = () => {
        showView('view-survival');
        startSurvivalGame(
            () => {
                showView('view-lobby');
                document.querySelector('[data-tab="survival"]').click();
            },
            () => showView('view-lobby') // 🏠 로비로 이탈 콜백
        );
    };

    // 9번: 차원 대통합 무한 모드 (6번째 카드)
    const btnCrossover = document.getElementById('btn-start-crossover');
    if (btnCrossover) {
        btnCrossover.onclick = () => {
            showView('view-quest');
            startQuestSession(Math.floor(1 + Math.random() * 5), () => {
                showView('view-lobby');
            });
        };
    }

    // 12번: 서바이벌 탭 내 명예의 전당 렌더링
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

    // 13번: AI 맞춤 오답노트 탭 렌더링
    function renderAINotesTab() {
        const container = document.getElementById('ai-notes-container');
        if (!container) return;

        const curr = getCurrentUserSession();
        const stats = (curr && curr.errorStats) ? curr.errorStats : { OBJECT_HONORIFIC: 1, APJON: 1, SPECIAL_WORD: 1, SUBJECT_OBJECT: 1 };

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
