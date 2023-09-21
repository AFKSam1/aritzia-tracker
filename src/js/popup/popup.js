//popup.js
import ProductUpdater from "../services/ProductUpdater.js";
import initializeStoreClasses from "../stores/storeConfig.js";

const supportedStores = Object.keys(initializeStoreClasses.initializeStoreClasses());

document.addEventListener("DOMContentLoaded", () => {
    const clearDataBtn = document.getElementById("clear-data");

    clearDataBtn.addEventListener("click", () => {
        ProductUpdater.clearAllChromeStorage()
            .then(() => {
                console.log("All products have been cleared from storage");
            })
            .catch((error) => {
                console.log("Error clear storage");
            });
    });

    const bookmarkButton = document.getElementById("bookmarkButton");

    bookmarkButton.addEventListener("click", () => {
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
    });
    const fetchDataBtn = document.getElementById("fetchDataBtn");

    fetchDataBtn.addEventListener("click", () => {
    const productListDiv = document.getElementById("product-list");
    // Clear existing content if any
    productListDiv.innerHTML = "";

    supportedStores.forEach((store) => {
        let title = document.createElement("h3");
        let storeDiv = document.createElement("div");

        title.id = store;
        title.className = "store-title text-lg text-center my-5 py-2 font-bold";
        title.innerText = store.toUpperCase();
        storeDiv.id = store + "-div";
        title.appendChild(storeDiv);
        productListDiv.appendChild(title);
    });
    chrome.storage.sync.get(null, (allData) => {
        for (const [key, product] of Object.entries(allData)) {
            const [domain, url] = key.split("_", 2); // Split the key into domain and url
            let storeDiv = document.getElementById(domain + "-div");

            const productCard = document.createElement("div");
            productCard.className = "flex w-full max-w-[700px] bg-white text-gray-700 border border-[#939fa5]";

            const imgContainer = document.createElement("div");
            imgContainer.className =
                "relative w-1/6 overflow-hidden rounded-[15px] bg-blue-gray-500 bg-clip-border text-white border border-blue-gray-400 m-[0.3em]";
            const imgElement = document.createElement("img");
            imgElement.src = product.imgUrl;
            imgElement.alt = product.name;
            imgElement.className = "w-full h-full object-cover";
            imgContainer.appendChild(imgElement);

            const detailsDiv = document.createElement("div");
            detailsDiv.className = "p-4 w-5/6 flex flex-col justify-center";

            const titleElement = document.createElement("h2");
            titleElement.className =
                "block font-sans text-lg font-medium leading-snug tracking-normal text-blue-gray-900 mb-1";
            titleElement.innerText = product.name;

            const priceDiv = document.createElement("div");
            priceDiv.className = "flex justify-between items-center";

            const priceDetailsDiv = document.createElement("div");
            const priceElement = document.createElement("h4");
            priceElement.className = "block text-start font-sans text-md  font-normal leading-relaxed text-gray-700 mb-1";
            priceElement.innerHTML = `Current Price: <span class="text-lg font-bold">$${product.currentPrice}</span>`;
            const prevPriceElement = document.createElement("h4");
            prevPriceElement.className = "block text-start font-sans text-md font-normal leading-relaxed text-gray-700 mb-2";
            prevPriceElement.innerHTML = `Price when added: <span class="text-lg font-bold">$${product.priceWhenAdded}</span>`;
            priceDetailsDiv.appendChild(priceElement);
            priceDetailsDiv.appendChild(prevPriceElement);

            const stockDiv = document.createElement("div");
            const discountElement = document.createElement("h4");
            discountElement.className = "block text-start font-sans text-md font-normal leading-relaxed text-gray-700 mb-2";
            discountElement.innerText = `Discount: ${(product.discount)}%`; 
            stockDiv.appendChild(discountElement);

            const stockDropdownContainer = document.createElement("div");
            stockDropdownContainer.className = "relative h-8 w-40";

            const stockDropdown = document.createElement("select");
            stockDropdown.className =
                "peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-2 py-1.5 font-sans text-xs font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-red-500 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50";

            const defaultOption = document.createElement("option");
            //defaultOption.text = "Check Stock";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            stockDropdown.appendChild(defaultOption);

            if (typeof product.stockInfo === 'string'){
                const stockOption = document.createElement("option");
                stockOption.text = `${product.stockInfo}`;
                stockDropdown.appendChild(stockOption);

            }else if (Array.isArray(product.stockInfo)) {
                product.stockInfo.forEach((stockItem) => {
                    const stockOption = document.createElement("option");
                    stockOption.text = `${stockItem.size} - ${stockItem.inventoryStatus}`;
                    stockDropdown.appendChild(stockOption);
                });
            } else {
                // Simons case
                for (const [color, sizes] of Object.entries(product.stockInfo)) {
                    for (const [size, stock] of Object.entries(sizes)) {
                        const stockOption = document.createElement("option");
                        stockOption.text = `${color} - ${size} - ${stock}`;
                        stockDropdown.appendChild(stockOption);
                    }
                }
            }

            stockDropdownContainer.appendChild(stockDropdown);

            const stockLabel = document.createElement("label");
            stockLabel.className =
                "before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1 flex h-full w-full select-none text-[10px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[5.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[5.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:leading-[3.5] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[10px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500";
            stockLabel.innerText = "Check Stock";
            stockDropdownContainer.appendChild(stockLabel);

            stockDiv.appendChild(stockDropdownContainer);

            priceDiv.appendChild(priceDetailsDiv);
            priceDiv.appendChild(stockDiv);

            detailsDiv.appendChild(titleElement);
            detailsDiv.appendChild(priceDiv);

            productCard.appendChild(imgContainer);
            productCard.appendChild(detailsDiv);

            storeDiv.appendChild(productCard);
        
        }
    })
    });
    
    const updateAllPricesBtn = document.getElementById("updateAllPricesBtn");

    updateAllPricesBtn.addEventListener("click", () => {
        ProductUpdater.updateAllProductPricesAndStock()
            .then(() => {
                console.log("All product prices updated");
            })
            .catch((error) => {
                console.log("Failed to update product prices: ", error);
            });
    });
});
