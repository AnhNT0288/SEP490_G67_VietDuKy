importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDz0mJO6dyYYJj3ul7yc6qG2z6wjkRQnzo",
    authDomain: "vietduky-80557.firebaseapp.com",
    projectId: "vietduky-80557",
    storageBucket: "vietduky-80557.firebasestorage.app",
    messagingSenderId: "1037542007618",
    appId: "1:1037542007618:web:79e2b38ee96544d1929edb",
    measurementId: "G-N5SJTSLNPR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
