// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
import helpers from "../utils/helpers.js"
class Simons extends Store {
    constructor() {
        super();
    }

    static async fetchPriceAndStock(url) {
        const doc = await this.urlToDomParser(url);
        const parsedData = {};

        // Extracting the price
        const priceElement = doc.querySelector(".single-product-price");
        if (priceElement) {
            parsedData.price = parseFloat(priceElement.innerText);
        }

        const scriptContent = Array.from(doc.querySelectorAll('script')).map(el => el.textContent).join('\n');
        const maxStocks = this.extractJsonFromScript(scriptContent, /product\.maxStocks\s*=\s*(\{[\s\S]*?\});/);
        const sizesEn = this.extractJsonFromScript(scriptContent, /product\.sizesEn\s*=\s*(\{[\s\S]*?\});/);

        parsedData.stockInfo = this.mapColorsToStocks(doc, maxStocks, sizesEn);
        return parsedData;
    }

    static async fetchProduct(url) {

        const doc = await this.urlToDomParser(url);
        const parsedData = helpers.extractMetaData(doc, [
            { itemprop: "image", key: "imgUrl" },
            { itemprop: "name", key: "title" }
        ], "itemprop");

        // Extracting the price
        const priceElement = doc.querySelector(".single-product-price");
        if (priceElement) {
            parsedData.price = parseFloat(priceElement.innerText);
        }

        const scriptContent = Array.from(doc.querySelectorAll('script')).map(el => el.textContent).join('\n');
        const maxStocks = this.extractJsonFromScript(scriptContent, /product\.maxStocks\s*=\s*(\{[\s\S]*?\});/);
        const sizesEn = this.extractJsonFromScript(scriptContent, /product\.sizesEn\s*=\s*(\{[\s\S]*?\});/);

        parsedData.stockInfo = this.mapColorsToStocks(doc, maxStocks, sizesEn);
        return parsedData;
    }

    static async updateProductPriceAndStock(storeName, url) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);
            // Fetch existing products from 'primitivestore'
            const existingProduct = await this.getProductDataFromChromeStorage(storeName, url);


            // Create updated product object
            const updatedProduct = { ...existingProduct, currentPrice: newProductData.price, stockInfo: newProductData.stockInfo };

            await this.saveProductToChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }

    static extractJsonFromScript(scriptContent, regex) {
        const match = scriptContent.match(regex);
        return match ? JSON.parse(match[1]) : null;
    }
    static mapColorsToStocks(doc, maxStocks, sizesEn) {
        const colorStockMap = {}; // Object to hold the mapping between color names and their stocks

        // Iterate over each color element in the DOM
        const colorElements = doc.querySelectorAll('.single-product-color.backup-color.js-color');
        colorElements.forEach((element) => {
            const colorName = element.getAttribute('title'); // Get the color name from the title attribute
            const colorId = element.getAttribute('data-product-color-id'); // Get the color ID

            // Create an object to hold the stocks of each size for this color
            const colorStocks = {};

            // Iterate over the maxStocks object to find the stocks that belong to this color
            for (const [key, value] of Object.entries(maxStocks)) {
                const [stockColorId, sizeCode] = key.split(':'); // Split the key to get the color ID and size code
                if (stockColorId === colorId) {
                    const sizeName = sizesEn[sizeCode] || sizeCode; // Get the size name, or use the code if the name is not found
                    colorStocks[sizeName] = value; // Add this size and its stock to the colorStocks object
                }
            }

            // Add this color and its stocks to the colorStockMap object
            colorStockMap[colorName] = colorStocks;
        });

        return colorStockMap; // Return the mapping
    }
}

export default Simons;