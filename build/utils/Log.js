"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogWarning = exports.LogInfo = exports.LogSuccess = exports.LogError = void 0;
const LogError = (path, error) => console.log(`❌  [${path}] 👉`, error);
exports.LogError = LogError;
const LogSuccess = (path, message) => console.log(`✅  [${path}] 👉`, message);
exports.LogSuccess = LogSuccess;
const LogInfo = (path, message) => console.log(`▶️  [${path}] 👉`, message);
exports.LogInfo = LogInfo;
const LogWarning = (path, message) => console.log(`⚠️  [${path}] 👉`, message);
exports.LogWarning = LogWarning;
//# sourceMappingURL=Log.js.map