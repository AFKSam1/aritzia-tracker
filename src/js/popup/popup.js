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
  