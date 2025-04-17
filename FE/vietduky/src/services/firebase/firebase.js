import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwo-gZYll_HfkwkVVtWoQM9QD5Ob-jpvo",
  authDomain: "vietduky-1bde7.firebaseapp.com",
  projectId: "vietduky-1bde7",
  storageBucket: "vietduky-1bde7.firebasestorage.app",
  messagingSenderId: "287422382537",
  appId: "1:287422382537:web:883dd6428d6b634a2e2818",
  measurementId: "G-160WFHPLYB"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
