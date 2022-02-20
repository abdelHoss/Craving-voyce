//  قال ألمألف 
// قد يقال

require('dotenv').config({});
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


module.exports = async ([long, latt], selection) => {
    const first_url = 'https://www.ubereats.com/search?diningMode=DELIVERY&pl=';
    const second_url = `%7B%22address%22%3A%22%20%20%20%22%2C%22reference%22%3A%22%22%2C%22referenceType%22%3A%22google_places%22%2C%22latitude%22%3A${latt}%2C%22longitude%22%3A${long}%7D`;
    const url = first_url + Buffer.from(second_url).toString('base64') + '&q=' + selection;
    let restaurants;
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, {
        timeout: 0,
        waitUntil: 'networkidle0'
    });
    const dom = await page.evaluate(() => document.querySelector('#main-content').innerHTML);
    await browser.close();
    restaurants = get_data(dom)
    return restaurants;
}


const get_data = html => {
    const $ = cheerio.load(html);
    const restaurants_info = filter_restaurant($);
    return restaurants_info;
}


const filter_restaurant = $ => {
    const anti_restaurant_keywords = ['grocery', 'supermarket', 'market', 'deli ', 'pharmacy', 'drugstore', 'convenience store', 'store', 'grocer', 'god', 'divin', 'angel', 'paradise', '7-eleven', 'alcohol', 'dépanneur'];
    const elements = $('a[href*="/store/"] ~ div').parent();
    let restaurants_data = [];
    elements.each((index, item) => {
        const warning = ($(item).find('a[href*="/store/"] ~ div').text()).toLowerCase().search(/unavailable|no couriers|pick it|closed/) !== -1;
        const restaurant_details = $(item).find('a[href*="/store/"] ~ div div').children().eq(1).text();
        const not_restaurant = anti_restaurant_keywords.some(key => restaurant_details.toLowerCase().includes(key));
        if (!warning && !not_restaurant) {
            restaurants_data.push({
                link: 'https://www.ubereats.com' + $(item).find('a[href*="/store/"]').attr('href'),
                delivery_time: restaurant_details.slice(restaurant_details.length - 10, restaurant_details.length - 4),
                delivery_fee: restaurant_details.slice(restaurant_details.lastIndexOf('$') + 1, restaurant_details.lastIndexOf('Delivery Fee'))
            })
        }
        return index < 19;
    });
    return restaurants_data;
}