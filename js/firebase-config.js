/* ==========================================================================
   🎮 [존댓말 차원 탐험대] Firebase Configuration & DB Service (firebase-config.js)
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDocs, 
    collection, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { getEnv } from './env.js';

const firebaseConfig = {
    apiKey: getEnv("FIREBASE_API_KEY"),
    authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("FIREBASE_APP_ID")
};

let app, auth, db, googleProvider;
let isFirebaseAvailable = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        isFirebaseAvailable = true;
    } catch (e) {
        console.warn("Firebase Init:", e);
    }
}

export { auth, db, googleProvider, isFirebaseAvailable, signInWithPopup };

const LOCAL_STORAGE_KEY_USER = "manner_explorer_current_user";
const LOCAL_STORAGE_KEY_TEACHERS = "manner_explorer_teachers";
const LOCAL_STORAGE_KEY_STUDENTS = "manner_explorer_students";
const LOCAL_STORAGE_KEY_RANKING = "manner_explorer_ranking";
const LOCAL_STORAGE_KEY_CREATOR_PROMPT = "manner_explorer_creator_prompt";

export function getCurrentUserSession() {
    const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY_USER) || localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
}

export function saveUserSession(userData) {
    sessionStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(userData));
}

export function clearUserSession() {
    sessionStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
}

export function checkIsSuperAdmin(email) {
    const adminEmail = getEnv("SUPER_ADMIN_EMAIL");
    if (adminEmail && email === adminEmail) return true;
    return email === "keriskeris0106@gmail.com";
}

// 1번: 교사가 생성하여 승인된 유효 학급 코드 검증 함수
export async function validateClassCode(code) {
    const teachers = await getAllTeachers();
    const valid = teachers.find(t => t.classCode === code && t.status === 'APPROVED');
    return !!valid;
}

export async function registerTeacherPending(teacherData) {
    if (isFirebaseAvailable) {
        try {
            await setDoc(doc(db, "teachers", teacherData.uid), teacherData);
        } catch (err) { console.warn(err); }
    }
    const teachers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
    const existingIdx = teachers.findIndex(t => t.uid === teacherData.uid);
    if (existingIdx >= 0) teachers[existingIdx] = teacherData;
    else teachers.push(teacherData);
    localStorage.setItem(LOCAL_STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
}

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

export async function loginOrRegisterStudent(studentInfo) {
    const studentId = `STU_${studentInfo.classCode}_${studentInfo.grade}_${studentInfo.classNum}_${studentInfo.name}`;
    const studentRecord = {
        studentId,
        classCode: studentInfo.classCode,
        grade: studentInfo.grade,
        classNum: studentInfo.classNum,
        name: studentInfo.name,
        role: 'student',
        lastLoginAt: new Date().toISOString(),
        earnedBadges: studentInfo.earnedBadges || [],
        currentTitle: studentInfo.currentTitle || '🌱 새싹 탐험대 (Lv.1)',
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
        studentRecord.earnedBadges = students[idx].earnedBadges || [];
        studentRecord.currentTitle = students[idx].currentTitle || '🌱 새싹 탐험대 (Lv.1)';
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

export async function getStudentsByClassCode(classCode) {
    const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS) || "[]");
    return students.filter(s => s.classCode === classCode || !classCode);
}

export async function saveLeaderboardScore(entry) {
    const rankings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
    rankings.push(entry);
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_STORAGE_KEY_RANKING, JSON.stringify(rankings.slice(0, 20)));
}

export function getLeaderboardRankings() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
}

// 5번: 제작자 프롬프트 저장 및 불러오기
export function saveCreatorPrompt(worldId, promptText) {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT) || "{}");
    data[worldId] = promptText;
    localStorage.setItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT, JSON.stringify(data));
}

export function getCreatorPrompt(worldId) {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT) || "{}");
    return data[worldId] || "초등학교 3학년 국어 교과과정 표준 높임법 지침 적용";
}
