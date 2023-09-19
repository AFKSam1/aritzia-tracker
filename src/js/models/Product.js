class Product {
    constructor( name, description, currentPrice, sizeInfo, imgUrl) {
        //this.id = id;
        this.name = name;
        this.description = description;
        this.currentPrice = currentPrice;
        this.sizeInfo = sizeInfo;

        this.imgUrl = imgUrl;
        //this.productUrl = productUrl;
        //this.sourceUrl = sourceUrl;
        this.previousPrices = [currentPrice];
        //this.apiUrl = apiUrl;
    }
}
export default Product;
