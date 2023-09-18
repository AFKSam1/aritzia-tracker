// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Primitive extends Store{
    constructor(name) {
        super(name);
    }


    async fetchProductData(productId) {
        // fetch logic 
    }

    async updateProductPrice(productId) {
        //update logic
    }
 
}

export default Primitive;