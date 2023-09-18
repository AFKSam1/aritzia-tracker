// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
class Aritzia extends Store{
    
    constructor(name) {
        super(name);
        this.isFetching = false;
    }

    async fetchProductData(productId) {
        // Generic fetch logic (likely overridden by subclasses)
        
    }

    async updateProductPrice(productId) {
        // Generic update logic (likely overridden by subclasses)
    }
    async handleAddToCart(url){
        console.log("In handleAddToCart Aritza");
        let header = {...this.headerObject}
        header['My-Custom-Header'] = 'true'; // Add a custom header
        this.isFetching = true;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: header
          });
        const data = await response.json()
        console.log(data.wishlist[0])
        this.isFetching = true;

    }

}

export default Aritzia;