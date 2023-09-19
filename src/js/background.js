// background.js
import Aritzia from "./stores/aritzia.js";
import createHeadersObject from "./utils/helpers.js";
// import more store classes as needed

const storeClasses = {
    aritzia: Aritzia,
    // Add more mappings here as needed
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

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        let url = new URL(details.url);
        let domain = url.hostname.split(".")[1]; // Extract base domain
        if (storeConfig.hasOwnProperty(domain)) {
            const config = storeConfig[domain];

            if (details.url.includes(config.addToCartURL)) {
                if (!storeInstances[domain]) {
                    const StoreClass = storeClasses[domain];
                    if (StoreClass) {
                        storeInstances[domain] = new StoreClass(domain);
                        loadProductsFromStorage(domain, storeInstances[domain]);

                    }
                }
                if (storeInstances[domain]) {
                    storeInstances[domain].setHeaderObject(createHeadersObject(details.requestHeaders));
                }
              }
            }
          },
          { urls: ['<all_urls>'] },
          ['requestHeaders']
        );

        
chrome.webRequest.onCompleted.addListener(
    function (details) {
        const url = new URL(details.url);
        const domain = url.hostname.split(".")[1]; // Extract base domain

        if (storeConfig.hasOwnProperty(domain)) {
            const config = storeConfig[domain];

            if (details.url.includes(config.addToCartURL)) {
                if (!storeInstances[domain]) {
                    const StoreClass = storeClasses[domain];
                    if (StoreClass) {
                        storeInstances[domain] = new StoreClass(domain);
                        loadProductsFromStorage(domain, storeInstances[domain]);
                    }
                }

                if (storeInstances[domain] && !storeInstances[domain].isFetching) {
                    storeInstances[domain].handleAddToCart(details.url);
                    console.log("Cart contains : ", storeInstances[domain].getAllProducts());
                }
            }
        }
    },
    { urls: ["<all_urls>"] }
);

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
    } // Handle other commands...
});



async function saveProductsToStorage(storeName, products) {
    const key = `${storeName}_products`;
    chrome.storage.sync.set({ [key]: products }, function() {
        console.log(`Products for ${storeName} saved.`);
    });
}


async function loadProductsFromStorage(storeName, storeInstance) {
    const key = `${storeName}_products`;
    chrome.storage.sync.get([key], function(result) {
        if (result[key]) {
            storeInstance.products = result[key];
        }
    });
}
