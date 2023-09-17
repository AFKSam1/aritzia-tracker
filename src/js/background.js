import Product from './models/Product.js';
import Store from './models/Store.js';
import { StoreName } from './src/popup/models/StoreName.js';
const ADD_TO_CART_URL = 'https://www.aritzia.com/en/mylist/add';
const addCartURLPattern = `${ADD_TO_CART_URL}*`;
let currentRequestHeaders;
let isFetching = false;
const myStore = new Store(StoreName.ARITZIA);
function initializeStoreFromStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['products'], (result) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                const products = JSON.parse(result.products || '[]');
                products.forEach((productData) => {
                    const product = new Product(productData.pid, productData.name, productData.price, productData.imgURL, productData.prodURL);
                    myStore.addProduct(product);
                });
                resolve();
            });
        });
    });
}
function createHeadersObject(headers = []) {
    const headersObject = {};
    headers.forEach(header => {
        if (header.name && header.value) {
            headersObject[header.name] = header.value;
        }
    });
    return headersObject;
}
function fetchProductData(url, headers) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: headers
            });
            const data = yield response.json();
            const productData = data.wishlist[0];
            const product = new Product(productData.pid, productData.name, parseFloat(productData.listPrice.replace('$', '')), productData.imgURL, productData.prodURL);
            myStore.addProduct(product);
            console.log(myStore.getProducts());
            updateStorage();
        }
        catch (error) {
            console.error('Error fetching product data:', error);
        }
    });
}
function updateStorage() {
    chrome.storage.local.set({ [StoreName.ARITZIA]: JSON.stringify(myStore.getProducts()) }, () => {
        if (chrome.runtime.lastError) {
            console.error('An error occurred:', chrome.runtime.lastError);
        }
    });
}
initializeStoreFromStorage().then(() => {
    chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
        var _a;
        if ((_a = details.url) === null || _a === void 0 ? void 0 : _a.includes(ADD_TO_CART_URL)) {
            currentRequestHeaders = details.requestHeaders;
        }
    }, { urls: [addCartURLPattern] }, ['requestHeaders']);
    chrome.webRequest.onCompleted.addListener((details) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (((_a = details.url) === null || _a === void 0 ? void 0 : _a.includes(ADD_TO_CART_URL)) && !isFetching) {
            isFetching = true;
            const headers = createHeadersObject(currentRequestHeaders);
            yield fetchProductData(details.url, headers);
            isFetching = false;
        }
    }), { urls: [addCartURLPattern] });
}).catch((error) => {
    console.error('Failed to initialize store:', error);
});
