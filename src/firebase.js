import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB0WQcQFqztXBiwGudWthqPb5_OOAvNpVI",
    authDomain: "fir-with-react-86d63.firebaseapp.com",
    projectId: "fir-with-react-86d63",
    storageBucket: "fir-with-react-86d63.appspot.com",
    messagingSenderId: "609081818023",
    appId: "1:609081818023:web:0040eae307066f19a9d482"
};

firebase.initializeApp(firebaseConfig);

// firebase.settings({ timestampsInSnapshots: true });

window.firebase = firebase;

export const storage = firebase.storage();

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;
  // get a reference to the place in the database
  const userRef = firestore.doc(`users/${user.uid}`);

  // go fetch the document from that location
  const snapshot = await userRef.get();

  if (!snapshot.exists)  {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName, email, photoURL, createdAt, ...additionalData,
      });
      
    } catch (error) {
      console.error('Error creating user', error);
    }
  }

  return getUserDocument(user.uid);
}

export const getUserDocument = async uid => {
    if (!uid) return null;
    return firestore
      .collection('users')
      .doc(uid);
}

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();
export default firebase;