// firebase.js
import * as firebase from 'firebase';
//get variables from environment.js

FIREBASE_API_KEY= 'AIzaSyCoTSWBQ2eTlel5BTdRH_BnGAN7ucnkdJg'
FIREBASE_AUTH_DOMAIN= 'helping-hands-cs194.firebaseapp.com'
FIREBASE_DATABASE_URL= 'https://helping-hands-cs194.firebaseio.com'
FIREBASE_PROJECT_ID= 'helping-hands-cs194'
FIREBASE_STORAGE_BUCKET= 'helping-hands-cs194.appspot.com'
FIREBASE_MESSAGING_SENDER_ID= '324182071358'

firebase.initializeApp({  
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
});

export default firebase; 