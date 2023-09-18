class Product {
    constructor(id, name, currentPrice, imgUrl, productUrl,apiUrl) {
        this.id = id;
        this.name = name;
        this.currentPrice = currentPrice;
        this.imgUrl = imgUrl;
        this.productUrl = productUrl;
        this.previousPrices = [currentPrice];
        this.apiUrl = apiUrl;
    }
}
export default Product;
