document.addEventListener('DOMContentLoaded', () => {
  const fetchDataButton = document.getElementById('fetch-data');

  fetchDataButton.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { command: 'fetchAllProductsData', storeName: 'aritzia' },
      (response) => {
        if (response.success) {
          console.log('Data fetched successfully');
        } else {
          console.log('Data fetch failed');
        }
      }
    );
  });
});

// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const bookmarkButton = document.getElementById("bookmarkButton");

  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        // Send message to background script
        chrome.runtime.sendMessage({
          command: "bookmarkPage",
          url: currentTab.url,
        });
      }
    });
  });
});
