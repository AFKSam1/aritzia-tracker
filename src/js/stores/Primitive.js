class Primitive extends Store{
        constructor(name) {
         super(name);
        }
        // Inherited methods:
        //  addProduct(product)
        //  removeProduct(productId)
        //  findProductById(productId)
        //  getAllProducts()
        async fetchProductData(productId) {
            // fetch logic 
        }
    
        async updateProductPrice(productId) {
            //update logic
        }
 
}