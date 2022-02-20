require('dotenv').config({});
const admin = require('firebase-admin');
const UID = process.env.AUTH_UID;
const serviceKey = require('./key/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceKey)
});
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true,
    merge: true
});

const connectDatabase = () => {
    return {
        device_collection: db.collection('devices_fingerprint'),
        delete_collection: db.collection('deleted_devices'),
        auth_collection: db.collection('security_tokens'),
        uid: UID
    }
}


module.exports = {
    connectDatabase,
}