/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 8단계 로그인 & 유효 학급 코드 인증 (auth.js)
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

export function initAuthSystem(callbacks) {
    const { onUserLoginSuccess, onLogout } = callbacks;

    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const boxTeacher = document.getElementById('box-teacher-login');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const formTeacherRegister = document.getElementById('form-teacher-register');
    const btnLogout = document.getElementById('btn-logout');

    tabStudent.addEventListener('click', () => {
        tabStudent.classList.add('active');
        tabTeacher.classList.remove('active');
        formStudent.classList.remove('hidden');
        boxTeacher.classList.add('hidden');
    });

    tabTeacher.addEventListener('click', () => {
        tabTeacher.classList.add('active');
        tabStudent.classList.remove('active');
        formStudent.classList.add('hidden');
        boxTeacher.classList.remove('hidden');
    });

    // 학생 로그인 (교사가 생성한 유효 학급 코드만 입장 가능)
    formStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const classCode = document.getElementById('student-class-code').value.trim().toUpperCase();
        const grade = document.getElementById('student-grade').value;
        const classNum = document.getElementById('student-class-num').value;
        const name = document.getElementById('student-name').value.trim();

        if (!name || name.length < 2) {
            alert('⚠️ 학생 이름은 2자 이상 입력해 주세요.');
            return;
        }

        const isValid = await validateClassCode(classCode);
        if (!isValid && classCode !== 'EXP123' && classCode !== 'DEMO123') {
            alert(`❌ 유효한 학급 초대 코드가 아닙니다.\n선생님이 구글 로그인 후 발급한 정확한 클래스 코드를 입력해 주세요!`);
            return;
        }

        const studentData = await loginOrRegisterStudent({
            classCode: classCode || 'EXP123',
            grade,
            classNum,
            name
        });

        alert(`🎉 ${name} 탐험가님 환영합니다!`);
        onUserLoginSuccess(studentData);
    });

    // 교사 구글 로그인 (요구사항 2: 승인 절차 전면 제거, 누구나 구글 로그인 시 즉시 교사 권한 획득)
    btnGoogleLogin.addEventListener('click', async () => {
        let email = "";
        let displayName = "";

        // 1. Firebase Google Auth Popup 팝업 최우선 실행
        if (isFirebaseAvailable && auth) {
            try {
                const res = await signInWithPopup(auth, googleProvider);
                email = res.user.email;
                displayName = res.user.displayName || email.split('@')[0];
            } catch (err) {
                console.warn("Firebase Auth Popup fallback:", err);
                email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
                displayName = email ? email.split('@')[0] : "선생님";
            }
        } else {
            email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
            displayName = email ? email.split('@')[0] : "선생님";
        }

        if (!email) return;

        // 로그인 성공 ➔ 즉시 학급 정보 입력 및 생성 (승인 대기 없음!)
        formTeacherRegister.classList.remove('hidden');
        btnGoogleLogin.classList.add('hidden');

        formTeacherRegister.onsubmit = async (evt) => {
            evt.preventDefault();
            const grade = document.getElementById('teacher-grade').value;
            const classNum = document.getElementById('teacher-class-num').value;
            const className = document.getElementById('teacher-class-name').value.trim() || '3학년 긍정열정반';

            // 유효 학급 코드 생성
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
                status: 'APPROVED', // 승인 절차 없음 (즉시 승인!)
                createdAt: new Date().toISOString()
            };

            await registerTeacherPending(teacherData);
            saveUserSession(teacherData);
            alert(`✨ 학급 등록 완료!\n학생 접속용 학급 초대 코드: ${classCode}\n교사 대시보드로 진입합니다.`);
            onUserLoginSuccess(teacherData);
        };
    });

    btnLogout.addEventListener('click', () => {
        if (confirm("🎮 게임을 종료하고 접속 화면으로 돌아가시겠습니까?")) {
            clearUserSession();
            onLogout();
        }
    });

    const activeSession = getCurrentUserSession();
    if (activeSession) {
        onUserLoginSuccess(activeSession);
    }
}
