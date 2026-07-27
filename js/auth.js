/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 교사/학생 인증 및 탭 클릭 완전 보장 (auth.js)
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

    // 1. 교사 로그인 탭 클릭 시 100% 화면 전환 및 구글 로그인 버튼 노출
    function switchToTeacherTab() {
        tabTeacher.classList.add('active');
        tabStudent.classList.remove('active');

        formStudent.classList.add('hidden');
        formStudent.style.display = 'none';

        boxTeacher.classList.remove('hidden');
        boxTeacher.style.display = 'block';

        btnGoogleLogin.classList.remove('hidden');
        btnGoogleLogin.style.display = 'block';

        formTeacherRegister.classList.add('hidden');
        formTeacherRegister.style.display = 'none';
    }

    function switchToStudentTab() {
        tabStudent.classList.add('active');
        tabTeacher.classList.remove('active');

        formStudent.classList.remove('hidden');
        formStudent.style.display = 'block';

        boxTeacher.classList.add('hidden');
        boxTeacher.style.display = 'none';
    }

    if (tabTeacher) {
        tabTeacher.onclick = switchToTeacherTab;
    }

    if (tabStudent) {
        tabStudent.onclick = switchToStudentTab;
    }

    // 2. 학생 로그인
    if (formStudent) {
        formStudent.onsubmit = async (e) => {
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
                alert(`⚠️ 선생님께 다시 여쭤보세요!\n입력하신 학급 초대 코드 (${classCode})가 존재하지 않거나 잘못되었습니다.`);
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
        };
    }

    // 3. 구글 로그인 버튼 클릭 ➔ 100% 구글 팝업 또는 이메일 입력
    if (btnGoogleLogin) {
        btnGoogleLogin.onclick = async (e) => {
            e.preventDefault();
            let email = "";
            let displayName = "";

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

            // 구글 로그인 성공 ➔ 즉시 학급 생성 폼으로 전환!
            btnGoogleLogin.style.display = 'none';
            formTeacherRegister.classList.remove('hidden');
            formTeacherRegister.style.display = 'block';

            formTeacherRegister.onsubmit = async (evt) => {
                evt.preventDefault();
                const grade = document.getElementById('teacher-grade').value;
                const classNum = document.getElementById('teacher-class-num').value;
                const className = document.getElementById('teacher-class-name').value.trim() || '3학년 긍정열정반';

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
                alert(`✨ 학급 생성 완료!\n학생 접속용 학급 초대 코드: ${classCode}\n선생님의 교사 대시보드로 입장합니다.`);
                onUserLoginSuccess(teacherData);
            };
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
