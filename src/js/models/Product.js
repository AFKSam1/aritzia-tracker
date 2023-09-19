class Product {
    constructor( name, description, currentPrice, stockInfo, imgUrl) {
        //this.id = id;
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;
        this.stockInfo = stockInfo;

        this.imgUrl = imgUrl;
        //this.productUrl = productUrl;
        //this.sourceUrl = sourceUrl;
        this.priceWhenAdded = currentPrice;
        //this.apiUrl = apiUrl;
    }
}
export default Product;
