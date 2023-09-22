
import ProductUpdater from "./services/ProductUpdater.js";
import initializeStoreClasses from "./stores/storeConfig.js";

// const bookmarkButton = document.getElementById("bookmarkButton");






chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "bookmarkProduct") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        ProductUpdater.handleBookmarkPage(currentTab.url)
          .then(() => {
            console.log("Product saved successfulllyyy");
          })
          .catch((error) => {
            console.log("Errror saving product");
          });
      }
    });
  }
});