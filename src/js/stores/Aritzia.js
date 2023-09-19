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
        this.isFetching = false;
        this.wishListId = null;
    }

    async fetchAdditionalProductData(url) {
        let additionalProductData = {};

        // const response = await fetch(url);
        // const htmlText = await response.text();

        // const parser = new DOMParser();
        // const doc = parser.parseFromString(htmlText, "text/html");

        // console.log(doc);
        //return additionalProductData;
    }

    parseHtml(doc) {
        console.log(doc);
        const title = doc.querySelector('.f1').textContent;
        console.log(title)
        // Aritzia-specific DOM parsing logic
        return { title };
    }
    async fetchAllProductsData(listId) {
        this.isFetching = true;
        const url =
            "https://www.aritzia.com/on/demandware.store/Sites-Aritzia_CA-Site/en_CA/Wishlist-GetWishlist?wishListID=" +
            listId;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        // Assume that data.products is the array of products in the JSON response
        for (let productData of data.wishlist) {
            const existingProduct = this.findProductById(productData.pid);

            if (existingProduct) {
                // Update the price if it has changed
                this.updateProductPrice(existingProduct, productData)

            } else {
                // Add the new product
                const name = productData.brand + productData.description;

                const newProduct = new Product(
                    productData.pid,
                    name,
                    productData.listPrice,
                    productData.imgURL,
                    productData.prodURL,
                    url
                )
                this.addProduct(newProduct);
            }
        }
        this.isFetching = false;
        chrome.runtime.sendMessage({
            command: 'saveProductsToStorage',
            storeName: this.name,
            products: this.products
        }, function (response) {
            if (chrome.runtime.lastError) {
                console.log("ERROR:", chrome.runtime.lastError);
            } else {
                console.log("RESPONSE:", response);
            }
        });

        console.log(this.products);

    }

    setWishListId(wishListId) {
        this.wishListId = wishListId;
    }

    async updateProductPrice(existingProduct, productFetchedData) {
        const currentPrice = parseFloat(existingProduct.currentPrice.replace("$", ""));
        const fetchedPrice = parseFloat(productFetchedData.listPrice.replace("$", ""));

        if (currentPrice > fetchedPrice) {
            existingProduct.previousPrices.push(existingProduct.currentPrice);
            existingProduct.updatePrice(productFetchedData.listPrice);
        }
    }

    // async handleAddToCart(url) {
    //     this.isFetching = true;

    //     if (this.wishListId == null) {
    //         console.log("In handleAddToCart Aritza");
    //         let header = { ...this.headerObject };
    //         header["My-Custom-Header"] = "true"; // Add a custom header

    //         const response = await fetch(url, {
    //             method: "GET",
    //             credentials: "include",
    //             headers: header,
    //         });
    //         const data = await response.json();

    //         this.setWishListId(data.wishlistID);
    //         this.fetchAllProductsData(this.wishListId);

    //     } else {
    //         this.fetchAllProductsData(this.wishListId);
    //     }
    // this.isFetching=false;
    // }
}

export default Aritzia;
