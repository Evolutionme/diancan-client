import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 这里的配置后续将在生产环境中通过 Vercel 环境变量传递，在本地可以在 .env 文件中配置
// 测试期间，用户会提供这些明文配置给我们填入
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "待填写的apiKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "待填写的authDomain",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "待填写的databaseURL",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "待填写的projectId",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "待填写的storageBucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "待填写的messagingSenderId",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "待填写的appId"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
