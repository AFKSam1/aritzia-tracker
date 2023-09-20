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

    static async fetchPriceAndStock(url) {
        throw new Error("This method must be overridden by subclass");
    }

    static async getAllProductsDataFromChromeStorage(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], function (result) {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                resolve(result[key] || {});
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

    static async saveProductToChromeStorage(storeName, url, productData) {
        const key = `${storeName}_${url}`;
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({ [key]: productData }, function () {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError));
                }
                console.log("This product has been saved :", productData);
                resolve();
            });
        });
    }

    static async updateProductPriceAndStock(storeName, url) {
        throw new Error("This method must be overridden by subclass");
    }

}
export default Store;
