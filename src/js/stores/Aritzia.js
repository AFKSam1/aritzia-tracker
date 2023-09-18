// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Aritzia extends Store{
    constructor(name) {
        super(name);
    }

    async fetchProductData(productId) {
        // Generic fetch logic (likely overridden by subclasses)
    }

    async updateProductPrice(productId) {
        // Generic update logic (likely overridden by subclasses)
    }
    async handleAddToCart(details){
        console.log("In handleAddToCart Aritza");
    }

}

export default Aritzia;