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





}

export default Aritzia;
