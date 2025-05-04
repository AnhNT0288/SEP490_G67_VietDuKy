importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCSpp_Qfx7P71kXaFYMkFbjm4DDWHgD7ng",
    authDomain: "vietduky-b2a24.firebaseapp.com",
    projectId: "vietduky-b2a24",
    storageBucket: "vietduky-b2a24.firebasestorage.app",
    messagingSenderId: "460941475771",
    appId: "1:460941475771:web:df11af9a01be2ce8be8e9e",
    measurementId: "G-374LVHBE1E"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
    });
});
