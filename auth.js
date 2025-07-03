// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const statusDiv = document.getElementById("status");

  // 註冊功能
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const nickname = document.getElementById("nickname").value;

      if (!nickname) {
        alert("請輸入社群暱稱");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          nickname
        });
        await setDoc(doc(db, "carts", userCredential.user.uid), { items: [] });
        alert("註冊成功！歡迎你，" + nickname);
      } catch (error) {
        alert("註冊失敗：" + error.message);
      }
    });
  }

  // 登入功能
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const nickname = userDoc.exists() ? userDoc.data().nickname : "使用者";
        alert("歡迎回來，" + nickname);
      } catch (error) {
        alert("登入失敗：" + error.message);
      }
    });
  }

  // 登出功能
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("你已成功登出");
      } catch (error) {
        alert("登出失敗：" + error.message);
      }
    });
  }

  // 登入狀態監聽（可選）
  if (statusDiv) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const nickname = userDoc.exists() ? userDoc.data().nickname : "使用者";
        statusDiv.innerText = `登入中：${nickname}`;
      } else {
        statusDiv.innerText = "尚未登入";
      }
    });
  }
});
