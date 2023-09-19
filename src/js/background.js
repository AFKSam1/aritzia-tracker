// background.js
import Product from "./models/product.js";
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
    if (request.command === 'clearChromeStorage') {
        chrome.storage.sync.clear(function() {
            console.log('Storage is cleared.');
        });

    } else if (request.command === 'bookmarkPage') {
        console.log("In here b")
        console.log(request.url)

        const url = new URL(request.url);
        const domain = url.hostname.split(".")[1]; // Extract base domain

        await manageBookmarkedProduct(request.url, domain);
    }
});



async function manageBookmarkedProduct(url, domain) {
    const key = `${domain}_products`;
          // If we already have an instance of the store, use it. Otherwise, create a new one.
          const StoreClass = storeClasses[domain];
          if (!storeInstances[domain] && StoreClass) {
              storeInstances[domain] = new StoreClass(domain);
          }

    // Fetch existing products from storage
    let existingProducts = await storeInstances[domain].fetchAllProductsData(key);

    // Check if the product with the same URL already exists
    let productExists = existingProducts.hasOwnProperty(url);

    if (!productExists) {
  



        const additionalProductData = await fetchAdditionalProductData(url,domain);

        // Add new product with initial data
        existingProducts[url] = new Product(
            additionalProductData.title,
            additionalProductData.description,
            additionalProductData.price,
            additionalProductData.imgUrl
        )
        
        
        await storeInstances[domain].saveAllProductsData(key,existingProducts);
        let products = await storeInstances[domain].fetchAllProductsData(key);
        console.log(products);
    }
}


async function fetchAdditionalProductData(url, domain) {
    const response = await fetch(url);
    const htmlText = await response.text();

    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, function (tabs) {
            const aritziaTab = tabs.find(tab => tab.url.includes("aritzia.com"));

            if (!aritziaTab) {
                return reject(new Error("No matching tab found"));
            }

            chrome.tabs.sendMessage(aritziaTab.id, { action: 'parseHtml', htmlText: htmlText, domain: domain }, function (response) {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }

                resolve(response.parsedData);
            });
        });
    });
}

