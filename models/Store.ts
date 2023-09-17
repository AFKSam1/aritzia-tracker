import Product from './Product' 
import { StoreName } from './StoreName';

class Store{
    name:StoreName;
    products: Map<number,Product>;

    constructor(name:StoreName){
        this.name = name;
        this.products = new Map <number,Product>;
    }

    getProducts():Product[]{
        return Array.from(this.products.values());
    }
    addProduct(product:Product){
        this.products.set(product.id,product);
    }
    removeProduct(id: number) {
        this.products.delete(id);
    }
      

}

export default Store