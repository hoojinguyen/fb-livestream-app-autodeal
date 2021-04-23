const firebase = require("firebase/app");
require("firebase/auth");

const config = {
  apiKey: "AIzaSyDTuBvMi0V7moujqtJMrCR9zbGRjY-fGe8",
  authDomain: "kltn-app-fb-livestream.firebaseapp.com",
  databaseURL: "https://kltn-app-fb-livestream.firebaseio.com",
  projectId: "kltn-app-fb-livestream",
  storageBucket: "kltn-app-fb-livestream.appspot.com",
  messagingSenderId: "182034617062",
  appId: "1:182034617062:web:9cf270965234ff47cea127",
  measurementId: "G-GPSDQK6SEV",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
module.exports = { auth, firebase };
