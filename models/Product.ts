class Product {
    id:number;
    name:string;
    currentPrice:number;
    imgUrl:string;
    productUrl:string;

    constructor(id: number, name: string, currentPrice: number, imgUrl: string, productUrl: string) {
        this.id = id;
        this.name = name;
        this.currentPrice = currentPrice;
        this.imgUrl = imgUrl;
        this.productUrl = productUrl;
    }
}

export default Product;