// background.js
import Aritzia from "./stores/aritzia.js";
import createHeadersObject from "./utils/helpers.js";

const storeClasses = {
    aritzia: Aritzia,
};
const storeConfig = {
    aritzia: {
        addToCartURL: "mylist/add",
        myListUrl: "/Wishlist-GetWishlist?wishListID=",
        wishListId: "wishListID",
    },
    "anotherstore.com": {
        addToCartURL: "cart/add",
    },
};

const storeInstances = {};





chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.command === 'fetchAllProductsData') {
        const storeInstance = storeInstances[request.storeName];
        if (storeInstance) {
            await storeInstance.fetchAllProductsData();
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false });
        }
    } else if (request.command === 'saveProductsToStorage') {
        saveProductsToStorage(request.storeName, request.products);
        sendResponse({ success: true });
    } else if (request.command === 'bookmarkPage') {
        console.log("In here b")
        console.log(request.url)

        const url = new URL(request.url);
        const domain = url.hostname.split(".")[1]; // Extract base domain

        await manageBookmarkedProduct(request.url, domain);
    }
});



async function saveProductsToStorage(storeName, products) {
    const key = `${storeName}_products`;
    chrome.storage.sync.set({ [key]: products }, function () {
        console.log(`Products for ${storeName} saved.`);
    });
}


async function loadProductsFromStorage(storeName, storeInstance) {
    const key = `${storeName}_products`;
    chrome.storage.sync.get([key], function (result) {
        if (result[key]) {
            storeInstance.products = result[key];
        }
    });
}
// ... (existing imports and setup)

async function manageBookmarkedProduct(url, domain) {
    const key = `${domain}_products`;
    let existingProducts = {};

    // Fetch existing products from storage
    await new Promise((resolve) => {
        chrome.storage.sync.get([key], (result) => {
            if (result[key]) {
                existingProducts = result[key];
            }
            resolve();
        });
    });

    // Check if the product with the same URL already exists
    let productExists = existingProducts.hasOwnProperty(url);

    if (!productExists) {
        // If we already have an instance of the store, use it. Otherwise, create a new one.
        const StoreClass = storeClasses[domain];
        if (!storeInstances[domain] && StoreClass) {
            storeInstances[domain] = new StoreClass(domain);
        }

        // Fetch additional product data from URL


        const additionalProductData = await fetchAdditionalProductData(url);

        // Add new product with initial data
        existingProducts[url] = {
            prices: [],
            // Add other fetched product properties as needed
            ...additionalProductData,
        };

        // Save updated product dictionary back to storage
        await new Promise((resolve) => {
            chrome.storage.sync.set({ [key]: existingProducts }, () => {
                console.log(`Product for ${domain} saved.`);
                resolve();
            });
        });
    }
}


async function fetchAdditionalProductData(url, domain) {
    const response = await fetch(url);
    const htmlText = await response.text();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { action: 'parseHtml', htmlText: htmlText, domain: domain }, function (response) {
            console.log(response);
            console.log(response.toString())
            console.log(response.text());
        });
    });
}

