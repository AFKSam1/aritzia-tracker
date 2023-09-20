// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Primitiveskate extends Store{
    constructor() {
        super();

    }

    static async fetchPriceAndStock(url) {
        let data = {};
        const doc = await this.urlToDomParser(url);

        const scriptElement = doc.querySelector('script[data-section-type="static-product"]');
        if (scriptElement) {
            const jsonObj = JSON.parse(scriptElement.innerHTML);
            data.price = (jsonObj.product.price / 100).toFixed(2);
            data.stockInfo = jsonObj.product.variants.map(({ title, inventory_quantity }) => ({
                size: title,
                inventoryStatus: inventory_quantity,
            }));
        }
        console.log(data);
        return data;
    }

    static async updateProductPriceAndStock(url, product) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);

            // Fetch existing products from 'aritzia_products'
            
            const existingData = await this.fetchAllProductsData("primitiveskate_products");

            // Create updated product object
            const updatedProduct = { ...product, currentPrice: newProductData.price, stockInfo: newProductData.stockInfo };

            // Update the specific product within the existing data
            existingData[url] = updatedProduct;

            // Store back the complete 'aritzia_products' object
            await new Promise((resolve, reject) => {
                chrome.storage.sync.set({ "aritzia_products": existingData }, function() {
                    if (chrome.runtime.lastError) {
                        return reject(new Error(chrome.runtime.lastError));
                    }
                    resolve();
                });
            });
        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }

    static async updateAllProductsPriceAndStock() {
        //update logic
    }
 
}

export default Primitiveskate;