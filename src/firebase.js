import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 这里的配置后续将在生产环境中通过 Vercel 环境变量传递，在本地可以在 .env 文件中配置
// 测试期间，用户会提供这些明文配置给我们填入
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQgCuGOLe8HlqxFwHhlAswWSqbovSV8EE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "diancan-system.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://diancan-system-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "diancan-system",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "diancan-system.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "859931066153",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:859931066153:web:df5ce37a47f5e1e07d4138"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
