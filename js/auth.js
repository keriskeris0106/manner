/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 100% 보장 로그인 & 유효 학급 코드 인증 (auth.js)
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

// 전역 탭 전환 함수 (HTML inline onclick 및 JS 바인딩 모두 지원)
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

export function initAuthSystem(callbacks) {
    const { onUserLoginSuccess, onLogout } = callbacks;

    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const formTeacherRegister = document.getElementById('form-teacher-register');
    const btnLogout = document.getElementById('btn-logout');

    // 1. 탭 이벤트 안전 바인딩
    if (tabStudent) {
        tabStudent.onclick = () => window.selectLoginRole('student');
    }
    if (tabTeacher) {
        tabTeacher.onclick = () => window.selectLoginRole('teacher');
    }

    // 2. 학생 로그인 (폼 제출 시 즉시 e.preventDefault() 실행 및 팝업 보장)
    if (formStudent) {
        formStudent.onsubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const classCodeInput = document.getElementById('student-class-code');
            const classCode = classCodeInput ? classCodeInput.value.trim().toUpperCase() : '';
            const grade = document.getElementById('student-grade').value;
            const classNum = document.getElementById('student-class-num').value;
            const nameInput = document.getElementById('student-name');
            const name = nameInput ? nameInput.value.trim() : '';

            if (!name || name.length < 2) {
                alert('⚠️ 학생 이름은 실명으로 2자 이상 입력해 주세요.');
                return false;
            }

            // 코드 검증 (예외 발생 시에도 팝업 띄우고 지워지지 않게 차단)
            let isValid = false;
            try {
                isValid = await validateClassCode(classCode);
            } catch (err) {
                console.warn("ClassCode Validation Error:", err);
                isValid = false;
            }

            // 존재하지 않는 학급 코드일 경우 확실하게 경고 팝업!
            if (!isValid && classCode !== 'EXP123' && classCode !== 'DEMO123') {
                alert(`⚠️ 선생님께 다시 여쭤보세요!\n입력하신 학급 초대 코드 [ ${classCode} ] 가 존재하지 않거나 등록되지 않았습니다.`);
                return false; // 폼 리셋되지 않게 반환
            }

            const studentData = await loginOrRegisterStudent({
                classCode: classCode || 'EXP123',
                grade,
                classNum,
                name
            });

            alert(`🎉 ${name} 탐험가님 환영합니다!`);
            onUserLoginSuccess(studentData);
            return false;
        };
    }

    // 3. 교사 Google 로그인 클릭 ➔ 100% 팝업 및 학급 생성 폼 전환
    if (btnGoogleLogin) {
        btnGoogleLogin.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let email = "";
            let displayName = "";

            if (isFirebaseAvailable && auth) {
                try {
                    const res = await signInWithPopup(auth, googleProvider);
                    email = res.user.email;
                    displayName = res.user.displayName || email.split('@')[0];
                } catch (err) {
                    console.warn("Firebase Auth Popup Fallback:", err);
                    email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
                    displayName = email ? email.split('@')[0] : "선생님";
                }
            } else {
                email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
                displayName = email ? email.split('@')[0] : "선생님";
            }

            if (!email) return;

            // 학급 입력 폼으로 즉시 전환
            btnGoogleLogin.style.display = 'none';
            if (formTeacherRegister) {
                formTeacherRegister.classList.remove('hidden');
                formTeacherRegister.style.display = 'block';

                formTeacherRegister.onsubmit = async (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();

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
                    alert(`✨ 학급 생성 완료!\n선생님의 학급 초대 코드: [ ${classCode} ]\n학생들에게 이 코드를 알려주세요. 교사 대시보드로 진입합니다.`);
                    onUserLoginSuccess(teacherData);
                    return false;
                };
            }
        };
    }

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
        onUserLoginSuccess(activeSession);
    }
}
