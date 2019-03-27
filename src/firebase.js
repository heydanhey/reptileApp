import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var config = {
  apiKey: process.env.REACT_APP_DEV_FIREBASE_KEY,
  authDomain: "reptileapp-200de.firebaseapp.com",
  databaseURL: "https://reptileapp-200de.firebaseio.com",
  projectId: "reptileapp-200de",
  storageBucket: "",
  messagingSenderId: process.env.REACT_APP_DEV_MESSENGINGSENDER_KEY
};
firebase.initializeApp(config);

firebase.firestore().settings({
  timestampsInSnapshots:true
});

export default firebase;