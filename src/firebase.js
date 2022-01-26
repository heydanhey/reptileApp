import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore/lite';

var config = {
  apiKey: process.env.REACT_APP_DEV_FIREBASE_KEY,
  authDomain: "reptileapp-200de.firebaseapp.com",
  databaseURL: "https://reptileapp-200de.firebaseio.com",
  projectId: "reptileapp-200de",
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_DEV_MESSENGINGSENDER_KEY
};
const app = initializeApp(config);
export const db = getFirestore(app);