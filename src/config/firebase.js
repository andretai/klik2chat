import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD5KbyWIBMgMLdvVvBs34Y_vYRiyDOfbsY",
  authDomain: "testauth-c9163.firebaseapp.com",
  projectId: "testauth-c9163",
  storageBucket: "testauth-c9163.appspot.com",
  messagingSenderId: "470048774281",
  appId: "1:470048774281:web:8464cac609f97b83504e58"
}

const firebase = initializeApp(firebaseConfig)

const auth = getAuth(firebase)

const db = getFirestore(firebase)

export { auth, db, firebase }