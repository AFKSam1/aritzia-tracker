// Inherited methods:
//  addProduct(product)
//  removeProduct(productId)
//  findProductById(productId)
//  getAllProducts()
import Store from '../models/store.js';
import Product from '../models/product.js';

class Aritzia extends Store{
    
    constructor(name) {
        super(name);
        this.isFetching = false;
    }

    async fetchAllProductsData(productId) {
        // Generic fetch logic (likely overridden by subclasses)let header = {...this.headerObject}

        let header = {...this.headerObject}
        header['My-Custom-Header'] = 'true'; // Add a custom header
        this.isFetching = true;

        this.products.forEach(async (product)=>{
            const prod = this.findProductById(product.id)

            const response = await fetch(product.apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: header
            });
            
            const data = await response.json();
            const productData = data.wishlist[0];

            console.log(data);
            this.updateProductPrice(prod, productData)

        })
    }

    async updateProductPrice(productData,productFetchedData) {
        const currentPrice = parseFloat(productData.currentPrice.replace('$', ''));
        const listPrice = parseFloat(productFetchedData.listPrice.replace('$', ''));
        if(currentPrice> listPrice){
            productData.previousPrices.push(productData.currentPrice);
            productData.currentPrice = productFetchedData.listPrice
        }
        
    }
    async handleAddToCart(url){
        console.log("In handleAddToCart Aritza");
        let header = {...this.headerObject}
        header['My-Custom-Header'] = 'true'; // Add a custom header
        this.isFetching = true;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: header
          });
        const data = await response.json()
        const productData = data.wishlist[0];
        console.log(data.wishlist[0])

        const name = productData.brand + productData.description;

        const newProduct = new Product(
            productData.pid, 
            name, 
            productData.listPrice, 
            productData.imgURL, 
            productData.prodURL,
            url
        )
        this.addProduct(newProduct);

        this.isFetching = false;



    }

}

export default Aritzia;