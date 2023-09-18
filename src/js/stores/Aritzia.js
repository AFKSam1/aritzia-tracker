// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()

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

}

export default Aritzia;