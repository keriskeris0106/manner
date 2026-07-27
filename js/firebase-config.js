/* ==========================================================================
   🎮 [존댓말 차원 탐험대] Firebase Configuration & DB Service (firebase-config.js)
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 기본 데모용 Firebase 설정 (사용자가 Vercel 환경변수나 콘솔 키로 교체 가능)
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyForMannerDimensionExplorer2026",
    authDomain: "manner-explorer.firebaseapp.com",
    projectId: "manner-explorer",
    storageBucket: "manner-explorer.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:demo123456"
};

// Initialize Firebase
let app, auth, db, googleProvider;
let isFirebaseAvailable = false;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseAvailable = true;
    console.log("🔥 Firebase initialized successfully.");
} catch (e) {
    console.warn("⚠️ Firebase fallback mode initialized:", e);
}

export { auth, db, googleProvider, isFirebaseAvailable };

// ==========================================================================
// 8단계 세션 및 Firestore 데이터 조작 래퍼 함수 (Local Fallback 지원)
// ==========================================================================

const LOCAL_STORAGE_KEY_USER = "manner_explorer_current_user";
const LOCAL_STORAGE_KEY_TEACHERS = "manner_explorer_teachers";
const LOCAL_STORAGE_KEY_STUDENTS = "manner_explorer_students";
const LOCAL_STORAGE_KEY_LOGS = "manner_explorer_logs";
const LOCAL_STORAGE_KEY_RANKING = "manner_explorer_ranking";

// 1. 현재 세션 유저 가져오기/저장하기
export function getCurrentUserSession() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
}

export function saveUserSession(userData) {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(userData));
}

export function clearUserSession() {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
}

// 2. 최종 관리자 여부 확인 (개발자 Google ID)
export const SUPER_ADMIN_EMAIL = "keriskeris0106@gmail.com"; // 개발자 구글 ID

export function checkIsSuperAdmin(email) {
    return email === SUPER_ADMIN_EMAIL || email.includes("keriskeris0106");
}

// 3. 교사가입 신청 및 저장
export async function registerTeacherPending(teacherData) {
    if (isFirebaseAvailable) {
        try {
            await setDoc(doc(db, "teachers", teacherData.uid), teacherData);
        } catch (err) {
            console.warn("Firestore error fallback to localStorage:", err);
        }
    }
    // Local fallback
    const teachers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
    const existingIdx = teachers.findIndex(t => t.uid === teacherData.uid);
    if (existingIdx >= 0) teachers[existingIdx] = teacherData;
    else teachers.push(teacherData);
    localStorage.setItem(LOCAL_STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
}

// 4. 모든 교사 가입 신청 가져오기 (Super Admin용)
export async function getAllTeachers() {
    let list = [];
    if (isFirebaseAvailable) {
        try {
            const querySnapshot = await getDocs(collection(db, "teachers"));
            querySnapshot.forEach((doc) => list.push(doc.data()));
            if (list.length > 0) return list;
        } catch (e) { console.warn(e); }
    }
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
}

// 5. 교사 승인/거절 상태 업데이트 (Super Admin용)
export async function updateTeacherStatus(uid, status) {
    if (isFirebaseAvailable) {
        try {
            await updateDoc(doc(db, "teachers", uid), { status: status });
        } catch (e) { console.warn(e); }
    }
    const teachers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
    const teacher = teachers.find(t => t.uid === uid);
    if (teacher) {
        teacher.status = status;
        localStorage.setItem(LOCAL_STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
    }
}

// 6. 학생 등록 및 로그인
export async function loginOrRegisterStudent(studentInfo) {
    // studentInfo: { classCode, name, grade, classNum }
    const studentId = `${studentInfo.classCode}_${studentInfo.grade}_${studentInfo.classNum}_${studentInfo.name}`;
    const studentRecord = {
        studentId,
        ...studentInfo,
        role: 'student',
        lastLoginAt: new Date().toISOString(),
        earnedBadges: studentInfo.earnedBadges || [],
        currentTitle: studentInfo.currentTitle || '🌱 새싹 탐험대',
        errorStats: studentInfo.errorStats || { OBJECT_HONORIFIC: 0, APJON: 0, SPECIAL_WORD: 0, SUBJECT_OBJECT: 0 },
        wrongLogs: studentInfo.wrongLogs || []
    };

    if (isFirebaseAvailable) {
        try {
            await setDoc(doc(db, "students", studentId), studentRecord, { merge: true });
        } catch (e) { console.warn(e); }
    }

    const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS) || "[]");
    const idx = students.findIndex(s => s.studentId === studentId);
    if (idx >= 0) {
        // 기존 배지 및 이력 보존
        studentRecord.earnedBadges = students[idx].earnedBadges || [];
        studentRecord.currentTitle = students[idx].currentTitle || '🌱 새싹 탐험대';
        studentRecord.errorStats = students[idx].errorStats || studentRecord.errorStats;
        studentRecord.wrongLogs = students[idx].wrongLogs || [];
        students[idx] = studentRecord;
    } else {
        students.push(studentRecord);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify(students));
    saveUserSession(studentRecord);
    return studentRecord;
}

// 7. 학생 학습 이력 및 오류 로그 업데이트
export async function updateStudentProgress(studentId, newBadges, errorType, wrongLogItem = null) {
    const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS) || "[]");
    const student = students.find(s => s.studentId === studentId);
    if (student) {
        if (newBadges && newBadges.length > 0) {
            student.earnedBadges = Array.from(new Set([...(student.earnedBadges || []), ...newBadges]));
        }
        if (errorType && student.errorStats[errorType] !== undefined) {
            student.errorStats[errorType] += 1;
        }
        if (wrongLogItem) {
            student.wrongLogs = student.wrongLogs || [];
            student.wrongLogs.push(wrongLogItem);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify(students));
        
        // 현재 세션 유저와 같으면 동기화
        const curr = getCurrentUserSession();
        if (curr && curr.studentId === studentId) {
            saveUserSession(student);
        }

        if (isFirebaseAvailable) {
            try {
                await updateDoc(doc(db, "students", studentId), {
                    earnedBadges: student.earnedBadges,
                    errorStats: student.errorStats,
                    wrongLogs: student.wrongLogs
                });
            } catch (e) { console.warn(e); }
        }
    }
}

// 8. 학급 학생 전체 목록 불러오기 (교사용)
export async function getStudentsByClassCode(classCode) {
    const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS) || "[]");
    return students.filter(s => s.classCode === classCode || !classCode);
}

// 9. 명예의 전당 리더보드 저장 & 조회
export async function saveLeaderboardScore(entry) {
    // entry: { name, classTitle, score, title, date }
    const rankings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
    rankings.push(entry);
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_STORAGE_KEY_RANKING, JSON.stringify(rankings.slice(0, 20)));
}

export function getLeaderboardRankings() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
}
