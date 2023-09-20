// src/services/ProductUpdater.js

import Store from "../models/store.js";
import initializeStoreClasses from "../stores/storeConfig.js";  // Assuming this is how you get the supported stores

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
    
}

export default ProductUpdater;
