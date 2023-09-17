import Store from './models/Store.js';
import { StoreName } from './models/StoreName.js';
import Product from './models/Product.js';

let myStore = new Store(StoreName.ARITZIA);

// Function to update the UI
function updateUI(products:Product[]) {
  const productList = document.getElementById("product-list");
  // Clear the previous list
  if (productList) {
    productList.innerHTML = '';
  }
  products.forEach((product:Product) => {
    const productDiv = document.createElement('div');
    productDiv.className = 'p-4 bg-white rounded shadow mb-4';
    productDiv.innerHTML = `
      <p>Name: ${product.name}</p>
      <p>Price: ${product.currentPrice}</p>
    `;
    if (productList) {
      productList.appendChild(productDiv);
    }
  });
}

// Fetch products from local storage and update UI
chrome.storage.local.get(['products'], function(result) {
  if (result.products) {
    const storedProducts = JSON.parse(result.products);
    myStore.addProduct(storedProducts);
    updateUI(storedProducts);
  }
});
