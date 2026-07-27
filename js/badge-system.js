/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 50개 배지 렌더링 & 상세 설명 팝업 (badge-system.js)
   ========================================================================== */

import { BADGES } from './data.js';

export function renderBadgeGrid(earnedBadgeIds = []) {
    const grid = document.getElementById('badge-grid');
    const countEl = document.getElementById('earned-badge-count');
    if (!grid) return;

    grid.innerHTML = '';
    const earnedSet = new Set(earnedBadgeIds);
    if (countEl) countEl.textContent = earnedSet.size;

    BADGES.forEach((badge) => {
        const isEarned = earnedSet.has(badge.id);
        const item = document.createElement('div');
        item.className = `badge-item-mini ${isEarned ? 'earned' : ''}`;
        item.title = `${badge.name} (클릭 시 예문 보기)`;
        item.innerHTML = `<span class="b-icon">${badge.icon}</span>`;
        
        // 5번 요구사항: 배지 클릭 시 존댓말 예문 및 설명 팝업 모달 노출!
        item.onclick = () => {
            openBadgeDetailModal(badge, isEarned);
        };

        grid.appendChild(item);
    });
}

function openBadgeDetailModal(badge, isEarned) {
    const modal = document.getElementById('modal-badge-detail');
    if (!modal) return;

    document.getElementById('bd-icon').textContent = badge.icon;
    document.getElementById('bd-title').textContent = `${badge.name} ${isEarned ? '🎖️ (획득 완료)' : '🔒 (미획득)'}`;
    document.getElementById('bd-example').textContent = `💬 존댓말 예문: "${badge.description}"`;
    document.getElementById('bd-desc').textContent = isEarned 
        ? `✨ 해당 월드 탐험을 성공하여 이 배지를 획득하셨습니다!`
        : `🔒 이 배지는 해당 세부 장소 탐험을 100점 만점으로 완료하면 해금됩니다.`;

    modal.classList.remove('hidden');

    const btnClose = document.getElementById('btn-close-badge-detail');
    if (btnClose) {
        btnClose.onclick = () => modal.classList.add('hidden');
    }
}

export function updateWorldBadgeStatus(earnedBadgeIds = []) {
    const earnedSet = new Set(earnedBadgeIds);

    for (let w = 1; w <= 5; w++) {
        const worldBadges = BADGES.filter(b => b.worldId === w);
        const count = worldBadges.filter(b => earnedSet.has(b.id)).length;
        
        const wbEl = document.getElementById(`wb-${w}`);
        if (wbEl) wbEl.textContent = `${count}/10`;

        const card = document.getElementById(`wcard-${w}`);
        if (card && w > 1) {
            const prevWorldBadges = BADGES.filter(b => b.worldId === w - 1);
            const prevCount = prevWorldBadges.filter(b => earnedSet.has(b.id)).length;

            if (prevCount >= 10 || count > 0) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
        }
    }
}

export function calculateTitle(earnedCount) {
    if (earnedCount >= 50) return "🌌 차원 대마법사 (Lv.MAX)";
    if (earnedCount >= 40) return "🏫 예의범절 마스터 (Lv.5)";
    if (earnedCount >= 30) return "🩺 미래 언어 의사 (Lv.4)";
    if (earnedCount >= 20) return "🛡️ 동화 수호자 (Lv.3)";
    if (earnedCount >= 10) return "🗡️ 바른말 수호기사 (Lv.2)";
    return "🌱 새싹 탐험대 (Lv.1)";
}
