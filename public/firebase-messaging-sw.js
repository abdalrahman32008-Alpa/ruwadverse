importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY_HERE", // NOTE: This needs to be replaced with actual key or fetched
  authDomain: "ruwadverse.firebaseapp.com",
  projectId: "ruwadverse",
  storageBucket: "ruwadverse.firebasestorage.app",
  messagingSenderId: "828930807958",
  appId: "1:828930807958:web:5dbea5cda39d1c1ebe8ab7",
  measurementId: "G-DN62YT2J4Z"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
