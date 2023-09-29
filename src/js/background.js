import ProductUpdater from "./services/ProductUpdater.js";
import initializeStoreClasses from "./stores/storeConfig.js";

chrome.runtime.onInstalled.addListener(() => {
  setUpdateAlarm();
  setLastUpdateTime();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateProductPricesAndStock') {
    updateProductsAndResetAlarm();
  }
});

chrome.runtime.onStartup.addListener(() => {
  // Check if the last update was more than 12 hours ago every time Chrome starts
  chrome.storage.sync.get('lastUpdateTime', (data) => {
    const lastUpdateTime = data.lastUpdateTime || 0;
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    if (now - lastUpdateTime > twelveHours) {
      updateProductsAndResetAlarm();
    }
  });
});

function updateProductsAndResetAlarm() {
  ProductUpdater.updateAllProductPricesAndStock()
    .then(() => {
      console.log('Products Updated Successfully!');
      setLastUpdateTime();
      setUpdateAlarm();
    })
    .catch((err) => console.error('Error updating products: ', err));
}

function setUpdateAlarm() {
  const now = new Date();
  const nextMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8);
  const nextEvening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20);
  let nextUpdate;

  if (now >= nextEvening) {
    nextMorning.setDate(nextMorning.getDate() + 1); // Set to 8AM of the next day
    nextUpdate = nextMorning;
  } else if (now >= nextMorning) {
    nextUpdate = nextEvening;
  } else {
    nextUpdate = nextMorning;
  }

  const delayInMinutes = (nextUpdate - now) / (1000 * 60);
  chrome.alarms.create('updateProductPricesAndStock', { delayInMinutes });
}

function setLastUpdateTime() {
  chrome.storage.sync.set({ lastUpdateTime: Date.now() });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "bookmarkProduct") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        ProductUpdater.handleBookmarkPage(currentTab.url)
          .then(() => console.log("Product saved successfully"))
          .catch((error) => console.log("Error saving product"));
      }
    });
  }
});
