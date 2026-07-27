/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 파이어베이스 구글 인증 연동 (Zero Prompt) (auth.js)
   ========================================================================== */

import { 
    getCurrentUserSession, 
    saveUserSession, 
    clearUserSession, 
    registerTeacherPending, 
    loginOrRegisterStudent,
    validateClassCode,
    auth,
    googleProvider,
    signInWithPopup,
    isFirebaseAvailable
} from './firebase-config.js';

let onLoginSuccessCallback = null;

window.selectLoginRole = function(role) {
    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const boxTeacher = document.getElementById('box-teacher-login');
    const btnGoogle = document.getElementById('btn-google-login');
    const formTeacherReg = document.getElementById('form-teacher-register');

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
        if (btnGoogle) {
            btnGoogle.classList.remove('hidden');
            btnGoogle.style.display = 'block';
        }
        if (formTeacherReg) {
            formTeacherReg.classList.add('hidden');
            formTeacherReg.style.display = 'none';
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

window.handleStudentLoginSubmit = async function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const classCodeInput = document.getElementById('student-class-code');
    const classCode = classCodeInput ? classCodeInput.value.trim().toUpperCase() : '';
    const gradeEl = document.getElementById('student-grade');
    const grade = gradeEl ? gradeEl.value : '3';
    const classNumEl = document.getElementById('student-class-num');
    const classNum = classNumEl ? classNumEl.value : '1';
    const nameInput = document.getElementById('student-name');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name || name.length < 2) {
        alert('⚠️ 학생 이름은 실명으로 2자 이상 입력해 주세요.');
        return false;
    }

    let isValid = false;
    try {
        isValid = await validateClassCode(classCode);
    } catch (err) {
        console.warn("ClassCode Check Error:", err);
        isValid = false;
    }

    if (!isValid) {
        alert(`⚠️ 선생님께 다시 여쭤보세요!\n입력하신 학급 초대 코드 [ ${classCode} ] 가 존재하지 않거나 등록되지 않았습니다.`);
        return false;
    }

    const studentData = await loginOrRegisterStudent({
        classCode: classCode || 'EXP123',
        grade,
        classNum,
        name
    });

    alert(`🎉 ${name} 탐험가님 환영합니다!`);
    if (onLoginSuccessCallback) onLoginSuccessCallback(studentData);
    return false;
};

// 교사 Google 로그인: 파이어베이스 signInWithPopup 직통 연동 (prompt 문구 100% 없음)
window.handleGoogleLoginClick = async function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    let email = "";
    let displayName = "";

    // 100% 파이어베이스 Google Auth 팝업 실행
    if (isFirebaseAvailable && auth && googleProvider) {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            email = res.user.email;
            displayName = res.user.displayName || email.split('@')[0];
        } catch (err) {
            console.error("Firebase Google Auth Error:", err);
            alert(`⚠️ 파이어베이스 구글 로그인 인증 오류:\n${err.message || '팝업 창이 차단되었거나 Firebase 설정이 확인되지 않았습니다.'}`);
            return false;
        }
    } else {
        alert("⚠️ Vercel의 Firebase 환경 변수(FIREBASE_API_KEY 등)가 아직 세팅되지 않았거나 연동 준비 중입니다.\nVercel 환경변수를 다시 확인해 주세요.");
        return false;
    }

    if (!email) return false;

    // 구글 로그인 성공 시 학급 정보 입력으로 전환
    const btnGoogle = document.getElementById('btn-google-login');
    const formTeacherRegister = document.getElementById('form-teacher-register');

    if (btnGoogle) btnGoogle.style.display = 'none';
    if (formTeacherRegister) {
        formTeacherRegister.classList.remove('hidden');
        formTeacherRegister.style.display = 'block';
    }

    window.handleTeacherRegisterSubmit = async function(evt) {
        if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        }

        const grade = document.getElementById('teacher-grade').value;
        const classNum = document.getElementById('teacher-class-num').value;
        const classNameInput = document.getElementById('teacher-class-name');
        const className = classNameInput ? classNameInput.value.trim() : '3학년 긍정열정반';

        const classCode = `EXP${grade}${classNum}${Math.floor(100 + Math.random() * 900)}`;

        const teacherData = {
            uid: 'teacher_' + Date.now(),
            email: email,
            name: `${displayName} 선생님`,
            grade,
            classNum,
            className,
            classCode,
            role: 'teacher',
            status: 'APPROVED',
            createdAt: new Date().toISOString()
        };

        await registerTeacherPending(teacherData);
        saveUserSession(teacherData);
        alert(`✨ 파이어베이스 구글 로그인 성공!\n선생님의 학급 초대 코드: [ ${classCode} ]\n학생들에게 이 코드를 알려주세요. 교사 대시보드로 진입합니다.`);
        if (onLoginSuccessCallback) onLoginSuccessCallback(teacherData);
        return false;
    };

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
                onLogout();
            }
        };
    }

    const activeSession = getCurrentUserSession();
    if (activeSession) {
        onLoginSuccessCallback(activeSession);
    }
}
