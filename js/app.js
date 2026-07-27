/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 1000% 무결점 클릭 보장 컨트롤러 (app.js)
   ========================================================================== */

import { initAuthSystem, switchScreenView } from './auth.js';
import { renderBadgeGrid, updateWorldBadgeStatus, calculateTitle } from './badge-system.js';
import { startQuestSession } from './game-quest.js';
import { startSurvivalGame } from './game-survival.js';
import { initTeacherDashboard } from './teacher-dashboard.js';
import { 
    getLeaderboardRankings, 
    getCurrentUserSession, 
    clearUserSession,
    saveCreatorPrompt, 
    getCreatorPrompt 
} from './firebase-config.js';

// 즉시 100% 전역 핸들러등록 (DOM 준비와 무관하게 무조건 호출 가능)
window.enterWorldQuest = function(worldId) {
    console.log("⚔️ 월드 입장 클릭 실행:", worldId);
    const curr = getCurrentUserSession();
    const earned = (curr && curr.earnedBadges) ? curr.earnedBadges : [];
    
    const card = document.getElementById(`wcard-${worldId}`);
    if (card && card.classList.contains('locked')) {
        alert('🔒 이전 월드의 10개 배지를 모두 100점 만점으로 모아야 다음 월드가 해금됩니다!');
        return;
    }

    switchScreenView('view-quest');
    startQuestSession(worldId, (newBadges) => {
        const activeUser = getCurrentUserSession();
        if (activeUser) {
            renderBadgeGrid(activeUser.earnedBadges || []);
            updateWorldBadgeStatus(activeUser.earnedBadges || []);
        }
    });
};

window.openTeacherManagement = function() {
    switchScreenView('view-teacher-dashboard');
    initTeacherDashboard();
};

window.closeTeacherDashboard = function() {
    switchScreenView('view-lobby');
};

window.switchLobbyTab = function(tabTarget, btnEl) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.add('hidden');
        p.style.display = 'none';
    });
    const activePanel = document.getElementById(`tab-content-${tabTarget}`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
        activePanel.style.display = 'block';
    }

    if (tabTarget === 'survival') {
        renderSurvivalHallRankings();
    } else if (tabTarget === 'ai-notes') {
        renderAINotesTab();
    }
};

window.launchSurvivalGame = function() {
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

window.exitQuestToLobby = function() {
    if (confirm("🎮 월드 지도로 돌아가시겠습니까?")) {
        switchScreenView('view-lobby');
    }
};

window.openLevelGuideModal = function() {
    const modal = document.getElementById('modal-level-guide');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

window.openCreatorMaster = function() {
    const modal = document.getElementById('modal-creator-master');
    const code = prompt("🛠️ 제작자 마스터 암호 코드를 입력하세요:");
    if (code === '0106' || code === 'creator' || code === 'keris') {
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
        const creatorWorldSelect = document.getElementById('creator-target-world');
        const creatorPromptText = document.getElementById('creator-prompt-template');
        if (creatorWorldSelect && creatorPromptText) {
            creatorPromptText.value = getCreatorPrompt(creatorWorldSelect.value);
        }
    } else if (code !== null) {
        alert("❌ 제작자 암호 코드가 올바르지 않습니다.");
    }
};

window.handleAppLogout = function() {
    if (confirm("🎮 게임을 종료하고 접속 화면으로 돌아가시겠습니까?")) {
        clearUserSession();
        switchScreenView('view-login');
    }
};

window.toggleGameSound = function() {
    const btnSound = document.getElementById('btn-sound-toggle');
    const isOn = btnSound ? btnSound.textContent === '🔊' : false;
    if (btnSound) btnSound.textContent = isOn ? '🎵' : '🔊';
    alert(isOn ? '🔇 모험 배경음악이 꺼졌습니다.' : '🔊 모험 배경음악이 켜졌습니다.');
};

function renderSurvivalHallRankings() {
    const tbody = document.getElementById('survival-hall-tbody');
    if (!tbody) return;
    const rankings = getLeaderboardRankings();
    tbody.innerHTML = '';

    if (rankings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">아직 반말 몬스터 던전 기록이 없습니다. 지금 도전해 보세요!</td></tr>';
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌌 DOM 로드 완료 - 로그인 세션 확인!");

    function handleLoginSuccess(user) {
        if (!user) return;

        const userDisplayName = document.getElementById('user-display-name');
        const userTitleDisplay = document.getElementById('user-title-display');
        const lobbyUserName = document.getElementById('lobby-user-name');
        const lobbyUserClass = document.getElementById('lobby-user-class');
        const lobbyUserTitle = document.getElementById('lobby-user-title');
        const btnTeacherManage = document.getElementById('btn-teacher-manage');
        const dashClassTitle = document.getElementById('dash-class-title');
        const dashCodeNum = document.getElementById('dash-code-num');

        const classCode = user.classCode || '363636';
        const earned = user.earnedBadges || [];
        const title = calculateTitle(earned.length);

        if (user.role === 'teacher') {
            if (btnTeacherManage) btnTeacherManage.classList.remove('hidden');
            if (userDisplayName) userDisplayName.textContent = `👩‍🏫 ${user.name || '선생님'} (교사)`;
            if (userTitleDisplay) userTitleDisplay.textContent = '👑 학급 관리자';
            if (lobbyUserName) lobbyUserName.textContent = `👩‍🏫 ${user.name || '선생님'}`;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.className || '학급'} (코드: ${classCode})`;
            if (lobbyUserTitle) lobbyUserTitle.textContent = '👑 학급 관리자';

            if (dashClassTitle) dashClassTitle.textContent = `${user.className || '우리 반'}`;
            if (dashCodeNum) dashCodeNum.textContent = classCode;
        } else {
            if (btnTeacherManage) btnTeacherManage.classList.add('hidden');
            if (userDisplayName) userDisplayName.textContent = `${user.name} (${user.grade}학년 ${user.classNum}반)`;
            if (userTitleDisplay) userTitleDisplay.textContent = title;
            if (lobbyUserName) lobbyUserName.textContent = user.name;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.grade}학년 ${user.classNum}반 (코드: ${classCode})`;
            if (lobbyUserTitle) lobbyUserTitle.textContent = title;
        }

        try {
            renderBadgeGrid(earned);
            updateWorldBadgeStatus(earned);
        } catch (e) {
            console.warn("Badge Render Shield:", e);
        }

        switchScreenView('view-lobby');
    }

    const btnSaveCreator = document.getElementById('btn-save-creator-data');
    if (btnSaveCreator) {
        btnSaveCreator.onclick = () => {
            const creatorWorldSelect = document.getElementById('creator-target-world');
            const creatorPromptText = document.getElementById('creator-prompt-template');
            if (creatorWorldSelect && creatorPromptText) {
                const wId = creatorWorldSelect.value;
                const text = creatorPromptText.value;
                saveCreatorPrompt(wId, text);
                alert(`💾 ${wId}월드의 표준 교과 프롬프트 템플릿이 Firebase DB 및 로컬에 안전하게 저장되었습니다!`);
                const modal = document.getElementById('modal-creator-master');
                if (modal) {
                    modal.classList.add('hidden');
                    modal.style.display = 'none';
                }
            }
        };
    }

    initAuthSystem({
        onUserLoginSuccess: handleLoginSuccess,
        onLogout: () => switchScreenView('view-login')
    });
});
