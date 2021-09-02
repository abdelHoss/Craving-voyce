const express = require('express');
const puppeteer = require('puppeteer-core');
const https = require('https');
const restaurant_info = require('../controllers/restaurant_info');
const {
    verifyFingerprint,
    verifyEmailExist,
    addCollection,
    updateCollection,
    deleteCollection
} = require('../db/manageData');
const BROWSER_PATH = 'C:\\Users\\Samha\\OneDrive\\Desktop\\Web Dev\\chrome-win\\chrome.exe';
let requirements = {};

const PORT = process.env.PORT || 5000;
const ORIGIN_URL = 'http://localhost:3000';
const BASE = 'https://www.grubhub.com/search?orderMethod=delivery&locationMode=DELIVERY&facetSet=umamiV2&pageSize=20&hideHateos=true&searchMetrics=true&latitude=';
const app = express();

const environment = {
    mapbox: {
        accessToken: "pk.eyJ1IjoiYWJkZWwtaG9zcyIsImEiOiJja28xNDFieGUwMWRiMnhyeHEyM3hkendnIn0.8xTTj2fBlz5AbmxO202K7g",
    },
    firestore: {
        key: "AIzaSyAx8gL3sDIpYAsZ_ImWmum9NcrgB7xt2FM"
    },
    mailboxvalidator: {
        key: 'LCRRWMB3WPWH2DAB5WA9'
    },
    request: {
        key: "TmV3T3JkZXI4NTQzMmZvckdyZWVuQ3JhdmluZ3RoZURlbGl2ZXJ5Vm95Y2VBbG90TW9yZWV4dHJhdmFnYW50RWFzaWVyU0ltcGxlckJlYXV0aWZ1bE1pa2VSb3RoODk1NjMyQXN0cmF6V2FybmVyQ3V6",
    },
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", ORIGIN_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

const shutdown_browser = async () => {
    await requirements.page.close();
    await requirements.browser.close();
    requirements.close_browser = true;
}



app.post('/find/city/deliveries', async (req, res) => {
    if (req.body.secret_key === environment.request.key) {
        switch (req.body.loop) {
            case false:
                requirements.browser = await puppeteer.launch({
                    executablePath: BROWSER_PATH,
                    headless: false
                });
                await type_address(req.body.coordinates[1], req.body.coordinates[0], req.body.category)
                    .then(async (response) => {
                        if (requirements.close_browser) {
                            shutdown_browser();
                        } else {
                            res.json({
                                content: response.content || false,
                                loop: response.loop
                            });
                        }
                    });

                break;
            case true:
                if (!requirements.close_browser) {
                    await restaurant_info.get_restaurant(requirements.browser, requirements.page, req.body.index).then(async (data_res) => {
                        if (data_res && (requirements.close_browser || data_res.next_disabled)) {
                            shutdown_browser();
                        }
                        if (!requirements.close_browser) res.json(data_res);
                    });
                } else {
                    shutdown_browser();
                }

                break;
        }
    } else {
        res.end('Wrong key!');
    }

});


app.post('/close/browser', async (req, res) => {
    if (req.body.secret_key === environment.request.key) {
        requirements.close_browser = true;
        console.log('Close browser called');
        res.end('Browser instance closed');
    }
});


app.post('/verify/fingerprint', (req, res) => {
    if (req.body.secret_key === environment.request.key) {
        verifyFingerprint(req.body.fingerprint).then(({
            found_record,
            email_record
        }) => res.json({
            found_record,
            email_record
        }))

    } else {
        res.end('Wrong secret key')
    }
});

app.post('/verify/email/exist', (req, res) => {
    if (req.body.secret_key === environment.request.key) {
        verifyEmailExist(req.body.email)
            .then(length => {
                if (length >= 10) {
                    res.json({
                        response: false,
                        error: 'You cannot link more than 10 devices to the same email, try another one'
                    })
                } else if (length >= 1) {
                    updateCollection({
                        fingerprint: req.body.fingerprint,
                        email: req.body.email.toLowerCase()
                    })
                    res.json({
                        response: true
                    });

                } else {
                    https.get(`https://api.mailboxvalidator.com/v1/validation/single?email=${req.body.email}&key=${environment.mailboxvalidator.key}`, mailResponse => {
                        let data = '';
                        mailResponse.on('data', (chunk) => data += chunk);
                        mailResponse.on('end', () => {
                            let email_valid = eval(JSON.parse(data).status.toLowerCase());
                            if (email_valid) {
                                addCollection({
                                    fingerprint: req.body.fingerprint,
                                    email: req.body.email.toLowerCase(),
                                })
                            }
                            res.json({
                                response: email_valid,
                                error: 'This email do not exist'
                            });
                        });
                    }).on("error", () => console.log('Http request error'));
                }
            });

    } else {
        res.end('Wrong Key!!');
    }
});


app.post('/delete/device/fingerprint', async (req, res) => {
    if (environment.request.key === req.body.secret_key) {
        await deleteCollection(req.body.fingerprint);
        res.end('true');
    } else {
        res.end('Wrong key!!');
    }
});


async function type_address(latt, long, selection) {
    let base_url = `${BASE}${latt}&longitude=${long}&queryText=${selection}&preciseLocation=true&facet=open_now%3Atrue&sortSetId=umamiv3&countOmittingTimes=true&includeOffers=true&sponsoredSize=3`;
    try {
        requirements.close_browser = false;
        const page = await requirements.browser.newPage();
        page.setViewport({
            width: 1366,
            height: 768
        });
        await page.goto(base_url, {
            timeout: 60000
        });
        requirements.page = page;
        await page.waitForTimeout(2000);
        const not_found = await page.$('[data-testid="no-results-variant-title"]');
        if (not_found === null || not_found === undefined) {
            let rest_cards = await page.$$('.restaurantCard-search');
            requirements.content = true;
            requirements.loop = rest_cards.length;

        } else {
            requirements.content = false;
            requirements.loop = 0;
            await requirements.browser.close();
        }
        return requirements;

    } catch (err) {
        console.log('Server error caught');
        if (err instanceof TimeoutError) await requirements.browser.close();
    }
}