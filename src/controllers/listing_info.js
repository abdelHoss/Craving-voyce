//قال ألمألف
const other_keywords = ['god', 'divin', 'angel', 'paradise'];
const drink_keywords = ['pepsi', 'coca-cola', 'cola', 'coke', 'tea', 'water', 'snapple', 'gatorade', 'powerade', 'sprite', 'perrier', 'crush', '7-up', 'soda', 'lemonade', 'cofee', 'juice', 'cappuccino', 'mocha', 'latte', 'san pelegrino', 'shake', 'smoothie', 'shake', 'drink', 'lassi', 'cafe', 'espresso', 'macchiato', 'mountain dew', 'brisk', 'sierra mist', 'red bull', 'ginger ale', 'canada dry', 'schweppes', 'bottle', 'fresca', 'fountain', 'can', 'monster', 'kombucha'];
const alcohol_keywords = ['beer', 'lager', 'rosé', 'wine', 'must be 21', 'chardonnay', 'whiskey', 'booze', 'liquor', 'spirits', 'moonshine', 'bourbon', 'brandy', 'brut', 'cassis', 'champagne', 'chianti', 'congeners', 'stout', 'bud light'];
const household_keywords = ['toothpaste', 'shampoo', 'colgate', 'tampons', 'always thin', 'bounty', 'tissue', 'charmin', 'dawn', 'downy', 'tide', 'dynamo', 'laundry', 'detergent', 'palmolive', 'ivory', 'ajax', 'crest', 'soap', 'listerine', 'deodorant', 'dove', 'stick', 'gillette', 'axe', 'bleach', 'disinfectants', 'towel', 'toilet', 'paper', 'wipe', 'gels', 'pets', 'cartridge', 'wood', 'vase', 'flowers', 'dishwash', 'glass', 'candle', 'refresher', 'carpet', 'bath', 'plastic', 'swiffer', 'sponges', 'bag'];
const wearing_keywords = ['gloves', 'mask', 'face shield', 'leather'];
const smoking_keywords = ['cigarette', 'vape', 'pod', 'juul', 'puff', 'nicotine'];
const candies_keyword = ['gummies', 'candy', ];
const animal_keywords = ['cat', 'dog', 'rat', 'ant']
const care_keywords = ['pill', 'advil', 'tylenol', 'sinus', 'motrin', 'nyquil', 'dayquil', 'aleve', 'excedrin', 'bayer', 'midol', 'alka-seltzer', 'benedryl', 'emergen', 'zantac', 'pepto bismol', 'imodium', 'abreva', 'aspirin', 'tablets', 'airborne', 'first aid', 'thermometer', 'tagamet', 'cbd', 'medicine', 'allergy', 'anti-biotic', 'gas', 'relief', 'fever', 'band-aid', 'care', 'sanitizer', 'drug', 'wash', 'shaving', 'razor'];
const meat_keywords = ['meat', 'beef', 'chicken', 'chickin', 'wing', 'hen', 'kabab', 'pork', 'fish', 'trout', 'shrimp', 'lamb', 'salmon', 'alcohol', 'bacon', 'pepperoni', 'turkey', 'hamburger', 'cheeseburger', 'sausage', 'steak', 'tuna', 'tilapia', 'crustacean', 'shellfish', 'ahi', 'angus', 'duck', 'capon', 'bushmeat', 'broiler', 'filet mignon', 'mutton', 'sheep', 'ham', 'quail,', 'veal', 'pigeon', 'pastrami', 'pheasant', 'bitlong', 'venison', 'wagyu', 'woodcock', 'squab', 'pancetta', 'fryer', 'trotter', 'partridge', 'gammon', 'seafood', 'poultry', 'deer', 'offal', 'cow', 'lobster', 'bison', 'goat', 'pig', 'buffalo wing', 'patty', 'ribs', 'calamari'];
const anti_vegetarian_keywords = [...other_keywords, ...drink_keywords, ...alcohol_keywords, ...wearing_keywords, ...smoking_keywords, ...household_keywords, ...candies_keyword, ...animal_keywords, ...meat_keywords, ...care_keywords];

const get_listing = async (page, restaurant_info) => {
    const list_filter = anti_vegetarian_keywords;
    let body_content = await page.evaluate((infos = restaurant_info, filters = list_filter) => {
        let content_promise = new Promise((resolve) => {
            const scroll_timer = setInterval(() => {
                if (window.pageYOffset >= window.document.body.scrollHeight - 1000) {
                    clearInterval(scroll_timer);
                    resolve(document.querySelectorAll('.restaurantPageMenu-content .menuItem-group > .menuItem'));
                }
                window.scrollBy(0, window.innerHeight);
            }, 150);
        });

        return content_promise.then(async (htmlContent) => {
            let product_info = [];
            htmlContent.forEach((element) => {
                let description = element.querySelector('.menuItemNew-description--truncate').innerText;
                let title = element.querySelector('.menuItem-name').innerText;
                let filter_clear = true;
                for (let keywords of filters) {
                    if ((description.toLowerCase()).search(keywords) !== -1 || (title.toLowerCase()).search(keywords) !== -1) {
                        filter_clear = false;
                    }
                }
                if (filter_clear) {
                    let image_url = element.querySelector('.menuItemNew-imageMagazine-img');
                    let id_attribute = element.querySelector('.menuItem .s-card-wrapper').getAttribute('id');
                    id_attribute = id_attribute.slice(9, id_attribute.length);
                    if (image_url !== null) {
                        image_url = image_url.src
                    };
                    product_info.push({
                        title: title,
                        description: description,
                        price: element.querySelector('.menuItem-displayPrice').innerText,
                        image: image_url,
                        link: `${window.location.href}/menu-item/${id_attribute}`,
                        delivery_time: `${infos.delivery_time} min`,
                        delivery_fee: infos.delivery_fee,
                        restaurant_name: infos.restaurant_name
                    });
                }
            });
            return product_info;
        });
    }, infos = restaurant_info, filters = list_filter);
    await page.waitForTimeout(1000);
    return body_content;
}



module.exports = {
    get_listing
}