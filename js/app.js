/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 애플리케이션 진입점 & 라우터 컨트롤러 (app.js)
   ========================================================================== */

import { initAuthSystem } from './auth.js';
import { renderBadgeGrid, updateWorldBadgeStatus, calculateTitle } from './badge-system.js';
import { startQuestSession } from './game-quest.js';
import { startSurvivalGame } from './game-survival.js';
import { initTeacherDashboard } from './teacher-dashboard.js';
import { initSuperAdminPage } from './super-admin.js';
import { getLeaderboardRankings, getCurrentUserSession } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("🌌 존댓말 차원 탐험대 앱이 가동되었습니다!");

    // 1. 화면 전환 라우터 함수
    function showView(viewId) {
        document.querySelectorAll('.view-screen').forEach(s => s.classList.add('hidden'));
        const targetView = document.getElementById(viewId);
        if (targetView) targetView.classList.remove('hidden');

        // GNB 노출 여부
        const gnb = document.getElementById('gnb');
        if (viewId === 'view-login') gnb.classList.add('hidden');
        else gnb.classList.remove('hidden');
    }

    // 2. 로그인 성공 시 라우팅 분기
    function handleLoginSuccess(user) {
        // GNB 사용자 정보 갱신
        const userDisplayName = document.getElementById('user-display-name');
        const userTitleDisplay = document.getElementById('user-title-display');
        const lobbyUserName = document.getElementById('lobby-user-name');
        const lobbyUserClass = document.getElementById('lobby-user-class');
        const lobbyUserTitle = document.getElementById('lobby-user-title');

        if (user.isSuperAdmin) {
            // 최종 관리자 (Super Admin)
            showView('view-super-admin');
            initSuperAdminPage();
        } else if (user.role === 'teacher') {
            if (user.status === 'APPROVED') {
                // 승인된 교사 대시보드
                showView('view-teacher-dashboard');
                initTeacherDashboard();
            } else {
                // 승인 대기 교사
                showView('view-login');
                document.getElementById('tab-teacher-login').click();
                document.getElementById('teacher-pending-notice').classList.remove('hidden');
                document.getElementById('form-teacher-register').classList.add('hidden');
            }
        } else {
            // 학생 탐험대 로비 진입
            const earned = user.earnedBadges || [];
            const title = calculateTitle(earned.length);

            if (userDisplayName) userDisplayName.textContent = `${user.name} (${user.grade}학년 ${user.classNum}반)`;
            if (userTitleDisplay) userTitleDisplay.textContent = title;
            if (lobbyUserName) lobbyUserName.textContent = user.name;
            if (lobbyUserClass) lobbyUserClass.textContent = `${user.grade}학년 ${user.classNum}반 (${user.classCode || '탐험대'})`;
            if (lobbyUserTitle) lobbyUserTitle.textContent = title;

            renderBadgeGrid(earned);
            updateWorldBadgeStatus(earned);
            showView('view-lobby');
        }
    }

    // 3. Auth 인증 시스템 초기화
    initAuthSystem({
        onUserLoginSuccess: handleLoginSuccess,
        onLogout: () => showView('view-login')
    });

    // 4. 로비 모드 탭 전환
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('lock-crossover')) {
                alert('🔒 5개 월드의 마스터 배지를 모두 획득해야 차원 대통합 모드가 해금됩니다!');
                return;
            }

            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabTarget = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            const activePanel = document.getElementById(`tab-content-${tabTarget}`);
            if (activePanel) activePanel.classList.remove('hidden');

            if (tabTarget === 'leaderboard') {
                renderLeaderboard();
            }
        });
    });

    // 5. 5개 월드 카드의 [입장하기] 버튼 이벤트
    document.querySelectorAll('.world-card').forEach(card => {
        const btn = card.querySelector('button');
        const worldId = parseInt(card.getAttribute('data-world'));

        if (btn) {
            btn.onclick = () => {
                showView('view-quest');
                startQuestSession(worldId, (newBadges) => {
                    // 퀘스트 완료 후 로비 복귀
                    const curr = getCurrentUserSession();
                    if (curr) handleLoginSuccess(curr);
                });
            };
        }
    });

    // [퀘스트 나가기] 버튼
    document.getElementById('btn-exit-quest').onclick = () => {
        if (confirm("🎮 진행 중인 퀘스트를 종료하고 월드 지도로 돌아가시겠습니까?")) {
            showView('view-lobby');
        }
    };

    // 6. 바른말 수호대 서바이벌 시작 버튼
    document.getElementById('btn-start-survival').onclick = () => {
        showView('view-survival');
        startSurvivalGame(() => {
            showView('view-lobby');
            document.querySelector('[data-tab="leaderboard"]').click();
        });
    };

    // 7. 차원 대통합 무한 모드 시작 버튼
    document.getElementById('btn-start-crossover').onclick = () => {
        showView('view-quest');
        startQuestSession(Math.floor(1 + Math.random() * 5), () => {
            showView('view-lobby');
        });
    };

    // 8. 명예의 전당 랭킹 렌더링
    function renderLeaderboard() {
        const tbody = document.getElementById('leaderboard-tbody');
        const rankings = getLeaderboardRankings();
        tbody.innerHTML = '';

        if (rankings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">아직 서바이벌 랭킹 기록이 없습니다. 최초로 도전해 보세요!</td></tr>';
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

    // 9. 사운드 토글
    const btnSound = document.getElementById('btn-sound-toggle');
    let soundOn = false;
    btnSound.onclick = () => {
        soundOn = !soundOn;
        btnSound.textContent = soundOn ? '🔊' : '🎵';
        alert(soundOn ? '🔊 모험 배경음악이 켜졌습니다.' : '🔇 모험 배경음악이 꺼졌습니다.');
    };
});
