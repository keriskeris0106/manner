/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 8단계 로그인 & 권한 인증 관리자 (auth.js)
   ==========================================================================
   🔒 하드코딩된 이메일/비밀번호 제로(0) 처리
   ========================================================================== */

import { 
    getCurrentUserSession, 
    saveUserSession, 
    clearUserSession, 
    checkIsSuperAdmin, 
    registerTeacherPending, 
    loginOrRegisterStudent 
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

    // 학생 로그인 (이름은 반 내 세션 식별용이며 외부 수집되지 않음)
    formStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const classCode = document.getElementById('student-class-code').value.trim().toUpperCase();
        const grade = document.getElementById('student-grade').value;
        const classNum = document.getElementById('student-class-num').value;
        const name = document.getElementById('student-name').value.trim();

        if (!name || name.length < 2) {
            alert('⚠️ 이름을 2자 이상 입력해 주세요.');
            return;
        }

        const studentData = await loginOrRegisterStudent({
            classCode: classCode || 'DEFAULT1',
            grade,
            classNum,
            name
        });

        alert(`🎉 ${name} 탐험가님 환영합니다!`);
        onUserLoginSuccess(studentData);
    });

    // 교사 Google 로그인
    btnGoogleLogin.addEventListener('click', async () => {
        const inputEmail = prompt("교사 Google 계정 이메일을 입력해 주세요:");
        if (!inputEmail) return;

        const isSuper = checkIsSuperAdmin(inputEmail);

        if (isSuper) {
            const superUser = {
                uid: 'super_admin_' + Date.now(),
                email: inputEmail,
                name: '최종 관리자',
                role: 'super_admin',
                isSuperAdmin: true,
                status: 'APPROVED'
            };
            saveUserSession(superUser);
            alert("👑 최종 관리자(Super Admin) 권한으로 접속하셨습니다.");
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

                const classCode = `EXP${grade}${classNum}${Math.floor(10 + Math.random() * 90)}`;

                const teacherData = {
                    uid: 'teacher_' + Date.now(),
                    email: inputEmail,
                    name: `${school} ${grade}-${classNum} 교사`,
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
                alert(`📩 교사 가입 신청이 완료되었습니다. (발급된 초대코드: ${classCode})\n관리자 승인 후 대시보드를 이용할 수 있습니다.`);
            };
        }
    });

    btnLogout.addEventListener('click', () => {
        if (confirm("🎮 로그아웃하고 접속 화면으로 돌아가시겠습니까?")) {
            clearUserSession();
            onLogout();
        }
    });

    const activeSession = getCurrentUserSession();
    if (activeSession) {
        onUserLoginSuccess(activeSession);
    }
}
