// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Simons extends Store{
    constructor() {
        super();
    }

    static async fetchPriceAndStock(url) {

    }

    static async updateProductPriceAndStock(url, product) {
        // fetch logic 
    }

    static async updateAllProductsPriceAndStock() {
        //update logic
    }
 
}

export default Simons;