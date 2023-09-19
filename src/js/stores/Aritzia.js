// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from "../models/store.js";

class Aritzia extends Store {
    constructor(name) {
        super(name);
    }

    async fetchPriceAndStock(url) {
        let data = {};
        const response = await fetch(url);
        const htmlText = await response.text();
        let parser = new DOMParser();  // Correct initialization
        const doc = parser.parseFromString(htmlText, "text/html");
    

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


    async updateProductPriceAndStock(url, product) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchPriceAndStock(url);

            // Fetch existing products from 'aritzia_products'
            const existingData = await new Promise((resolve, reject) => {
                chrome.storage.sync.get("aritzia_products", function(result) {
                    if (chrome.runtime.lastError) {
                        return reject(new Error(chrome.runtime.lastError));
                    }
                    resolve(result.aritzia_products || {});
                });
            });

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

    async updateAllProductsPriceAndStock() {
        try {
            // Assuming fetchAllProductsData is a method that fetches all products under 'aritzia_products'
            const allProducts = await this.fetchAllProductsData("aritzia_products"); 
            for (const [url, product] of Object.entries(allProducts)) {
                await this.updateProductPriceAndStock(url, product);
            }
        } catch (error) {
            console.error("Error updating all product prices:", error);
        }
    }


    
}

export default Aritzia;
