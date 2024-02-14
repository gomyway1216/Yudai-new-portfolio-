// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export { app, analytics };


let firebaseApp;
let db;
let auth;

export const init = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  if(!db) {
    db = getFirestore(firebaseApp);
  }
  if(!auth) {
    auth = getAuth(firebaseApp);
  }
};
init();

export const exportDbAccess = () => {
  return db;
};

export const exportStorageAccess = () => {
  return getStorage(firebaseApp);
};

export { auth };

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    }).catch((error) => {
      console.log('errorCode: ', error.code);
      console.log('errorMessage: ', error.message);
      throw new Error('Sign in failed!');
    });
};

export const signOutUser = () => {
  signOut(auth).then(() => {
    console.log('sign out successful!');
  }).catch((error) => {
    console.log('sign out has some error', error);
  });
};