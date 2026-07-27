/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 최종 관리자 (Super Admin) 승인/거절 페이지 (super-admin.js)
   ========================================================================== */

import { getAllTeachers, updateTeacherStatus } from './firebase-config.js';

export async function initSuperAdminPage() {
    const teachers = await getAllTeachers();
    renderTeachersTable(teachers);
}

function renderTeachersTable(teachers) {
    const tbody = document.getElementById('super-admin-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">가입 신청한 교사 계정이 없습니다.</td></tr>';
        return;
    }

    teachers.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.name} (${t.email})</td>
            <td>${t.school || '-'}</td>
            <td>${t.grade || 3}학년 ${t.classNum || 1}반</td>
            <td>${t.className || '기본 클래스'}</td>
            <td><strong style="color: ${t.status === 'APPROVED' ? '#06d6a0' : (t.status === 'REJECTED' ? '#ef476f' : '#ffd166')};">${t.status || 'PENDING'}</strong></td>
            <td>
                ${t.status === 'PENDING' ? `
                    <button class="btn-pixel btn-success btn-sm btn-approve" data-uid="${t.uid}">✅ 승인</button>
                    <button class="btn-pixel btn-danger btn-sm btn-reject" data-uid="${t.uid}">❌ 거절</button>
                ` : '완료됨'}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // 승인/거절 버튼 이벤트
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.onclick = async () => {
            const uid = btn.getAttribute('data-uid');
            await updateTeacherStatus(uid, 'APPROVED');
            alert('✅ 해당 교사의 가입을 승인했습니다.');
            initSuperAdminPage();
        };
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.onclick = async () => {
            const uid = btn.getAttribute('data-uid');
            await updateTeacherStatus(uid, 'REJECTED');
            alert('❌ 해당 교사의 가입을 거절했습니다.');
            initSuperAdminPage();
        };
    });
}
