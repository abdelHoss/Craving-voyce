const {
    TimeoutError
} = require('puppeteer-core');
const listing = require('./listing_info');
const anti_restaurant_keywords = ['grocery', 'supermarket', 'pharmacy', 'drugstore', 'convenience store', 'store', 'grocer'];

async function get_restaurant(browser, page, index) {
    try {

        await page.setDefaultNavigationTimeout(0);
        let rest_cards = await page.$$('.restaurantCard-search');
        let loop_times = rest_cards.length;
        let loop_again = false;
        let is_next_disabled = false;
        const warning = await rest_cards[index].$('.u-text-warning');
        const title = await rest_cards[index].$eval('.restaurant-name', name => name.innerText);
        const not_restaurant = anti_restaurant_keywords.some(key => title.toLowerCase().includes(key));

        if ((warning === undefined || warning === '' || warning === null) && !not_restaurant) {
            let restaurant_info = {
                "restaurant_link": `https://www.grubhub.com${await rest_cards[index].$eval('a.restaurant-name', link => link.getAttribute('href'))}`,
                "delivery_time": await rest_cards[index].$eval('.timeEstimate span.value.h5', del => del.innerText),
                "delivery_fee": await rest_cards[index].$eval('span[data-testid="text-delivery-fee"]', fee => fee.innerText),
                "restaurant_name": await rest_cards[index].$eval('.restaurant-name', name => name.innerText)
            }
            const list_page = await browser.newPage();
            await list_page.goto(restaurant_info.restaurant_link, {
                timeout: 60000
            });
            await list_page.waitForTimeout(2000);
            get_content = await listing.get_listing(list_page, restaurant_info).then(async (content) => {
                await list_page.close();
                return content;
            });

        }
        if (index === loop_times - 1) {
            is_next_disabled = await page.evaluate((loop_times = loop_times) => {
                const list = document.querySelectorAll('.pagination > .page-item');
                if (list[list.length - 2] !== undefined || loop_times > 19) {
                    return list[list.length - 2].classList.contains('disabled');
                } else {
                    return true;
                }
            }, loop_times = loop_times);
            if (!is_next_disabled) {
                let link = await page.url();
                const pageIndex = link.indexOf('pageNum=');
                if (pageIndex === -1) {
                    link = link.concat('&pageNum=2');
                } else {
                    let newPageIndex = Number(link.slice(pageIndex + 8, pageIndex + 9)) + 1;
                    link = link.replace(`pageNum=${newPageIndex - 1}`, `pageNum=${newPageIndex}`);
                }
                await page.goto(link, {
                    timeout: 60000
                });
                await page.waitForTimeout(2000);

                rest_cards = await page.$$('.restaurantCard-search');
                loop_times = await rest_cards.length;
                loop_again = true;
            }
        }

        return {
            content: get_content,
            loop_again: loop_again,
            loop_times: loop_times,
            next_disabled: is_next_disabled
        }
    } catch (err) {
        if (err instanceof TimeoutError) await browser.close();
    }
}

module.exports = {
    get_restaurant
};