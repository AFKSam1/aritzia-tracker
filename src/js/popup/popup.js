//popup.js
import ProductUpdater from "../services/ProductUpdater.js"
import initializeStoreClasses from "../stores/storeConfig.js";


const supportedStores = Object.keys(initializeStoreClasses.initializeStoreClasses());

document.addEventListener("DOMContentLoaded", () => {
  const clearDataBtn = document.getElementById("clear-data");

  clearDataBtn.addEventListener("click", () => {
    ProductUpdater
      .clearAllChromeStorage()
      .then(() => {
        console.log("All products have been cleared from storage");
      }).catch((error) => {
        console.log("Error clear storage")
      })

  });

  const bookmarkButton = document.getElementById("bookmarkButton");

  bookmarkButton.addEventListener("click", () => {


    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        ProductUpdater
          .handleBookmarkPage(currentTab.url)
          .then(() => {
            console.log("Product saved successfulllyyy");
          }).catch((error) => {
            console.log("Errror saving product")
          })
      }
    });
  });




  const fetchDataBtn = document.getElementById("fetchDataBtn");

  fetchDataBtn.addEventListener("click", () => {
    const productListDiv = document.getElementById("product-list");
    // Clear existing content if any
    productListDiv.innerHTML = "";

    supportedStores.forEach(store => {
      let title = document.createElement("h3");
      let storeDiv = document.createElement("div");

      title.id = store;
      title.className = "store-title";
      title.innerText = store.toUpperCase();
      storeDiv.id = (store + "-div");
      title.appendChild(storeDiv);
      productListDiv.appendChild(title);
    })
    chrome.storage.sync.get(null, (allData) => {


      for (const [key, product] of Object.entries(allData)) {
        const [domain, url] = key.split("_", 2);  // Split the key into domain and url
        //const domainDiv = document.createElement("h3");
        //domainDiv.innerText = `Product from ${domain}:`;
        //productListDiv.appendChild(domainDiv);
        let storeDiv = document.getElementById(domain + "-div");

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
        prevPriceElement.innerText = `Price when added: ${product.priceWhenAdded}`;

        productCard.appendChild(imgElement);
        productCard.appendChild(titleElement);
        productCard.appendChild(priceElement);
        productCard.appendChild(prevPriceElement);

        const stockDropdown = document.createElement("select");
        stockDropdown.className = "stock-dropdown";

        const defaultOption = document.createElement("option");
        defaultOption.text = "Check Stock";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        stockDropdown.appendChild(defaultOption);

        if (Array.isArray(product.stockInfo)) {
          product.stockInfo.forEach((stockItem) => {
            const stockOption = document.createElement("option");
            stockOption.text = `${stockItem.size} - ${stockItem.inventoryStatus}`;
            stockDropdown.appendChild(stockOption);
          });
        } else {  // Simons case
          for (const [color, sizes] of Object.entries(product.stockInfo)) {
            for (const [size, stock] of Object.entries(sizes)) {
              const stockOption = document.createElement("option");
              stockOption.text = `${color} - ${size} - ${stock}`;
              stockDropdown.appendChild(stockOption);
            }
          }
        }

        productCard.appendChild(stockDropdown); // Append stock dropdown to product card
        storeDiv.appendChild(productCard);
      }

    });
  });


  const updateAllPricesBtn = document.getElementById("updateAllPricesBtn");

  updateAllPricesBtn.addEventListener("click", () => {
    ProductUpdater
      .updateAllProductPricesAndStock()
      .then(() => {
        console.log("All product prices updated");
      })
      .catch((error) => {
        console.log("Failed to update product prices: ", error);
      });
  });
});
