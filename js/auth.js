/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 6자리 숫자 학급 코드 교사 인증 & 100% 화면 전환 (auth.js)
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

// 직관적 100% 화면 전환 보장 함수
export function switchScreenView(viewId) {
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

// 탭 선택 핸들러
window.selectLoginRole = function(role) {
    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const boxTeacher = document.getElementById('box-teacher-login');

    if (role === 'teacher') {
        if (tabTeacher) tabTeacher.classList.add('active');
        if (tabStudent) tabStudent.classList.remove('active');

        if (formStudent) {
            formStudent.classList.add('hidden');
            formStudent.style.display = 'none';
        }
        if (boxTeacher) {
            boxTeacher.classList.remove('hidden');
            boxTeacher.style.display = 'block';
        }
    } else {
        if (tabStudent) tabStudent.classList.add('active');
        if (tabTeacher) tabTeacher.classList.remove('active');

        if (formStudent) {
            formStudent.classList.remove('hidden');
            formStudent.style.display = 'block';
        }
        if (boxTeacher) {
            boxTeacher.classList.add('hidden');
            boxTeacher.style.display = 'none';
        }
    }
};

// 신규 클래스 생성 모달 열기
window.openTeacherCreateModal = function() {
    const modal = document.getElementById('modal-teacher-create-class');
    if (modal) {
        modal.classList.remove('hidden');
    }
};

// 1. 학생 탐험대 로그인
window.handleStudentLoginSubmit = async function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

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

    let isValid = false;
    try {
        isValid = await validateClassCode(classCode);
    } catch (err) {
        isValid = false;
    }

    if (!isValid && classCode !== '363636' && classCode !== '123456') {
        alert(`⚠️ 선생님께 다시 여쭤보세요!\n입력하신 6자리 학급 초대 코드 [ ${classCode} ] 가 존재하지 않습니다.`);
        return false;
    }

    const studentData = await loginOrRegisterStudent({
        classCode: classCode || '363636',
        grade,
        classNum,
        name
    });

    alert(`🎉 ${name} 탐험가님 환영합니다!`);
    switchScreenView('view-lobby');
    if (onLoginSuccessCallback) onLoginSuccessCallback(studentData);
    return false;
};

// 2. 기존 교사 로그인 (6자리 코드 직접 입력 대시보드 진입)
window.handleTeacherDirectLogin = async function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const codeInput = document.getElementById('teacher-code-login');
    const code = codeInput ? codeInput.value.trim().replace(/[^0-9]/g, '') : '';

    if (!code || code.length !== 6) {
        alert('⚠️ 교사 학급 코드는 숫자 6자리로 입력해 주세요. (예: 363636)');
        return false;
    }

    const teachers = await getAllTeachers();
    const foundTeacher = teachers.find(t => t.classCode === code);

    if (foundTeacher) {
        saveUserSession(foundTeacher);
        alert(`✨ ${foundTeacher.name || '선생님'} 환영합니다!\n[ ${foundTeacher.className} ] 학급 대시보드로 진입합니다.`);
        switchScreenView('view-teacher-dashboard');
        if (onLoginSuccessCallback) onLoginSuccessCallback(foundTeacher);
        return false;
    }

    // 기본 가상 매칭
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
        alert(`✨ 학급 대시보드로 진입합니다.`);
        switchScreenView('view-teacher-dashboard');
        if (onLoginSuccessCallback) onLoginSuccessCallback(defaultTeacher);
        return false;
    }

    alert(`⚠️ 등록되지 않은 6자리 학급 코드 [ ${code} ] 입니다.\n[신규 클래스 생성하기] 버튼을 눌러 새 학급을 개설해 주세요.`);
    return false;
};

// 3. 신규 클래스 생성 (6자리 숫자 코드 중복 체크 포함)
window.handleTeacherCreateSubmit = async function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

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

    // 중복 검사
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
    if (modal) modal.classList.add('hidden');

    alert(`✨ 신규 클래스 생성 완료!\n학급 코드: [ ${newCode} ] (학생 로그인 시 이 6자리 코드를 안내해 주세요)\n선생님의 학급 대시보드로 진입합니다.`);
    switchScreenView('view-teacher-dashboard');
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
        if (activeSession.role === 'teacher') {
            switchScreenView('view-teacher-dashboard');
        } else {
            switchScreenView('view-lobby');
        }
        if (onLoginSuccessCallback) onLoginSuccessCallback(activeSession);
    }
}
