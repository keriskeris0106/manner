/* ==========================================================================
   🎮 [존댓말 차원 탐험대] 8단계 로그인 & 권한 인증 관리자 (auth.js)
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

    // 1. DOM 요소 바인딩
    const tabStudent = document.getElementById('tab-student-login');
    const tabTeacher = document.getElementById('tab-teacher-login');
    const formStudent = document.getElementById('form-student-login');
    const boxTeacher = document.getElementById('box-teacher-login');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const formTeacherRegister = document.getElementById('form-teacher-register');
    const pendingNotice = document.getElementById('teacher-pending-notice');
    const btnLogout = document.getElementById('btn-logout');

    // 2. 학생 / 교사 선택 탭 이벤트 (3단계)
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

    // 3. 학생 로그인 제출 (1단계, 5단계: 실명만 허용)
    formStudent.addEventListener('submit', async (e) => {
        e.preventDefault();
        const classCode = document.getElementById('student-class-code').value.trim().toUpperCase();
        const grade = document.getElementById('student-grade').value;
        const classNum = document.getElementById('student-class-num').value;
        const name = document.getElementById('student-name').value.trim();

        if (!name || name.length < 2) {
            alert('⚠️ 학생 이름은 실명으로 2자 이상 입력해 주세요 (닉네임 금지).');
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

    // 4. 교사 Google 로그인 모의/실제 클릭 (4단계, 5단계)
    btnGoogleLogin.addEventListener('click', async () => {
        // 실제 Google Auth 팝업 호출 또는 개발용 프롬프트 이메일 입력
        const mockEmail = prompt("교사 Google 계정 이메일을 입력하세요 (최종 관리자는 keriskeris0106@gmail.com 입력):", "teacher1@school.es.kr");
        if (!mockEmail) return;

        const isSuper = checkIsSuperAdmin(mockEmail);
        const name = mockEmail.split('@')[0];

        if (isSuper) {
            const superUser = {
                uid: 'super_admin_uid_0106',
                email: mockEmail,
                name: '최종 관리자 (개발자)',
                role: 'super_admin',
                isSuperAdmin: true,
                status: 'APPROVED'
            };
            saveUserSession(superUser);
            alert("👑 최종 관리자(Super Admin)로 접속하셨습니다.");
            onUserLoginSuccess(superUser);
        } else {
            // 일반 교사: 가입 신청 폼 노출
            formTeacherRegister.classList.remove('hidden');
            btnGoogleLogin.classList.add('hidden');

            formTeacherRegister.onsubmit = async (evt) => {
                evt.preventDefault();
                const school = document.getElementById('teacher-school').value.trim();
                const grade = document.getElementById('teacher-grade').value;
                const classNum = document.getElementById('teacher-class-num').value;
                const className = document.getElementById('teacher-class-name').value.trim();

                // 고유 클래스 초대 코드 자동 생성 (6자리)
                const classCode = `EXP${grade}${classNum}${Math.floor(10 + Math.random() * 90)}`;

                const teacherData = {
                    uid: 'teacher_' + Date.now(),
                    email: mockEmail,
                    name: `${school} ${grade}-${classNum} 교사`,
                    school,
                    grade,
                    classNum,
                    className,
                    classCode,
                    role: 'teacher',
                    status: 'PENDING', // 관리자 승인 대기 상태
                    createdAt: new Date().toISOString()
                };

                await registerTeacherPending(teacherData);
                formTeacherRegister.classList.add('hidden');
                pendingNotice.classList.remove('hidden');
                alert(`📩 교사 가입 신청이 완료되었습니다! (클래스 코드: ${classCode})\n최종 관리자의 승인 후 접속이 완료됩니다.`);
            };
        }
    });

    // 5. 게임 종료 / 로그아웃 버튼 (7단계)
    btnLogout.addEventListener('click', () => {
        if (confirm("🎮 게임을 종료하고 로그인 화면으로 돌아가시겠습니까?")) {
            clearUserSession();
            onLogout();
        }
    });

    // 6. 자동 로그인 세션 검사 (8단계)
    const activeSession = getCurrentUserSession();
    if (activeSession) {
        onUserLoginSuccess(activeSession);
    }
}
