/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 교사 대시보드 & 커스텀 퀘스트 실시간 반영 (teacher-dashboard.js)
   ========================================================================== */

import { getStudentsByClassCode, getCurrentUserSession } from './firebase-config.js';

export async function initTeacherDashboard() {
    const user = getCurrentUserSession();
    const classCode = (user && user.classCode) ? user.classCode : '363636';

    const dashTitle = document.getElementById('dash-class-title');
    const dashCode = document.getElementById('dash-code-num');
    if (dashTitle) dashTitle.textContent = user ? user.className : '3학년 긍정열정반';
    if (dashCode) dashCode.textContent = classCode;

    // 대시보드 탭 전환
    const tabs = document.querySelectorAll('.dash-tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.getAttribute('data-dashtab');
            document.querySelectorAll('.dashtab-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`dashtab-${target}`);
            if (panel) panel.classList.add('active');
        };
    });

    // 학생 목록 불러오기
    await loadStudentList(classCode);

    // 8번 요구사항: 커스텀 퀘스트 작성 폼 처리 및 던전에 즉시 반영!
    const formCQ = document.getElementById('form-custom-quest');
    if (formCQ) {
        formCQ.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById('cq-title').value.trim();
            const wrong = document.getElementById('cq-wrong').value.trim();
            const correctStr = document.getElementById('cq-correct').value.trim();

            if (!wrong || !correctStr) {
                alert('⚠️ 공격 반말 문장과 정답 문장을 올바르게 입력해 주세요.');
                return;
            }

            const correctBlocks = correctStr.split(' ').filter(w => w.length > 0);

            const newQuest = {
                title,
                wrong,
                correctBlocks
            };

            const saved = JSON.parse(localStorage.getItem("manner_explorer_custom_quests") || "[]");
            saved.push(newQuest);
            localStorage.setItem("manner_explorer_custom_quests", JSON.stringify(saved));

            alert(`✨ 커스텀 퀘스트 [ ${title} ] 추가 완료!\n선생님이 만든 이 문제가 '반말 몬스터 던전' 문제 풀이에 즉시 출제됩니다.`);
            formCQ.reset();
        };
    }

    // 인쇄/PDF 기능
    const btnPrint = document.getElementById('btn-print-report');
    if (btnPrint) {
        btnPrint.onclick = () => window.print();
    }
}

async function loadStudentList(classCode) {
    const students = await getStudentsByClassCode(classCode);
    const countEl = document.getElementById('dash-student-count');
    const ulList = document.getElementById('student-ul-list');
    
    if (countEl) countEl.textContent = students.length;
    if (!ulList) return;

    ulList.innerHTML = '';
    if (students.length === 0) {
        ulList.innerHTML = '<li style="cursor:default; color:var(--text-muted);">아직 학급에 들어온 학생이 없습니다.</li>';
        return;
    }

    students.forEach((s) => {
        const li = document.createElement('li');
        li.textContent = `${s.name} (${s.grade}학년 ${s.classNum}반)`;
        li.onclick = () => {
            document.querySelectorAll('#student-ul-list li').forEach(l => l.classList.remove('active'));
            li.classList.add('active');
            renderStudentDetail(s);
        };
        ulList.appendChild(li);
    });

    if (students.length > 0) {
        renderStudentDetail(students[0]);
    }
}

function renderStudentDetail(student) {
    const nameEl = document.getElementById('detail-student-name');
    const content = document.getElementById('student-analysis-content');
    if (nameEl) nameEl.textContent = `${student.name} 학생 진단 리포트`;
    if (content) content.classList.remove('hidden');

    const stats = student.errorStats || { OBJECT_HONORIFIC: 0, APJON: 0, SPECIAL_WORD: 0, SUBJECT_OBJECT: 0 };
    document.getElementById('err-object').textContent = `${stats.OBJECT_HONORIFIC || 0}회`;
    document.getElementById('err-apjon').textContent = `${stats.APJON || 0}회`;
    document.getElementById('err-special').textContent = `${stats.SPECIAL_WORD || 0}회`;
    document.getElementById('err-subject').textContent = `${stats.SUBJECT_OBJECT || 0}회`;

    const recreationBox = document.getElementById('student-logs-recreation');
    if (recreationBox) {
        recreationBox.innerHTML = '';
        const logs = student.wrongLogs || [];
        if (logs.length === 0) {
            recreationBox.innerHTML = '<p style="color:#06d6a0;">🎉 오답 이력이 없습니다. 올바른 존댓말을 매우 잘 사용하고 있습니다!</p>';
        } else {
            logs.forEach(l => {
                const item = document.createElement('div');
                item.style.cssText = 'border-bottom:1px solid #2e265c; padding:6px 0;';
                item.innerHTML = `
                    <p style="color:#ffd166;">📌 장소: ${l.location || '퀘스트'} | 학생 선택: "${l.userChoice}"</p>
                    <p style="color:#ef476f;">💡 AI 피드백: ${l.feedback}</p>
                `;
                recreationBox.appendChild(item);
            });
        }
    }
}
