class Store {
    constructor() { }

    static async clearSpecificKey(key) {
        chrome.storage.sync.remove(key, () => {
            console.log(`Specific ${key} is cleared.`);
        });
    }

    static async urlToDomParser(url) {
        const response = await fetch(url);
        const htmlText = await response.text();
        let parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        return doc;
    }

    static async clearAllChromeStorage() {
        chrome.storage.sync.clear(() => {
            console.log("Storage is cleared.");
        });
    }

    static async fetchPriceAndStock(url) { }

    static async fetchAllProductsData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], function (result) {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                resolve(result[key] || {});
            });
        });
    }

    static async saveAllProductsData(key, products) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [key]: products }, function () {
                console.log(`Products for ${key} saved.`);
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                resolve();
            });
        });
    }

    static async getProductDataFromChromeStorage(storeName, url) {
        const key = `${storeName}_${url}`;
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], function (result) {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                resolve(result[key] || null);

            });
        });
    }

    static async setProductDataChromeStorage(storeName, url, productData) {
        const key = `${storeName}_${url}`;
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [key]: productData }, function () {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                console.log(`Product for ${key} saved.`);
                resolve();
            });
        });
    }

    static async updateProductPriceAndStock(storeName, url) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);

            // Fetch existing products from 'aritzia_products'
            const existingProduct = await Store.getProductDataFromChromeStorage(storeName, url);


            // Create updated product object
            const updatedProduct = { ...existingProduct, currentPrice: newProductData.price, stockInfo: newProductData.stockInfo };


            await Store.setProductDataChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }


    static async updateAllProductsPriceAndStock() { }
}
export default Store;
