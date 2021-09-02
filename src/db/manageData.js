
const validate = require('./auth');
const connection = validate.connectDatabase();


const verifyFingerprint = async (fprint) => {
    let record = {};
    await connection.device_collection.get().then(res => {
            res.docs.map(elem => {
                elem.data().fingerprints.forEach(element => {
                    if (element === fprint) {
                        record.found_record = true;
                        record.email_record = elem.data().email_address;
                    };
                });
            })
        })
        .catch(() => console.log('Caught verifying fingerprint error'));
    return {
        found_record: record.found_record,
        email_record: record.email_record
    }
}

const verifyEmailExist = async (email) => {
    let fingerprint_list_length = 0;
    await connection.device_collection.where('email_address', '==', email).get()
        .then(snapshot => snapshot.forEach(item => fingerprint_list_length = item.data().fingerprints.length))
        .catch(() => console.log('Caught verifying email error'));
    return fingerprint_list_length;
}


const addCollection = (data) => {
    connection.device_collection.add({
            fingerprints: [data.fingerprint],
            email_address: data.email,
            event_time: new Date(),
            uid: connection.uid
        })
        .catch(() => console.log('Caught adding collection error'));
}

const updateCollection = (data) => {
    connection.device_collection.where('email_address', '==', data.email).get()
        .then(snapshot => snapshot.forEach(document => document.ref.update({
            fingerprints: [...document.data().fingerprints, data.fingerprint]
        })))
        .catch(() => console.log('Caught updating collection error'));
}


const deleteCollection = (fingerprint) => {
    let deleted_data = null;
    connection.device_collection.where('fingerprints', 'array-contains', fingerprint).get()
        .then(snapshot => snapshot.forEach(document => {
            deleted_data = document.data();
            document.ref.delete();
            connection.delete_collection.where('email_address', '==', deleted_data.email_address).get()
                .then(doc => {
                    if (doc.empty) connection.delete_collection.add(deleted_data);
                })
        }))
        .catch(() => console.log('Caught deleting collection error'));
}


module.exports = {
    verifyFingerprint,
    verifyEmailExist,
    addCollection,
    updateCollection,
    deleteCollection,
}