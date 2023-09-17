class Store {
    constructor(name) {
        this.name = name;
        this.products = new Map;
    }
    getProducts() {
        return Array.from(this.products.values());
    }
    addProduct(product) {
        this.products.set(product.id, product);
    }
    removeProduct(id) {
        this.products.delete(id);
    }
}
export default Store;
