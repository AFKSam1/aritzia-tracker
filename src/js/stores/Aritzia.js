// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from "../models/store.js";
import Product from "../models/product.js";

class Aritzia extends Store {
    constructor(name) {
        super(name);
    }

    async fetchData(url) {
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

    async updateProductPrice(url, product) {
        try {
            // Fetch and parse product data
            const newProductData = await this.fetchData(url);

            // Update the Chrome storage with new price
            const updatedProduct = { ...product, currentPrice: newProductData.price };
            await new Promise((resolve, reject) => {
                chrome.storage.sync.set({ [url]: updatedProduct }, function () {
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

    async updateAllProductsPrice() {
        try {
            const allProducts = await this.fetchAllProductsData("aritzia_products"); // Assuming this returns a dictionary where keys are URLs
            for (const [url, product] of Object.entries(allProducts)) {
                await this.updateProductPrice(url, product);
            }
        } catch (error) {
            console.error("Error updating all product prices:", error);
        }
    }

    async updateAllProductsStock() {}
}

export default Aritzia;
