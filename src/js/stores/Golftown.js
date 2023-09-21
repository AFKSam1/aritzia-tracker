
import Store from '../models/store.js';
class Golftown extends Store {
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

    static async fetchProduct(url) {

        const parsedData = {};
        const doc = await this.urlToDomParser(url);
        const scriptElement = doc.getElementById("product-data");
        const decodedString = scriptElement.defaultValue.replace(/&quot;/g, '"');

// Then, parse the JSON string into an object
        const jsonObject = JSON.parse(decodedString);

        parsedData.title = jsonObject.name;
        parsedData.price = jsonObject.price;
        parsedData.imgUrl = jsonObject.image;
        parsedData.stockInfo = jsonObject.availability;
        return parsedData;

    }


    static async updateProductPriceAndStock(storeName, url) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);
            // Fetch existing products from 'primitivestore'
            const existingProduct = await this.getProductDataFromChromeStorage(storeName, url);


            // Create updated product object
            const updatedProduct = { ...existingProduct, 
                currentPrice: newProductData.price, 
                stockInfo: newProductData.stockInfo, 
                priceHistory: [...existingProduct.priceHistory, parseFloat(newProductData.price)], 
                discount: Math.round((newProductData.price / existingProduct.priceWhenAdded) * 100)}

            await this.saveProductToChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }



}

export default Golftown;