//import axios from 'axios';


import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
var config = {
    apiKey: "AIzaSyDKEIQRnNYczx3IZgiLwIucSBCBLg1t0Wg",
    authDomain: "hupity-9b190.firebaseapp.com",
    databaseURL: "https://hupity-9b190.firebaseio.com",
    projectId: "hupity-9b190",
    storageBucket: "hupity-9b190.appspot.com",
    messagingSenderId: "874067485777" 
}

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;




 