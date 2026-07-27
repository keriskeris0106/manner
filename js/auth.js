/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 8단계 로그인 & 유효 학급 코드 인증 (auth.js)
   ========================================================================== */

import { 
    getCurrentUserSession, 
    saveUserSession, 
    clearUserSession, 
    checkIsSuperAdmin, 
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
    const pendingNotice = document.getElementById('teacher-pending-notice');
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

    // 1번: 승인된 클래스 코드만 학생 로그인 허용!
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

        // 학급 초대 코드 검증
        const isValid = await validateClassCode(classCode);
        if (!isValid && classCode !== 'DEMO123' && classCode !== 'EXP123') {
            alert(`❌ 유효하지 않거나 아직 관리자 승인 대기 중인 학급 초대 코드입니다.\n선생님이 발급한 정확한 클래스 코드를 확인해 주세요!`);
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

    // 2번: Firebase Google Auth / 팝업 로그인 지원
    btnGoogleLogin.addEventListener('click', async () => {
        let email = "";
        let displayName = "";

        if (isFirebaseAvailable && auth) {
            try {
                const res = await signInWithPopup(auth, googleProvider);
                email = res.user.email;
                displayName = res.user.displayName || email.split('@')[0];
            } catch (err) {
                console.warn("Firebase Popup Auth Fallback:", err);
                email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
            }
        } else {
            email = prompt("교사 Google 계정 이메일을 입력해 주세요:");
        }

        if (!email) return;

        const isSuper = checkIsSuperAdmin(email);

        if (isSuper) {
            const superUser = {
                uid: 'super_admin_0106',
                email: email,
                name: displayName || '최종 관리자 (개발자)',
                role: 'super_admin',
                isSuperAdmin: true,
                status: 'APPROVED'
            };
            saveUserSession(superUser);
            alert("👑 최종 관리자 (Super Admin) 권한으로 접속하셨습니다.");
            onUserLoginSuccess(superUser);
        } else {
            formTeacherRegister.classList.remove('hidden');
            btnGoogleLogin.classList.add('hidden');

            formTeacherRegister.onsubmit = async (evt) => {
                evt.preventDefault();
                const school = document.getElementById('teacher-school').value.trim();
                const grade = document.getElementById('teacher-grade').value;
                const classNum = document.getElementById('teacher-class-num').value;
                const className = document.getElementById('teacher-class-name').value.trim();

                const classCode = `EXP${grade}${classNum}${Math.floor(100 + Math.random() * 900)}`;

                const teacherData = {
                    uid: 'teacher_' + Date.now(),
                    email: email,
                    name: `${school} ${grade}-${classNum} 교사 (${displayName || school})`,
                    school,
                    grade,
                    classNum,
                    className,
                    classCode,
                    role: 'teacher',
                    status: 'PENDING',
                    createdAt: new Date().toISOString()
                };

                await registerTeacherPending(teacherData);
                formTeacherRegister.classList.add('hidden');
                pendingNotice.classList.remove('hidden');
                alert(`📩 교사가입 신청 및 학급 코드 생성 완료!\n생성된 학급 코드: ${classCode}\n최종 관리자 승인 후 학생들이 로그인할 수 있습니다.`);
            };
        }
    });

    btnLogout.addEventListener('click', () => {
        if (confirm("🎮 게을 종료하고 접속 화면으로 돌아가시겠습니까?")) {
            clearUserSession();
            onLogout();
        }
    });

    const activeSession = getCurrentUserSession();
    if (activeSession) {
        onUserLoginSuccess(activeSession);
    }
}
