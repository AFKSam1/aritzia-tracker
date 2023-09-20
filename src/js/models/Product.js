class Product {
    constructor( name, description, currentPrice, stockInfo, imgUrl) {
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;
        this.stockInfo = stockInfo;
        this.imgUrl = imgUrl;
        this.priceWhenAdded = currentPrice;
    }
}
export default Product;
