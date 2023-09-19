class Store {
    constructor(name) {
        this.name = name;
    }
  
 

    async fetchPriceAndStock(url){

    }

    async fetchAllProductsData(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([key], function(result) {
              if (chrome.runtime.lastError) {
                return reject(new Error(chrome.runtime.lastError));
              }
              resolve(result[key] || {});
            });
          });
    }
    
    
    async saveAllProductsData(key,products){
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

    async updateProductPriceAndStock(url, product) {
        // Generic update logic (likely overridden by subclasses)
    }
    async updateAllProductsPriceAndStock() {

    }
}
export default Store;
