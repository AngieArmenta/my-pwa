// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB72qsFYShEgj4PODpcYVCmBUKN1pA8eCc",
  authDomain: "my-pwa-app-e0698.firebaseapp.com",
  projectId: "my-pwa-app-e0698",
  storageBucket: "my-pwa-app-e0698.firebasestorage.app",
  messagingSenderId: "1041370331903",
  appId: "1:1041370331903:web:f942a1b4950c43c2ffeaca",
  measurementId: "G-19Y0TX0NSD"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Recibido mensaje:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
