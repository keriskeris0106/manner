/* ==========================================================================
   🎮 [존댓말 차원 탐험대] Firebase Configuration & Shielded Auth (firebase-config.js)
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
    apiKey: getEnv("FIREBASE_API_KEY") || "",
    authDomain: getEnv("FIREBASE_AUTH_DOMAIN") || "manner-explorer.firebaseapp.com",
    projectId: getEnv("FIREBASE_PROJECT_ID") || "manner-explorer",
    storageBucket: getEnv("FIREBASE_STORAGE_BUCKET") || "manner-explorer.appspot.com",
    messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID") || "205380689014",
    appId: getEnv("FIREBASE_APP_ID") || ""
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let isFirebaseAvailable = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.apiKey.length > 10) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        isFirebaseAvailable = true;
    } catch (e) {
        console.warn("Firebase Shield Init:", e);
    }
}

export { auth, db, googleProvider, isFirebaseAvailable, signInWithPopup };

const LOCAL_STORAGE_KEY_USER = "manner_explorer_current_user";
const LOCAL_STORAGE_KEY_TEACHERS = "manner_explorer_teachers";
const LOCAL_STORAGE_KEY_STUDENTS = "manner_explorer_students";
const LOCAL_STORAGE_KEY_RANKING = "manner_explorer_ranking";
const LOCAL_STORAGE_KEY_CREATOR_PROMPT = "manner_explorer_creator_prompt";

export function getCurrentUserSession() {
    try {
        const saved = sessionStorage.getItem(LOCAL_STORAGE_KEY_USER) || localStorage.getItem(LOCAL_STORAGE_KEY_USER);
        return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
}

export function saveUserSession(userData) {
    try {
        sessionStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(userData));
    } catch (e) {}
}

export function clearUserSession() {
    try {
        sessionStorage.removeItem(LOCAL_STORAGE_KEY_USER);
        localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    } catch (e) {}
}

export async function validateClassCode(code) {
    if (!code) return false;
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === 'EXP123' || cleanCode === 'DEMO123' || cleanCode === 'TEACHER') {
        return true;
    }

    try {
        const teachers = await getAllTeachers();
        if (Array.isArray(teachers)) {
            const found = teachers.find(t => t.classCode && t.classCode.toUpperCase() === cleanCode);
            if (found) return true;
        }
    } catch (e) {}

    try {
        const localTeachers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
        const foundLocal = localTeachers.find(t => t.classCode && t.classCode.toUpperCase() === cleanCode);
        if (foundLocal) return true;
    } catch (e) {}

    return false;
}

export async function registerTeacherPending(teacherData) {
    if (isFirebaseAvailable && db) {
        try {
            await setDoc(doc(db, "teachers", teacherData.uid), teacherData);
        } catch (err) { console.warn(err); }
    }
    try {
        const teachers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
        const existingIdx = teachers.findIndex(t => t.uid === teacherData.uid);
        if (existingIdx >= 0) teachers[existingIdx] = teacherData;
        else teachers.push(teacherData);
        localStorage.setItem(LOCAL_STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
    } catch (e) {}
}

export async function getAllTeachers() {
    let list = [];
    if (isFirebaseAvailable && db) {
        try {
            const querySnapshot = await getDocs(collection(db, "teachers"));
            querySnapshot.forEach((doc) => list.push(doc.data()));
            if (list.length > 0) return list;
        } catch (e) { console.warn(e); }
    }
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TEACHERS) || "[]");
    } catch (e) { return []; }
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

    if (isFirebaseAvailable && db) {
        try {
            await setDoc(doc(db, "students", studentId), studentRecord, { merge: true });
        } catch (e) { console.warn(e); }
    }

    try {
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
    } catch (e) {}
    
    saveUserSession(studentRecord);
    return studentRecord;
}

export async function updateStudentProgress(studentId, newBadges, errorType, wrongLogItem = null) {
    try {
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

            if (isFirebaseAvailable && db) {
                try {
                    await updateDoc(doc(db, "students", studentId), {
                        earnedBadges: student.earnedBadges,
                        errorStats: student.errorStats,
                        wrongLogs: student.wrongLogs
                    });
                } catch (e) {}
            }
        }
    } catch (e) {}
}

export async function getStudentsByClassCode(classCode) {
    try {
        const students = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS) || "[]");
        return students.filter(s => s.classCode === classCode || !classCode);
    } catch (e) { return []; }
}

export function saveLeaderboardScore(entry) {
    try {
        const rankings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
        rankings.push(entry);
        rankings.sort((a, b) => b.score - a.score);
        localStorage.setItem(LOCAL_STORAGE_KEY_RANKING, JSON.stringify(rankings.slice(0, 20)));
    } catch (e) {}
}

export function getLeaderboardRankings() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RANKING) || "[]");
    } catch (e) { return []; }
}

export function saveCreatorPrompt(worldId, promptText) {
    try {
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT) || "{}");
        data[worldId] = promptText;
        localStorage.setItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT, JSON.stringify(data));
    } catch (e) {}
}

export function getCreatorPrompt(worldId) {
    try {
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CREATOR_PROMPT) || "{}");
        return data[worldId] || "초등학교 3학년 국어 교과과정 표준 높임법 지침 적용";
    } catch (e) { return "기본 지침 적용"; }
}
