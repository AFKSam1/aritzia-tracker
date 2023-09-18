class Store {
    constructor(name) {
        this.name = name;
        this.products = [];
        this.headerObject = {};
    }
    addProduct(product) {
        this.products.push(product);
    }

    setHeaderObject(headersObject){
        console.log(headersObject)
        this.headerObject = headersObject;
        console.log("Headers were set to : ",this.headerObject);
    }

    removeProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
    }

    findProductById(productId) {
        return this.products.find(product => product.id === productId);
    }
    getAllProducts(){
        return this.products;
    }
    async fetchAllProductsData(productId) {
        // Generic fetch logic (likely overridden by subclasses)
    }

    async updateProductPrice(productId) {
        // Generic update logic (likely overridden by subclasses)
    }
}
export default Store;
