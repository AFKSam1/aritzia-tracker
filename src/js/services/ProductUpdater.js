// src/services/ProductUpdater.js

import Store from "../models/store.js";
import initializeStoreClasses from "../stores/storeConfig.js";
import helpers from "../utils/helpers.js"
import Product from "../models/Product.js";

class ProductUpdater {
    static async updateAllProductPricesAndStock() {
        try {
            const allKeys = await this.getAllKeysFromStorage();  // You'll need to implement this method in Store
            const supportedStores = Object.keys(initializeStoreClasses.initializeStoreClasses());

            for (const key of allKeys) {
                const [storeName, url] = key.split('_');
                if (supportedStores.includes(storeName)) {
                    const StoreClass = initializeStoreClasses.initializeStoreClasses()[storeName];
                    await StoreClass.updateProductPriceAndStock(storeName, url);
                }
            }
        } catch (error) {
            console.error("Error updating all product prices:", error);
        }
    }

    static async getAllKeysFromStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (allData) => {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }

                const allKeys = Object.keys(allData);
                resolve(allKeys);
            });
        });
    }



    static async handleBookmarkPage(url) {
        const parsedUrl = new URL(url);
        const domain = helpers.extractBaseDomain(parsedUrl);
        await this.manageBookmarkedProduct(url, domain);
    }



    static async manageBookmarkedProduct(url, domain) {
        try {
            const storeClasses = initializeStoreClasses.initializeStoreClasses();
            // Check if a static class exists for the domain
            if (!storeClasses[domain]) {
                console.error(`No store class found for domain: ${domain}`);
                return;
            }



            //Looking if the product is already stored by the extension
            let existingProduct = await Store.getProductDataFromChromeStorage(domain, url);


            // If the product URL isnt stored
            if (!existingProduct) {

                const StoreClass = storeClasses[domain];

                const additionalProductData = await StoreClass.fetchProduct(url);
                console.log("Found this data for the new product :", additionalProductData);

                // Create a new Product instance
                const newProduct = new Product(
                    additionalProductData.title,
                    additionalProductData.description,
                    additionalProductData.price,
                    additionalProductData.stockInfo,
                    additionalProductData.imgUrl
                );
                // Save products to chrome storage
                await Store.saveProductToChromeStorage(domain, url, newProduct);

                let product = await Store.getProductDataFromChromeStorage(domain, url);
            }
        } catch (error) {
            console.error(`An error occurred while managing the bookmarked product:`, error);
            console.log(error);  // Log the full error object
        }
    }

    static async fetchProductData(url, domain) {
        const storeClasses = initializeStoreClasses.initializeStoreClasses();
        if (!storeClasses[domain]) {
            console.error(`No store class found for domain: ${domain}`);
            return;
        }
        storeClasses[domain].fetchProduct(url);
    }






}

export default ProductUpdater;
