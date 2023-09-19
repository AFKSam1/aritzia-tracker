// background.js
import Product from "./models/product.js";
import Aritzia from "./stores/aritzia.js";
import helpers from "./utils/helpers.js";

const storeClasses = {
    aritzia: Aritzia,
    // add more stores here
};

const storeInstances = {};

for (const [domain, StoreClass] of Object.entries(storeClasses)) {
    storeInstances[domain] = new StoreClass(domain);
}

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


async function manageBookmarkedProduct(url, domain) {
    try {
        const key = `${domain}_products`;

        if (!storeClasses[domain]) {
            console.error(`No store class found for domain: ${domain}`);
            return;
        }

        if (!storeInstances[domain]) {
            storeInstances[domain] = new storeClasses[domain](domain);
        }

        let existingProducts = await storeInstances[domain].fetchAllProductsData(key);

        if (!existingProducts.hasOwnProperty(url)) {
            const additionalProductData = await fetchAdditionalProductData(url, domain);

            existingProducts[url] = new Product(
                additionalProductData.title,
                additionalProductData.description,
                additionalProductData.price,
                additionalProductData.imgUrl
            );

            await storeInstances[domain].saveAllProductsData(key, existingProducts);
            let products = await storeInstances[domain].fetchAllProductsData(key);

            console.log(`The store: ${domain} contains these products:`, products);
        }
    } catch (error) {
        console.error(`An error occurred while managing the bookmarked product: ${error}`);
    }
}

async function fetchAdditionalProductData(url, domain) {
    const response = await fetch(url);
    const htmlText = await response.text();

    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, function (tabs) {
            const aritziaTab = tabs.find((tab) => tab.url.includes("aritzia.com"));

            if (!aritziaTab) {
                return reject(new Error("No matching tab found"));
            }

            chrome.tabs.sendMessage(
                aritziaTab.id,
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
