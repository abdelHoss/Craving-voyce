const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
require('dotenv').config({});
const security_key_error = 'Wrong Security key!!';
const get_restaurants = require('./scripts/get_restaurants');
const get_listings = require('./scripts/get_listings');
const {
    verifyFingerprint,
    verifyEmailExist,
    updateDeviceCollection,
    deleteDeviceCollection,
    deleteSecurityToken
} = require('./db/manageData');
const sendEmail = require('./smtp/emailManager');
const {
    generatePin,
    verifyPin,
} = require('./smtp/pinGenerator');

const app = express();
const corsConfig = {
    origin: process.env.ORIGIN_URL,
    optionsSuccessStatus: 200
}
app.use(cors(corsConfig));
app.use(express.json());

app.post('/verify/fingerprint', (req, res) => {
    if (req.body.secret_key === process.env.REQUEST_KEY) {
        verifyFingerprint(req.body.fingerprint).then(record => res.end(JSON.stringify(record)))
    } else res.end(security_key_error);
});

app.post('/verify/email/exist', (req, res) => {
    if (req.body.secret_key === process.env.REQUEST_KEY) {
        verifyEmailExist(req.body.email)
            .then(length => {
                if (length >= 1 && length < 10) {
                    updateDeviceCollection({
                        fingerprint: req.body.fingerprint,
                        email: req.body.email.toLowerCase()
                    })

                } else if (length === 0) {
                    const token = generatePin(req.body.fingerprint);
                    sendEmail(req.body.email, token);
                    setTimeout(() => deleteSecurityToken(req.body.fingerprint), 300000);
                }
                res.end(JSON.stringify({
                    response: length < 10,
                    error: length >= 10 ? 'You cannot link more than 10 devices to the same email, try another one' : '',
                    length
                }));
            });
    } else res.end(security_key_error);

});

app.post('/verify/security/pin', (req, res) => {
    const {
        secret_key,
        security_pin,
        fingerprint,
        email
    } = req.body;
    if (process.env.REQUEST_KEY === secret_key) {
        verifyPin(security_pin, fingerprint, email)
            .then(verified => res.end(JSON.stringify(verified)))
    }
})

app.post('/delete/security/pin', (req, res) => {
    if (process.env.REQUEST_KEY === req.body.secret_key) {
        deleteSecurityToken(req.body.fingerprint);
        res.end('true');
    } else res.end(security_key_error);
})

app.post('/delete/device/fingerprint', async (req, res) => {
    if (process.env.REQUEST_KEY === req.body.secret_key) {
        await deleteDeviceCollection(req.body.fingerprint);
        res.end('true');
    } else res.end(security_key_error);
});


app.post('/get/restaurant/links', async (req, res) => {
    const {
        secret_key,
        coordinates,
        category,
    } = req.body;
    if (secret_key === process.env.REQUEST_KEY) {
        const restaurant_informations = await get_restaurants(coordinates, category);
        res.end(JSON.stringify(restaurant_informations));
    } else res.end(security_key_error);
});

app.post('/find/restaurants/deliveries', async (req, res) => {
    if (req.body.secret_key === process.env.REQUEST_KEY) {
        const food_listings = await get_listings(req.body);
        res.end(JSON.stringify(food_listings));
    } else res.end(security_key_error);
})

exports.cravingvoycemodel = functions.runWith({
    memory: '2GB',
    timeoutSeconds: 180,
}).https.onRequest(app);