// background.js
import Aritzia from './stores/aritzia.js';
// import more store classes as needed

const storeClasses = {
  "aritzia": Aritzia
  // Add more mappings here as needed
};

const storeConfig = {
  "aritzia": {
    "addToCartURL": "mylist/add"
  },
  "anotherstore.com": {
    "addToCartURL": "cart/add"
  }
};

const storeInstances = {};

chrome.webRequest.onCompleted.addListener(
  function(details) {
    const url = new URL(details.url);
    const domain = url.hostname.split('.')[1]; // Extract base domain

    if (storeConfig.hasOwnProperty(domain)) {
      const config = storeConfig[domain];

      if (details.url.includes(config.addToCartURL)) {

        if (!storeInstances[domain]) {
          const StoreClass = storeClasses[domain];
          if (StoreClass) {
            storeInstances[domain] = new StoreClass();
          }
        }

        if (storeInstances[domain]) {
          storeInstances[domain].handleAddToCart(details);
        }
      }
    }
  },
  { urls: ['<all_urls>'] }
);
