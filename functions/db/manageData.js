const {
    connectDatabase,
} = require('./auth');
const {
    device_collection,
    delete_collection,
    auth_collection,
    uid
} = connectDatabase();


const verifyFingerprint = async (fingerprint) => {
    let record = {};
    await device_collection.where('fingerprints', 'array-contains', fingerprint).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(item => record = [true, item.data().email_address])
            }
        })
        .catch(err => err);
    return {
        found_record: record[0],
        email_record: record[1]
    }
}

const verifyEmailExist = async (email) => {
    let fingerprint_list_length = 0;
    await device_collection.where('email_address', '==', email).get()
        .then(snapshot => snapshot.forEach(item => fingerprint_list_length = item.data().fingerprints.length))
        .catch(err => err);
    return fingerprint_list_length;
}


const addSecurityToken = async (fingerprint, token) => {

    auth_collection.add({
            fingerprint,
            token,
            event_time: new Date(),
            uid
        })
        .catch(err => err);
}

const getSecurityToken = async (fingerprint) => {
    let tokenInfo = '';
    await auth_collection.where('fingerprint', '==', fingerprint).get()
        .then(snapshot => snapshot.forEach(doc => tokenInfo = doc.data()))
        .catch(err => err);
    return tokenInfo;
}

const deleteSecurityToken = async (fingerprint) => {
    auth_collection.where('fingerprint', '==', fingerprint).get()
        .then(snapshot => snapshot.forEach(document => document.ref.delete()))
        .catch(err => err);
}

const addDeviceCollection = async (data) => {
    device_collection.add({
            fingerprints: [data.fingerprint],
            email_address: data.email,
            event_time: new Date(),
            uid
        })
        .catch(err => err);
}

const updateDeviceCollection = async (data) => {
    device_collection.where('email_address', '==', data.email).get()
        .then(snapshot => snapshot.forEach(document => document.ref.update({
            fingerprints: [...document.data().fingerprints, data.fingerprint]
        })))
        .catch(err => err);
}


const deleteDeviceCollection = async (fingerprint) => {
    let deleted_data = null;
    device_collection.where('fingerprints', 'array-contains', fingerprint).get()
        .then(snapshot => snapshot.forEach(document => {
            deleted_data = document.data();
            document.ref.delete();
            delete_collection.where('email_address', '==', deleted_data.email_address).get()
                .then(doc => {
                    if (doc.empty) delete_collection.add(deleted_data);
                })
        }))
        .catch(err => err);
}


module.exports = {
    verifyFingerprint,
    verifyEmailExist,
    addDeviceCollection,
    updateDeviceCollection,
    deleteDeviceCollection,
    addSecurityToken,
    getSecurityToken,
    deleteSecurityToken
}