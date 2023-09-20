// background.js
import Product from "./models/product.js";
import Aritzia from "./stores/aritzia.js";
import Primitiveskate from "./stores/Primitiveskate.js";
import Simons from "./stores/Simons.js";

import helpers from "./utils/helpers.js";

// Initialize store classes and instances
const storeClasses = initializeStoreClasses();
const storeInstances = initializeStoreInstances(storeClasses);

// Chrome runtime message listener
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.command) {
        case "clearChromeStorage":
            clearChromeStorage();
            break;
        case "bookmarkPage":
            await handleBookmarkPage(request.url);
            break;
        case "fetchAllProducts":
            // Your code for fetching all products
            break;
        default:
            console.error("Unknown command");
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.command === "clearChromeStorage") {
        chrome.storage.sync.clear(function () {
            console.log("Storage is cleared.");
        });
    } else if (request.command === "bookmarkPage") {
        console.log("In here b");
        console.log(request.url);

        const url = new URL(request.url);
        const domain = helpers.extractBaseDomain(url);

        await manageBookmarkedProduct(request.url, domain);
    } else if (request.command === "fetchAllProducts") {
      
    }
});


function clearChromeStorage() {
    chrome.storage.sync.clear(() => {
        console.log("Storage is cleared.");
    });
}



async function handleBookmarkPage(url) {
    const parsedUrl = new URL(url);
    const domain = helpers.extractBaseDomain(parsedUrl);
    await manageBookmarkedProduct(url, domain);
}



async function manageBookmarkedProduct(url, domain) {
    try {
        const key = `${domain}_products`;

        if (!storeClasses[domain]) {
            console.error(`No store class found for domain: ${domain}`);
            return;
        }

        if (!storeInstances[domain]) {
            console.log("Initializing store instance...");
            storeInstances[domain] = new storeClasses[domain](domain);
            console.log(`Initialized store instance for domain: ${domain}`);
        } else {
            console.log(`Store instance already exists for domain: ${domain}`);
        }

        console.log("Fetching existing products...");
        let existingProducts = await storeInstances[domain].fetchAllProductsData(key);
        console.log("Fetched existing products:", existingProducts);

        if (!existingProducts.hasOwnProperty(url)) {
            console.log("Fetching additional product data...");
            const additionalProductData = await fetchAdditionalProductData(url, domain);
            console.log("Fetched additional product data:", additionalProductData);

            existingProducts[url] = new Product(
                additionalProductData.title,
                additionalProductData.description,
                additionalProductData.price,
                additionalProductData.stockInfo,
                additionalProductData.imgUrl
            );

            await storeInstances[domain].saveAllProductsData(key, existingProducts);
            let products = await storeInstances[domain].fetchAllProductsData(key);

            console.log(`The store: ${domain} contains these products:`, products);
        }
    } catch (error) {
        console.error(`An error occurred while managing the bookmarked product:`, error);
        console.log(error);  // Log the full error object
    }
}

async function fetchAdditionalProductData(url, domain) {
    const response = await fetch(url);
    const htmlText = await response.text();
  
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, function (tabs) {
            const targetTab = tabs.find((tab) => tab.url.includes(domain));
  
            if (!targetTab) {
                return reject(new Error("No matching tab found"));
            }
  
            chrome.tabs.sendMessage(
                targetTab.id,
                { action: "parseHtml", htmlText: htmlText, domain: domain },
                function (response) {
                    if (chrome.runtime.lastError) {
                        return reject(new Error(chrome.runtime.lastError));
                    }
  
                    resolve(response.parsedData);
                }
            );
        });
    });
}



// Initialize store classes
function initializeStoreClasses() {
    return {
        aritzia: Aritzia,
        primitiveskate:Primitiveskate,
        simons:Simons,
        // add more stores here
    };
}

// Initialize store instances
function initializeStoreInstances(storeClasses) {
    const instances = {};
    for (const [domain, StoreClass] of Object.entries(storeClasses)) {
        instances[domain] = new StoreClass(domain);
    }
    return instances;
}