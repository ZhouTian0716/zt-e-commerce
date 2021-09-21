import firebase from "firebase/app";
import "firebase/auth";

// firebase config
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // apiKey: 'AIzaSyAv57jCOuApQog5OxYdmHpmgTnGiluPDfs',
  // authDomain: 'zt-e-commerce.firebaseapp.com',
  // projectId: 'zt-e-commerce',
  // storageBucket: 'zt-e-commerce.appspot.com',
  // messagingSenderId: '875825363401',
  // appId: '1:875825363401:web:4c1101e259bd83f5545018',
};
// initialize firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// export
// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();