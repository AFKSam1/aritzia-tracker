// background.js
import Store from "./models/store.js";
import Product from "./models/product.js";
import Aritzia from "./stores/aritzia.js";
import Primitiveskate from "./stores/Primitiveskate.js";
import Simons from "./stores/Simons.js";
import helpers from "./utils/helpers.js";
import { initializeStoreClasses } from "./stores/storeConfig.js";

const storeClasses = initializeStoreClasses();

// Chrome runtime message listener
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.command) {
        case "clearChromeStorage":
            Store.clearAllChromeStorage();
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







async function handleBookmarkPage(url) {
    const parsedUrl = new URL(url);
    const domain = helpers.extractBaseDomain(parsedUrl);
    await manageBookmarkedProduct(url, domain);
}



async function manageBookmarkedProduct(url, domain) {
    try {

        // Check if a static class exists for the domain
        if (!storeClasses[domain]) {
            console.error(`No store class found for domain: ${domain}`);
            return;
        }
        

        
        // Fetch existing product
        console.log("Fetching existing product...");
        let existingProduct = await Store.getProductDataFromChromeStorage(domain, url);
        console.log("Fetched existing product:", existingProduct);


        // If the product URL does not exist in the existing products
        if (!existingProduct) {
            console.log("Fetching additional product data...");
            const additionalProductData = await fetchAdditionalProductData(url, domain);
            console.log("Fetched additional product data:", additionalProductData);

            // Create a new Product instance
            const newProduct = new Product(
                additionalProductData.title,
                additionalProductData.description,
                additionalProductData.price,
                additionalProductData.stockInfo,
                additionalProductData.imgUrl
            );
            // Save all products data
            await Store.setProductDataChromeStorage(domain, url, newProduct);

            // Fetch specific product data again to confirm
            let product = await Store.getProductDataFromChromeStorage(domain, url);
            //console.log(`The store: ${domain} contains this product:`, product);
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

