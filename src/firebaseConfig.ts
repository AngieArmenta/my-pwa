// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
apiKey: "AIzaSyB72qsFYShEgj4PODpcYVCmBUKN1pA8eCc",
  authDomain: "my-pwa-app-e0698.firebaseapp.com",
  projectId: "my-pwa-app-e0698",
  storageBucket: "my-pwa-app-e0698.firebasestorage.app",
  messagingSenderId: "1041370331903",
  appId: "1:1041370331903:web:f942a1b4950c43c2ffeaca",
  measurementId: "G-19Y0TX0NSD"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// --- Obtener permiso del usuario para notificaciones ---
export async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: "BF2LzfrpwIy1sKb-jcc2rd4xhBC98y0ROAtGMCFMJLumf6uBsZu6xuCRnPCqQQvHNebzzBU7twTQTTgbmEZC1Y0" // la obtendrás más abajo
    });
    console.log('🔔 Token FCM:', token);
    return token;
  } else {
    console.log('🚫 Permiso de notificaciones denegado');
  }
}

onMessage(messaging, (payload) => {
  console.log('📩 Mensaje recibido en primer plano:', payload);
});

export { messaging };
