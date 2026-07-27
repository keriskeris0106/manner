/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 배지 수집 & 칭호 부여 시스템 (badge-system.js)
   ========================================================================== */

import { BADGES, TITLES } from './data.js';

export function calculateTitle(earnedBadgeCount) {
    let currentTitle = TITLES[0].title;
    for (let t of TITLES) {
        if (earnedBadgeCount >= t.minBadges) {
            currentTitle = t.title;
        }
    }
    return currentTitle;
}

export function renderBadgeGrid(earnedBadgesArray = []) {
    const badgeGrid = document.getElementById('badge-grid');
    const badgeCountSpan = document.getElementById('earned-badge-count');
    if (!badgeGrid) return;

    badgeGrid.innerHTML = '';
    const earnedSet = new Set(earnedBadgesArray);
    let count = 0;

    Object.values(BADGES).forEach(b => {
        const isEarned = earnedSet.has(b.id);
        if (isEarned) count++;

        const bDiv = document.createElement('div');
        bDiv.className = `badge-item ${isEarned ? 'earned' : ''}`;
        bDiv.title = `${b.name}: ${b.desc}`;
        bDiv.innerHTML = `
            <div class="b-icon">${b.icon}</div>
            <span class="b-name">${b.name}</span>
        `;
        badgeGrid.appendChild(bDiv);
    });

    if (badgeCountSpan) {
        badgeCountSpan.textContent = count;
    }

    return calculateTitle(count);
}

export function updateWorldBadgeStatus(earnedBadgesArray = []) {
    const earnedSet = new Set(earnedBadgesArray);
    for (let i = 1; i <= 5; i++) {
        const wbTag = document.getElementById(`wb-${i}`);
        if (wbTag) {
            if (earnedSet.has(`MASTER_${i}`)) {
                wbTag.textContent = '🏆 마스터';
                wbTag.classList.add('mastered');
            } else {
                wbTag.textContent = '미획득';
                wbTag.classList.remove('mastered');
            }
        }
    }

    // 5개 마스터 배지 모두 획득 시 차원 대통합 해금
    const masterCount = [1,2,3,4,5].filter(num => earnedSet.has(`MASTER_${num}`)).length;
    const tabCrossover = document.getElementById('tab-crossover');
    if (tabCrossover) {
        if (masterCount >= 5) {
            tabCrossover.classList.remove('lock-crossover');
            tabCrossover.innerHTML = '🌌 차원 대통합 (해금!)';
            tabCrossover.title = '무한 조합 모드에 도전하세요!';
        }
    }
}
