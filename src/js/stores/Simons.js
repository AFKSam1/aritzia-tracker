// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Simons extends Store{
    constructor(name) {
        super(name);
    }

    async fetchPriceAndStock(url) {

    }

    async updateProductPriceAndStock(url, product) {
        // fetch logic 
    }

    async updateAllProductsPriceAndStock() {
        //update logic
    }
 
}

export default Simons;