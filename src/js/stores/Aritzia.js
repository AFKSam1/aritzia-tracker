// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from "../models/store.js";

class Aritzia extends Store {
    constructor() {
        super();
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
            const existingProduct = await Store.getProductDataFromChromeStorage(storeName, url);


            // Create updated product object
            const updatedProduct = { ...existingProduct, currentPrice: newProductData.price, stockInfo: newProductData.stockInfo };


            await Store.setProductDataChromeStorage(storeName, url, updatedProduct);

        } catch (error) {
            console.error("Error updating product price:", error);
        }
    }

    // static async updateAllProductsPriceAndStock() {
    // try {
    //     // Fetch the list of URLs for the given store
    //     const urls = await this.fetchUrlsForStore(storeName);  // You'll need to implement this method

    //     // Update each product one by one
    //     for (const url of urls) {
    //         await this.updateProductPriceAndStock(storeName, url);
    //     }
    // } catch (error) {
    //     console.error("Error updating all product prices:", error);
    // }
    //}

    

    
}

export default Aritzia;
