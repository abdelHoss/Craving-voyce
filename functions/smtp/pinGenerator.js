const {
    addSecurityToken,
    getSecurityToken,
    deleteSecurityToken,
    addDeviceCollection
} = require('../db/manageData');
let numberArray = [];

const randomNumber = () => {
    let genNumber = Math.floor(Math.random() * 10);
    while (numberArray[numberArray.length - 1] === genNumber || numberArray[numberArray.length - 1] === genNumber - 1) genNumber = Math.floor(Math.random() * 10);
    return genNumber;
}

const generatePin = (fingerprint) => {
    for (let x = 0; x < 8; x++) numberArray.push(randomNumber());
    const token = numberArray.join('');
    addSecurityToken(fingerprint, token);
    numberArray = [];
    return token;
}


const verifyPin = async (key, fingerprint, email) => {
    const {
        event_time,
        token
    } = await getSecurityToken(fingerprint);
    const tokenExpiry = event_time ? (event_time.seconds * 1000) + 300000 : false;
    const actualTime = Date.parse(new Date());
    if (token === key && tokenExpiry > actualTime) {
        addDeviceCollection({
            fingerprint,
            email
        });
        deleteSecurityToken(fingerprint);
    } else if (tokenExpiry < actualTime) deleteSecurityToken(fingerprint);

    return {
        valid: token === key,
        expired: tokenExpiry < actualTime,
        deleted: !event_time && !token
    }
}

module.exports = {
    generatePin,
    verifyPin
}