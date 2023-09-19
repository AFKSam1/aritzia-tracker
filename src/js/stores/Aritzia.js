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


    async fetchAllProductsData(listId) {
 
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
