// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./config/vietduky-b2a24-firebase-adminsdk-fbsvc-cd803a43ce.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://vietduky-b2a24-default-rtdb.firebaseio.com',
});
const db = admin.firestore();
module.exports = { admin, db };
