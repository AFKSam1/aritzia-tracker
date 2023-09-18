// In background.js
import createStoreHandler from './storeFactory.js';

const storeInstances = {};

chrome.webRequest.onCompleted.addListener(
  async function(details) {
    const url = new URL(details.url);
    const domain = url.hostname.split('.').slice(-2).join('.'); // Extract base domain


    // Verify if we already have a instance of that store class created 
    if (!storeInstances[domain]) {
      const storeHandler = await createStoreHandler(domain);
      if (storeHandler) {
        storeInstances[domain] = storeHandler;
      }
    }

    if (storeInstances[domain]) {
      storeInstances[domain].handleRequest(details);
    }
  },
  { urls: ['<all_urls>'] }
);
