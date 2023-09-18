// background.js
import Aritzia from './stores/aritzia.js';
import createHeadersObject from './utils/helpers.js'
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


chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        const headersObject = createHeadersObject(details.requestHeaders);
        if (headersObject['My-Custom-Header']) return; // Ignore if custom header is set        
        let url = new URL(details.url);
        let domain = url.hostname.split('.')[1]; // Extract base domain
    
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
                storeInstances[domain].setHeaderObject(createHeadersObject(details.requestHeaders));
            }
          }
        }
      },
      { urls: ['<all_urls>'] },
      ['requestHeaders']
    );

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

        if (storeInstances[domain] &&!storeInstances[domain].isFetching) {
            storeInstances[domain].handleAddToCart(details.url);
        }
      }
    }
  },
  { urls: ['<all_urls>'] }
);


