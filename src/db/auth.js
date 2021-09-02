const {
    initializeApp,
    firestore,
    auth
} = require('firebase');
const USERNAME = 'appadmin@cravingvoyce.com';
const PASSWORD = '7FFFE6B6F3B7B36BAADC56CAA2A1D1EF340FF78D3F2FF4729C766F3D83F2C3E7';
const UID = 'Y7AgjvDD7KZdvgkRiLEkB2XV2rE2';

const firebaseConfig = {
    apiKey: "AIzaSyAx8gL3sDIpYAsZ_ImWmum9NcrgB7xt2FM",
    authDomain: "craving-voyce.firebaseapp.com",
    projectId: "craving-voyce",
    storageBucket: "craving-voyce.appspot.com",
    messagingSenderId: "36810662671",
    appId: "1:36810662671:web:b71f17a61ae979063bd47a",
    measurementId: "G-1ZZNQGBFFM"
};

const connectDatabase = () => {
    initializeApp(firebaseConfig);
    firestore().settings({
        timestampsInSnapshots: true,
        merge: true
    });

    auth().signInWithEmailAndPassword(USERNAME, PASSWORD);
    return {
        device_collection: firestore().collection('devices_fingerprint'),
        delete_collection: firestore().collection('deleted_devices'),
        uid: UID,
        auth: auth()
    }
}


module.exports = {
    connectDatabase
}