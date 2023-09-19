class Product {
    constructor( name, description, currentPrice, imgUrl) {
        //this.id = id;
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;
        this.imgUrl = imgUrl;
        //this.productUrl = productUrl;
        //this.sourceUrl = sourceUrl;
        this.previousPrices = [currentPrice];
        //this.apiUrl = apiUrl;
    }
}
export default Product;
