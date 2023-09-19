//popup.js 
document.addEventListener('DOMContentLoaded', () => {
  const clearDataBtn = document.getElementById('clear-data');

  clearDataBtn.addEventListener('click', () => {
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

  const fetchDataBtn = document.getElementById("fetchDataBtn");

  fetchDataBtn.addEventListener('click', () => {
      chrome.storage.sync.get(null, (allData) => {
          const productListDiv = document.getElementById("product-list");
          
          // Clear existing content if any
          productListDiv.innerHTML = '';
          
          for (const [key, products] of Object.entries(allData)) {
              const domain = key.replace('_products', '');
              const domainDiv = document.createElement("h3");
              domainDiv.innerText = `Products from ${domain}:`;
              productListDiv.appendChild(domainDiv);
              
              for (const [url, product] of Object.entries(products)) {
                  const productCard = document.createElement("div");
                  productCard.className = "product-card";
  
                  const imgElement = document.createElement("img");
                  imgElement.src = product.imgUrl;
                  imgElement.alt = product.name;
                  imgElement.className = "product-img";
  
                  const titleElement = document.createElement("h2");
                  titleElement.innerText = product.name;
  

                  
  
                  const priceElement = document.createElement("h4");
                  priceElement.innerText = `Current Price: ${product.currentPrice}`;
  
                  const prevPriceElement = document.createElement("h4");
                  prevPriceElement.innerText = `Previous Prices: ${product.previousPrices.join(', ')}`;
  
                  productCard.appendChild(imgElement);
                  productCard.appendChild(titleElement);
                  //productCard.appendChild(descElement);
                  productCard.appendChild(priceElement);
                  productCard.appendChild(prevPriceElement);

                  const stockDropdown = document.createElement("select");
                stockDropdown.className = "stock-dropdown";

                const defaultOption = document.createElement("option");
                defaultOption.text = "Check Stock";
                defaultOption.disabled = true;
                defaultOption.selected = true;
                stockDropdown.appendChild(defaultOption);

                product.stockInfo.forEach(stockItem => {
                    const stockOption = document.createElement("option");
                    stockOption.text = `${stockItem.size} - ${stockItem.inventoryStatus}`;
                    stockDropdown.appendChild(stockOption);
                });

                productCard.appendChild(stockDropdown); // Append stock dropdown to product card

                productListDiv.appendChild(productCard);
                  
  
                  productListDiv.appendChild(productCard);
              }
          }
      });
  });
  
})