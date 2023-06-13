chrome.runtime.onInstalled.addListener(() => {
    // Initialize your extension storage, setup alarms, etc.
});

chrome.alarms.onAlarm.addListener((alarm) => {
    // Handle the alarm event, such as refreshing the price of each bookmarked item
});


// This function will be used to save a bookmarked item
// background.js

// This function will be used to save a bookmarked item
function saveItem(item) {
    chrome.storage.local.get({ items: [] }, (result) => {
        let items = result.items;
        items.push(item);
        chrome.storage.local.set({ items: items }, () => {
            console.log('Item saved');
        });
    });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'bookmark') {
        saveItem(message.item);
        sendResponse({ status: 'Item saved' });
    }
});

  // You'll need to call this function when an item is bookmarked
  // You'll need to pass an object with the properties listPrice, name, imgURL, and prodURL
  // For example: saveItem({ listPrice: '...', name: '...', imgURL: '...', prodURL: '...' });
