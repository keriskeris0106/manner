/* ==========================================================================
   🔑 [존댓말 차원 탐험대] 환경 변수 래퍼 (env.js)
   ========================================================================== */

// 1. window.ENV 객체가 Vercel 배포 시 또는 env.js로 정의된 경우 로드
window.ENV = window.ENV || {
    FIREBASE_API_KEY: "",
    FIREBASE_AUTH_DOMAIN: "",
    FIREBASE_PROJECT_ID: "",
    FIREBASE_STORAGE_BUCKET: "",
    FIREBASE_MESSAGING_SENDER_ID: "",
    FIREBASE_APP_ID: "",
    GEMINI_API_KEY: ""
};

export function getEnv(key, defaultValue = "") {
    if (window.ENV && window.ENV[key]) {
        return window.ENV[key];
    }
    // Process env fallback for Node/Vite build
    if (typeof process !== "undefined" && process.env && process.env[key]) {
        return process.env[key];
    }
    return defaultValue;
}
