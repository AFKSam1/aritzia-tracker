
import Store from '../models/store.js';
import helpers from "../utils/helpers.js"

class Golftown extends Store {
    constructor() {
        super();
    }

    static async fetchPriceAndStock(url) {
        const parsedData = {};
        const doc = await this.urlToDomParser(url);
        const scriptElement = doc.getElementById("product-data");
        const decodedString = scriptElement.defaultValue.replace(/&quot;/g, '"');

        const jsonObject = JSON.parse(decodedString);
        parsedData.price = jsonObject.price;
        parsedData.stockInfo = jsonObject.availability;
        return parsedData;
    }

    static async fetchProduct(url) {

        const parsedData = {};
        const doc = await this.urlToDomParser(url);
        const scriptElement = doc.getElementById("product-data");
        const decodedString = scriptElement.defaultValue.replace(/&quot;/g, '"');
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
            const updatedProduct = {
                ...existingProduct,
                currentPrice: newProductData.price,
                stockInfo: newProductData.stockInfo,
                priceHistory: [...existingProduct.priceHistory, parseFloat(newProductData.price)],
                discount: helpers.discountPercentCalc(newProductData.price,existingProduct.priceWhenAdded)
            }

            await this.saveProductToChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }



}

export default Golftown;