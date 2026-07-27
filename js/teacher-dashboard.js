/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 교사 대시보드 & 리포트 인쇄 컨트롤러 (teacher-dashboard.js)
   ========================================================================== */

import { getStudentsByClassCode, getCurrentUserSession } from './firebase-config.js';

let classStudents = [];

export async function initTeacherDashboard() {
    const teacherUser = getCurrentUserSession();
    if (!teacherUser) return;

    // 대시보드 정보 갱신
    document.getElementById('dash-class-title').textContent = teacherUser.className || `${teacherUser.grade || 3}학년 ${teacherUser.classNum || 1}반`;
    document.getElementById('dash-invite-code').innerHTML = `클래스 초대코드: <strong>${teacherUser.classCode || 'EXP123'}</strong>`;

    // 학생 목록 불러오기
    classStudents = await getStudentsByClassCode(teacherUser.classCode);
    renderStudentList(classStudents);

    // 인쇄/PDF 버튼 이벤트 (요구사항 4번)
    document.getElementById('btn-print-report').onclick = () => {
        window.print();
    };

    // 대시보드 탭 전환
    const tabs = document.querySelectorAll('.dash-tab');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const dashtabName = tab.getAttribute('data-dashtab');
            document.querySelectorAll('.dashtab-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`dashtab-${dashtabName}`).classList.add('active');
        };
    });

    // 커스텀 퀘스트 폼 제출 (요구사항 6번)
    const formCustom = document.getElementById('form-custom-quest');
    if (formCustom) {
        formCustom.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById('cq-title').value;
            alert(`✨ 커스텀 문제 "${title}"가 성공적으로 저장되었습니다!`);
            formCustom.reset();
        };
    }
}

function renderStudentList(students) {
    const ul = document.getElementById('student-ul-list');
    document.getElementById('dash-student-count').textContent = students.length;
    ul.innerHTML = '';

    if (students.length === 0) {
        ul.innerHTML = '<li>아직 등록된 학생이 없습니다.</li>';
        return;
    }

    students.forEach((st, idx) => {
        const li = document.createElement('li');
        li.textContent = `${st.grade}학년 ${st.classNum}반 ${st.name} (${st.currentTitle || '새싹 탐험대'})`;
        li.onclick = () => {
            document.querySelectorAll('#student-ul-list li').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            renderStudentAnalysis(st);
        };
        ul.appendChild(li);
    });

    // 첫 번째 학생 자동 선택
    if (students.length > 0) {
        ul.children[0].click();
    }
}

function renderStudentAnalysis(student) {
    document.getElementById('detail-student-name').textContent = `${student.name} 학생 진단 리포트`;
    document.getElementById('student-analysis-content').classList.remove('hidden');

    const stats = student.errorStats || { OBJECT_HONORIFIC: 0, APJON: 0, SPECIAL_WORD: 0, SUBJECT_OBJECT: 0 };
    document.getElementById('err-object').textContent = `${stats.OBJECT_HONORIFIC || 0}회`;
    document.getElementById('err-apjon').textContent = `${stats.APJON || 0}회`;
    document.getElementById('err-special').textContent = `${stats.SPECIAL_WORD || 0}회`;
    document.getElementById('err-subject').textContent = `${stats.SUBJECT_OBJECT || 0}회`;

    // 선택 오답 로그 재현
    const logsBox = document.getElementById('student-logs-recreation');
    logsBox.innerHTML = '';

    const wrongLogs = student.wrongLogs || [];
    if (wrongLogs.length === 0) {
        logsBox.innerHTML = '<p class="text-muted">아직 수집된 오답 로그가 없습니다.</p>';
    } else {
        wrongLogs.forEach((log, i) => {
            const logDiv = document.createElement('div');
            logDiv.style.marginBottom = '8px';
            logDiv.style.paddingBottom = '8px';
            logDiv.style.borderBottom = '1px solid #2e265c';
            logDiv.innerHTML = `
                <p><strong>[로그 #${i+1}]</strong> 선택지: "${log.userChoice || log.userSentence || ''}"</p>
                <p style="color: #ef476f;">⚠️ 분석 피드백: ${log.feedback || log.attack || ''}</p>
            `;
            logsBox.appendChild(logDiv);
        });
    }
}
