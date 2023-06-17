export const LogError = (path: string, error: any) => console.log(`❌  [${path}] 👉`, error);
export const LogSuccess = (path: string, message: any) => console.log(`✅  [${path}] 👉`, message);
export const LogInfo = (path: string, message: any) => console.log(`▶️  [${path}] 👉`, message)
export const LogWarning = (path: string, message: any) => console.log(`⚠️  [${path}] 👉`, message)

