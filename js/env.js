/* ==========================================================================
   🔑 [존댓말 차원 탐험대] 환경 변수 래퍼 (env.js)
   ========================================================================== */

window.ENV = window.ENV || {};

export function getEnv(key, defaultValue = "") {
    if (window.ENV && window.ENV[key] && window.ENV[key] !== `YOUR_${key}`) {
        return window.ENV[key];
    }
    if (typeof process !== "undefined" && process.env && process.env[key]) {
        return process.env[key];
    }
    return defaultValue;
}
