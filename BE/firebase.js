// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./config/vietduky-80557-firebase-adminsdk-fbsvc-8cf6f5f2e3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vietduky-b2a24-default-rtdb.firebaseio.com",
});
const db = admin.firestore();
module.exports = { admin, db };
