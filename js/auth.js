/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 철통 100% 화면 전환 & 클릭 관통 인증 (auth.js)
   ========================================================================== */

import { 
    getCurrentUserSession, 
    saveUserSession, 
    clearUserSession, 
    registerTeacherPending, 
    loginOrRegisterStudent,
    validateClassCode,
    getAllTeachers
} from './firebase-config.js';

let onLoginSuccessCallback = null;

export function switchScreenView(viewId) {
    // 숨겨진 모든 모달 팝업 가리기
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.classList.add('hidden');
        m.style.display = 'none';
    });

    const screens = document.querySelectorAll('.view-screen');
    screens.forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
        target.style.display = 'block';
    }

    const gnb = document.getElementById('gnb');
    if (gnb) {
        if (viewId === 'view-login') {
            gnb.classList.add('hidden');
            gnb.style.display = 'none';
        } else {
            gnb.classList.remove('hidden');
            gnb.style.display = 'flex';
        }
    }
}

window.selectLoginRole = function(role) {
    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const boxTeacher = document.getElementById('box-teacher-login');

    if (role === 'teacher') {
        if (tabTeacher) tabTeacher.classList.add('active');
        if (tabStudent) tabStudent.classList.remove('active');
        if (formStudent) { formStudent.classList.add('hidden'); formStudent.style.display = 'none'; }
        if (boxTeacher) { boxTeacher.classList.remove('hidden'); boxTeacher.style.display = 'block'; }
    } else {
        if (tabStudent) tabStudent.classList.add('active');
        if (tabTeacher) tabTeacher.classList.remove('active');
        if (formStudent) { formStudent.classList.remove('hidden'); formStudent.style.display = 'block'; }
        if (boxTeacher) { boxTeacher.classList.add('hidden'); boxTeacher.style.display = 'none'; }
    }
};

