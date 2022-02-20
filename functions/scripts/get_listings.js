//  قال ألمألف 
// قد يقال

const cheerio = require('cheerio');
const axios = require('axios');

const other_keywords = ['god', 'divin', 'angel', 'paradise', 'heaven', 'lamb', 'agneau', 'boneless', 'wings', 'non veg', 'not veg', 'announcement', 'covid', 'utensils', 'refill'];
const alcohol_keywords = ['alcohol', 'abv', 'beer', 'ale', 'brew', 'lager', 'rosé', 'wine', 'pinot', 'must be 21', 'chardonnay', 'whiskey', 'vodka', 'booze', 'liquor', 'spirits', 'moonshine', 'bourbon', 'brandy', 'brut', 'cassis', 'champagne', 'chianti', 'congeners', 'stout', 'bud light', 'coors light', 'peroni', 'seltzer', 'vin', 'mousseux', 'bière'];
const meat_keywords = ['meat', 'beef', 'boeuf', 'bœuf', 'chicken', 'checken', 'poulet', 'wing', 'hen', 'kabab', 'kafta', 'kibe', 'kebe', 'kebbe', 'shawarma', 'shish taouk', 'pork', 'porc', 'fish', 'trout', 'shrimp', 'salmon', 'bacon', 'pepperoni', 'turkey', 'hamburger', 'sausage', 'steak', 'tuna', 'tilapia', 'crustacean', 'shellfish', 'ahi', 'angus', 'duck', 'capon', 'bushmeat', 'broiler', 'filet mignon', 'mutton', 'sheep', 'ham', 'quail,', 'veal', 'pigeon', 'pastrami', 'pheasant', 'bitlong', 'venison', 'wagyu', 'woodcock', 'squab', 'pancetta', 'fryer', 'trotter', 'partridge', 'gammon', 'seafood', 'poultry', 'deer', 'offal', 'cow', 'lobster', 'bison', 'goat', 'pig', 'buffalo wing', 'patty', 'ribs', 'calamari', 'octopus', 'viande'];
const anti_vegetarian_keywords = [...alcohol_keywords, ...meat_keywords];
const pro_vegan_keywords = ['vegan', 'végétalien', 'végé', 'meatless', 'beyond meat', 'beyond meet', 'beyond sausage', 'beyond burger', 'impossible burger', 'plant based']

module.exports = async (restaurant_info) => {
    try {
        const final_data = [];
        const dom = await axios.get(restaurant_info.link, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0"
            }
        });
        const object = await filter_data(dom.data, restaurant_info);
        final_data.push(...object);
        return final_data;
    } catch (err) {
        return err;
    }
}


const filter_data = async (dom, information) => {
    const $ = cheerio.load(dom);
    let final_object = [];
    const object = JSON.parse($('script[type="application/ld+json"]').html());
    const cards = object.hasMenu ? object.hasMenu.hasMenuSection : [];

    for (let items of cards) {
        items.hasMenuItem.map(item => {
            const title_and_description = (item.name + item.description).toLowerCase();
            const filter_accepted = (anti_vegetarian_keywords.some(key => title_and_description.includes(key)) === false || pro_vegan_keywords.some(key => title_and_description.includes(key))) &&
                other_keywords.some(key => title_and_description.includes(key)) === false;
            if (filter_accepted) {
                final_object.push({
                    title: item.name,
                    description: item.description,
                    price: `${(item.offers.price / 100).toFixed(2)}`,
                    link: information.link,
                    image: decodeURIComponent(object.image[0].replace(/\\\\u0022|\\u0022/g, '"')),
                    delivery_time: information.delivery_time,
                    delivery_fee: information.delivery_fee,
                    restaurant_name: object.name
                })
            }
        })
    }
    return final_object;
}