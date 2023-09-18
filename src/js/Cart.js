class Cart {
    constructor() {
        this.stores = [];
    }

    addStore(store) {
        this.stores.push(store);
    }

    removeStore(storeName) {
        // Logic to remove a store by name
    }

    async updateAllPrices() {
        for (let store of this.stores) {
            for (let product of store.products) {
                await store.updateProductPrice(product.id);
            }
        }
    }
}
export default Cart;