window.openTeacherCreateModal = function() {
    const modal = document.getElementById('modal-teacher-create-class');
    const input = document.getElementById('new-class-code');
    const msg = document.getElementById('code-duplicate-msg');
    if (input) input.value = '';
    if (msg) { msg.textContent = ''; msg.className = ''; }
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

window.handleRealtimeCodeCheck = async function(inputEl) {
    const code = inputEl.value.trim().replace(/[^0-9]/g, '');
    inputEl.value = code;
    const msgEl = document.getElementById('code-duplicate-msg');
    const submitBtn = document.getElementById('btn-submit-create-class');

    if (!msgEl) return;

    if (code.length < 6) {
        msgEl.textContent = "숫자 6자리를 모두 입력해 주세요. (예: 363636)";
        msgEl.style.color = "#ff9f1c";
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    const isUsed = await validateClassCode(code);
    if (isUsed) {
        msgEl.textContent = `⚠️ 이미 사용 중인 6자리 클래스 코드입니다.`;
        msgEl.style.color = "#ef476f";
        if (submitBtn) submitBtn.disabled = true;
    } else {
        msgEl.textContent = `✅ 사용 가능한 6자리 클래스 코드입니다!`;
        msgEl.style.color = "#06d6a0";
        if (submitBtn) submitBtn.disabled = false;
    }
};

window.handleStudentLoginSubmit = async function(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const classCodeInput = document.getElementById('student-class-code');
    const classCode = classCodeInput ? classCodeInput.value.trim().replace(/[^0-9]/g, '') : '';
    const grade = document.getElementById('student-grade').value;
    const classNum = document.getElementById('student-class-num').value;
    const nameInput = document.getElementById('student-name');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!classCode || classCode.length !== 6) {
        alert('⚠️ 학급 초대 코드는 숫자 6자리로 입력해 주세요. (예: 363636)');
        return false;
    }

    if (!name || name.length < 2) {
        alert('⚠️ 학생 이름은 실명으로 2자 이상 입력해 주세요.');
        return false;
    }

    const teachers = await getAllTeachers();
    const matchedTeacher = teachers.find(t => 
        t.classCode === classCode && 
        t.grade.toString() === grade.toString() && 
        t.classNum.toString() === classNum.toString()
    );

    const isDefaultDemoMatch = (classCode === '363636' || classCode === '123456') && grade === '3' && classNum === '1';

    if (!matchedTeacher && !isDefaultDemoMatch) {
        alert(`⚠️ 입력하신 [ ${grade}학년 ${classNum}반 ] 과 6자리 학급 초대 코드 [ ${classCode} ] 가 일치하는 클래스를 찾을 수 없습니다.\n선생님께 정확한 학년, 반, 학급 코드를 확인해 주세요.`);
        return false;
    }

    const studentData = await loginOrRegisterStudent({
        classCode,
        grade,
        classNum,
        name
    });

    alert(`🎉 ${name} 탐험가님 환영합니다! (${grade}학년 ${classNum}반)`);
    switchScreenView('view-lobby');
    if (onLoginSuccessCallback) onLoginSuccessCallback(studentData);
    return false;
};

window.handleTeacherDirectLogin = async function(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const codeInput = document.getElementById('teacher-code-login');
    const code = codeInput ? codeInput.value.trim().replace(/[^0-9]/g, '') : '';

    if (!code || code.length !== 6) {
        alert('⚠️ 교사 학급 코드는 숫자 6자리로 입력해 주세요. (예: 363636)');
        return false;
    }

    const teachers = await getAllTeachers();
    const foundTeacher = teachers.find(t => t.classCode === code);

    if (foundTeacher) {
        foundTeacher.role = 'teacher';
        saveUserSession(foundTeacher);
        alert(`✨ ${foundTeacher.name || '선생님'} 환영합니다!\n[ ${foundTeacher.className} (코드: ${code}) ] 학급 모험 및 학생 관리를 시작합니다.`);
        switchScreenView('view-lobby');
        if (onLoginSuccessCallback) onLoginSuccessCallback(foundTeacher);
        return false;
    }

    if (code === '363636' || code === '123456') {
        const defaultTeacher = {
            uid: 'teacher_' + code,
            name: '선생님',
            className: '3학년 긍정열정반',
            classCode: code,
            grade: '3',
            classNum: '1',
            role: 'teacher'
        };
        saveUserSession(defaultTeacher);
        alert(`✨ 학급 모험 및 관리를 시작합니다.`);
        switchScreenView('view-lobby');
        if (onLoginSuccessCallback) onLoginSuccessCallback(defaultTeacher);
        return false;
    }

    alert(`⚠️ 등록되지 않은 6자리 학급 코드 [ ${code} ] 입니다.\n[신규 클래스 생성하기] 버튼을 눌러 새 학급을 개설해 주세요.`);
    return false;
};

window.handleTeacherCreateSubmit = async function(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    const newCodeInput = document.getElementById('new-class-code');
    const newCode = newCodeInput ? newCodeInput.value.trim().replace(/[^0-9]/g, '') : '';
    const grade = document.getElementById('new-teacher-grade').value;
    const classNum = document.getElementById('new-teacher-class-num').value;
    const classNameInput = document.getElementById('new-class-name');
    const className = classNameInput ? classNameInput.value.trim() : '3학년 긍정열정반';

    if (!newCode || newCode.length !== 6) {
        alert('⚠️ 희망 학급 코드는 숫자 6자리로 입력해 주세요. (예: 363636)');
        return false;
    }

    const isAlreadyUsed = await validateClassCode(newCode);
    if (isAlreadyUsed) {
        alert(`⚠️ 이미 사용 중인 6자리 클래스 코드 [ ${newCode} ] 입니다.\n다른 6자리 숫자를 입력해 주세요.`);
        return false;
    }

    const teacherData = {
        uid: 'teacher_' + Date.now(),
        name: `${grade}학년 ${classNum}반 선생님`,
        grade,
        classNum,
        className,
        classCode: newCode,
        role: 'teacher',
        createdAt: new Date().toISOString()
    };

    await registerTeacherPending(teacherData);
    saveUserSession(teacherData);

    const modal = document.getElementById('modal-teacher-create-class');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }

    alert(`✨ 신규 클래스 생성 완료!\n선생님의 6자리 학급 코드: [ ${newCode} ] (${grade}학년 ${classNum}반)\n학생들에게 알려주세요! 게임 로비로 진입합니다.`);
    switchScreenView('view-lobby');
    if (onLoginSuccessCallback) onLoginSuccessCallback(teacherData);
    return false;
};

export function initAuthSystem(callbacks) {
    onLoginSuccessCallback = callbacks.onUserLoginSuccess;
    const onLogout = callbacks.onLogout;

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm("🎮 게임을 종료하고 접속 화면으로 돌아가시겠습니까?")) {
                clearUserSession();
                switchScreenView('view-login');
                if (onLogout) onLogout();
            }
        };
    }

    const activeSession = getCurrentUserSession();
    if (activeSession) {
        switchScreenView('view-lobby');
        if (onLoginSuccessCallback) onLoginSuccessCallback(activeSession);
    }
}
