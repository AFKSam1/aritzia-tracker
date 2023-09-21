
import Store from "../models/store.js";
import helpers from "../utils/helpers.js"

class Aritzia extends Store {
    constructor() {
        super();
    }


    static async fetchProduct(url) {
        const doc = await this.urlToDomParser(url);

        const parsedData = helpers.extractMetaData(doc, [
            { property: "og:title", key: "title" },
            { property: "og:price:amount", key: "price" },
            { property: "og:description", key: "description" },
            { property: "og:image", key: "imgUrl" }
        ]);

        parsedData.stockInfo = this.extractStockInfoAritzia(doc);
        return parsedData;
    }

    static async fetchPriceAndStock(url) {
        let data = {};

        const doc = await this.urlToDomParser(url);


        const priceElement = doc.querySelector("meta[property='og:price:amount']");
        if (priceElement) {
            data.price = priceElement.getAttribute("content");
        }
        // Get all the 'li' elements with the class 'ar-dropdown__option' from the document
        const listItems = doc.querySelectorAll(".ar-dropdown__option");

        // Initialize an array to hold sizes and inventory statuses
        const stockInfo = [];

        // Loop through each 'li' element
        listItems.forEach((item) => {
            // Find the 'span' with class 'f1' inside each 'li'
            const sizeSpan = item.querySelector(".f1");

            // Find the 'span' with class 'js-size-dropdown__inventory-status' inside each 'li'
            const inventorySpan = item.querySelector(".js-size-dropdown__inventory-status");

            // If both 'span' elements exist, capture their text content
            if (sizeSpan && sizeSpan.textContent && inventorySpan) {
                const size = sizeSpan.textContent.trim();
                var inventoryStatus = inventorySpan.textContent.trim();
                if (inventoryStatus == "") {
                    inventoryStatus = "In Stock";
                }

                // Store the size and its inventory status in an object, and add it to the array
                stockInfo.push({ size, inventoryStatus });
            }
        });
        data.stockInfo = stockInfo;
        console.log(data);
        return data;
    }


    static async updateProductPriceAndStock(storeName, url) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);

            // Fetch existing products from 'aritzia_products'
            const existingProduct = await this.getProductDataFromChromeStorage(storeName, url);


            // Create updated product object
            const updatedProduct = { ...existingProduct, currentPrice: newProductData.price, stockInfo: newProductData.stockInfo, priceHistory: [...existingProduct.priceHistory, parseFloat(newProductData.price)] };


            await this.saveProductToChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }





    static extractStockInfoAritzia(doc) {
        return Array.from(doc.querySelectorAll(".ar-dropdown__option")).map(item => {
            const sizeSpan = item.querySelector(".f1");
            const inventorySpan = item.querySelector(".js-size-dropdown__inventory-status");
            if (sizeSpan && inventorySpan) {
                const size = sizeSpan.textContent.trim();
                let inventoryStatus = inventorySpan.textContent.trim() || "In Stock";
                return { size, inventoryStatus };
            }
            return null;
        }).filter(Boolean);
    }



}

export default Aritzia;
