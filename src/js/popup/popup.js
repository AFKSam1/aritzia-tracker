document.addEventListener('DOMContentLoaded', () => {
  const fetchDataButton = document.getElementById('clear-data');

  fetchDataButton.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { command: 'clearChromeStorage', storeName: 'aritzia' },
      (response) => {
        if (response.success) {
          console.log('clearChromeStorage success');
        } else {
          console.log('clearChromeStorage failed');
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
