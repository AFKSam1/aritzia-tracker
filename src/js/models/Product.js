class Product {
    constructor(id, name, currentPrice, imgUrl, productUrl) {
        this.id = id;
        this.name = name;
        this.currentPrice = currentPrice;
        this.imgUrl = imgUrl;
        this.productUrl = productUrl;
        this.previousPrices = [];
    }
}
export default Product;
