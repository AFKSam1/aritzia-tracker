import Product from './models/Product.js';
import Store from './models/Store.js';
import { StoreName } from './models/StoreName.js';

const ADD_TO_CART_URL = 'https://www.aritzia.com/en/mylist/add';
const addCartURLPattern = `${ADD_TO_CART_URL}*`;

let currentRequestHeaders: chrome.webRequest.HttpHeader[] | undefined;
let isFetching = false;

const myStore = new Store(StoreName.ARITZIA);


async function initializeStoreFromStorage() {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.get(['products'], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        const products = JSON.parse(result.products || '[]');
        products.forEach((productData: any) => {
          const product = new Product(
            productData.pid,
            productData.name,
            productData.price,
            productData.imgURL,
            productData.prodURL
          );
          myStore.addProduct(product);
        });
        resolve();
      });
    });
  }


function createHeadersObject(headers: chrome.webRequest.HttpHeader[] = []): { [key: string]: string } {
  const headersObject: { [key: string]: string } = {};
  headers.forEach(header => {
    if (header.name && header.value) {
      headersObject[header.name] = header.value;
    }
  });
  return headersObject;
}

async function fetchProductData(url: string, headers: { [key: string]: string }) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: headers
    });

    const data = await response.json();
    const productData = data.wishlist[0];
    const product = new Product(
      productData.pid,
      productData.name,
      parseFloat(productData.listPrice.replace('$', '')),
      productData.imgURL,
      productData.prodURL
    );

    myStore.addProduct(product);
    console.log(myStore.getProducts());
    updateStorage();

  } catch (error) {
    console.error('Error fetching product data:', error);
  }
}

function updateStorage() {
        
    chrome.storage.local.set({ [StoreName.ARITZIA] : JSON.stringify(myStore.getProducts()) }, () => {
      if (chrome.runtime.lastError) {
        console.error('An error occurred:', chrome.runtime.lastError);
      }
    });
  }

  
initializeStoreFromStorage().then(() => {
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url?.includes(ADD_TO_CART_URL)) {
      currentRequestHeaders = details.requestHeaders;
    }
  },
  { urls: [addCartURLPattern] },
  ['requestHeaders']
);

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.url?.includes(ADD_TO_CART_URL) && !isFetching) {
      isFetching = true;
      const headers = createHeadersObject(currentRequestHeaders);
      await fetchProductData(details.url, headers);
      isFetching = false;
    }
  },
  { urls: [addCartURLPattern] }
);}).catch((error) => {
    console.error('Failed to initialize store:', error);
  });
