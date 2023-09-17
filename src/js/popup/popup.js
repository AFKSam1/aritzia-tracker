import Store from '../../models/Store.js';
import { StoreName } from '../js/models/StoreName.js';
import Product from '../../models/Product.js';
let myStore = new Store(StoreName.ARITZIA);
function initializeStoreFromStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([StoreName.ARITZIA], (result) => {
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                if (result[StoreName.ARITZIA]) {
                    const products = JSON.parse(result[StoreName.ARITZIA]);
                    products.forEach((productData) => {
                        const product = new Product(productData.id, productData.name, productData.currentPrice, productData.imgUrl, productData.productUrl);
                        myStore.addProduct(product);
                    });
                    resolve();
                }
            });
        });
    });
}
function updateUI(products) {
    const productList = document.getElementById("product-list");
    const tbody = productList ? productList.querySelector("tbody") : null;
    if (tbody) {
        tbody.innerHTML = '';
        products.forEach((product) => {
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
          <td><img src="${product.imgUrl}" alt="${product.name}" width="50"></td>
          <td>${product.name}</td>
          <td>${product.currentPrice}</td>
        `;
            tbody.appendChild(productRow);
        });
    }
}
// Initialize store and update UI
initializeStoreFromStorage()
    .then(() => {
    updateUI(myStore.getProducts());
})
    .catch((error) => {
    console.error('Failed to initialize store:', error);
});
