/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 50개 배지, 5개 월드 순차 해금 및 레틀/칭호 (badge-system.js)
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
        bDiv.className = `badge-item-mini ${isEarned ? 'earned' : ''}`;
        bDiv.title = `${b.name}: ${b.desc}`;
        bDiv.innerHTML = `<div class="b-icon">${isEarned ? b.icon : '🔒'}</div>`;
        badgeGrid.appendChild(bDiv);
    });

    if (badgeCountSpan) {
        badgeCountSpan.textContent = count;
    }

    return calculateTitle(count);
}

// 3번: 각 월드당 10개 배지 수집 시 순차적 다음 월드 해금!
export function updateWorldBadgeStatus(earnedBadgesArray = []) {
    const earnedSet = new Set(earnedBadgesArray);

    // 각 월드별 획득 배지 수 계산
    const worldBadgeCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    earnedBadgesArray.forEach(badgeId => {
        if (BADGES[badgeId]) {
            const wId = BADGES[badgeId].worldId;
            if (worldBadgeCounts[wId] !== undefined) {
                worldBadgeCounts[wId]++;
            }
        }
    });

    for (let w = 1; w <= 5; w++) {
        const count = worldBadgeCounts[w];
        const statusTag = document.getElementById(`wb-${w}`);
        const cardEl = document.getElementById(`wcard-${w}`) || document.querySelector(`[data-world="${w}"]`);

        if (statusTag) {
            statusTag.textContent = `${count}/10`;
        }

        // 월드 1은 기본 해금, 월드 2~5는 이전 월드 배지 10개 필요
        let isUnlocked = false;
        if (w === 1) isUnlocked = true;
        else {
            isUnlocked = (worldBadgeCounts[w - 1] >= 10);
        }

        if (cardEl) {
            const enterBtn = cardEl.querySelector('.btn-enter-world');
            if (isUnlocked) {
                cardEl.classList.remove('locked');
                if (enterBtn) {
                    enterBtn.disabled = false;
                    enterBtn.textContent = '입장하기 ➔';
                }
            } else {
                cardEl.classList.add('locked');
                if (enterBtn) {
                    enterBtn.disabled = true;
                    enterBtn.textContent = `🔒 월드 ${w-1} 배지 10개 필요`;
                }
            }
        }
    }

    // 9번: 차원 대통합 카드 (월드 5 카드 오른쪽 6번째) 50개 모았을 때 해금
    const totalCount = Object.values(worldBadgeCounts).reduce((a, b) => a + b, 0);
    const crossoverCard = document.getElementById('wcard-crossover');
    const btnCrossover = document.getElementById('btn-start-crossover');

    if (crossoverCard && btnCrossover) {
        if (totalCount >= 50) {
            crossoverCard.classList.remove('locked');
            btnCrossover.disabled = false;
            btnCrossover.textContent = '🌀 무한 탐험 입장!';
        } else {
            crossoverCard.classList.add('locked');
            btnCrossover.disabled = true;
            btnCrossover.textContent = `🔒 배지 50개 필요 (${totalCount}/50)`;
        }
    }
}
